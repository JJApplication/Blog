"use client";

import { useEffect, useState } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import { GlassButton } from "@/components/GlassButton";
import { ChevronLeft, ChevronRight, LayoutGrid, List, Terminal } from "lucide-react";
import { ArticleCardView } from "@/components/views/ArticleCardView";
import { ArticleListView } from "@/components/views/ArticleListView";
import { ArticleShellView } from "@/components/views/ArticleShellView";

export default function PostsPage() {
  const { articles, fetchArticles, isLoading, error, total, pageSize, setPageSize } = useBlogStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'card' | 'list' | 'shell'>('card');

  useEffect(() => {
    fetchArticles(currentPage, pageSize);
  }, [fetchArticles, currentPage, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-24 overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto px-6 py-12 flex-grow flex flex-col">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 text-glow">
              All Articles
            </h1>
            <p className="text-white/60">
              Explore {total > 0 ? total : ''} posts about technology, lifestyle, and more.
            </p>
          </div>
          
          {/* View Toggles */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
            <button onClick={() => setViewMode('card')} className={`p-2 rounded-lg transition-colors ${viewMode === 'card' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/90'}`} title="Card View">
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/90'}`} title="List View">
              <List className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode('shell')} className={`p-2 rounded-lg transition-colors ${viewMode === 'shell' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/90'}`} title="Shell View">
              <Terminal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {viewMode === 'card' && <ArticleCardView articles={articles} isLoading={isLoading} error={error} />}
        {viewMode === 'list' && <ArticleListView articles={articles} isLoading={isLoading} error={error} />}
        {viewMode === 'shell' && <ArticleShellView articles={articles} isLoading={isLoading} error={error} />}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-16 pt-8 border-t border-white/10 gap-6">
            
            {/* Page Size Selector */}
            <div className="flex items-center gap-3 text-sm text-white/70">
              <span>Show</span>
              <div className="flex gap-2">
                {[10, 20, 50].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setPageSize(size);
                      setCurrentPage(1); // Reset to page 1 on size change
                    }}
                    className={`px-3 py-1 rounded-full transition-colors ${
                      pageSize === size
                        ? 'bg-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <span>per page</span>
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-4">
              <GlassButton 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
                className={`px-4 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </GlassButton>
              
              <span className="text-white/70 text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <GlassButton 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
                className={`px-4 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ChevronRight className="w-4 h-4" />
              </GlassButton>
            </div>
          </div>
        )}
      </div>

      {/* Ambient glowing orbs for Posts page */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000 pointer-events-none -z-10" />
    </div>
  );
}