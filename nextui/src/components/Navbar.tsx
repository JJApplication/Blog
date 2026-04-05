"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Hexagon, ChevronDown, User } from "lucide-react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const background = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.5)"]
  );

  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(12px)"]
  );

  const borderBottom = useTransform(
    scrollY,
    [0, 100],
    ["1px solid rgba(255, 255, 255, 0)", "1px solid rgba(255, 255, 255, 0.1)"]
  );

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      // Could be used later for conditional rendering based on scroll
      if (latest > 50) {
        // Scrolled
      }
    });
  }, [scrollY]);

  return (
    <motion.nav
      style={{
        background,
        backdropFilter: backdropBlur,
        borderBottom,
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Hexagon className="w-8 h-8 text-white group-hover:text-glow transition-all" />
          <span className="font-bold text-xl tracking-wider group-hover:text-glow transition-all">BLOG.NEXT</span>
        </Link>
        <div className="flex gap-6 items-center text-sm font-medium relative">
          <Link href="/" className="text-white/70 hover:text-white transition-colors">Home</Link>
          
          <div 
            className="relative"
            onMouseEnter={() => setIsExploreOpen(true)}
            onMouseLeave={() => setIsExploreOpen(false)}
          >
            <button className="flex items-center gap-1 text-white/70 hover:text-white transition-colors py-2">
              Explore
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExploreOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isExploreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-40 glass-effect rounded-xl overflow-hidden shadow-xl"
                >
                  <div className="flex flex-col py-2">
                    <Link href="/archive" className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                      Archives
                    </Link>
                    <Link href="/tags" className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                      Tags
                    </Link>
                    <Link href="/zhuanlan" className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                      Zhuanlan
                    </Link>
                    <Link href="/message" className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                      Message
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/about" className="text-white/70 hover:text-white transition-colors">About</Link>
          
          <Link href="/signin" className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-white/90 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]">
            <User className="w-4 h-4" />
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
