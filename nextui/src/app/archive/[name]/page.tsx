"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Tag, Archive as ArchiveIcon } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { apiFetch } from "@/lib/api";
import type { Article } from "@/store/useBlogStore";

export default function ArchiveDetailPage() {
  const params = useParams<{ name: string }>();
  const archiveName = useMemo(() => decodeURIComponent(params?.name || ""), [params?.name]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArchiveArticles = async () => {
      if (!archiveName) return;

      setIsLoading(true);
      setError(null);
      try {
        const res = await apiFetch(`/api/article/archives?date=${encodeURIComponent(archiveName)}`);
        if (!res.ok) throw new Error("Failed to fetch archive articles");
        const json = await res.json();

        if (json.code === 200) {
          setArticles(Array.isArray(json.data) ? json.data : []);
        } else {
          throw new Error(json.msg || "Error fetching archive articles");
        }
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchiveArticles();
  }, [archiveName]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-24 overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto px-6 py-12 flex-grow flex flex-col">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-white/50 mb-3 text-sm">
            <ArchiveIcon className="w-4 h-4" />
            <span>Archive</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 text-glow">
            {archiveName}
          </h1>
          <p className="text-white/60">Articles under this archive.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <GlassCard key={i} className="animate-pulse h-28 flex flex-col justify-center">
                <div className="h-5 bg-white/10 rounded w-3/4 mb-3" />
                <div className="h-4 bg-white/10 rounded w-1/4" />
              </GlassCard>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-12">Failed to load articles: {error}</div>
        ) : articles.length === 0 ? (
          <div className="text-center text-white/50 py-12">No articles found in this archive.</div>
        ) : (
          <div className="space-y-4">
            <p className="text-white/50 text-sm mb-4">Found {articles.length} article(s)</p>
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
              >
                <Link href={`/post/${encodeURIComponent(article.name)}`} className="block">
                  <GlassCard className="!p-5 hover:-translate-y-1 cursor-pointer transition-transform duration-300">
                    <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">{article.title}</h3>
                    <div className="flex items-center gap-6 text-sm text-white/40">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{article.date}</span>
                      </div>
                      {article.tags && (
                        <div className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          <span className="truncate max-w-[240px]">{article.tags}</span>
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
  );
}
