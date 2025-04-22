import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define the valid roles as a union type
const ProjectRole = v.union(
  v.literal("owner"),
  v.literal("member"),
  v.literal("viewer")
);

export default defineSchema({
  ...authTables,

  // Projects are the top-level organizational unit
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
  }),

  // ProjectMembers establishes a many-to-many relationship between projects and users
  projectMembers: defineTable({
    projectId: v.id("projects"),
    userId: v.id("users"),
    role: ProjectRole, // Using our union type for strict role validation
  })
    .index("by_project", ["projectId"]) // For querying members of a project
    .index("by_user", ["userId"]) // For querying projects a user belongs to
    .index("by_project_and_user", ["projectId", "userId"]), // For checking if a user is a member of a project

  // Groups belong to a project
  groups: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    projectId: v.id("projects"), // Reference to the parent project
  }).index("by_project", ["projectId"]), // Index for efficient querying of groups in a project

  // Tasks belong to a group
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    groupId: v.id("groups"), // Reference to the parent group
  }).index("by_group", ["groupId"]), // Index for efficient querying of tasks in a group
});
