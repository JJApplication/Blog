"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { GlassButton } from "./GlassButton";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const { scrollY } = useScroll();
  const router = useRouter();
  
  // Parallax and fade out effects for the background image
  const backgroundY = useTransform(scrollY, [0, 500], ["0%", "50%"]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Fixed Background Layer for smooth scrolling parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{
          y: backgroundY,
          opacity: opacity,
          scale: scale,
        }}
      >
        <Image
          src="/assets/bg.jpeg"
          alt="Enjoy your life background"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Gradient overlay to make text pop */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" />
      </motion.div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 pb-4 text-glow"
        >
          Enjoy your life
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="mt-6 text-xl md:text-2xl text-white/70 max-w-2xl font-light"
        >
          Explore thoughts, stories, and ideas about technology and lifestyle.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="mt-12"
        >
          <GlassButton onClick={() => {
            router.push('/posts');
          }}>
            Explore Articles
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </GlassButton>
        </motion.div>
      </div>

      {/* Ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000 pointer-events-none" />
    </div>
  );
}
