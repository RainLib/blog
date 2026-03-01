import React, { useState, useMemo } from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Translate from "@docusaurus/Translate";
import { PROMOTIONS } from "../data/promotions";
import PromoBanner from "../components/PromoBanner";
import { motion, AnimatePresence } from "framer-motion";

export default function PromotionsPage() {
  const { siteConfig } = useDocusaurusContext();

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(PROMOTIONS.map((p) => p.category.split(" ")[0]))),
    ];
  }, []);

  const [activeTab, setActiveTab] = useState(categories[0]);

  const activePromotions = useMemo(() => {
    if (activeTab === "All") return PROMOTIONS;
    return PROMOTIONS.filter((p) => p.category.startsWith(activeTab));
  }, [activeTab]);

  return (
    <Layout
      title={`Offers - ${siteConfig.title}`}
      description="RainLib Exclusive Offers and Tools"
    >
      {/*
        Inject raw CSS to forcefully override Docusaurus's default root backgrounds
        This eliminates the white/gray gaps at the top and edges completely.
      */}
      <style>{`
        :root {
          --ifm-background-color: #F8F8F8;
          --ifm-navbar-background-color: #F8F8F8;
        }
        html[data-theme='dark'] {
          --ifm-background-color: #000000;
          --ifm-navbar-background-color: #000000;
        }
        .navbar {
          box-shadow: none !important;
          border-bottom: 1px solid rgba(150,150,150,0.1);
        }
      `}</style>

      <div className="min-h-screen text-zinc-900 dark:text-zinc-50 relative selection:bg-[var(--ifm-color-primary)] selection:text-white transition-colors duration-700 w-full flex flex-col items-center">
        <main className="w-full max-w-[1600px] px-0 pt-16 md:pt-24 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="px-6 md:px-12 mb-16 md:mb-24 flex flex-col xl:flex-row xl:items-end justify-between gap-12"
          >
            <div className="max-w-5xl">
              <span className="inline-block px-4 py-2 bg-zinc-900 text-white dark:bg-white dark:text-black text-[10px] md:text-xs font-mono font-bold tracking-[0.3em] uppercase mb-8 md:mb-12 rounded-full">
                Curated Selection
              </span>
              <h1 className="text-[5rem] md:text-[9rem] lg:text-[12rem] leading-[0.8] font-black tracking-tighter m-0 uppercase text-zinc-900 dark:text-white">
                <Translate id="promotions.page.title">OFFERS</Translate>
                <span className="text-[var(--ifm-color-primary)] inline-block hover:scale-110 hover:-rotate-12 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                  .
                </span>
              </h1>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-md xl:pb-6"
            >
              <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 font-medium leading-[1.6] m-0 text-balance border-l-4 border-[var(--ifm-color-primary)] pl-6">
                <Translate id="promotions.page.description">
                  精心挑选的精品开发者工具与服务。使用专属链接获取最高折扣，同时支持本站持续输出。
                </Translate>
              </p>
            </motion.div>
          </motion.div>

          {/* Redesigned Tab Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="px-6 md:px-12 mb-8 flex flex-wrap gap-4"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`relative px-8 py-3 text-sm md:text-xs font-mono tracking-[0.2em] uppercase transition-all duration-500 rounded-full border border-solid ${
                  activeTab === category
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white font-black scale-105"
                    : "bg-transparent text-zinc-500 dark:text-zinc-500 border-zinc-300 dark:border-zinc-800 hover:border-zinc-500 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-white font-medium"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Animated List Wrapper */}
          <div className="w-full flex flex-col border-t border-b border-zinc-200 dark:border-zinc-800 relative z-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col w-full"
              >
                {activePromotions.map((promo, i) => (
                  <PromoBanner key={promo.id} promotion={promo} index={i} />
                ))}

                {activePromotions.length === 0 && (
                  <div className="py-40 text-center text-zinc-400 dark:text-zinc-600 font-mono tracking-[0.3em] uppercase">
                    No offers mapping to current sector.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-32 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600"
          >
            <span>RainLib // Partner Network</span>
            <span>Updated 2026 // Global</span>
          </motion.div>
        </main>
      </div>
    </Layout>
  );
}
