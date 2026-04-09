import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Calendar, Tag } from "lucide-react";
import { Article } from "@/store/useBlogStore";
import Link from "next/link";

interface ArticleCardViewProps {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
}

export function ArticleCardView({ articles, isLoading, error }: ArticleCardViewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-grow">
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
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-12 flex-grow">
        Failed to load articles: {error}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center text-white/50 py-12 flex-grow">
        No articles found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-grow">
      {articles.map((article, index) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        >
          <Link href={`/post/${encodeURIComponent(article.name)}`} className="block h-full">
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
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
