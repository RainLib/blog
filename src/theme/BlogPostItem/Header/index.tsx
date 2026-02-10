import React from "react";
import { useBlogPost } from "@docusaurus/theme-common/internal";
import BlogPostItemHeaderTitle from "@theme/BlogPostItem/Header/Title";
import BlogPostItemHeaderInfo from "@theme/BlogPostItem/Header/Info";
import BlogPostItemHeaderAuthors from "@theme/BlogPostItem/Header/Authors";
import Translate from "@docusaurus/Translate";

export default function BlogPostItemHeader(): JSX.Element {
  const { metadata, isBlogPostPage } = useBlogPost();
  const { title } = metadata;

  // Only customize for the detailed Post Page, not the list items (if they used this, but list uses BlogRow now)
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
    <header className="mb-12 border-b border-dashed border-neutral-200 dark:border-white/10 pb-8 relative">
      <div className="flex items-center gap-3 mb-6">
        <span className="px-2 py-1 text-[10px] font-mono font-bold tracking-widest uppercase border border-primary text-primary dark:text-cyan-400 dark:border-cyan-400 bg-primary/5">
          <Translate id="blog.transmission">INCOMING_TRANSMISSION</Translate>
        </span>
        <div className="h-px flex-grow bg-neutral-200 dark:bg-cyan-900/50"></div>
        <span className="font-mono text-xs text-neutral-400 dark:text-cyan-500/50">
          // {metadata.formattedDate}
        </span>
      </div>

      <BlogPostItemHeaderTitle className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-neutral-900 dark:text-white uppercase leading-tight" />

      <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400 font-mono">
        <BlogPostItemHeaderAuthors />
        {/* Add more meta if needed */}
      </div>
    </header>
  );
}
