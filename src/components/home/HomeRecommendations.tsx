import React from "react";
import Link from "@docusaurus/Link";
import useGlobalData from "@docusaurus/useGlobalData";
import Translate from "@docusaurus/Translate";
import { Recommendation, Tag } from "../../plugins/recommendation-plugin";

export default function HomeRecommendations() {
  const globalData = useGlobalData();
  const pluginData = globalData["recommendation-plugin"]?.["default"] as
    | { recommendations: Recommendation[]; tags: Record<string, Tag> }
    | undefined;

  const recommendations = pluginData?.recommendations || [];
  const tags = pluginData?.tags || {};

  // Take top 3
  const displayItems = recommendations.slice(0, 3);

  if (displayItems.length === 0) return null;

  return (
    <section className="py-24 relative z-10 bg-[var(--ifm-background-color)] border-t border-[var(--glass-border)]">
      <div className="container px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="font-mono text-sm tracking-[0.2em] uppercase opacity-70 mb-2 flex items-center gap-2">
              <span className="text-xl">✨</span>
              <Translate id="homepage.recommendations.label">
                灵感采集
              </Translate>
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              <Translate id="homepage.recommendations.title">
                最近推荐
              </Translate>
            </h2>
          </div>
          <Link
            to="/recommend"
            className="hidden md:flex items-center gap-2 text-zinc-500 hover:text-[var(--ifm-color-primary)] transition-colors font-medium"
          >
            <Translate id="homepage.recommendations.view_all">
              查看全部
            </Translate>{" "}
            <span aria-hidden="true" className="text-lg">
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
              <div className="relative overflow-hidden rounded-2xl glass-panel p-8 h-full border border-[var(--glass-border)] hover:border-[var(--ifm-color-primary)] transition-all duration-300 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border border-[var(--glass-border)] flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-110 transition-transform duration-500">
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
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[var(--glass-border)] opacity-60 uppercase bg-zinc-50 dark:bg-zinc-800"
                      >
                        {tags[tag]?.label || tag}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100 group-hover:text-[var(--ifm-color-primary)] transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 flex-grow line-clamp-3">
                  {item.description || item.excerpt}
                </p>

                <div className="mt-auto flex items-center text-sm font-semibold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[var(--ifm-color-primary)]">
                  <Translate id="homepage.recommendations.read_more">
                    阅读详情
                  </Translate>{" "}
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/recommend"
            className="inline-flex items-center gap-2 text-[var(--ifm-color-primary)] font-semibold"
          >
            <Translate id="homepage.recommendations.view_all_mobile">
              查看详情推荐
            </Translate>{" "}
            →
          </Link>
        </div>
      </div>
    </section>
  );
}
