import React, { useState } from "react";
import Translate from "@docusaurus/Translate";
import { PROMOTIONS } from "../../data/promotions";
import PromoBanner from "../PromoBanner";

export default function HomePromotions() {
  if (!PROMOTIONS || PROMOTIONS.length === 0) return null;

  return (
    <section className="py-24 relative z-10 bg-zinc-50 dark:bg-zinc-900/20 overflow-hidden border-y border-zinc-200/50 dark:border-white/5">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500 opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-[var(--ifm-color-primary)] opacity-[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="container px-4 relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs tracking-[0.3em] text-[var(--ifm-color-primary)] uppercase mb-4 inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[var(--ifm-color-primary)]"></span>
            <Translate id="homepage.promotions.label">Special Offers</Translate>
            <span className="w-8 h-[1px] bg-[var(--ifm-color-primary)]"></span>
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 via-zinc-600 to-zinc-900 dark:from-white dark:via-zinc-200 dark:to-zinc-500 mb-4">
            <Translate id="homepage.promotions.title">
              Sponsors & Discounts
            </Translate>
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            <Translate id="homepage.promotions.subtitle">
              Exclusive discounts on tools and services I use and recommend.
              Using these links helps support this blog!
            </Translate>
          </p>
        </div>

        <div className="space-y-6">
          {PROMOTIONS.map((promo) => (
            <PromoBanner key={promo.id} promotion={promo} />
          ))}
        </div>
      </div>
    </section>
  );
}
