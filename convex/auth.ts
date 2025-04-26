import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { getAuthUserId } from "@convex-dev/auth/server";
import { QueryCtx, MutationCtx, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";
import { ResendOTPPasswordReset } from "./ResendOTPPasswordReset";
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({ reset: ResendOTPPasswordReset }),
    // TODO: Uncomment when we have email domain setup
    // Password({ reset: ResendOTPPasswordReset, verify: ResendOTP }),
    // ResendOTP,
  ],
});

/**
 * Ensures the user is authenticated and returns their userId.
 * Throws ConvexError if not authenticated.
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);

  if (!userId) {
    throw new ConvexError("Unauthenticated");
  }
  const user = await ctx.db.get(userId);
  if (!user) {
    throw new ConvexError("Unauthenticated");
  }
  // TODO: Uncomment when we have email domain setup
  // if (!user.emailVerificationTime) {
  //   throw new ConvexError("Email not verified");
  // }
  return userId;
}

/**
 * Ensures the user is a member of the specified project.
 * Throws ConvexError if not authenticated or not a project member.
 * Returns the project member document if successful.
 */
export async function requireProjectMember(
  ctx: QueryCtx | MutationCtx,
  projectId: Id<"projects">,
  ownerOnly: boolean = false
) {
  const userId = await requireAuth(ctx);

  const projectMember = await ctx.db
    .query("projectMembers")
    .withIndex("by_project_and_user", (q) =>
      q.eq("projectId", projectId).eq("userId", userId)
    )
    .unique();

  if (!projectMember) {
    throw new ConvexError("Unauthorized - Not a project member");
  }

  if (ownerOnly && projectMember.role !== "owner") {
    throw new ConvexError("Unauthorized - Not an owner");
  }

  return projectMember;
}

/**
 * Ensures the user is a member of the project that contains the specified task.
 * Throws ConvexError if not authenticated or not a project member.
 * Returns the task document if successful.
 */
export async function requireTaskMember(
  ctx: QueryCtx | MutationCtx,
  taskId: Id<"tasks">
) {
  const task = await ctx.db.get(taskId);
  if (!task) {
    throw new ConvexError("Task not found");
  }

  const group = await ctx.db.get(task.groupId);
  if (!group) {
    throw new ConvexError("Group not found");
  }

  const project = await ctx.db.get(group.projectId);
  if (!project) {
    throw new ConvexError("Project not found");
  }

  await requireProjectMember(ctx, project._id);
  return task;
}

export async function requireGroupMember(
  ctx: QueryCtx | MutationCtx,
  groupId: Id<"groups">
) {
  const group = await ctx.db.get(groupId);
  if (!group) {
    throw new ConvexError("Group not found");
  }

  const project = await ctx.db.get(group.projectId);
  if (!project) {
    throw new ConvexError("Project not found");
  }

  await requireProjectMember(ctx, project._id);
  return group;
}

export const getUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("Unauthenticated");
    }
    const user = await ctx.db.get(userId);
    return user;
  },
});

export const getUserByEmail = async (ctx: QueryCtx, email: string) => {
  const user = await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", email))
    .unique();
  if (!user) {
    throw new ConvexError("User not found");
  }
  return user;
};
