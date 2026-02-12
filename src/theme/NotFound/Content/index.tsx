import React from "react";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { motion } from "framer-motion";

export default function NotFoundContent(): React.ReactNode {
  return (
    <div className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-black text-black dark:text-white">
      {/* --- BACKGROUND: Liquid Metal Shader --- */}
      <BrowserOnly>
        {() => {
          const LiquidMetalShader =
            require("@site/src/components/LiquidMetalShader").default;
          return <LiquidMetalShader />;
        }}
      </BrowserOnly>

      {/* --- CONTENT OVERLAY (Mix Blend Mode) --- */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="relative z-10 w-full max-w-[90vw] md:max-w-6xl px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center mix-blend-difference"
      >
        {/* Left Col: Massive 404 */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <h1 className="text-[25vw] md:text-[14rem] font-bold leading-[0.8] tracking-tighter text-white select-none">
            404
          </h1>
          <div className="h-px w-full bg-white my-8" />
          <div className="flex justify-between font-mono text-sm md:text-base tracking-widest uppercase text-white/80">
            <span>Error Code: Void_Null</span>
            <span>System: Offline</span>
          </div>
        </div>

        {/* Right Col: Editorial Text */}
        <div className="md:col-span-5 flex flex-col justify-center space-y-10">
          <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white">
            <Translate id="theme.NotFound.title">Reality Dissolved.</Translate>
          </h2>

          <p className="text-lg md:text-xl leading-relaxed text-white/90 font-light max-w-md">
            <Translate id="theme.NotFound.p1">
              You have reached the edge of the known universe. The page you seek
              has returned to the liquid flux.
            </Translate>
          </p>

          <div className="flex flex-col gap-4 items-start">
            <Link
              to="/"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-black bg-white uppercase tracking-widest hover:bg-zinc-200 transition-colors duration-300 no-underline"
            >
              <span className="relative z-10">Return to Origin</span>
            </Link>

            <Link
              to="/blog"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white border border-white uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 no-underline"
            >
              <span className="relative z-10">Read Transmission</span>
            </Link>
          </div>
        </div>
      </motion.main>

      {/* Decorative Corners */}
      <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-white mix-blend-difference z-20" />
      <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-white mix-blend-difference z-20" />
    </div>
  );
}
