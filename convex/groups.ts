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
    // Verify that the project exists
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const groupId = await ctx.db.insert("groups", {
      name: args.name,
      description: args.description,
      projectId: args.projectId,
    });
    return groupId;
  },
});

/**
 * List all groups in a project
 */
export const list = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const groups = await ctx.db
      .query("groups")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
    return groups;
  },
});
