import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    // Get all users with their survey data
    const users = await ctx.db.query("users").collect();
    
    // Calculate total points for each user from their surveys
    const leaderboardData = await Promise.all(
      users.map(async (user) => {
        const surveys = await ctx.db
          .query("surveys")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .filter((q) => q.eq(q.field("status"), "completed"))
          .collect();

        const totalPoints = surveys.reduce((sum, s) => sum + s.pointsEarned, 0);
        const completedSurveys = surveys.length;

        return {
          userId: user._id,
          name: user.name || user.email?.split('@')[0] || "Anonymous",
          email: user.email,
          totalPoints,
          completedSurveys,
          role: user.role || "user",
        };
      })
    );

    // Sort by points descending
    const sortedLeaderboard = leaderboardData
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
        isCurrentUser: entry.userId === currentUser._id,
      }));

    // Find current user's position
    const currentUserRank = sortedLeaderboard.find(
      (entry) => entry.userId === currentUser._id
    );

    return {
      leaderboard: sortedLeaderboard,
      currentUserRank: currentUserRank || null,
      totalUsers: sortedLeaderboard.length,
    };
  },
});
