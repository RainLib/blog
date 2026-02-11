import React from "react";
import Link from "@docusaurus/Link";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { motion } from "framer-motion";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Translate, { translate } from "@docusaurus/Translate";

export default function HomepageHeader() {
  return (
    <header className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
      {/* Restored WebGL Shader Background */}
      <BrowserOnly>
        {() => {
          const ShaderHero = require("../ShaderHero").default;
          return <ShaderHero />;
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

          <div className="relative irregular-glass p-8 md:p-16 border-white/10 dark:border-white/5 shadow-2xl overflow-hidden">
            {/* Added a very subtle mesh-like overlay inside the box for "designed" feel */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

            <div className="relative flex flex-col items-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 mb-8">
                <motion.img
                  src={useBaseUrl("/img/logo.svg")}
                  alt="RainLib Logo"
                  className="w-24 h-24 md:w-36 md:h-36 drop-shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] dark:invert transition-all duration-500 hover:scale-105 animate-float"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
                <h1 className="text-7xl md:text-9xl font-bold tracking-tighter metallic-text drop-shadow-2xl">
                  RainLib
                </h1>
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
    </header>
  );
}
