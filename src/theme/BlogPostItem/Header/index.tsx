import React, { useEffect } from "react";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import BlogPostItemHeaderTitle from "@theme/BlogPostItem/Header/Title";
import BlogPostItemHeaderInfo from "@theme/BlogPostItem/Header/Info";
import BlogPostItemHeaderAuthors from "@theme/BlogPostItem/Header/Authors";
import { motion } from "framer-motion";

export default function BlogPostItemHeader() {
  const { metadata, isBlogPostPage } = useBlogPost();
  const { date, tags, readingTime } = metadata;
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Inject Busuanzi script for view counting
  useEffect(() => {
    if (typeof window === "undefined") return;
    const script = document.createElement("script");
    script.src = "//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Only customize for the detailed Post Page
  if (!isBlogPostPage) {
    return (
      <header>
        <BlogPostItemHeaderTitle />
        <BlogPostItemHeaderInfo />
        <BlogPostItemHeaderAuthors />
      </header>
    );
  }

  return (
    <header className="relative mb-8 text-center max-w-[90rem] mx-auto px-6 py-12 md:py-24 overflow-visible bg-transparent mt-4 group">
      {/* Dynamic Background Blobs - Ambient Light Effect (No Clipping) */}
      <motion.div
        animate={{
          x: [0, 100, -60, 0],
          y: [0, -60, 100, 0],
          scale: [1, 1.2, 0.9, 1],
          rotate: [0, 45, 90, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="pointer-events-none absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-purple-400/10 dark:bg-purple-900/5 rounded-full filter blur-[150px] opacity-60"
      />
      <motion.div
        animate={{
          x: [0, -100, 60, 0],
          y: [0, 60, -100, 0],
          scale: [1, 1.25, 0.85, 1],
          rotate: [0, -45, -90, 0],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "linear",
          delay: 5,
        }}
        className="pointer-events-none absolute top-[-10%] right-[-20%] w-[800px] h-[800px] bg-amber-400/10 dark:bg-amber-900/5 rounded-full filter blur-[150px] opacity-60"
      />

      {/* Top: Tags Container (Minimal Floating Pills) */}
      {tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative mb-8 flex flex-wrap items-center justify-center gap-3"
        >
          {tags.map((tag) => (
            <motion.a
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.98 }}
              href={tag.permalink}
              key={tag.permalink}
              className="px-4 py-1.5 bg-zinc-100/50 dark:bg-zinc-800/30 backdrop-blur-sm rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 no-underline transition-all hover:text-black dark:hover:text-white border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            >
              {tag.label}
            </motion.a>
          ))}
        </motion.div>
      )}

      {/* Middle: Title (Seamless Integration with large tracking) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.8,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.4,
        }}
        className="mb-12 relative z-10 px-8"
      >
        <BlogPostItemHeaderTitle className="text-5xl sm:text-7xl md:text-[8rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-500 drop-shadow-sm leading-none" />
      </motion.div>

      {/* Bottom: Floating Metadata (Clean & Minimal) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Combined Info Pill */}
        <div className="flex items-center gap-6 px-8 py-4 bg-zinc-50/30 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-zinc-200/20 dark:border-white/5 shadow-sm">
          <div className="relative">
            <BlogPostItemHeaderAuthors className="!m-0 !p-0" />
          </div>

          <div className="w-[1px] h-8 bg-zinc-300/30 dark:bg-white/10" />

          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400" />
              <time
                dateTime={metadata.date}
                className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-zinc-600 dark:text-zinc-400 font-bold"
              >
                {formattedDate}
              </time>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {readingTime
                  ? `${Math.ceil(readingTime)} MIN READ`
                  : "8 MIN READ"}
              </span>
              <span className="text-zinc-300 dark:text-zinc-700 opacity-30">
                /
              </span>
              <span
                id="busuanzi_container_page_pv"
                className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500"
              >
                <span id="busuanzi_value_page_pv" className="mr-1">
                  ...
                </span>{" "}
                VIEWS
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
