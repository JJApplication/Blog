"use client";

import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { Code2, Server, Database, Sparkles, Brain } from "lucide-react";

export default function AboutPage() {
  const techStack = [
    { name: "Next.js", icon: <Code2 className="w-5 h-5 text-white/70" /> },
    { name: "React", icon: <Code2 className="w-5 h-5 text-blue-400" /> },
    { name: "Tailwind CSS", icon: <Code2 className="w-5 h-5 text-cyan-400" /> },
    { name: "Zustand", icon: <Database className="w-5 h-5 text-yellow-400" /> },
    { name: "Framer Motion", icon: <Sparkles className="w-5 h-5 text-pink-400" /> },
    { name: "Go (Gin)", icon: <Server className="w-5 h-5 text-teal-400" /> },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-24 overflow-x-hidden">
      <div className="w-full max-w-4xl mx-auto px-6 py-12 flex-grow flex flex-col">
        
        {/* Title Section */}
        <div className="mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 text-glow"
          >
            About BlogNEXT
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" 
          />
        </div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <GlassCard className="p-8 md:p-12">
            <div className="space-y-6 text-lg text-white/80 leading-relaxed font-light">
              <p>
                博客项目开始于 2020 年，迭代更新了很多版本，一开始只是简单地做一个博客网站。
              </p>
              <p>
                渐渐地我开始意识到博客应该有什么东西，应该向他人表达什么，希望这些东西在 BlogNEXT 上能够以最直观的方式呈现出来。
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tech Stack & AI Model Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-auto"
        >
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Powered By
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {techStack.map((tech, index) => (
              <GlassCard key={index} className="!p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex flex-col items-center justify-center gap-3">
                  {tech.icon}
                  <span className="text-white/90 font-medium text-center">{tech.name}</span>
                </div>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="!p-6 bg-white/5 border-purple-500/20">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 shrink-0 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Brain className="w-7 h-7 text-purple-400" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-white font-semibold mb-1 text-lg">AI Programming Model</h3>
                <p className="text-white/60 text-sm">Developed with the assistance of Trae IDE & Gemini-3.1-Pro-Preview</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

      </div>

      {/* Ambient glowing orbs */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000 pointer-events-none -z-10" />
    </div>
  );
}