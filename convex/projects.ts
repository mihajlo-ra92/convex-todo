import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByEmail, requireProjectMember } from "./auth";

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
    return Promise.all(
      userProjects.map(async (userProject) => {
        const projectData = await ctx.db.get(userProject.projectId);
        return {
          ...projectData,
          role: userProject.role,
        };
      })
    );
  },
});

export const getMembers = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    await requireProjectMember(ctx, args.projectId, true);
    const members = await ctx.db
      .query("projectMembers")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
    return Promise.all(
      members.map(async (member) => {
        const userData = await ctx.db.get(member.userId);
        return {
          ...member,
          user: userData,
        };
      })
    );
  },
});

export const addMember = mutation({
  args: {
    projectId: v.id("projects"),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    await requireProjectMember(ctx, args.projectId, true);
    const user = await getUserByEmail(ctx, args.email);
    await ctx.db.insert("projectMembers", {
      projectId: args.projectId,
      userId: user._id,
      role: "member",
    });
  },
});
