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
      className="group relative flex flex-col h-full overflow-hidden bg-white/5 dark:bg-black/40 backdrop-blur-md border border-neutral-200 dark:border-white/10 hover:border-primary/50 dark:hover:border-cyan-400/50 transition-colors duration-300"
    >
      {/* Tech Corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary/0 group-hover:border-primary/100 transition-colors duration-300" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary/0 group-hover:border-primary/100 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary/0 group-hover:border-primary/100 transition-colors duration-300" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary/0 group-hover:border-primary/100 transition-colors duration-300" />

      <Link to={permalink} className="absolute inset-0 z-10" />

      <div className="p-6 flex flex-col flex-grow relative z-20">
        {/* Header: Date & Tag */}
        <div className="flex justify-between items-start mb-4">
          <time
            dateTime={date}
            className="text-xs font-mono text-neutral-500 dark:text-cyan-200/70 uppercase tracking-wider"
          >
            {formattedDate}
          </time>
          <div className="flex gap-2">
            {tags.slice(0, 1).map((tag: any) => (
              <span
                key={tag.permalink}
                className="text-[10px] font-mono px-2 py-0.5 border border-neutral-300 dark:border-white/20 text-neutral-500 dark:text-white/60 uppercase"
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-6 flex-grow leading-relaxed font-light">
          {description}
        </p>

        {/* Footer: Author & Read More */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-neutral-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            {authors.length > 0 && authors[0].imageURL && (
              <img
                src={authors[0].imageURL}
                alt={authors[0].name}
                className="w-6 h-6 rounded-full grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100"
              />
            )}
            {authors.length > 0 && (
              <span className="text-xs font-mono text-neutral-500 dark:text-neutral-500">
                {authors[0].name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-neutral-400 group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors">
            <Translate id="blog.card.read">Read</Translate>
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
