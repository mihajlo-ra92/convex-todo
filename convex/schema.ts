import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Projects are the top-level organizational unit
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
  }),

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
