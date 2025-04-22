import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const toggle = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");

    await ctx.db.patch(args.id, {
      isCompleted: !task.isCompleted,
    });
  },
});

/**
 * Create a new task within a group
 */
export const create = mutation({
  args: {
    text: v.string(),
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    // Verify that the group exists
    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    const taskId = await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: false,
      groupId: args.groupId,
    });
    return taskId;
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");
    await ctx.db.delete(args.id);
  },
});

/**
 * List all tasks in a group
 */
export const list = query({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();
    return tasks;
  },
});
