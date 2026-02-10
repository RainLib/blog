import React from "react";
import Link from "@docusaurus/Link";
import { motion } from "framer-motion";
import Translate from "@docusaurus/Translate";
import type { PropItem } from "@docusaurus/plugin-content-blog";

// The item passed here is actually the 'content' field of PropItem
export default function FeaturedPost({ item }: { item: any }) {
  const { permalink, title, date, formattedDate, authors, description, tags } =
    item.metadata;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-black shadow-lg hover:shadow-2xl transition-all duration-500 group mb-12"
    >
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 p-8 md:p-12 items-center">
        <div className="flex-1 flex flex-col items-start text-left">
          <div className="flex gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-primary/25">
              <Translate id="blog.featured">Featured</Translate>
            </span>
            {tags.map((tag) => (
              <span
                key={tag.permalink}
                className="px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-semibold"
              >
                {tag.label}
              </span>
            ))}
          </div>

          <Link to={permalink}>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 group-hover:to-primary transition-all duration-300">
              {title}
            </h2>
          </Link>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed max-w-2xl">
            {description}
          </p>

          <div className="flex items-center gap-6 mt-auto">
            {authors.map((author) => (
              <div key={author.name} className="flex items-center gap-3">
                {author.imageURL && (
                  <img
                    src={author.imageURL}
                    alt={author.name}
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-neutral-800 shadow-sm"
                  />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">
                    {author.name}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {author.title}
                  </span>
                </div>
              </div>
            ))}

            <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-700 mx-2" />

            <time
              dateTime={date}
              className="text-sm font-medium text-neutral-500"
            >
              {formattedDate}
            </time>
          </div>
        </div>

        {/* Decorative Element / Image Placeholder */}
        {/* If frontMatter has image, use it. For now, use a decorative abstract shape */}
        <div className="hidden md:block w-1/3 h-64 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Link
              to={permalink}
              className="px-8 py-3 rounded-full bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold shadow-xl hover:scale-105 transition-transform"
            >
              <Translate id="blog.readArticle">Read Article</Translate>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
