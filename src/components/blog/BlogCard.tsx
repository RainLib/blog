import React from "react";
import Link from "@docusaurus/Link";
import { motion } from "framer-motion";
import Translate from "@docusaurus/Translate";

export interface BlogCardProps {
  item: any; // Content
  index: number;
}

export default function BlogCard({ item, index }: BlogCardProps) {
  const { permalink, title, date, formattedDate, authors, description, tags } =
    item.metadata;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col h-full overflow-hidden rounded-3xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 dark:group-hover:from-blue-500/10 dark:group-hover:to-purple-500/10 transition-colors duration-500" />

      <Link to={permalink} className="absolute inset-0 z-10" />

      <div className="p-6 md:p-8 flex flex-col flex-grow relative z-20">
        {/* Header: Date & Tag */}
        <div className="flex justify-between items-center mb-6">
          <time
            dateTime={date}
            className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide"
          >
            {formattedDate}
          </time>
          <div className="flex gap-2">
            {tags.slice(0, 1).map((tag: any) => (
              <span
                key={tag.permalink}
                className="text-xs font-bold px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
              >
                #{tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-base text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-8 flex-grow leading-relaxed">
          {description}
        </p>

        {/* Footer: Author & Read More */}
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
          <div className="flex items-center gap-2">
            {authors.length > 0 && authors[0].imageURL && (
              <img
                src={authors[0].imageURL}
                alt={authors[0].name}
                className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm object-cover"
              />
            )}
            {authors.length > 0 && (
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                {authors[0].name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <Translate id="blog.card.read">Read Post</Translate>
            <span>→</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
