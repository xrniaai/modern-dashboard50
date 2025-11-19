import { v } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Return customer-focused stats
    return {
      accountBalance: 2450.00,
      pointsEarned: 1850,
      activeOffers: 12,
      referrals: 8,
    };
  },
});

export const getRecentActivity = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Return customer activity data
    return [
      {
        id: "1",
        type: "earning",
        title: "Points Earned",
        description: "Completed survey: Tech Product Feedback",
        timestamp: Date.now() - 1000 * 60 * 15,
      },
      {
        id: "2",
        type: "redemption",
        title: "Reward Redeemed",
        description: "$10 Amazon Gift Card",
        timestamp: Date.now() - 1000 * 60 * 60 * 3,
      },
      {
        id: "3",
        type: "referral",
        title: "Referral Bonus",
        description: "Your friend John joined - 100 PV earned",
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
      },
      {
        id: "4",
        type: "offer",
        title: "New Offer Available",
        description: "Complete a shopping task - Earn 250 PV",
        timestamp: Date.now() - 1000 * 60 * 60 * 48,
      },
    ];
  },
});

export const getTopSurveyRecommendations = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Mock survey data with ranking logic: points ÷ estimated_minutes + match_bonus
    const surveys = [
      {
        id: "1",
        title: "Tech Product Feedback",
        description: "Share your thoughts on the latest tech gadgets",
        points: 250,
        estimatedMinutes: 10,
        matchBonus: 0.5,
        category: "Technology",
      },
      {
        id: "2",
        title: "Shopping Habits Survey",
        description: "Tell us about your online shopping preferences",
        points: 200,
        estimatedMinutes: 8,
        matchBonus: 0.8,
        category: "Retail",
      },
      {
        id: "3",
        title: "Entertainment Preferences",
        description: "What do you watch and listen to?",
        points: 150,
        estimatedMinutes: 5,
        matchBonus: 0.3,
        category: "Entertainment",
      },
      {
        id: "4",
        title: "Health & Wellness Check",
        description: "Quick survey about your wellness routine",
        points: 300,
        estimatedMinutes: 15,
        matchBonus: 0.4,
        category: "Health",
      },
      {
        id: "5",
        title: "Travel Experience Survey",
        description: "Share your recent travel experiences",
        points: 400,
        estimatedMinutes: 20,
        matchBonus: 0.6,
        category: "Travel",
      },
    ];

    // Calculate ranking score and sort
    const rankedSurveys = surveys
      .map((survey) => ({
        ...survey,
        rankingScore: survey.points / survey.estimatedMinutes + survey.matchBonus,
      }))
      .sort((a, b) => b.rankingScore - a.rankingScore)
      .slice(0, 5);

    return rankedSurveys;
  },
});

export const getPersonalizedEarningStrategy = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Mock personalized earning strategy
    return {
      dailyGoal: 500,
      currentProgress: 150,
      recommendations: [
        {
          action: "Complete 2 high-value surveys",
          potentialEarnings: 500,
          timeRequired: 25,
          priority: "high",
        },
        {
          action: "Refer a friend",
          potentialEarnings: 100,
          timeRequired: 5,
          priority: "medium",
        },
        {
          action: "Complete profile for bonus",
          potentialEarnings: 50,
          timeRequired: 10,
          priority: "low",
        },
      ],
      bestTimeToComplete: "Evening (6-9 PM)",
      estimatedDailyEarnings: 650,
    };
  },
});

export const getEstimatedEarningsToday = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Mock estimated earnings data
    return {
      currentEarnings: 150,
      projectedEarnings: 650,
      availableSurveys: 12,
      averagePointsPerSurvey: 225,
      timeToReachGoal: 45, // minutes
      topOpportunity: {
        title: "Travel Experience Survey",
        points: 400,
        minutes: 20,
      },
    };
  },
});

export const getHighestPayingSurveys = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Mock highest paying surveys
    return [
      {
        id: "1",
        title: "Travel Experience Survey",
        points: 400,
        estimatedMinutes: 20,
        pointsPerMinute: 20,
        category: "Travel",
        expiresIn: "2 hours",
      },
      {
        id: "2",
        title: "Health & Wellness Check",
        points: 300,
        estimatedMinutes: 15,
        pointsPerMinute: 20,
        category: "Health",
        expiresIn: "5 hours",
      },
      {
        id: "3",
        title: "Tech Product Feedback",
        points: 250,
        estimatedMinutes: 10,
        pointsPerMinute: 25,
        category: "Technology",
        expiresIn: "1 day",
      },
    ];
  },
});