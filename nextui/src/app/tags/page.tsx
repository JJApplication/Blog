"use client";

import { useEffect } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { Tag as TagIcon } from "lucide-react";
import Link from "next/link";

export default function TagsPage() {
  const { tags, fetchTags, isLoading, error } = useBlogStore();

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-24 overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto px-6 py-12 flex-grow flex flex-col">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 text-glow">
            Tags
          </h1>
          <p className="text-white/60">
            Explore articles by topics and tags.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-wrap gap-4">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="animate-pulse h-10 w-24 bg-white/10 rounded-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-12 flex-grow">
            Failed to load tags: {error}
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {tags.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
              >
                <Link href={`/tag/${encodeURIComponent(item)}`}>
                  <GlassCard className="!p-3 flex items-center gap-2 hover:-translate-y-1 cursor-pointer transition-transform duration-300">
                    <TagIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-white/90 font-medium text-sm">
                      {item}
                    </span>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Ambient glowing orbs */}
      <div className="fixed top-1/4 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 pointer-events-none -z-10" />
    </div>
  );
}
