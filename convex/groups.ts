import { requireProjectMember } from "./auth";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a new group within a project
 */
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    // Verify project membership
    await requireProjectMember(ctx, args.projectId);

    const groupId = await ctx.db.insert("groups", {
      name: args.name,
      description: args.description,
      projectId: args.projectId,
    });
    return groupId;
  },
});

/**
 * List all groups in a project with their tasks
 */
export const listWithTasks = query({
  args: {
    projectId: v.id("projects"),
  },
  returns: v.array(
    v.object({
      _id: v.id("groups"),
      _creationTime: v.number(),
      name: v.string(),
      description: v.optional(v.string()),
      projectId: v.id("projects"),
      tasks: v.array(
        v.object({
          _id: v.id("tasks"),
          _creationTime: v.number(),
          text: v.string(),
          isCompleted: v.boolean(),
          groupId: v.id("groups"),
        })
      ),
    })
  ),
  handler: async (ctx, args) => {
    // Verify project membership
    await requireProjectMember(ctx, args.projectId);

    // First get all groups in the project
    const groups = await ctx.db
      .query("groups")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    // For each group, fetch its tasks
    const groupsWithTasks = await Promise.all(
      groups.map(async (group) => {
        const tasks = await ctx.db
          .query("tasks")
          .withIndex("by_group", (q) => q.eq("groupId", group._id))
          .collect();

        return {
          ...group,
          tasks,
        };
      })
    );

    return groupsWithTasks;
  },
});

/**
 * Delete a group and all its tasks
 */
export const remove = mutation({
  args: {
    groupId: v.id("groups"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Ensure the user is a member of the project that owns the group
    const group = await ctx.db.get(args.groupId);
    if (!group) throw new Error("Group not found");
    await requireProjectMember(ctx, group.projectId);

    // Delete all tasks in the group
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    // Delete the group itself
    await ctx.db.delete(args.groupId);
    return null;
  },
});
