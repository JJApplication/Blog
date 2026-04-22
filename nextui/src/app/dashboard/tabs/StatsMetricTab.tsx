"use client";

import { useEffect, useMemo, useState } from "react";
import { GlassButton } from "@/components/GlassButton";
import { apiFetch } from "@/lib/api";

type MetricColor = "blue" | "purple" | "cyan";

interface StatsMetricTabProps {
  title: string;
  endpoint: string;
  valueLabel: string;
  active: boolean;
  color: MetricColor;
  valueKey?: string;
}

interface MetricItem {
  name: string;
  value: number;
}

const COLOR_MAP: Record<MetricColor, { bar: string; text: string; badge: string }> = {
  blue: {
    bar: "bg-blue-400/85",
    text: "text-blue-200",
    badge: "bg-blue-500/20 border-blue-400/30 text-blue-100",
  },
  purple: {
    bar: "bg-purple-400/85",
    text: "text-purple-200",
    badge: "bg-purple-500/20 border-purple-400/30 text-purple-100",
  },
  cyan: {
    bar: "bg-cyan-400/85",
    text: "text-cyan-200",
    badge: "bg-cyan-500/20 border-cyan-400/30 text-cyan-100",
  },
};

const resolveName = (item: Record<string, unknown>, fallback: string) => {
  const candidates = [item.name, item.title, item.postName, item.article, item.slug];
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return fallback;
};

const resolveValue = (item: Record<string, unknown>, valueKey?: string) => {
  const preferredValue = valueKey ? item[valueKey] : undefined;
  const candidates = [
    preferredValue,
    item.value,
    item.count,
    item.view,
    item.like,
    item.share,
    item.views,
    item.likes,
    item.shares,
    item.total,
    item.num,
  ];
  for (const value of candidates) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) return Number(value);
  }
  return 0;
};

const normalizeMetrics = (raw: unknown, valueKey?: string): MetricItem[] => {
  if (Array.isArray(raw)) {
    return raw
      .map((item, index) => {
        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>;
          return {
            name: resolveName(record, `文章-${index + 1}`),
            value: resolveValue(record, valueKey),
          };
        }
        return null;
      })
      .filter((item): item is MetricItem => item !== null);
  }

  if (raw && typeof raw === "object") {
    return Object.entries(raw as Record<string, unknown>)
      .map(([key, value]) => {
        if (typeof value === "number" && Number.isFinite(value)) {
          return { name: key, value };
        }
        if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
          return { name: key, value: Number(value) };
        }
        return null;
      })
      .filter((item): item is MetricItem => item !== null);
  }

  return [];
};

export default function StatsMetricTab({ title, endpoint, valueLabel, active, color, valueKey }: StatsMetricTabProps) {
  const [items, setItems] = useState<MetricItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => b.value - a.value),
    [items]
  );
  const top10 = useMemo(() => sortedItems.slice(0, 10), [sortedItems]);
  const maxValue = useMemo(() => Math.max(...top10.map((item) => item.value), 1), [top10]);

  const fetchMetrics = async () => {
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
      const normalized = normalizeMetrics(payload, valueKey);
      setItems(normalized);
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
      fetchMetrics();
    }
  }, [active]);

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <GlassButton onClick={fetchMetrics} disabled={loading} className="px-4 py-2">
          刷新数据
        </GlassButton>
      </div>

      {loading ? (
        <div className="space-y-3 mb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl border border-white/10 bg-white/5" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-red-300 mb-6">
          加载失败：{error}
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 mb-6">
            <div className="h-72 overflow-y-auto pr-1 space-y-2">
              {sortedItems.length === 0 ? (
                <div className="h-full flex items-center justify-center text-white/50 text-sm">暂无统计数据</div>
              ) : (
                sortedItems.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-white/80 text-sm truncate">{item.name}</p>
                    </div>
                    <span className={`text-xs border rounded-full px-2 py-0.5 ${COLOR_MAP[color].badge}`}>
                      {item.value} {valueLabel}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm text-white/70 mb-3">TOP10 柱状图</h3>
            {top10.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-8 text-center text-white/50 text-sm">
                暂无可视化数据
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="h-56 flex items-end gap-2">
                  {top10.map((item, index) => {
                    const barHeight = `${Math.max((item.value / maxValue) * 100, 8)}%`;
                    return (
                      <div key={`${item.name}-${index}`} className="flex-1 min-w-0 flex flex-col items-center gap-2">
                        <span className={`text-[10px] ${COLOR_MAP[color].text}`}>{item.value}</span>
                        <div className="w-full h-40 flex items-end">
                          <div
                            className={`w-full rounded-t-md transition-all duration-300 ${COLOR_MAP[color].bar}`}
                            style={{ height: barHeight }}
                            title={`${item.name}: ${item.value}`}
                          />
                        </div>
                        <span className="text-[10px] text-white/60 truncate w-full text-center">{item.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
