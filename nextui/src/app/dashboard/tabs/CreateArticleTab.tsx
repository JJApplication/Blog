"use client";

import { PlusCircle } from "lucide-react";
import { GlassButton } from "@/components/GlassButton";

export default function CreateArticleTab() {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-6 min-h-[280px] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-3">新建文章</h2>
        <p className="text-white/60 mb-6">点击按钮进入文章创建流程。</p>
        <GlassButton className="px-6 py-2.5">
          <PlusCircle className="w-4 h-4" />
          新建文章
        </GlassButton>
      </div>
    </div>
  );
}
