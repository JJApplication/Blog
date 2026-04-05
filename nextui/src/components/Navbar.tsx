"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import { Hexagon } from "lucide-react";

export function Navbar() {
  const { scrollY } = useScroll();

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
        <div className="flex gap-6 items-center text-sm font-medium">
          <Link href="/" className="text-white/70 hover:text-white transition-colors">Home</Link>
          <Link href="/archive" className="text-white/70 hover:text-white transition-colors">Archive</Link>
          <Link href="/about" className="text-white/70 hover:text-white transition-colors">About</Link>
        </div>
      </div>
    </motion.nav>
  );
}
