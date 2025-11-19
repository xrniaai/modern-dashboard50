import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TrendingUp, Clock, Zap, Target, Loader2 } from "lucide-react";

export function AIRecommendations() {
  const topSurveys = useQuery(api.dashboard.getTopSurveyRecommendations);
  const earningStrategy = useQuery(api.dashboard.getPersonalizedEarningStrategy);
  const estimatedEarnings = useQuery(api.dashboard.getEstimatedEarningsToday);
  const highestPaying = useQuery(api.dashboard.getHighestPayingSurveys);

  if (!topSurveys || !earningStrategy || !estimatedEarnings || !highestPaying) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Today's Earnings Projection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-primary/10 via-primary/5 to-background overflow-hidden relative hover:shadow-xl hover:border-primary/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                Today's Earnings Projection
              </CardTitle>
              <Badge variant="secondary" className="bg-primary text-primary-foreground border-0 shadow-sm">
                <Zap className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-background/80 backdrop-blur border border-primary/10">
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Current</p>
                <p className="text-3xl font-bold text-primary">{estimatedEarnings.currentEarnings} <span className="text-lg text-muted-foreground">PV</span></p>
              </div>
              <div className="p-4 rounded-xl bg-primary/10 backdrop-blur border border-primary/20">
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Projected</p>
                <p className="text-3xl font-bold text-primary">{estimatedEarnings.projectedEarnings} <span className="text-lg text-muted-foreground">PV</span></p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time to reach goal
              </span>
              <span className="font-bold text-primary">{estimatedEarnings.timeToReachGoal} min</span>
            </div>
            <div className="p-4 bg-gradient-to-br from-primary/5 to-background rounded-xl border border-primary/10 shadow-sm">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Top Opportunity
              </p>
              <p className="font-bold text-base mb-2">{estimatedEarnings.topOpportunity.title}</p>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-semibold text-primary">{estimatedEarnings.topOpportunity.points} PV</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{estimatedEarnings.topOpportunity.minutes} min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Recommended Surveys */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-2 border-primary/20 shadow-md hover:shadow-lg hover:border-primary/30 transition-all duration-300">
          <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b flex items-center justify-center py-6">
            <CardTitle className="text-xl font-bold tracking-tight flex items-center justify-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              Top Recommended Surveys
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {topSurveys.slice(0, 3).map((survey, index) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="p-4 border-2 border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all bg-card cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{survey.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{survey.description}</p>
                  </div>
                  <Badge variant="secondary" className="ml-2 shrink-0">
                    {survey.category}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-bold text-primary">{survey.points} PV</span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {survey.estimatedMinutes} min
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                    <Zap className="h-3 w-3" />
                    Score: {survey.rankingScore.toFixed(1)}
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Personalized Earning Strategy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-2 border-primary/20 shadow-md hover:shadow-lg hover:border-primary/30 transition-all duration-300">
          <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b flex items-center justify-center py-6">
            <CardTitle className="text-xl font-bold tracking-tight flex items-center justify-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              Your Earning Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 shadow-sm">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Daily Goal</span>
              <span className="text-2xl font-bold text-primary">{earningStrategy.dailyGoal} <span className="text-base text-muted-foreground">PV</span></span>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recommended Actions</p>
              {earningStrategy.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border-2 border-border rounded-xl flex items-start justify-between hover:border-primary/30 transition-colors bg-gradient-to-br from-card to-primary/5"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">{rec.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {rec.potentialEarnings} PV • {rec.timeRequired} min
                    </p>
                  </div>
                  <Badge
                    variant={rec.priority === "high" ? "default" : "secondary"}
                    className="ml-2 shrink-0"
                  >
                    {rec.priority}
                  </Badge>
                </motion.div>
              ))}
            </div>
            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20 shadow-sm">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Best Time to Complete
              </p>
              <p className="text-base font-bold text-primary">{earningStrategy.bestTimeToComplete}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Highest Paying Surveys Right Now */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-2 border-primary/20 shadow-md hover:shadow-lg hover:border-primary/30 transition-all duration-300">
          <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b flex items-center justify-center py-6">
            <CardTitle className="text-xl font-bold tracking-tight flex items-center justify-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              Highest Paying Right Now
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {highestPaying.map((survey, index) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="p-4 border-2 border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all bg-card cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{survey.title}</h4>
                    <Badge variant="secondary" className="text-xs">{survey.category}</Badge>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-lg font-bold text-primary">{survey.points} PV</p>
                    <p className="text-xs text-muted-foreground">{survey.estimatedMinutes} min</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                    <Zap className="h-3 w-3" />
                    {survey.pointsPerMinute} PV/min
                  </div>
                  <Badge variant="outline" className="text-xs">
                    ⏰ Expires in {survey.expiresIn}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}