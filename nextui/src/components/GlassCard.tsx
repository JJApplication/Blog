import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card",
        "relative overflow-hidden group",
        className
      )}
      {...props}
    >
      <div className="absolute -inset-2 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 group-hover:-translate-x-full transition-all duration-1000 transform -skew-x-12 z-0" />
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
}
