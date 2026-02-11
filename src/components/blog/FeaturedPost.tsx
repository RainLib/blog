import React from "react";
import Link from "@docusaurus/Link";
import { motion } from "framer-motion";
import Translate from "@docusaurus/Translate";

// The item passed here is the 'content' field
export default function FeaturedPost({ item }: { item: any }) {
  const { permalink, title, date, formattedDate, authors, description, tags } =
    item.metadata;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-xl transition-all duration-500 hover:shadow-2xl group mb-12"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 p-8 md:p-12 items-center">
        <div className="flex-1 flex flex-col items-start text-left">
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            <span className="px-3 py-1 rounded-full bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide uppercase">
              <Translate id="blog.featured">Featured</Translate>
            </span>
            {tags.slice(0, 3).map((tag: any) => (
              <Link
                key={tag.permalink}
                to={tag.permalink}
                className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                #{tag.label}
              </Link>
            ))}
          </div>

          <Link
            to={permalink}
            className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-white leading-tight">
              {title}
            </h2>
          </Link>

          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed max-w-2xl line-clamp-3">
            {description}
          </p>

          <div className="flex items-center gap-6 mt-auto px-1">
            {authors.map((author: any) => (
              <div key={author.name} className="flex items-center gap-3">
                {author.imageURL && (
                  <img
                    src={author.imageURL}
                    alt={author.name}
                    className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm object-cover"
                  />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {author.name}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-500">
                    {author.title}
                  </span>
                </div>
              </div>
            ))}

            <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-2" />

            <time
              dateTime={date}
              className="text-sm font-medium text-zinc-500 dark:text-zinc-500"
            >
              {formattedDate}
            </time>
          </div>
        </div>

        {/* Action Button */}
        <div className="hidden md:flex flex-col items-center justify-center">
          <Link
            to={permalink}
            className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all duration-300 shadow-sm group-hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
