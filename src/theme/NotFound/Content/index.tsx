import React from "react";
import { motion } from "framer-motion";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import Layout from "@theme/Layout";

const PARTICLES = [
  { left: "10%", top: "20%", duration: 12, delay: 0 },
  { left: "80%", top: "40%", duration: 15, delay: 2 },
  { left: "30%", top: "70%", duration: 18, delay: 5 },
  { left: "60%", top: "10%", duration: 10, delay: 1 },
  { left: "90%", top: "80%", duration: 20, delay: 3 },
  { left: "15%", top: "85%", duration: 14, delay: 4 },
  { left: "75%", top: "25%", duration: 16, delay: 6 },
  { left: "45%", top: "55%", duration: 13, delay: 0 },
  { left: "5%", top: "50%", duration: 17, delay: 2 },
  { left: "95%", top: "30%", duration: 11, delay: 5 },
  { left: "25%", top: "15%", duration: 19, delay: 1 },
  { left: "55%", top: "90%", duration: 15, delay: 3 },
  { left: "35%", top: "35%", duration: 12, delay: 4 },
  { left: "65%", top: "65%", duration: 14, delay: 6 },
  { left: "20%", top: "60%", duration: 16, delay: 0 },
  { left: "40%", top: "80%", duration: 18, delay: 2 },
  { left: "50%", top: "20%", duration: 13, delay: 5 },
  { left: "70%", top: "45%", duration: 11, delay: 1 },
  { left: "85%", top: "75%", duration: 17, delay: 3 },
  { left: "60%", top: "5%", duration: 19, delay: 4 },
];

export default function NotFoundContent(): React.ReactNode {
  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden px-4">
      {/* Dynamic Background Particles */}
      <div className="absolute inset-0 z-0">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[var(--ifm-color-primary)] opacity-20"
            style={{
              width: "4px",
              height: "4px",
              left: p.left,
              top: p.top,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-12 md:p-16 rounded-[2rem] max-w-2xl w-full text-center relative z-10"
      >
        <motion.div
          animate={{
            rotate: [0, -2, 2, 0],
            y: [0, -5, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-8"
        >
          <span className="text-8xl md:text-9xl font-bold metallic-text tracking-tighter">
            404
          </span>
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          <Translate id="theme.NotFound.title">Lost in the Garden?</Translate>
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-12 leading-relaxed">
          <Translate id="theme.NotFound.p1">
            It seems you've wandered into an uncharted corner of the garden. The
            path you followed might have vanished or never existed.
          </Translate>
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="hero-button-primary px-8 py-4 rounded-xl font-bold no-underline flex items-center justify-center gap-2 group transition-all"
          >
            <motion.span
              animate={{ x: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ←
            </motion.span>
            <Translate id="theme.NotFound.backHome">
              Teleport Back Home
            </Translate>
          </Link>

          <Link
            to="/blog"
            className="px-8 py-4 rounded-xl font-bold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all no-underline"
          >
            <Translate id="theme.NotFound.exploreBlog">
              Explore Latest Insights
            </Translate>
          </Link>
        </div>

        {/* Decorative Grid */}
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[var(--ifm-color-primary)] opacity-5 blur-[100px] rounded-full" />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-pink-500 opacity-5 blur-[100px] rounded-full" />
      </motion.div>
    </div>
  );
}
