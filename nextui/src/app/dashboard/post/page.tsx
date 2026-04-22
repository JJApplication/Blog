"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Download, Save } from "lucide-react";
import { GlassButton } from "@/components/GlassButton";
import { GlassCard } from "@/components/GlassCard";
import { apiFetch } from "@/lib/api";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-[620px] rounded-xl border border-white/10 bg-black/25 flex items-center justify-center text-white/60 text-sm">
      编辑器加载中...
    </div>
  ),
});

const getDefaultPostName = () => `post-${Date.now()}`;

const downloadMarkdown = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.md`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export default function DashboardPostEditorPage() {
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const defaultName = getDefaultPostName();
    setTitle((prev) => prev || defaultName);
    setFileName((prev) => prev || defaultName);
    setContent((prev) => prev || `# ${defaultName}\n\n在这里开始编写你的 Markdown 内容...`);
  }, []);

  const handleExportMd = () => {
    if (!fileName.trim()) {
      setError("文件名不能为空");
      return;
    }
    setError("");
    setMessage("");
    downloadMarkdown(fileName.trim(), content);
    setMessage("Markdown 导出成功");
  };

  const handleCreatePost = async () => {
    if (!fileName.trim()) {
      setError("文件名不能为空");
      return;
    }
    if (!title.trim()) {
      setError("标题不能为空");
      return;
    }
    if (!content.trim()) {
      setError("内容不能为空");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        name: fileName.trim(),
        title: title.trim(),
        content,
      };

      const isDebugMode = process.env.NODE_ENV === "development";
      const endpoint = "/dashboard/post/add";

      const res = isDebugMode
        ? await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await apiFetch(endpoint, {
            method: "POST",
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        throw new Error("创建文章失败");
      }

      const json = await res.json();
      if (json?.code === 200 || json?.success === true) {
        setMessage("文章创建成功");
      } else {
        throw new Error(json?.msg || "创建文章失败");
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("创建文章失败");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-24 overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 py-6 flex-grow flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              返回管理面板
            </Link>
            <h1 className="text-2xl md:text-3xl font-semibold text-white text-glow">文章编辑器</h1>
          </div>

          <div className="flex items-center gap-2">
            <GlassButton onClick={handleExportMd} className="px-4 py-2">
              <Download className="w-4 h-4" />
              导出md
            </GlassButton>
            <GlassButton onClick={handleCreatePost} disabled={saving} className="px-4 py-2">
              <Save className="w-4 h-4" />
              {saving ? "创建中..." : "创建文章"}
            </GlassButton>
          </div>
        </div>

        <GlassCard className="!p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">标题</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/35"
              />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">文件名（不含 .md）</label>
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/35"
              />
            </div>
          </div>
        </GlassCard>

        {error && (
          <div className="rounded-lg border border-red-400/25 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-lg border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm text-green-200">
            {message}
          </div>
        )}

        <GlassCard className="!p-4 flex-grow min-h-[70vh]">
          <div className="text-sm text-white/70 mb-3">Markdown 在线编辑器（实时预览）</div>
          <div data-color-mode="dark">
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || "")}
              height={620}
              preview="live"
              visibleDragbar={false}
            />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
