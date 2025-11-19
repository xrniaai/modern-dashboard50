import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PaidvineCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function PaidvineCard({ children, className = "", hover = false }: PaidvineCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      className={`bg-card border border-border rounded-lg p-6 card-shadow ${className}`}
    >
      {children}
    </motion.div>
  );
}
