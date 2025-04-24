import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

/**
 * Create a new project
 */
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Unauthenticated");
    }
    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
    });

    await ctx.db.insert("projectMembers", { projectId, userId, role: "owner" });
    return projectId;
  },
});

/**
 * List all projects
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Unauthenticated");
    }
    const userProjects = await ctx.db
      .query("projectMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const projectIds = userProjects.map(
      (projectMember) => projectMember.projectId
    );
    const projects = await Promise.all(projectIds.map(ctx.db.get));
    return projects;
  },
});
