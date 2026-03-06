import React, { useState } from "react";
import Translate from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import type { Promotion } from "../data/promotions";
import { motion } from "framer-motion";

export default function PromoBanner({
  promotion,
  index = 0,
}: {
  promotion: Promotion;
  index?: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (promotion.code) {
      try {
        await navigator.clipboard.writeText(promotion.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy code: ", err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative w-full border-b border-zinc-200 dark:border-zinc-800 transition-all duration-500 hover:bg-black dark:hover:bg-white overflow-hidden"
    >
      {/* Huge background marquee text on hover - Hidden on mobile to prevent overflow */}
      <div className="absolute inset-0 pointer-events-none hidden md:flex items-center overflow-hidden opacity-0 group-hover:opacity-10 dark:group-hover:opacity-[0.05] transition-opacity duration-700">
        <motion.span
          initial={{ x: "0%" }}
          animate={{ x: "-50%" }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="text-[10rem] md:text-[20rem] font-black whitespace-nowrap text-white dark:text-black inline-block leading-none"
        >
          {promotion.name.toUpperCase()} {promotion.name.toUpperCase()}{" "}
          {promotion.name.toUpperCase()} {promotion.name.toUpperCase()}
        </motion.span>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between py-12 md:py-20 px-4 md:px-12 w-full gap-8 transition-transform duration-500 group-hover:scale-[0.98]">
        {/* Left: Category and Massive Title */}
        <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-16 w-full md:w-auto z-20">
          <span className="text-sm font-mono tracking-[0.4em] text-zinc-400 dark:text-zinc-600 uppercase w-24 shrink-0 transition-colors duration-500 group-hover:text-zinc-400 dark:group-hover:text-zinc-500">
            {promotion.category.split(" ")[0]}
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-[6rem] lg:text-[8rem] leading-[0.8] font-black tracking-tighter text-zinc-900 dark:text-white uppercase m-0 transition-all duration-500 group-hover:text-white dark:group-hover:text-black group-hover:translate-x-4">
            {promotion.name.split(" ")[0]}
            <span className="text-[var(--ifm-color-primary)]">.</span>
          </h2>
        </div>

        {/* Right: Description & Actions */}
        <div className="flex flex-col items-start md:items-end w-full md:w-[35%] gap-8 z-20 transition-all duration-500 group-hover:-translate-x-4">
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-medium text-left md:text-right m-0 leading-relaxed text-balance group-hover:text-zinc-300 dark:group-hover:text-zinc-600 transition-colors duration-500">
            {promotion.description}
          </p>

          <div className="flex flex-col xl:flex-row items-start md:items-end xl:items-center gap-4 w-full md:w-auto mt-4">
            {promotion.code && (
              <button
                onClick={handleCopy}
                className={`relative flex items-center justify-center h-12 md:h-14 px-8 rounded-full border transition-all duration-300 w-full xl:w-auto overflow-hidden ${
                  copied
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 bg-transparent group-hover:border-white/20 dark:group-hover:border-black/20 group-hover:text-white dark:group-hover:text-black hover:scale-105"
                }`}
              >
                <span className="text-sm font-mono font-bold tracking-[0.1em] uppercase relative z-10">
                  {copied ? "COPIED" : `CODE: ${promotion.code}`}
                </span>
              </button>
            )}

            <Link
              href={promotion.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/claim relative inline-flex h-12 md:h-14 items-center justify-center px-10 text-sm font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:no-underline w-full xl:w-auto shadow-none group-hover:shadow-xl
                         bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white group-hover:bg-[var(--ifm-color-primary)] group-hover:text-white"
            >
              <div className="absolute inset-0 bg-white/20 w-0 group-hover/claim:w-full transition-all duration-500 ease-[0.16,1,0.3,1] z-0" />
              <span className="tracking-[0.2em] uppercase text-xs relative z-10 font-bold">
                Claim Offer
              </span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
