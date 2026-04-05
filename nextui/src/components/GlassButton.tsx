import { cn } from "@/lib/utils";
import React from "react";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function GlassButton({ children, className, ...props }: GlassButtonProps) {
  return (
    <button
      className={cn(
        "relative overflow-hidden group",
        "px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300",
        "bg-white/5 border border-white/10 text-white backdrop-blur-md",
        "hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]",
        "active:scale-95",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
      </div>
    </button>
  );
}
