"use client";

import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { motion } from "framer-motion";
import { User, Lock, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useBlogStore } from "@/store/useBlogStore";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const router = useRouter();
  const checkAuth = useBlogStore((state) => state.checkAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setWarningMessage("");
    
    try {
      const res = await apiFetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ name: username, passwd: password }),
      });

      const data = await res.json();
      
      if (data.code === 200) {
        // Read token from response header or data
        const token = data.data.token;
        if (token) {
          localStorage.setItem("admin_token", token);
        }
        const isAuthenticated = await checkAuth();
        if (isAuthenticated) {
          router.push("/dashboard");
        } else {
          setWarningMessage("Token authentication failed");
        }
      } else {
        setWarningMessage(data.msg || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setWarningMessage("Network error or server unavailable");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center overflow-hidden relative">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md px-6 z-10"
      >
        <GlassCard className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 text-glow">
              Welcome Back
            </h1>
            <p className="text-white/60 text-sm">
              Please sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-white/40 group-focus-within:text-white/80 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all backdrop-blur-sm"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-white/40 group-focus-within:text-white/80 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all backdrop-blur-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-4">
              {warningMessage && (
                <div className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-200">
                  {warningMessage}
                </div>
              )}
              <GlassButton 
                type="submit" 
                className="w-full py-3 flex items-center justify-center text-base"
                disabled={isLoading || !username || !password}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <LogIn className="w-4 h-4" />
                  </span>
                )}
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      </motion.div>

      {/* Ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000 pointer-events-none" />
    </div>
  );
}
