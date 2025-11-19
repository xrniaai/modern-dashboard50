import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  index: number;
}

export function StatCard({ title, value, icon: Icon, trend, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary via-primary to-primary/80 overflow-hidden h-full hover:shadow-lg hover:border-primary/40 transition-all duration-300 cursor-pointer">
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-sm font-medium text-primary-foreground/80">
                {title}
              </CardTitle>
              <div className="p-2 rounded-lg bg-white/20">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary-foreground">{value}</p>
              {trend && (
                <p className="text-xs text-primary-foreground/70">{trend}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}