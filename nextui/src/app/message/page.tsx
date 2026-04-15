"use client";

import { useEffect, useState } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { motion } from "framer-motion";
import { MessageSquare, Send, Clock, User } from "lucide-react";

export default function MessagePage() {
  const { messages, fetchMessages, postMessage, isLoading, error } = useBlogStore();
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSubmitting(true);
    const success = await postMessage(newMessage);
    if (success) {
      setNewMessage("");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-24 overflow-x-hidden">
      <div className="w-full max-w-4xl mx-auto px-6 py-12 flex-grow flex flex-col">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 text-glow">
            Message Board
          </h1>
          <p className="text-white/60">
            Leave a message, share your thoughts, or just say hi.
          </p>
        </div>

        {/* Message Input Form */}
        <GlassCard className="mb-12 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all backdrop-blur-sm resize-y"
                required
              />
            </div>
            <div className="flex justify-end">
              <GlassButton 
                type="submit" 
                disabled={isSubmitting || !newMessage.trim()}
                className="px-8"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Message
                    <Send className="w-4 h-4" />
                  </span>
                )}
              </GlassButton>
            </div>
          </form>
        </GlassCard>

        {/* Messages List */}
        <div className="space-y-6 flex-grow">
          {isLoading && messages.length === 0 ? (
            [...Array(3)].map((_, i) => (
              <GlassCard key={i} className="animate-pulse h-32 flex flex-col justify-center">
                <div className="h-4 bg-white/10 rounded w-1/4 mb-4" />
                <div className="h-4 bg-white/10 rounded w-full" />
              </GlassCard>
            ))
          ) : error ? (
            <div className="text-center text-red-400 py-12">
              Failed to load messages: {error}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-white/50 py-12 flex flex-col items-center">
              <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
              <p>No messages yet. Be the first to say hi!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={msg.primary_id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <GlassCard className="!p-6 hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                        <User className="w-4 h-4 text-white/70" />
                      </div>
                      <span className="font-medium text-white/90">
                        {msg.user || "Anonymous"}
                      </span>
                    </div>
                    {msg.date && (
                      <div className="flex items-center gap-1 text-xs text-white/40">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{msg.date}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Ambient glowing orbs */}
      <div className="fixed top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000 pointer-events-none -z-10" />
    </div>
  );
}