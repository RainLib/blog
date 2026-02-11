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
    <header className="mb-10 text-center max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <time
          dateTime={metadata.date}
          className="text-sm font-medium text-zinc-500 dark:text-zinc-400"
        >
          {formattedDate}
        </time>
        {tags.length > 0 && (
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
        )}
        {tags.map((tag) => (
          <span
            key={tag.permalink}
            className="text-sm font-medium text-blue-600 dark:text-blue-400"
          >
            #{tag.label}
          </span>
        ))}
      </div>

      <BlogPostItemHeaderTitle className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 text-zinc-900 dark:text-white leading-tight" />

      <div className="flex justify-center">
        <BlogPostItemHeaderAuthors />
      </div>

      <div className="h-px w-full max-w-xs mx-auto bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent my-10" />
    </header>
  );
}
