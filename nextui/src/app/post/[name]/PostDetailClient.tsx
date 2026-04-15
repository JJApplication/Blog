"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, ChevronLeft, ChevronRight, Clock3, Folder, Tag, User } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { apiFetch } from "@/lib/api";

interface PostDetailClientProps {
  postName: string;
}

interface PostDetail {
  name: string;
  title: string;
  date: string;
  date_plus?: string;
  update?: string;
  content: string;
  tags?: string;
  categories?: string;
}

interface PostDetailResponse {
  code: number;
  msg: string;
  data: PostDetail;
}

interface PostComment {
  primary_id: number;
  name: string;
  user: string;
  date: string;
  comment: string;
}

interface PostCommentsResponse {
  data: PostComment[];
  msg: string;
}

export function PostDetailClient({ postName }: PostDetailClientProps) {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [brother, setBrother] = useState<[string, string]>(["", ""]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postName) return;

    const fetchPageData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [postRes, commentsRes, brotherRes] = await Promise.all([
          apiFetch(`/api/article/post?name=${encodeURIComponent(postName)}`),
          apiFetch(`/api/article/comments?name=${encodeURIComponent(postName)}`),
          apiFetch(`/api/article/brother?name=${encodeURIComponent(postName)}`),
        ]);

        if (!postRes.ok) {
          throw new Error("Failed to fetch post");
        }

        const postJson = (await postRes.json()) as PostDetailResponse;
        const commentsJson = commentsRes.ok
          ? ((await commentsRes.json()) as PostCommentsResponse)
          : { data: [], msg: "" };
        const brotherJson = brotherRes.ok ? ((await brotherRes.json()) as string[]) : [];

        if (postJson.code !== 233200 || !postJson.data) {
          throw new Error(postJson.msg || "Failed to parse post data");
        }

        setPost(postJson.data);
        setComments(Array.isArray(commentsJson.data) ? commentsJson.data : []);
        setBrother([
          Array.isArray(brotherJson) && brotherJson[0] ? brotherJson[0] : "",
          Array.isArray(brotherJson) && brotherJson[1] ? brotherJson[1] : "",
        ]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [postName]);

  const tags = useMemo(() => {
    return (post?.tags || "").split(/\s+/).filter(Boolean);
  }, [post?.tags]);

  const categories = useMemo(() => {
    return (post?.categories || "").split(/\s+/).filter(Boolean);
  }, [post?.categories]);

  const createdAt = post?.date_plus || post?.date || "-";
  const updatedAt = post?.update || "-";

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="w-full max-w-4xl mx-auto px-6 space-y-6">
        {isLoading && (
          <GlassCard className="animate-pulse !p-8">
            <div className="h-10 bg-white/10 rounded w-2/3 mb-6" />
            <div className="h-5 bg-white/10 rounded w-1/3" />
          </GlassCard>
        )}

        {!isLoading && error && (
          <GlassCard className="!p-8 text-red-400">
            Failed to load post: {error}
          </GlassCard>
        )}

        {!isLoading && !error && post && (
          <>
            <GlassCard className="!p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight text-glow mb-7">
                {post.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-white/60 mb-7">
                <div className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{createdAt}</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <Clock3 className="w-4 h-4" />
                  <span>{updatedAt}</span>
                </div>
              </div>

              {(tags.length > 0 || categories.length > 0) && (
                <div className="space-y-3 pt-1">
                  {tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag className="w-4 h-4 text-cyan-300" />
                      {tags.map((item) => (
                        <span
                          key={item}
                          className="px-2.5 py-1 rounded-full text-xs bg-cyan-500/15 text-cyan-200 border border-cyan-500/25"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                  {categories.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <Folder className="w-4 h-4 text-purple-300" />
                      {categories.map((item) => (
                        <span
                          key={item}
                          className="px-2.5 py-1 rounded-full text-xs bg-purple-500/15 text-purple-200 border border-purple-500/25"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </GlassCard>

            <GlassCard className="!p-8">
              <MarkdownRenderer content={post.content || ""} />
            </GlassCard>

            <GlassCard className="!p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Comments</h2>
              <div className="space-y-4">
                {comments.length === 0 && (
                  <div className="text-white/50 text-sm">No comments yet.</div>
                )}
                {comments.map((comment) => (
                  <div
                    key={comment.primary_id}
                    className="rounded-xl border border-white/10 bg-black/30 p-4"
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/80">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="text-white/85 font-medium">
                          {comment.user?.trim() ? comment.user : "匿名"}
                        </span>
                      </div>
                      <span className="text-xs text-white/45">{comment.date}</span>
                    </div>
                    <MarkdownRenderer
                      content={comment.comment || ""}
                      className="markdown-comment text-sm"
                    />
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="flex items-center justify-between gap-4 pt-2">
              {brother[0] ? (
                <Link
                  href={`/post/${encodeURIComponent(brother[0])}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/30">
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </span>
              )}

              {brother[1] ? (
                <Link
                  href={`/post/${encodeURIComponent(brother[1])}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/30">
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
