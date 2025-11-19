import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

interface Activity {
  title: string;
  description: string;
  timestamp: number;
}

interface ActivityFeedProps {
  activities: Activity[];
}

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (!activities || activities.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 border-primary/20 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-primary/10 transition-colors duration-200 cursor-pointer"
            >
              <div className="p-2 rounded-full bg-primary/10 shrink-0">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm mb-1">{activity.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTimestamp(activity.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}