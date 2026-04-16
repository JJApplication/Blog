"use client";

import { useEffect } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { Archive as ArchiveIcon } from "lucide-react";
import Link from "next/link";

export default function ArchivePage() {
  const { archives, fetchArchives, isLoading, error } = useBlogStore();

  useEffect(() => {
    fetchArchives();
  }, [fetchArchives]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-24 overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto px-6 py-12 flex-grow flex flex-col">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 text-glow">
            Archives
          </h1>
          <p className="text-white/60">
            A timeline of all published articles.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <GlassCard key={i} className="animate-pulse h-24 flex flex-col justify-center items-center">
                <div className="h-4 bg-white/10 rounded w-1/2 mb-2" />
                <div className="h-3 bg-white/10 rounded w-1/3" />
              </GlassCard>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-12 flex-grow">
            Failed to load archives: {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {archives.map((item, index) => (
              <motion.div
                key={item.date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
              >
                <Link href={`/archive/${encodeURIComponent(item.date)}`} className="block h-full">
                  <GlassCard className="!p-4 h-full flex flex-col justify-center items-center hover:-translate-y-1 cursor-pointer transition-transform duration-300">
                    <ArchiveIcon className="w-5 h-5 text-gray-400 mb-2 opacity-50" />
                    <h3 className="text-lg font-medium text-white/90">
                      {item.date}
                    </h3>
                    <span className="text-sm text-white/50 mt-1">
                      {item.count} {item.count === 1 ? 'post' : 'posts'}
                    </span>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Ambient glowing orbs */}
      <div className="fixed top-1/3 left-1/4 w-[300px] h-[300px] bg-gray-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 pointer-events-none -z-10" />
    </div>
  );
}
