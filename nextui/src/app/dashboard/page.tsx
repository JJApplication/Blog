"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart3, FileText, Import, LogOut, MessageSquare, PlusCircle, Share2, ThumbsUp } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { useBlogStore } from "@/store/useBlogStore";
import ArticleListTab from "./tabs/ArticleListTab";
import CreateArticleTab from "./tabs/CreateArticleTab";
import ImportArticleTab from "./tabs/ImportArticleTab";
import ExportArticleTab from "./tabs/ExportArticleTab";
import ViewStatsTab from "./tabs/ViewStatsTab";
import LikeStatsTab from "./tabs/LikeStatsTab";
import ShareStatsTab from "./tabs/ShareStatsTab";
import CommentManageTab from "./tabs/CommentManageTab";
import SystemMessageTab from "./tabs/SystemMessageTab";

type MainTab = "article" | "stats" | "message" | "logout";
type ArticleSubTab = "list" | "create" | "import" | "export";
type StatsSubTab = "views" | "likes" | "shares";
type MessageSubTab = "comment" | "system";

export default function DashboardPage() {
  const router = useRouter();
  const [mainTab, setMainTab] = useState<MainTab>("article");
  const [articleSubTab, setArticleSubTab] = useState<ArticleSubTab>("list");
  const [statsSubTab, setStatsSubTab] = useState<StatsSubTab>("views");
  const [messageSubTab, setMessageSubTab] = useState<MessageSubTab>("comment");

  const topMenus = useMemo(
    () => [
      { key: "article" as const, label: "文章管理", icon: FileText },
      { key: "stats" as const, label: "数据统计", icon: BarChart3 },
      { key: "message" as const, label: "留言管理", icon: MessageSquare },
      { key: "logout" as const, label: "登出", icon: LogOut },
    ],
    []
  );

  const articleMenus = useMemo(
    () => [
      { key: "list" as const, label: "文章列表", api: "/api/dashboard/articles" },
      { key: "create" as const, label: "新建文章", api: "/api/dashboard/article/create" },
      { key: "import" as const, label: "导入文章", api: "/api/dashboard/article/import" },
      { key: "export" as const, label: "导出文章", api: "/api/dashboard/article/export" },
    ],
    []
  );

  const statsMenus = useMemo(
    () => [
      { key: "views" as const, label: "文章访问统计", api: "/api/dashboard/stats/views", icon: BarChart3 },
      { key: "likes" as const, label: "点赞统计", api: "/api/dashboard/stats/likes", icon: ThumbsUp },
      { key: "shares" as const, label: "分享统计", api: "/api/dashboard/stats/shares", icon: Share2 },
    ],
    []
  );

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    useBlogStore.setState({ isAuthenticated: false });
    router.push("/signin");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-24 overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto px-6 py-4 flex-grow flex flex-col gap-8">

        <div className="flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-md">
          {topMenus.map((menu) => {
            const Icon = menu.icon;
            const active = mainTab === menu.key;
            return (
              <button
                key={menu.key}
                onClick={() => setMainTab(menu.key)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-all ${
                  active
                    ? "bg-white/20 text-white shadow-[0_0_12px_rgba(255,255,255,0.12)]"
                    : "text-white/65 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{menu.label}</span>
              </button>
            );
          })}
        </div>

        {mainTab === "article" && (
          <GlassCard className="!p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {articleMenus.map((menu) => (
                <button
                  key={menu.key}
                  onClick={() => setArticleSubTab(menu.key)}
                  className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                    articleSubTab === menu.key
                      ? "bg-blue-500/30 text-blue-100 border border-blue-300/30"
                      : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {menu.label}
                </button>
              ))}
            </div>

            {articleSubTab === "list" ? (
              <motion.div
                key={articleSubTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArticleListTab active={mainTab === "article" && articleSubTab === "list"} />
              </motion.div>
            ) : articleSubTab === "create" ? (
              <motion.div
                key={articleSubTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CreateArticleTab />
              </motion.div>
            ) : articleSubTab === "import" ? (
              <motion.div
                key={articleSubTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ImportArticleTab />
              </motion.div>
            ) : articleSubTab === "export" ? (
              <motion.div
                key={articleSubTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ExportArticleTab />
              </motion.div>
            ) : (
              <motion.div
                key={articleSubTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-white/10 bg-black/20 p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-3">
                  {articleMenus.find((item) => item.key === articleSubTab)?.label}
                </h2>
                <p className="text-white/60 mb-3">这里是功能视图占位区，后续接入业务组件与数据。</p>
                <p className="text-sm text-cyan-300/90">
                  接口占位：{articleMenus.find((item) => item.key === articleSubTab)?.api}
                </p>
              </motion.div>
            )}
          </GlassCard>
        )}

        {mainTab === "stats" && (
          <GlassCard className="!p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {statsMenus.map((menu) => (
                <button
                  key={menu.key}
                  onClick={() => setStatsSubTab(menu.key)}
                  className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                    statsSubTab === menu.key
                      ? "bg-purple-500/30 text-purple-100 border border-purple-300/30"
                      : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {menu.label}
                </button>
              ))}
            </div>

            {statsSubTab === "views" ? (
              <motion.div
                key={statsSubTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ViewStatsTab active={mainTab === "stats" && statsSubTab === "views"} />
              </motion.div>
            ) : statsSubTab === "likes" ? (
              <motion.div
                key={statsSubTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <LikeStatsTab active={mainTab === "stats" && statsSubTab === "likes"} />
              </motion.div>
            ) : (
              <motion.div
                key={statsSubTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ShareStatsTab active={mainTab === "stats" && statsSubTab === "shares"} />
              </motion.div>
            )}
          </GlassCard>
        )}

        {mainTab === "message" && (
          <GlassCard className="!p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setMessageSubTab("comment")}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  messageSubTab === "comment"
                    ? "bg-cyan-500/30 text-cyan-100 border border-cyan-300/30"
                    : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                评论管理
              </button>
              <button
                onClick={() => setMessageSubTab("system")}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  messageSubTab === "system"
                    ? "bg-cyan-500/30 text-cyan-100 border border-cyan-300/30"
                    : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                系统留言
              </button>
            </div>

            {messageSubTab === "comment" ? (
              <motion.div
                key={messageSubTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CommentManageTab active={mainTab === "message" && messageSubTab === "comment"} />
              </motion.div>
            ) : (
              <motion.div
                key={messageSubTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SystemMessageTab active={mainTab === "message" && messageSubTab === "system"} />
              </motion.div>
            )}
          </GlassCard>
        )}

        {mainTab === "logout" && (
          <GlassCard className="!p-6">
            <h2 className="text-xl font-semibold text-white mb-3">安全退出</h2>
            <p className="text-white/60 mb-6">点击下方按钮将清除登录状态并返回登录页。</p>
            <GlassButton onClick={handleLogout} className="px-5">
              <LogOut className="w-4 h-4" />
              立即登出
            </GlassButton>
          </GlassCard>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard className="!p-5">
            <div className="flex items-center gap-2 text-white mb-2">
              <FileText className="w-4 h-4 text-blue-300" />
              <span className="font-medium">文章管理快捷入口</span>
            </div>
            <p className="text-sm text-white/60">默认子菜单：文章列表、新建、导入、导出。</p>
          </GlassCard>

          <GlassCard className="!p-5">
            <div className="flex items-center gap-2 text-white mb-2">
              <PlusCircle className="w-4 h-4 text-purple-300" />
              <span className="font-medium">数据统计快捷入口</span>
            </div>
            <p className="text-sm text-white/60">默认子菜单：访问、点赞、分享统计。</p>
          </GlassCard>

          <GlassCard className="!p-5">
            <div className="flex items-center gap-2 text-white mb-2">
              <Import className="w-4 h-4 text-cyan-300" />
              <span className="font-medium">留言管理快捷入口</span>
            </div>
            <p className="text-sm text-white/60">预留留言审核、回复和删除能力入口。</p>
          </GlassCard>
        </div>
      </div>

      <div className="fixed top-1/4 left-0 w-[360px] h-[360px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[360px] h-[360px] bg-purple-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 pointer-events-none -z-10" />
    </div>
  );
}
