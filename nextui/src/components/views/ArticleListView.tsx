import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Calendar, Tag } from "lucide-react";
import { Article } from "@/store/useBlogStore";

interface ArticleListViewProps {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
}

export function ArticleListView({ articles, isLoading, error }: ArticleListViewProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 flex-grow">
        {[...Array(5)].map((_, i) => (
          <GlassCard key={i} className="animate-pulse h-24 flex items-center !p-4">
            <div className="flex-grow space-y-3">
              <div className="h-5 bg-white/10 rounded w-1/3" />
              <div className="h-4 bg-white/10 rounded w-1/4" />
            </div>
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
    <div className="flex flex-col gap-4 flex-grow">
      {articles.map((article, index) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <GlassCard className="!p-4 flex items-center justify-between hover:bg-white/10 cursor-pointer group">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center gap-4 text-xs text-white/50">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{article.date}</span>
                </div>
                {article.tags && (
                  <div className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{article.tags}</span>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}