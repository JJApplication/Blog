"use client";

import { useEffect, useState } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { Search as SearchIcon, Calendar, Tag } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  const { searchResults, searchArticles, isLoading, error } = useBlogStore();
  const [query, setQuery] = useState("");

  // Debounce search logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        searchArticles(query);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query, searchArticles]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-24 overflow-x-hidden">
      <div className="w-full max-w-4xl mx-auto px-6 py-12 flex-grow flex flex-col">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 text-glow">
            Search Articles
          </h1>
          
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-white/40 group-focus-within:text-white/80 transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type keywords to search..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all backdrop-blur-md shadow-lg"
              autoFocus
            />
          </div>
        </div>

        {/* Search Results Area */}
        <div className="flex-grow">
          {!query.trim() ? (
            <div className="text-center text-white/40 mt-20 flex flex-col items-center">
              <SearchIcon className="w-16 h-16 mb-4 opacity-20" />
              <p>Enter keywords above to find articles.</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <GlassCard key={i} className="animate-pulse h-28 flex flex-col justify-center">
                  <div className="h-5 bg-white/10 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-white/10 rounded w-1/4" />
                </GlassCard>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-12">
              Search failed: {error}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center text-white/50 py-12">
              No articles found matching &quot;{query}&quot;.
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-white/50 text-sm mb-6">Found {searchResults.length} result(s)</p>
              {searchResults.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link href={`/post/${encodeURIComponent(article.name)}`} className="block">
                    <GlassCard className="!p-5 hover:-translate-y-1 cursor-pointer transition-transform duration-300">
                      <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                        {article.title}
                      </h3>
                      
                      <div className="flex items-center gap-6 text-sm text-white/40">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{article.date}</span>
                        </div>
                        
                        {article.tags && (
                          <div className="flex items-center gap-1">
                            <Tag className="w-4 h-4" />
                            <span className="truncate max-w-[200px]">{article.tags}</span>
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ambient glowing orbs */}
      <div className="fixed top-1/4 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000 pointer-events-none -z-10" />
    </div>
  );
}
