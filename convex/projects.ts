import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a new project
 */
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
    });
    return projectId;
  },
});

/**
 * List all projects
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    return projects;
  },
});
