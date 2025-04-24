import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireGroupMember, requireTaskMember } from "./auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const toggle = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await requireTaskMember(ctx, args.id);
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
    await requireGroupMember(ctx, args.groupId);

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
    await requireTaskMember(ctx, args.id);
    await ctx.db.delete(args.id);
  },
});

export const edit = mutation({
  args: {
    id: v.id("tasks"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    await requireTaskMember(ctx, args.id);
    await ctx.db.patch(args.id, {
      text: args.text,
    });
  },
});
