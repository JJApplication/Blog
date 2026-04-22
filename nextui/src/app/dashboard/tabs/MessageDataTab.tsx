"use client";

import { useEffect, useState } from "react";
import { GlassButton } from "@/components/GlassButton";
import { GlassCard } from "@/components/GlassCard";
import { apiFetch } from "@/lib/api";

interface MessageDataTabProps {
  title: string;
  endpoint: string;
  active: boolean;
  emptyText: string;
}

interface MessageItem {
  id: string;
  author: string;
  date: string;
  content: string;
  articleName?: string;
}

const pickString = (record: Record<string, unknown>, keys: string[], fallback = "") => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return fallback;
};

const toMessageItem = (item: unknown, index: number): MessageItem | null => {
  if (!item || typeof item !== "object") return null;
  const record = item as Record<string, unknown>;
  const idRaw = record.id ?? record.primary_id ?? index + 1;
  const id = String(idRaw);
  const author = pickString(record, ["user", "author", "nickname", "username"], "匿名用户");
  const date = pickString(record, ["date", "create_at", "created_at", "time", "update_at"], "-");
  const content = pickString(record, ["comment", "message", "content", "text", "body"]);
  const articleName = pickString(record, ["name", "article", "article_name", "post", "postName", "title"], "");

  return {
    id,
    author,
    date,
    content: content || "(空内容)",
    articleName: articleName || undefined,
  };
};

export default function MessageDataTab({ title, endpoint, active, emptyText }: MessageDataTabProps) {
  const [items, setItems] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const isDebugMode = process.env.NODE_ENV === "development";
      const requestUrl = endpoint;
      const res = isDebugMode
        ? await fetch(requestUrl, { method: "GET" })
        : await apiFetch(requestUrl, { method: "GET" });

      if (!res.ok) {
        throw new Error(`获取${title}失败`);
      }

      const json = await res.json();
      const payload = json?.code === 200 ? json.data : Array.isArray(json) ? json : json?.data;
      const list = Array.isArray(payload)
        ? payload
            .map((item, index) => toMessageItem(item, index))
            .filter((item): item is MessageItem => item !== null)
        : [];
      setItems(list);
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
      fetchData();
    }
  }, [active]);

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <GlassButton onClick={fetchData} disabled={loading} className="px-4 py-2">
          刷新列表
        </GlassButton>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border border-white/10 bg-white/5" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-red-300">
          加载失败：{error}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-6 text-white/60">{emptyText}</div>
      ) : (
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {items.map((item) => (
            <GlassCard key={item.id} className="!p-4">
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/50 mb-2">
                <span>#{item.id}</span>
                <span>{item.author}</span>
                <span>{item.date}</span>
                {item.articleName && <span className="text-cyan-300/80">文章：{item.articleName}</span>}
              </div>
              <p className="text-sm text-white/85 leading-relaxed whitespace-pre-wrap break-words">{item.content}</p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
