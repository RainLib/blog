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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative flex flex-col md:flex-row items-start md:items-center gap-6 p-6 border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-cyan-900/10 transition-colors duration-200"
    >
      {/* Absolute Link */}
      <Link to={permalink} className="absolute inset-0 z-10" />

      {/* Access/Status Indicator */}
      <div className="hidden md:flex flex-col items-center justify-center w-8 h-full">
        <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700 group-hover:bg-primary dark:group-hover:bg-cyan-400 shadow-[0_0_0_0_rgba(0,0,0,0)] group-hover:shadow-[0_0_10px_2px_rgba(56,189,248,0.5)] transition-all duration-300" />
        <div className="w-px h-full bg-neutral-200 dark:bg-neutral-800 mt-2 group-hover:bg-primary/20 dark:group-hover:bg-cyan-400/20 transition-colors" />
      </div>

      {/* Date & Meta (Left Column) */}
      <div className="md:w-32 flex-shrink-0 flex flex-col gap-1">
        <time
          dateTime={date}
          className="text-xs font-mono font-bold text-neutral-500 dark:text-cyan-200/60 uppercase tracking-wider group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors"
        >
          {formattedDate}
        </time>
        {authors.length > 0 && (
          <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 truncate">
            {authors.map((a: any) => a.name).join(", ")}
          </span>
        )}
      </div>

      {/* Main Content (Middle) */}
      <div className="flex-grow min-w-0 pr-4">
        <h3 className="text-xl md:text-2xl font-bold mb-2 text-neutral-900 dark:text-white group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-light">
          {description}
        </p>
      </div>

      {/* Tags & Action (Right) */}
      <div className="flex flex-col items-end gap-3 flex-shrink-0 md:w-32">
        {/* Show top tag */}
        <div className="flex gap-2">
          {tags.slice(0, 1).map((tag: any) => (
            <span
              key={tag.permalink}
              className="px-2 py-0.5 text-[10px] font-mono border border-neutral-200 dark:border-neutral-800 rounded text-neutral-500 dark:text-neutral-500 uppercase"
            >
              {tag.label}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-400 group-hover:text-primary dark:group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
          <span>OPEN_FILE</span>
          <span>{">>"}</span>
        </div>
      </div>

      {/* Decorative Corner (Bottom Right) */}
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/0 group-hover:border-primary/50 dark:group-hover:border-cyan-400/50 transition-colors" />
    </motion.div>
  );
}
