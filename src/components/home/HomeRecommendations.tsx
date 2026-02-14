import React from "react";
import Link from "@docusaurus/Link";
import useGlobalData from "@docusaurus/useGlobalData";
import Translate from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { Recommendation, Tag } from "../../plugins/recommendation-plugin";

export default function HomeRecommendations() {
  const globalData = useGlobalData();
  const { i18n } = useDocusaurusContext();
  const pluginData = globalData["recommendation-plugin"]?.["default"] as
    | { recommendations: Recommendation[]; tags: Record<string, Tag> }
    | undefined;

  const recommendations = pluginData?.recommendations || [];
  const tags = pluginData?.tags || {};

  // Take top 3
  const displayItems = recommendations.slice(0, 3);

  if (displayItems.length === 0) return null;

  return (
    <section className="py-32 relative z-10 bg-[var(--ifm-background-color)] overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--ifm-color-primary)]/20 to-transparent" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-blue-500 opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-pink-500 opacity-[0.03] blur-[80px] rounded-full pointer-events-none" />

      <div className="container px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <p className="font-mono text-xs tracking-[0.3em] text-[var(--ifm-color-primary)] uppercase mb-4 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[var(--ifm-color-primary)]"></span>
              <Translate id="homepage.recommendations.label">
                Curated Collection
              </Translate>
            </p>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 via-zinc-600 to-zinc-900 dark:from-white dark:via-zinc-200 dark:to-zinc-500">
              <Translate id="homepage.recommendations.title">
                Fresh Picks
              </Translate>
            </h2>
          </div>
          <Link
            to="/recommend"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-[var(--ifm-color-primary)] transition-all group"
          >
            <Translate id="homepage.recommendations.view_all">
              View All Collection
            </Translate>{" "}
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayItems.map((item, i) => (
            <Link
              key={item.slug}
              to={`/recommend/${item.slug}`}
              className="group block h-full"
            >
              <div className="relative overflow-hidden rounded-3xl bg-white/5 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-white/5 p-8 h-full transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[var(--ifm-color-primary)]/10 flex flex-col">
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border border-white/20 dark:border-white/5 flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    {item.icon?.startsWith("http") ||
                    item.icon?.startsWith("/") ? (
                      <img
                        src={item.icon}
                        alt={item.title}
                        className="w-full h-full object-contain p-2.5"
                      />
                    ) : (
                      <span className="text-2xl filter drop-shadow-md">
                        {item.icon}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                    {item.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-1 rounded-md border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 uppercase tracking-wide"
                      >
                        <Translate id={`recommend.tag.${tag.toLowerCase()}`}>
                          {tags[tag]?.label || tag}
                        </Translate>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4 relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-1 h-1 rounded-full bg-[var(--ifm-color-primary)]"></span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
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
                    </span>
                  </div>
                  <h3 className="text-xl font-bold leading-tight text-zinc-900 dark:text-zinc-100 group-hover:text-[var(--ifm-color-primary)] transition-colors">
                    {item.title}
                  </h3>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 flex-grow line-clamp-3 relative z-10">
                  {item.description || item.excerpt}
                </p>

                <div className="mt-auto flex items-center text-xs font-bold tracking-widest uppercase text-[var(--ifm-color-primary)] opacity-80 group-hover:opacity-100 transition-all duration-300 gap-2 relative z-10">
                  <span className="relative">
                    <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-[var(--ifm-color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                    <Translate id="homepage.recommendations.read_more">
                      Read Review
                    </Translate>
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link
            to="/recommend"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ifm-color-primary)]"
          >
            <Translate id="homepage.recommendations.view_all_mobile">
              View All Collection
            </Translate>{" "}
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
