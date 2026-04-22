"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Eye,
  Folder,
  Heart,
  QrCode,
  Share2,
  Tag,
  User,
  X,
} from "lucide-react";
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

function readCount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

function extractCount(payload: unknown): number | null {
  if (payload === null || payload === undefined) {
    return null;
  }
  const direct = readCount(payload);
  if (direct !== null) {
    return direct;
  }
  if (typeof payload !== "object") {
    return null;
  }
  const data = payload as Record<string, unknown>;
  const keys = ["views", "view", "likes", "like", "shares", "share", "count", "data"];
  for (const key of keys) {
    const value = data[key];
    const parsed = readCount(value);
    if (parsed !== null) {
      return parsed;
    }
  }
  return null;
}

export function PostDetailClient({ postName }: PostDetailClientProps) {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [brother, setBrother] = useState<[string, string]>(["", ""]);
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [shares, setShares] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [likeAnimationTick, setLikeAnimationTick] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postName) return;

    const fetchPageData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [postRes, commentsRes, brotherRes, viewsRes, likesRes, sharesRes] = await Promise.all([
          apiFetch(`/api/article/post?name=${encodeURIComponent(postName)}`),
          apiFetch(`/api/article/comments?name=${encodeURIComponent(postName)}`),
          apiFetch(`/api/article/brother?name=${encodeURIComponent(postName)}`),
          apiFetch(`/api/article/views?name=${encodeURIComponent(postName)}`),
          apiFetch(`/api/article/likes?name=${encodeURIComponent(postName)}`),
          apiFetch(`/api/article/share?name=${encodeURIComponent(postName)}`),
        ]);

        if (!postRes.ok) {
          throw new Error("Failed to fetch post");
        }

        const postJson = (await postRes.json()) as PostDetailResponse;
        const commentsJson = commentsRes.ok
          ? ((await commentsRes.json()) as PostCommentsResponse)
          : { data: [], msg: "" };
        let brotherJson = [] as string[];
        if (brotherRes.ok) {
          const { data } = await brotherRes.json();
          brotherJson = data as string[];
        }
        if (viewsRes.ok) {
          const viewsJson = await viewsRes.json();
          setViews(extractCount(viewsJson) ?? 0);
        } else {
          setViews(0);
        }
        if (likesRes.ok) {
          const likesJson = await likesRes.json();
          setLikes(extractCount(likesJson) ?? 0);
        } else {
          setLikes(0);
        }
        if (sharesRes.ok) {
          const sharesJson = await sharesRes.json();
          setShares(extractCount(sharesJson) ?? 0);
        } else {
          setShares(0);
        }

        if (postJson.code !== 200 || !postJson.data) {
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

  useEffect(() => {
    if (!showShareModal) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowShareModal(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showShareModal]);

  const tags = useMemo(() => {
    return (post?.tags || "").split(/\s+/).filter(Boolean);
  }, [post?.tags]);

  const categories = useMemo(() => {
    return (post?.categories || "").split(/\s+/).filter(Boolean);
  }, [post?.categories]);

  const createdAt = post?.date_plus || post?.date || "-";
  const updatedAt = post?.update || "-";
  const shareQrUrl = useMemo(() => {
    if (!shareUrl) {
      return "";
    }
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
      shareUrl
    )}`;
  }, [shareUrl]);

  const handleLike = async () => {
    if (!postName || isLiking) {
      return;
    }
    setActionError(null);
    setIsLiking(true);
    try {
      const response = await apiFetch(
        `/api/article/likes?name=${encodeURIComponent(postName)}`,
        { method: "POST" }
      );
      if (!response.ok) {
        throw new Error("点赞失败，请稍后再试");
      }
      const payload = await response.json().catch(() => null);
      const next = extractCount(payload);
      setLikes((prev) => next ?? prev + 1);
      setLikeAnimationTick((prev) => prev + 1);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "点赞失败，请稍后再试");
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    if (!postName || isSharing) {
      return;
    }
    setActionError(null);
    setCopied(false);
    setShareUrl(window.location.href);
    setIsSharing(true);
    try {
      const response = await apiFetch(
        `/api/article/share?name=${encodeURIComponent(postName)}`,
        { method: "POST" }
      );
      if (!response.ok) {
        throw new Error("分享计数更新失败，请稍后再试");
      }
      const payload = await response.json().catch(() => null);
      const next = extractCount(payload);
      setShares((prev) => next ?? prev + 1);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "分享计数更新失败，请稍后再试");
    } finally {
      setIsSharing(false);
      setShowShareModal(true);
    }
  };

  const handleCopyShareLink = async () => {
    if (!shareUrl) {
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      setActionError("复制失败，请手动复制链接");
    }
  };

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
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-100">
                  <Eye className="w-4 h-4 text-cyan-300" />
                  <span>浏览 {views.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    type="button"
                    onClick={handleLike}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLiking}
                    className="inline-flex items-center gap-2 rounded-xl border border-pink-400/30 bg-pink-500/10 px-3.5 py-2 text-sm text-pink-100 hover:bg-pink-500/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <motion.span
                      key={likeAnimationTick}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.35, 0.95, 1], rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.45 }}
                      className="inline-flex"
                    >
                      <Heart className="w-4 h-4" />
                    </motion.span>
                    <span>点赞 {likes.toLocaleString()}</span>
                  </motion.button>

                  <button
                    type="button"
                    onClick={handleShare}
                    disabled={isSharing}
                    className="inline-flex items-center gap-2 rounded-xl border border-purple-400/30 bg-purple-500/10 px-3.5 py-2 text-sm text-purple-100 hover:bg-purple-500/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>分享 {shares.toLocaleString()}</span>
                  </button>
                </div>
              </div>

              {actionError && <div className="mb-4 text-sm text-rose-300">{actionError}</div>}

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

      <AnimatePresence>
        {showShareModal && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md"
              onClick={(event) => event.stopPropagation()}
            >
              <GlassCard className="!p-6 relative">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="absolute right-4 top-4 rounded-md p-1 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 mb-4">
                  <QrCode className="w-5 h-5 text-purple-300" />
                  <h3 className="text-lg font-semibold text-white">分享文章</h3>
                </div>

                <p className="text-sm text-white/70 mb-4">
                  点击链接复制并分享
                </p>

                <div className="rounded-xl border border-white/15 bg-black/35 p-3">
                  <p className="text-xs text-white/60 break-all mb-3">{shareUrl}</p>
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 hover:bg-white/15 text-white text-sm px-3 py-2 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "已复制链接" : "复制分享链接"}</span>
                  </button>
                </div>

                {shareQrUrl && (
                  <div className="mt-4 rounded-xl border border-white/15 bg-white p-3 flex justify-center">
                    <img
                      src={shareQrUrl}
                      alt="博客分享二维码"
                      className="w-44 h-44"
                    />
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
