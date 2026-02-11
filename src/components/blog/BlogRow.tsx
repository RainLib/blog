import React from "react";
import Link from "@docusaurus/Link";
import { motion } from "framer-motion";
import Translate from "@docusaurus/Translate";

export interface BlogRowProps {
  item: any; // Content
  index: number;
}

export default function BlogRow({ item, index }: BlogRowProps) {
  // Guard against undefined item or metadata
  if (!item || !item.metadata) return null;

  const { permalink, title, date, formattedDate, authors, description, tags } =
    item.metadata;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative flex flex-col md:flex-row items-baseline gap-6 p-8 border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors duration-300 last:border-0"
    >
      {/* Absolute Link */}
      <Link to={permalink} className="absolute inset-0 z-10" />

      {/* Main Content */}
      <div className="flex-grow min-w-0">
        {/* Meta: Date & Tags */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <time
            dateTime={date}
            className="text-sm font-medium text-zinc-400 dark:text-zinc-500 font-mono"
          >
            {formattedDate}
          </time>
          <span className="text-zinc-300 dark:text-zinc-700">·</span>
          {tags.slice(0, 3).map((tag: any) => (
            <span
              key={tag.permalink}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full"
            >
              #{tag.label}
            </span>
          ))}
        </div>

        <h3 className="text-xl md:text-2xl font-bold mb-3 text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight leading-snug">
          {title}
        </h3>
        <p className="text-base text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
          {description}
        </p>

        {/* Author Info - Subtle */}
        {authors.length > 0 && (
          <div className="flex items-center gap-2">
            {authors[0].imageURL && (
              <img
                src={authors[0].imageURL}
                alt={authors[0].name}
                className="w-6 h-6 rounded-full grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all border border-zinc-200 dark:border-zinc-700"
              />
            )}
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {authors[0].name}
            </span>
          </div>
        )}
      </div>

      {/* Arrow Action (Right) */}
      <div className="flex-shrink-0 self-center md:self-start md:pt-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <span className="text-blue-600 dark:text-blue-400 text-xl">→</span>
      </div>
    </motion.div>
  );
}
