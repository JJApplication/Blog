"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { GlassButton } from "@/components/GlassButton";

export default function ImportArticleTab() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const acceptFile = (nextFile: File | null) => {
    if (!nextFile) return;
    if (!nextFile.name.toLowerCase().endsWith(".md")) {
      setError("仅支持上传 .md 文件");
      setFile(null);
      return;
    }
    setError(null);
    setFile(nextFile);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-6">
      <h2 className="text-xl font-semibold text-white mb-3">导入文章</h2>
      <p className="text-white/60 mb-5">拖拽 `.md` 文件到下方区域，或点击按钮选择文件。</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          acceptFile(e.dataTransfer.files?.[0] || null);
        }}
        className={`rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
          dragActive ? "border-blue-300/70 bg-blue-500/10" : "border-white/20 bg-white/5"
        }`}
      >
        <UploadCloud className="w-10 h-10 text-white/60 mx-auto mb-3" />
        <p className="text-white/80 mb-2">拖拽 `.md` 文件到这里</p>
        <p className="text-xs text-white/50 mb-5">仅支持 Markdown 文件</p>

        <input
          ref={inputRef}
          type="file"
          accept=".md,text/markdown"
          className="hidden"
          onChange={(e) => acceptFile(e.target.files?.[0] || null)}
        />

        <GlassButton onClick={() => inputRef.current?.click()} className="px-5 py-2">
          选择文件
        </GlassButton>
      </div>

      <div className="mt-4">
        {file ? (
          <div className="rounded-lg border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm text-green-200">
            已选择：{file.name}
          </div>
        ) : (
          <div className="text-sm text-white/50">尚未选择文件</div>
        )}

        {error && (
          <div className="rounded-lg border border-red-400/25 bg-red-500/10 px-4 py-2 text-sm text-red-200 mt-3">
            {error}
          </div>
        )}
      </div>

      <div className="mt-6">
        <GlassButton disabled={!file} className="px-6 py-2.5">
          上传文件
        </GlassButton>
      </div>
    </div>
  );
}
