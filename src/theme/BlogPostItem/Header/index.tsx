import React from "react";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import BlogPostItemHeaderTitle from "@theme/BlogPostItem/Header/Title";
import BlogPostItemHeaderInfo from "@theme/BlogPostItem/Header/Info";
import BlogPostItemHeaderAuthors from "@theme/BlogPostItem/Header/Authors";

export default function BlogPostItemHeader() {
  const { metadata, isBlogPostPage } = useBlogPost();
  const { date, tags } = metadata;
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
    <header className="relative mb-12 text-center max-w-[90rem] mx-auto px-4 py-12 md:py-24 overflow-hidden rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-black/40 backdrop-blur-xl mt-6 shadow-sm">
      <style>
        {`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }
        `}
      </style>

      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      {/* Metadata (Date) */}
      <div
        className="relative mb-6 animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-white/10 backdrop-blur-md rounded-full border border-black/5 dark:border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white animate-pulse" />
          <time
            dateTime={metadata.date}
            className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-zinc-600 dark:text-zinc-300"
          >
            {formattedDate} // TRENDING
          </time>
        </div>
      </div>

      {/* Title */}
      <div
        className="mb-8 relative z-10 px-4 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        <BlogPostItemHeaderTitle className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white drop-shadow-sm leading-none" />
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div
          className="flex flex-wrap items-center justify-center gap-2 mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          {tags.map((tag) => (
            <a
              href={tag.permalink}
              key={tag.permalink}
              className="relative px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:scale-105 no-underline"
            >
              {tag.label}
            </a>
          ))}
        </div>
      )}

      {/* Authors */}
      <div
        className="flex justify-center animate-fade-in-up"
        style={{ animationDelay: "0.4s" }}
      >
        <div className="scale-90 opacity-80 hover:opacity-100 transition-opacity">
          <BlogPostItemHeaderAuthors />
        </div>
      </div>
    </header>
  );
}
