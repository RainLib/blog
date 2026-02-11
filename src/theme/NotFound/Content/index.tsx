import React from "react";
import { motion } from "framer-motion";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import BrowserOnly from "@docusaurus/BrowserOnly";

export default function NotFoundContent(): React.ReactNode {
  // Glitch animation variants
  const glitchVariants = {
    initial: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: "easeOut" as any },
    },
  };

  const textGlitch = {
    animate: {
      x: [0, -2, 2, -1, 1, 0],
      opacity: [1, 0.8, 1, 0.9, 1],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatDelay: Math.random() * 5 + 2,
      },
    },
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center relative overflow-hidden px-4 py-20">
      {/* Background WebGL Shader */}
      <BrowserOnly fallback={<div className="absolute inset-0 bg-[#0b0c10]" />}>
        {() => {
          const VoidShader = require("@site/src/components/VoidShader").default;
          return (
            <div className="absolute inset-0 z-0">
              <VoidShader />
            </div>
          );
        }}
      </BrowserOnly>

      <motion.div
        variants={glitchVariants}
        initial="initial"
        animate="animate"
        className="glass-panel p-10 md:p-20 rounded-[3rem] max-w-3xl w-full text-center relative z-10 backdrop-blur-[32px] border-white/10 shadow-2xl"
      >
        {/* Animated 404 Text */}
        <motion.div
          variants={textGlitch}
          animate="animate"
          className="relative mb-6 inline-block"
        >
          <span className="text-9xl md:text-[12rem] font-bold metallic-text tracking-tighter opacity-90 select-none">
            404
          </span>
          {/* Subtle Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ifm-color-primary)]/20 to-transparent blur-3xl -z-10" />
        </motion.div>

        {/* Content Heading */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight text-gradient"
        >
          <Translate id="theme.NotFound.title">Lost in the Garden?</Translate>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-zinc-500 dark:text-zinc-400 text-xl mb-12 leading-relaxed max-w-xl mx-auto font-medium"
        >
          <Translate id="theme.NotFound.p1">
            It seems you've wandered into an uncharted corner of the garden. The
            path you followed might have vanished or never existed.
          </Translate>
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <Link
            to="/"
            className="hero-button-primary px-10 py-5 rounded-2xl font-bold no-underline flex items-center justify-center gap-3 group transition-all relative overflow-hidden"
          >
            {/* Pulsing Aura for Primary Button */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-white/30 rounded-2xl"
            />
            <span className="relative z-10">
              <Translate id="theme.NotFound.backHome">
                Teleport Back Home
              </Translate>
            </span>
            <motion.span
              animate={{ x: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="relative z-10 text-2xl"
            >
              ←
            </motion.span>
          </Link>

          <Link
            to="/blog"
            className="px-10 py-5 rounded-2xl font-bold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all no-underline backdrop-blur-md group"
          >
            <span className="group-hover:text-[var(--ifm-color-primary)] transition-colors">
              <Translate id="theme.NotFound.exploreBlog">
                Explore Latest Insights
              </Translate>
            </span>
          </Link>
        </motion.div>

        {/* Dynamic Scanline Overlay Effect in CSS (via className) */}
        <div className="absolute inset-0 pointer-events-none rounded-[3rem] overflow-hidden">
          <div className="w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        </div>
      </motion.div>
    </div>
  );
}
