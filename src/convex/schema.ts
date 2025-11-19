import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
      
      // User qualification history metrics
      qualificationRate: v.optional(v.number()), // percentage of surveys qualified for
      fraudFlags: v.optional(v.number()), // number of fraud flags
      totalSurveysAttempted: v.optional(v.number()),
      totalSurveysCompleted: v.optional(v.number()),
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Available Surveys Table (surveys users can take)
    availableSurveys: defineTable({
      title: v.string(),
      description: v.string(),
      category: v.string(),
      points: v.number(),
      estimatedMinutes: v.number(),
      questions: v.array(v.object({
        id: v.string(),
        type: v.union(v.literal("multiple_choice"), v.literal("text"), v.literal("rating")),
        question: v.string(),
        options: v.optional(v.array(v.string())),
        required: v.boolean(),
      })),
      isActive: v.boolean(),
      expiresAt: v.optional(v.number()),
      
      // Demographics and targeting
      targetAge: v.optional(v.object({
        min: v.number(),
        max: v.number(),
      })),
      targetCountries: v.optional(v.array(v.string())),
      
      // Survey quality metrics
      commonlyIncorrectDQ: v.optional(v.boolean()), // Does this survey commonly have incorrect disqualifications?
      averageCompletionTime: v.optional(v.number()), // Average time to complete in seconds
    }).index("by_active", ["isActive"]),

    // Survey History Table (completed/pending surveys by users)
    surveys: defineTable({
      userId: v.id("users"),
      surveyId: v.id("availableSurveys"),
      title: v.string(),
      description: v.string(),
      pointsEarned: v.number(),
      status: v.union(
        v.literal("completed"), 
        v.literal("pending"), 
        v.literal("rejected"),
        v.literal("disqualified")
      ),
      completedAt: v.optional(v.number()),
      disqualifiedAt: v.optional(v.number()),
      timeSpentSeconds: v.optional(v.number()), // Time spent before disqualification/completion
      answers: v.optional(v.array(v.object({
        questionId: v.string(),
        answer: v.union(v.string(), v.number()),
      }))),
    }).index("by_user", ["userId"]),

    // Appeal Tickets Table
    appealTickets: defineTable({
      userId: v.id("users"),
      userEmail: v.string(),
      surveyId: v.id("availableSurveys"),
      surveyTitle: v.string(),
      surveyAttemptId: v.id("surveys"),
      
      ticketType: v.literal("Disqualification Appeal"),
      status: v.union(
        v.literal("Open"),
        v.literal("Under Review"),
        v.literal("Approved"),
        v.literal("Denied"),
        v.literal("Closed")
      ),
      priority: v.union(v.literal("Low"), v.literal("Medium"), v.literal("High")),
      
      // AI Analysis
      aiReasoning: v.string(), // Why AI thinks this might be incorrect
      aiConfidence: v.number(), // 0-100 confidence score
      
      // Appeal content
      appealMessage: v.string(),
      
      // Metadata
      disqualificationTime: v.number(),
      timeSpentBeforeDQ: v.number(),
      
      // Resolution
      resolvedAt: v.optional(v.number()),
      resolutionMessage: v.optional(v.string()),
      pointsAwarded: v.optional(v.number()),
      
      // Tags
      tags: v.array(v.string()),
    })
      .index("by_user", ["userId"])
      .index("by_status", ["status"]),

    // Redemption Requests Table
    redemptions: defineTable({
      userId: v.id("users"),
      amount: v.number(),
      pointsUsed: v.number(),
      method: v.string(),
      accountDetails: v.string(),
      status: v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("completed"),
        v.literal("rejected")
      ),
      requestedAt: v.number(),
      processedAt: v.optional(v.number()),
      notes: v.optional(v.string()),
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;