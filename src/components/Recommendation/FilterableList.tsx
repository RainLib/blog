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
      <div className="flex flex-wrap gap-3 justify-center mb-12 sticky top-16 z-10 py-4 px-4 bg-white/80 dark:bg-[#1b1b1d]/80 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <button
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${
            !selectedTag
              ? "bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent"
              : "bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
          }`}
          onClick={() => handleTagClick(null)}
        >
          <Translate id="recommend.filter.all">All</Translate>
        </button>
        {availableTags.map((tagKey) => {
          const tagInfo = tags[tagKey];
          const isSelected = selectedTag === tagKey;
          // Default color if undefined
          const color = tagInfo?.color || "#a1a1aa";

          return (
            <button
              key={tagKey}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border`}
              style={{
                borderColor: isSelected ? color : undefined,
                backgroundColor: isSelected ? `${color}20` : "transparent",
                color: isSelected ? color : undefined,
              }}
              onClick={() => handleTagClick(tagKey)}
            >
              <span
                className={
                  !isSelected ? "text-zinc-600 dark:text-zinc-400" : ""
                }
              >
                <Translate id={`recommend.tag.${tagKey}`}>
                  {tagInfo?.label || tagKey}
                </Translate>
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
      >
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item) => (
            <motion.div
              layout
              key={item.slug}
              variants={itemAnim}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm"></div>
              <div className="relative h-full bg-white dark:bg-[#18181b] rounded-xl p-6 flex flex-col border border-zinc-200 dark:border-zinc-800 transition-transform duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-500">
                      {item.icon?.startsWith("http") ||
                      item.icon?.startsWith("/") ? (
                        <img
                          src={item.icon}
                          alt={item.title}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <span className="text-xl">{item.icon}</span>
                      )}
                    </div>
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
                    <span className="text-[10px]">↗</span>
                  </Link>
                </div>
              </div>
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
