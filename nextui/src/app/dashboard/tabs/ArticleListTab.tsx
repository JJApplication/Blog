"use client";

import { useEffect, useState } from "react";
import { Calendar, Eye, Tag } from "lucide-react";
import { GlassButton } from "@/components/GlassButton";
import { GlassCard } from "@/components/GlassCard";
import { apiFetch } from "@/lib/api";
import type { Article } from "@/store/useBlogStore";

interface ArticleListTabProps {
  active: boolean;
}

export default function ArticleListTab({ active }: ArticleListTabProps) {
  const [posts, setPosts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const isDebugMode = process.env.NODE_ENV === "development";
      const endpoint = "/api/dashboard/post";

      const res = isDebugMode
        ? await fetch(endpoint, { method: "GET" })
        : await apiFetch(endpoint, { method: "GET" });

      if (!res.ok) {
        throw new Error("获取文章列表失败");
      }

      const json = await res.json();
      if (json?.code === 200) {
        setPosts(Array.isArray(json.data) ? json.data : []);
      } else if (Array.isArray(json)) {
        setPosts(json);
      } else {
        throw new Error(json?.msg || "获取文章列表失败");
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("未知错误");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (active) {
      fetchPosts();
    }
  }, [active]);

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white">文章列表</h2>
        <GlassButton onClick={fetchPosts} disabled={loading} className="px-4 py-2">
          刷新列表
        </GlassButton>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl border border-white/10 bg-white/5" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-red-300">
          加载失败：{error}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-6 text-white/60">
          当前暂无文章数据
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <GlassCard key={post.id} className="!p-4 hover:bg-white/10 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-medium text-white truncate">{post.title}</h3>
                  <p className="text-xs text-white/40 truncate mt-1">slug: {post.name}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-white/60">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span className="inline-flex items-center gap-1 max-w-[220px] truncate">
                    <Tag className="w-3.5 h-3.5" />
                    {post.tags || "-"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    ID {post.id}
                  </span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
