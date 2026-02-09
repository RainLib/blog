import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { motion } from "framer-motion";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* 3D Liquid Glass Background */}
      <BrowserOnly>
        {() => {
          const LiquidGlass = require("../components/LiquidGlass").default;
          return <LiquidGlass />;
        }}
      </BrowserOnly>

      {/* Overlay Content */}
      <div className="relative z-10 container pointer-events-none flex flex-col items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="text-center pointer-events-auto mix-blend-difference" // Interaction enabled for buttons
        >
          <h1 className="text-[8rem] md:text-[12rem] font-bold tracking-tighter text-white leading-none mb-4 select-none">
            RainLib
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-xl md:text-2xl font-light tracking-[0.2em] text-cyan-300 uppercase">
              Digital Garden // Creative Coding
            </p>

            <div className="flex gap-6 mt-8">
              <Link
                className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-full border border-white/20 hover:border-cyan-400 transition-all duration-300 pointer-events-auto"
                to="/blog"
              >
                <div className="absolute inset-0 w-full h-full bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-all duration-300 blur-xl opacity-0 group-hover:opacity-100" />
                <span className="relative text-white font-mono tracking-widest text-sm group-hover:text-cyan-300 transition-colors">
                  ENTER_BLOG
                </span>
              </Link>

              <Link
                className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-full border border-white/20 hover:border-pink-500 transition-all duration-300 pointer-events-auto"
                to="https://github.com/RainLib"
              >
                <div className="absolute inset-0 w-full h-full bg-pink-500/10 group-hover:bg-pink-500/20 transition-all duration-300 blur-xl opacity-0 group-hover:opacity-100" />
                <span className="relative text-white font-mono tracking-widest text-sm group-hover:text-pink-300 transition-colors">
                  GITHUB_PROFILE
                </span>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-0 right-0 text-center pointer-events-none"
        >
          <span className="text-xs font-mono tracking-[0.5em] text-white/50">
            EST. 2024 · SCROLL TO EXPLORE
          </span>
        </motion.div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="RainLib - Digital Garden of a Full Stack Developer"
    >
      <HomepageHeader />
    </Layout>
  );
}
