import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PaidvineAvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PaidvineAvatar({
  src,
  alt = "Avatar",
  fallback = "U",
  size = "md",
  className = "",
}: PaidvineAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="bg-primary text-primary-foreground font-medium">
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
}
