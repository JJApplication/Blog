"use client";

import { useEffect } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { BookOpen, Calendar, FileText } from "lucide-react";

export default function ZhuanlanPage() {
  const { zhuanlans, fetchZhuanlans, isLoading, error } = useBlogStore();

  useEffect(() => {
    fetchZhuanlans();
  }, [fetchZhuanlans]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-24 overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto px-6 py-12 flex-grow flex flex-col">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 text-glow">
            Zhuanlan
          </h1>
          <p className="text-white/60">
            Special columns and serialized tutorials.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <GlassCard key={i} className="animate-pulse h-48 flex flex-col justify-between">
                <div className="h-6 bg-white/10 rounded w-1/2 mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-5/6" />
                </div>
                <div className="h-4 bg-white/10 rounded w-1/4 mt-auto" />
              </GlassCard>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-12 flex-grow">
            Failed to load zhuanlan: {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {zhuanlans.map((item, index) => (
              <motion.div
                key={item.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard className="h-full flex flex-col hover:-translate-y-2 cursor-pointer transition-transform duration-300">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <BookOpen className="w-6 h-6 text-purple-400" />
                      <h3 className="text-2xl font-semibold text-white leading-snug">
                        {item.title}
                      </h3>
                    </div>
                    
                    <p className="text-base text-white/70 mb-6 leading-relaxed flex-grow">
                      {item.content || "No description available for this column."}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-white/40 mt-auto pt-4 border-t border-white/10">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.date.split(' ')[0]}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{item.posts ? item.posts.length : 0} Posts</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Ambient glowing orbs */}
      <div className="fixed top-1/4 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 pointer-events-none -z-10" />
    </div>
  );
}