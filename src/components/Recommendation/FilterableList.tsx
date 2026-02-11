import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { Recommendation, Tag } from "../../plugins/recommendation-plugin";

interface Props {
  recommendations: Recommendation[];
  tags: Record<string, Tag>;
}

const ITEMS_PER_PAGE = 9;

export default function FilterableList({ recommendations, tags }: Props) {
  const { i18n } = useDocusaurusContext();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Extract unique tags from recommendations
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    recommendations.forEach((item) =>
      item.tags?.forEach((tag) => tagSet.add(tag)),
    );
    return Array.from(tagSet).sort();
  }, [recommendations]);

  // Filter recommendations
  const filteredItems = useMemo(() => {
    if (!selectedTag) return recommendations;
    return recommendations.filter((item) => item.tags?.includes(selectedTag));
  }, [recommendations, selectedTag]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(tag);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnim = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <div>
      {/* Tag Filters */}
      {/* Tag Filters - Floating Island */}
      <div className="flex justify-center mb-12 sticky top-16 z-30">
        <div className="bg-white/70 dark:bg-[#09090b]/90 backdrop-blur-xl rounded-full border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-1.5 flex flex-wrap gap-1 max-w-[90vw] overflow-x-auto no-scrollbar justify-center">
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              !selectedTag
                ? "bg-black text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-lg"
                : "bg-zinc-100/50 dark:bg-zinc-800/50 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
            }`}
            onClick={() => handleTagClick(null)}
          >
            <Translate id="recommend.filter.all">All</Translate>
          </button>
          {availableTags.map((tagKey) => {
            const tagInfo = tags[tagKey] || tags[tagKey.toLowerCase()];
            const isSelected = selectedTag === tagKey;

            return (
              <button
                key={tagKey}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 relative group ${!isSelected ? "bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50" : ""}`}
                onClick={() => handleTagClick(tagKey)}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeTag"
                    className="absolute inset-0 rounded-full shadow-lg bg-black dark:bg-zinc-100"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 ${isSelected ? "text-white dark:text-zinc-950 font-medium shadow-sm" : "text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-200"}`}
                  style={{
                    textShadow: isSelected
                      ? "0 1px 2px rgba(0,0,0,0.1)"
                      : "none",
                  }}
                >
                  <Translate id={`recommend.tag.${tagKey}`}>
                    {tagInfo?.label || tagKey}
                  </Translate>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
      >
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item) => (
            <motion.div
              layout
              key={item.slug}
              variants={itemAnim}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover="hover"
              className="group relative break-inside-avoid mb-6"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-md group-hover:blur-lg"></div>
              <motion.div
                variants={{
                  hover: {
                    y: -5,
                    boxShadow:
                      "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative h-full bg-white dark:bg-[#18181b]/90 backdrop-blur-sm rounded-xl p-6 flex flex-col border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 group-hover:border-pink-500/30 overflow-hidden"
              >
                {/* Shine Effect */}
                <motion.div
                  variants={{
                    show: { x: "-100%", opacity: 0 },
                    hover: {
                      x: ["-100%", "200%"],
                      opacity: 1,
                      transition: {
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                      },
                    },
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 pointer-events-none -translate-x-full"
                ></motion.div>

                <div className="flex items-start justify-between mb-4 relative z-20">
                  <div className="flex items-center gap-3">
                    <motion.div
                      variants={{
                        hover: {
                          scale: 1.25,
                          rotate: 12,
                        },
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                      className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center overflow-hidden shadow-sm dark:shadow-none"
                    >
                      {item.icon?.startsWith("http") ||
                      item.icon?.startsWith("/") ? (
                        <img
                          src={item.icon}
                          alt={item.title}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <span className="text-2xl">{item.icon}</span>
                      )}
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-base m-0 text-zinc-900 dark:text-zinc-100 line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                        {item.date
                          ? new Date(item.date).toLocaleDateString(
                              i18n.currentLocale,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "Recently"}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {item.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                          >
                            <Translate
                              id={`recommend.tag.${tag.toLowerCase()}`}
                            >
                              {tags[tag]?.label || tag}
                            </Translate>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 line-clamp-3 leading-relaxed flex-grow">
                  {item.description || item.excerpt}
                </p>

                <div className="mt-auto flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                  <Link
                    to={`/recommend/${item.slug}`}
                    className="text-sm font-semibold text-zinc-900 dark:text-white hover:text-primary transition-colors after:absolute after:inset-0 after:content-['']"
                  >
                    <Translate id="recommend.card.read_more">
                      Read More
                    </Translate>
                  </Link>
                  <Link
                    to={item.url}
                    className="relative z-10 ml-auto text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 flex items-center gap-1"
                  >
                    <Translate id="recommend.card.visit">Visit</Translate>{" "}
                    <motion.span
                      variants={{
                        hover: {
                          x: 4,
                          y: -2,
                        },
                      }}
                      className="text-[10px] inline-block"
                    >
                      ↗
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-12 mb-8">
          <button
            className="px-8 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
          >
            <Translate id="recommend.list.load_more">Load More</Translate>
          </button>
        </div>
      )}

      {!hasMore && filteredItems.length > 0 && (
        <div className="text-center mt-12 text-zinc-400 text-sm">
          <Translate id="recommend.list.end">End of list</Translate>
        </div>
      )}
    </div>
  );
}
