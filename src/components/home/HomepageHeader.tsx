import React from "react";
import Link from "@docusaurus/Link";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { motion } from "framer-motion";
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

      <div className="relative z-10 container flex flex-col items-center justify-center text-center px-4">
        {/* Removed glassmorphism box, using high-contrast text instead */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-white dark:to-neutral-400 drop-shadow-xl">
            RainLib
          </h1>
          <p className="text-xl md:text-2xl font-light leading-relaxed mb-10 text-neutral-700 dark:text-neutral-300 drop-shadow-md">
            <Translate
              id="homepage.hero.description.start"
              description="Start of hero description"
            >
              汇聚思想，探索
            </Translate>{" "}
            <span className="font-mono text-[var(--ifm-color-primary)] font-bold">
              <Translate
                id="homepage.hero.distributed_systems"
                description="Distributed Systems term"
              >
                分布式系统
              </Translate>
            </span>{" "}
            &{" "}
            <span className="font-mono text-[var(--ifm-color-primary-light)]">
              <Translate id="homepage.hero.genai" description="GenAI term">
                生成式 AI
              </Translate>
            </span>
            .
          </p>
        </motion.div>

        <div className="flex gap-4 items-center justify-center">
          <Link
            to="/blog"
            className="px-8 py-3 rounded-full bg-[var(--ifm-color-primary)] text-white hover:bg-[var(--ifm-color-primary-dark)] transition-all font-semibold"
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
