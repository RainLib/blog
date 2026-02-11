import React from "react";
import { motion } from "framer-motion";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { Recommendation } from "../../plugins/recommendation-plugin";

interface Props {
  recommendations: Recommendation[];
}

export default function RecentRecommendations({ recommendations }: Props) {
  const { i18n } = useDocusaurusContext();
  if (recommendations.length === 0) return null;

  // Take top 3 recent items
  const recentItems = recommendations.slice(0, 3);
  // ... existing animation constants ...
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
        className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[400px]"
      >
        {recentItems.map((item, index) => {
          const isLarge = index === 0;

          return (
            <motion.div
              key={item.slug}
              variants={itemAnim}
              whileHover="hover"
              className={`group relative ${isLarge ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-2"}`}
            >
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300 blur-md group-hover:blur-lg`}
              ></div>
              <motion.div
                variants={{
                  hover: {
                    y: -5,
                    boxShadow:
                      "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative h-full bg-white dark:bg-black/80 backdrop-blur-sm rounded-2xl p-6 flex flex-col border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 group-hover:border-emerald-500/30 overflow-hidden ${isLarge ? "justify-end" : "justify-between"}`}
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
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 pointer-events-none"
                ></motion.div>

                <div
                  className={`flex ${isLarge ? "flex-col items-start gap-4" : "flex-col gap-4"} relative z-20`}
                >
                  <motion.div
                    variants={{
                      hover: {
                        scale: 1.25,
                        rotate: 12,
                      },
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={`${isLarge ? "w-16 h-16" : "w-12 h-12"} rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center overflow-hidden shadow-sm dark:shadow-none mb-2`}
                  >
                    {item.icon?.startsWith("http") ||
                    item.icon?.startsWith("/") ? (
                      <img
                        src={item.icon}
                        alt={item.title}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <span className={`${isLarge ? "text-4xl" : "text-2xl"}`}>
                        {item.icon}
                      </span>
                    )}
                  </motion.div>

                  <div>
                    <h3
                      className={`font-bold ${isLarge ? "text-2xl md:text-3xl" : "text-lg"} m-0 line-clamp-1`}
                    >
                      {item.title}
                    </h3>
                    <div className="text-xs text-zinc-500 font-mono mt-1">
                      {item.date ? (
                        new Date(item.date).toLocaleDateString(
                          i18n.currentLocale,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )
                      ) : (
                        <Translate id="recent.label.recently">
                          Recently
                        </Translate>
                      )}
                    </div>
                  </div>
                </div>

                <p
                  className={`text-zinc-600 dark:text-zinc-400 ${isLarge ? "text-base line-clamp-3 my-4" : "text-sm line-clamp-4 mt-2 flex-grow"} `}
                >
                  {item.description || item.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                  <Link
                    to={`/recommend/${item.slug}`}
                    className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-600 hover:opacity-80 transition-opacity after:absolute after:inset-0 after:content-['']"
                  >
                    <Translate id="recent.read_review">Read Review</Translate>{" "}
                    <motion.span
                      variants={{
                        hover: {
                          x: 4,
                        },
                      }}
                      className="inline-block"
                    >
                      &rarr;
                    </motion.span>
                  </Link>
                  <Link
                    to={item.url}
                    className="relative z-10 ml-auto text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Translate id="recent.visit">Visit</Translate>{" "}
                    <motion.span
                      variants={{
                        hover: {
                          x: 4,
                          y: -2,
                        },
                      }}
                      className="text-xs inline-block"
                    >
                      ↗
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
