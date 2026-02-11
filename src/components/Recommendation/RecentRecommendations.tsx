import React from "react";
import { motion } from "framer-motion";
import Link from "@docusaurus/Link";
import { Recommendation } from "../../plugins/recommendation-plugin";
import Translate from "@docusaurus/Translate";

interface Props {
  recommendations: Recommendation[];
}

export default function RecentRecommendations({ recommendations }: Props) {
  if (recommendations.length === 0) return null;

  // Take top 3 recent items
  const recentItems = recommendations.slice(0, 3);

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="margin-bottom--xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text--center margin-bottom--lg"
      >
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 inline-block">
          <Translate id="recent.title">Recent Arrivals</Translate>
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          <Translate id="recent.subtitle">
            Discover the latest tools added to our collection
          </Translate>
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {recentItems.map((item) => (
          <motion.div
            key={item.slug}
            variants={itemAnim}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-100 transition duration-500 blur-sm"></div>
            <div className="relative h-full bg-white dark:bg-black rounded-xl p-6 flex flex-col border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-2xl shadow-inner">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg m-0 line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="text-xs text-zinc-500 font-mono mt-1">
                    {item.date}
                  </div>
                </div>
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 mb-6 flex-grow">
                {item.description || item.excerpt}
              </p>

              <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                <Link
                  to={`/recommend/${item.slug}`}
                  className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-600 hover:opacity-80 transition-opacity after:absolute after:inset-0 after:content-['']"
                >
                  <Translate id="recent.read_review">Read Review</Translate>{" "}
                  &rarr;
                </Link>
                <Link
                  to={item.url}
                  className="relative z-10 ml-auto text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Translate id="recent.visit">Visit</Translate>{" "}
                  <span className="text-xs">↗</span>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
