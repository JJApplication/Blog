"use client";

import { useEffect } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import { HeroSection } from "@/components/HeroSection";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";

export default function Home() {
  const { articles, fetchArticles, isLoading, error, pageSize } = useBlogStore();

  useEffect(() => {
    fetchArticles(1, pageSize);
  }, [fetchArticles, pageSize]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center overflow-x-hidden">
      <HeroSection />

      <section className="relative w-full max-w-6xl mx-auto px-6 py-24 z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Latest Articles
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <GlassCard key={i} className="animate-pulse h-64 flex flex-col justify-between">
                <div className="h-6 bg-white/10 rounded w-3/4 mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-5/6" />
                </div>
                <div className="h-4 bg-white/10 rounded w-1/4 mt-auto" />
              </GlassCard>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-12">
            Failed to load articles: {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard className="h-full flex flex-col hover:-translate-y-2 cursor-pointer">
                  <div className="flex flex-col h-full">
                    <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-white/60 mb-6 line-clamp-3 leading-relaxed flex-grow">
                      {article.abstract || "No abstract available for this article."}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-white/40 mt-auto pt-4 border-t border-white/10">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{article.date}</span>
                      </div>
                      
                      {article.tags && (
                        <div className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[100px]">{article.tags}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
        
        {!isLoading && articles.length === 0 && !error && (
          <div className="text-center text-white/50 py-12">
            No articles found.
          </div>
        )}
      </section>
      
      {/* Footer */}
      <footer className="w-full py-8 text-center text-white/30 text-sm mt-auto border-t border-white/5">
        <p>© {new Date().getFullYear()} BLOG.NEXT. <a href="https://renj.io" target="_blank" rel="noopener noreferrer">renj.io</a> All rights reserved.</p>
      </footer>
    </div>
  );
}
