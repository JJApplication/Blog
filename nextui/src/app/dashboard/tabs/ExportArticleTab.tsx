"use client";

import { useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import JSZip from "jszip";
import { GlassButton } from "@/components/GlassButton";
import { apiFetch } from "@/lib/api";

type ExportType = "json" | "zip";

interface ExportPostItem {
  name?: string;
  content?: string;
  [key: string]: unknown;
}

const sanitizeFileName = (name: string) =>
  name
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, " ")
    .trim();

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export default function ExportArticleTab() {
  const [exportType, setExportType] = useState<ExportType>("json");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const fetchExportData = async (): Promise<ExportPostItem[]> => {
    const isDebugMode = process.env.NODE_ENV === "development";
    const endpoint = "/api/dashboard/post/export";

    const res = isDebugMode
      ? await fetch(endpoint, { method: "POST" })
      : await apiFetch(endpoint, { method: "POST" });

    if (!res.ok) {
      throw new Error("导出数据获取失败");
    }

    const json = await res.json();
    if (json?.code === 200 && Array.isArray(json.data)) {
      return json.data;
    }
    if (Array.isArray(json)) {
      return json;
    }
    throw new Error(json?.msg || "导出数据格式错误");
  };

  const exportAsJson = async (data: ExportPostItem[]) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
    downloadBlob(blob, `posts-${Date.now()}.json`);
  };

  const exportAsZip = async (data: ExportPostItem[]) => {
    const zip = new JSZip();
    data.forEach((item, index) => {
      const rawName = typeof item.name === "string" && item.name.trim() ? item.name : `post-${index + 1}`;
      const fileName = `${sanitizeFileName(rawName)}.md`;
      const fileContent = typeof item.content === "string" ? item.content : "";
      zip.file(fileName, fileContent);
    });
    const content = await zip.generateAsync({ type: "blob" });
    downloadBlob(content, `posts-${Date.now()}.zip`);
  };

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");
    try {
      const data = await fetchExportData();
      if (exportType === "json") {
        await exportAsJson(data);
        setSuccessMessage(`JSON 导出成功，共 ${data.length} 条记录`);
      } else {
        await exportAsZip(data);
        setSuccessMessage(`ZIP 导出成功，共 ${data.length} 个 Markdown 文件`);
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("导出失败");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-6">
      <h2 className="text-xl font-semibold text-white mb-3">导出文章</h2>
      <p className="text-white/60 mb-5">选择导出类型后点击导出按钮。</p>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative">
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value as ExportType)}
            className="appearance-none rounded-lg border border-white/20 bg-white/5 pl-3 pr-10 py-2 text-sm text-white outline-none focus:border-white/40"
          >
            <option value="json" className="bg-slate-900 text-white">
              JSON
            </option>
            <option value="zip" className="bg-slate-900 text-white">
              ZIP压缩包
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
        </div>

        <GlassButton onClick={handleExport} disabled={loading} className="px-5 py-2">
          <Download className="w-4 h-4" />
          {loading ? "导出中..." : "导出"}
        </GlassButton>
      </div>

      <p className="text-xs text-cyan-300/90 mb-3">
        接口：{process.env.NODE_ENV === "development" ? "http://localhost:5000/api/dashboard/post/export" : "/api/dashboard/post/export"}
      </p>

      {error && (
        <div className="rounded-lg border border-red-400/25 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm text-green-200">
          {successMessage}
        </div>
      )}
    </div>
  );
}
