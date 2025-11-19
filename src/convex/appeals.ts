import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Analyze if a disqualification should be appealed
export const analyzeDisqualification = query({
  args: {
    surveyAttemptId: v.id("surveys"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const surveyAttempt = await ctx.db.get(args.surveyAttemptId);
    if (!surveyAttempt || surveyAttempt.userId !== user._id) {
      throw new Error("Survey attempt not found");
    }

    const survey = await ctx.db.get(surveyAttempt.surveyId);
    if (!survey) {
      throw new Error("Survey not found");
    }

    // Get user's qualification history
    const userSurveys = await ctx.db
      .query("surveys")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const totalAttempts = userSurveys.length;
    const completedSurveys = userSurveys.filter((s) => s.status === "completed").length;
    const qualificationRate = totalAttempts > 0 ? (completedSurveys / totalAttempts) * 100 : 0;
    const fraudFlags = user.fraudFlags || 0;

    // Calculate time spent
    const timeSpent = surveyAttempt.timeSpentSeconds || 0;
    const expectedMinTime = (survey.estimatedMinutes * 60) * 0.1; // 10% of estimated time

    // Decision factors
    const factors = {
      instantDQ: timeSpent < 30, // Less than 30 seconds
      unusuallyFast: timeSpent < expectedMinTime,
      goodHistory: qualificationRate > 60,
      noFraudFlags: fraudFlags === 0,
      commonlyIncorrectDQ: survey.commonlyIncorrectDQ || false,
      hasAnswers: (surveyAttempt.answers?.length || 0) > 0,
    };

    // Calculate confidence score
    let confidenceScore = 0;
    let reasoning: string[] = [];

    if (factors.instantDQ) {
      confidenceScore += 30;
      reasoning.push("The disqualification occurred within 30 seconds, which often indicates a technical glitch rather than a legitimate screening failure.");
    }

    if (factors.unusuallyFast) {
      confidenceScore += 20;
      reasoning.push("The disqualification happened unusually fast compared to the survey's estimated completion time.");
    }

    if (factors.goodHistory) {
      confidenceScore += 25;
      reasoning.push(`You have a strong qualification rate of ${qualificationRate.toFixed(1)}%, indicating you typically meet survey requirements.`);
    }

    if (factors.noFraudFlags) {
      confidenceScore += 15;
      reasoning.push("Your account has no history of fraudulent or low-quality responses.");
    }

    if (factors.commonlyIncorrectDQ) {
      confidenceScore += 10;
      reasoning.push("This survey has a history of incorrectly disqualifying qualified participants.");
    }

    // Determine if appeal should be offered
    const shouldAppeal = confidenceScore >= 50;
    const isUncertain = confidenceScore >= 30 && confidenceScore < 50;

    return {
      shouldAppeal,
      isUncertain,
      confidenceScore,
      reasoning: reasoning.join(" "),
      factors,
      userQualificationRate: qualificationRate,
      timeSpent,
      surveyTitle: survey.title,
    };
  },
});

// Generate appeal message
export const generateAppealMessage = query({
  args: {
    surveyAttemptId: v.id("surveys"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const surveyAttempt = await ctx.db.get(args.surveyAttemptId);
    if (!surveyAttempt || surveyAttempt.userId !== user._id) {
      throw new Error("Survey attempt not found");
    }

    const survey = await ctx.db.get(surveyAttempt.surveyId);
    if (!survey) {
      throw new Error("Survey not found");
    }

    // Get user's qualification history
    const userSurveys = await ctx.db
      .query("surveys")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const totalAttempts = userSurveys.length;
    const completedSurveys = userSurveys.filter((s) => s.status === "completed").length;
    const qualificationRate = totalAttempts > 0 ? (completedSurveys / totalAttempts) * 100 : 0;
    const fraudFlags = user.fraudFlags || 0;

    // Calculate time spent
    const timeSpent = surveyAttempt.timeSpentSeconds || 0;
    const expectedMinTime = (survey.estimatedMinutes * 60) * 0.1;

    // Build reasoning
    let reasoning: string[] = [];

    if (timeSpent < 30) {
      reasoning.push("The disqualification occurred within 30 seconds, which often indicates a technical glitch rather than a legitimate screening failure.");
    }

    if (timeSpent < expectedMinTime) {
      reasoning.push("The disqualification happened unusually fast compared to the survey's estimated completion time.");
    }

    if (qualificationRate > 60) {
      reasoning.push(`You have a strong qualification rate of ${qualificationRate.toFixed(1)}%, indicating you typically meet survey requirements.`);
    }

    if (fraudFlags === 0) {
      reasoning.push("Your account has no history of fraudulent or low-quality responses.");
    }

    if (survey.commonlyIncorrectDQ) {
      reasoning.push("This survey has a history of incorrectly disqualifying qualified participants.");
    }

    const disqualificationDate = new Date(surveyAttempt.disqualifiedAt || Date.now());
    const formattedDate = disqualificationDate.toLocaleString();

    const message = `Hello,

I would like to request a review of a disqualification I received.

Survey Information:
- Survey Title: ${survey.title}
- Date/Time of Attempt: ${formattedDate}
- Time Spent Before Disqualification: ${Math.floor((surveyAttempt.timeSpentSeconds || 0) / 60)} minutes ${(surveyAttempt.timeSpentSeconds || 0) % 60} seconds

Why This Disqualification May Be Incorrect:
${reasoning.join(" ")}

User Profile Match:
- I have a qualification rate of ${qualificationRate.toFixed(1)}%, demonstrating that I typically meet survey requirements.
- My account has no history of fraudulent or low-quality responses.
- I completed the pre-screening questions honestly and thoroughly.

I kindly request a reevaluation of this disqualification. I believe there may have been a technical issue or error in the screening process.

Thank you for your time and cooperation.

Best regards,
${user.name || user.email || "Survey Participant"}`;

    return message;
  },
});

// Submit appeal
export const submitAppeal = mutation({
  args: {
    surveyAttemptId: v.id("surveys"),
    appealMessage: v.string(),
    aiReasoning: v.string(),
    aiConfidence: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const surveyAttempt = await ctx.db.get(args.surveyAttemptId);
    if (!surveyAttempt || surveyAttempt.userId !== user._id) {
      throw new Error("Survey attempt not found");
    }

    const survey = await ctx.db.get(surveyAttempt.surveyId);
    if (!survey) {
      throw new Error("Survey not found");
    }

    // Check if appeal already exists
    const existingAppeal = await ctx.db
      .query("appealTickets")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("surveyAttemptId"), args.surveyAttemptId))
      .first();

    if (existingAppeal) {
      throw new Error("An appeal for this survey has already been submitted");
    }

    // Create appeal ticket
    const ticketId = await ctx.db.insert("appealTickets", {
      userId: user._id,
      userEmail: user.email || "no-email@provided.com",
      surveyId: surveyAttempt.surveyId,
      surveyTitle: survey.title,
      surveyAttemptId: args.surveyAttemptId,
      ticketType: "Disqualification Appeal",
      status: "Open",
      priority: "Medium",
      aiReasoning: args.aiReasoning,
      aiConfidence: args.aiConfidence,
      appealMessage: args.appealMessage,
      disqualificationTime: surveyAttempt.disqualifiedAt || Date.now(),
      timeSpentBeforeDQ: surveyAttempt.timeSpentSeconds || 0,
      tags: ["Possible False Disqualification", "AI Generated"],
    });

    return ticketId;
  },
});

// Get user's appeals
export const getUserAppeals = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const appeals = await ctx.db
      .query("appealTickets")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return appeals;
  },
});

// Get appeal by ID
export const getAppealById = query({
  args: { appealId: v.id("appealTickets") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const appeal = await ctx.db.get(args.appealId);
    if (!appeal || appeal.userId !== user._id) {
      throw new Error("Appeal not found");
    }

    return appeal;
  },
});
