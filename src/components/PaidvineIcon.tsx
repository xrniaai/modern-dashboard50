import { LucideIcon } from "lucide-react";

interface PaidvineIconProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PaidvineIcon({ icon: Icon, size = "md", className = "" }: PaidvineIconProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return <Icon className={`${sizeClasses[size]} ${className}`} />;
}
