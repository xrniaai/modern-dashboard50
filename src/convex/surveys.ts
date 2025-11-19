import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getUserSurveys = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const surveys = await ctx.db
      .query("surveys")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return surveys;
  },
});

export const getSurveyStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const surveys = await ctx.db
      .query("surveys")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const completed = surveys.filter((s) => s.status === "completed").length;
    const totalPoints = surveys
      .filter((s) => s.status === "completed")
      .reduce((sum, s) => sum + s.pointsEarned, 0);

    return {
      total: surveys.length,
      completed,
      totalPoints,
    };
  },
});

export const getAvailableSurveys = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const surveys = await ctx.db
      .query("availableSurveys")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    return surveys;
  },
});

export const getSurveyById = query({
  args: { surveyId: v.id("availableSurveys") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const survey = await ctx.db.get(args.surveyId);
    return survey;
  },
});

export const submitSurvey = mutation({
  args: {
    surveyId: v.id("availableSurveys"),
    answers: v.array(v.object({
      questionId: v.string(),
      answer: v.union(v.string(), v.number()),
    })),
    timeSpentSeconds: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const survey = await ctx.db.get(args.surveyId);
    if (!survey) {
      throw new Error("Survey not found");
    }

    const surveyId = await ctx.db.insert("surveys", {
      userId: user._id,
      surveyId: args.surveyId,
      title: survey.title,
      description: survey.description,
      pointsEarned: survey.points,
      status: "completed",
      completedAt: Date.now(),
      timeSpentSeconds: args.timeSpentSeconds,
      answers: args.answers,
    });

    // Update user stats
    await ctx.db.patch(user._id, {
      totalSurveysAttempted: (user.totalSurveysAttempted || 0) + 1,
      totalSurveysCompleted: (user.totalSurveysCompleted || 0) + 1,
    });

    return surveyId;
  },
});

// Record a disqualification
export const recordDisqualification = mutation({
  args: {
    surveyId: v.id("availableSurveys"),
    answers: v.array(v.object({
      questionId: v.string(),
      answer: v.union(v.string(), v.number()),
    })),
    timeSpentSeconds: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const survey = await ctx.db.get(args.surveyId);
    if (!survey) {
      throw new Error("Survey not found");
    }

    const surveyAttemptId = await ctx.db.insert("surveys", {
      userId: user._id,
      surveyId: args.surveyId,
      title: survey.title,
      description: survey.description,
      pointsEarned: 0,
      status: "disqualified",
      disqualifiedAt: Date.now(),
      timeSpentSeconds: args.timeSpentSeconds,
      answers: args.answers,
    });

    // Update user stats
    await ctx.db.patch(user._id, {
      totalSurveysAttempted: (user.totalSurveysAttempted || 0) + 1,
    });

    return surveyAttemptId;
  },
});