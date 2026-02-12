import React from "react";
import Link from "@docusaurus/Link";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { motion } from "framer-motion";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Translate, { translate } from "@docusaurus/Translate";

export default function HomepageHeader() {
  return (
    <header className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
      {/* Static Gradient Placeholder for LCP */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 via-purple-500/20 to-pink-500/20 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-pink-900/40 z-0" />

      {/* Restored WebGL Shader Background - Load after hydration */}
      <BrowserOnly>
        {() => {
          const ShaderHero = require("../ShaderHero").default;
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="absolute inset-0 z-0"
            >
              <ShaderHero />
            </motion.div>
          );
        }}
      </BrowserOnly>

      <div className="relative z-10 container flex flex-col items-center justify-center text-center px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group"
        >
          {/* Subtle Ambient Glow behind content */}
          <div className="absolute -inset-10 bg-[var(--neon-glow)] blur-[100px] opacity-20 dark:opacity-10 rounded-full animate-pulse pointer-events-none" />

          <div className="relative p-8 md:p-16">
            {/* The Glass Background Layer - Clipped & Animated */}
            <div className="absolute inset-0 irregular-glass overflow-hidden z-0">
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            </div>

            {/* The Content Layer - Visible & Overflowing */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex flex-col md:flex-row items-center justify-center mb-8">
                <motion.img
                  src={useBaseUrl("/img/logo.svg")}
                  alt="RainLib Logo"
                  // Added opacity-0 to hide on SSG load, avoiding layout shift/flash
                  className="opacity-0 w-32 h-32 md:w-56 md:h-56 -mt-10 md:-mt-16 drop-shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] dark:invert"
                  initial={{ opacity: 0, rotate: 0, scale: 1, y: 0 }}
                  animate={{
                    opacity: 1,
                    rotate: [0, 10, -10, 10, 0], // Gentle wave
                    y: [0, -15, 0, -15, 0], // Floating up and down
                    scale: [1, 1.05, 1, 1.05, 1], // Breathing scale
                  }}
                  transition={{
                    opacity: { duration: 0.5, ease: "easeOut" },
                    default: {
                      duration: 6, // Slower, more majestic loop
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatType: "mirror",
                    },
                  }}
                  whileHover={{ scale: 1.1, rotate: 0 }} // Stop rotation on hover for focus
                />
                <motion.h1
                  className="text-7xl md:text-9xl font-bold tracking-tighter drop-shadow-2xl md:-ml-12"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    y: [0, -10, 0, -10, 0],
                    scale: [1, 1.02, 1, 1.02, 1],
                  }}
                  transition={{
                    opacity: { duration: 0.8, ease: "easeOut", delay: 0.2 },
                    default: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatType: "mirror",
                    },
                  }}
                >
                  <span className="metallic-text">RainLib</span>
                </motion.h1>
              </div>

              <div className="max-w-2xl mx-auto">
                <p className="text-xl md:text-2xl font-medium leading-relaxed text-zinc-800 dark:text-zinc-200 opacity-90 mb-4">
                  <Translate id="homepage.hero.description.start">
                    汇聚思想，探索
                  </Translate>{" "}
                  <span className="text-[var(--ifm-color-primary)] font-bold inline-flex items-center gap-1">
                    <span className="text-2xl">🔗</span>
                    <Translate id="homepage.hero.distributed_systems">
                      分布式系统
                    </Translate>
                  </span>{" "}
                  &{" "}
                  <span className="text-[#059669] dark:text-[var(--ifm-color-primary-light)] font-bold inline-flex items-center gap-1">
                    <span className="text-2xl">🤖</span>
                    <Translate id="homepage.hero.genai">生成式 AI</Translate>
                  </span>
                  .
                </p>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--ifm-color-primary)] to-transparent mx-auto opacity-20" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-4 items-center justify-center mt-12">
          <Link
            to="/blog"
            className="px-8 py-3 rounded-full hero-button-primary transition-all font-semibold"
          >
            <Translate
              id="homepage.hero.explore"
              description="Button to explore blog"
            >
              探索花园
            </Translate>
          </Link>
          <Link
            to="https://github.com/RainLib"
            className="px-8 py-3 rounded-full glass-panel hover:bg-white/10 transition-all font-semibold"
          >
            GitHub
          </Link>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-500"
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
        >
          <span className="text-[10px] tracking-[0.2em] font-light uppercase text-zinc-500 dark:text-zinc-400">
            Scroll
          </span>
          {/* Elegant Chevron */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-zinc-500 dark:text-zinc-400"
          >
            <path
              d="M7 10L12 15L17 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </header>
  );
}
