import React from "react";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import useGlobalData from "@docusaurus/useGlobalData";

export default function LatestInsights() {
  const { i18n } = useDocusaurusContext();
  const globalData = useGlobalData();
  const pluginData = globalData["recent-blog-posts-plugin"]?.["default"] as
    | { recentPosts: any[] }
    | undefined;

  const rawPosts = pluginData?.recentPosts || [];

  const displayPosts = rawPosts.map((post) => {
    const date =
      post.date && post.date !== "1970-01-01"
        ? new Date(post.date).toLocaleDateString(i18n.currentLocale, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "Recently";

    return {
      title: post.title || "Untitled",
      desc:
        post.description ||
        translate({
          id: "homepage.insights.post_description_fallback",
          message: "深入探索 gRPC 与分布式系统的核心技术。",
          description: "Fallback description for blog posts on homepage",
        }),
      date: date,
      rawDate: post.date || "1970-01-01",
      link: `/blog/${post.slug}`,
      tags: post.tags || ["Blog"],
    };
  });

  return (
    <section className="py-32 relative z-10 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[var(--ifm-color-primary)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500 opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="container px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <p className="font-mono text-xs tracking-[0.3em] text-[var(--ifm-color-primary)] uppercase mb-4 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[var(--ifm-color-primary)]"></span>
              <Translate id="homepage.insights.label">
                Fresh from the Garden
              </Translate>
            </p>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
              <Translate id="homepage.insights.title">
                Latest Insights
              </Translate>
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-[var(--ifm-color-primary)] transition-all group"
          >
            <Translate id="homepage.insights.view_all">
              View All Articles
            </Translate>
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayPosts.map((post, i) => (
            <Link key={i} to={post.link} className="group block h-full">
              <article className="relative h-full flex flex-col p-8 rounded-3xl bg-white/5 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-white/5 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[var(--ifm-color-primary)]/10">
                {/* Liquid Metal Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--ifm-color-primary)] opacity-[0.05] blur-[50px] rounded-full group-hover:bg-[var(--ifm-color-primary)] group-hover:opacity-[0.1] transition-all duration-500" />

                {/* Index Number */}
                <div className="absolute top-6 right-6 font-mono text-4xl font-bold text-zinc-100 dark:text-white/5 group-hover:text-[var(--ifm-color-primary)]/20 transition-colors duration-500">
                  0{i + 1}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                  {post.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-3 py-1 rounded-full border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-black/20 text-zinc-600 dark:text-zinc-300 backdrop-blur-sm uppercase tracking-wider group-hover:border-[var(--ifm-color-primary)]/30 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Date */}
                <div className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--ifm-color-primary)]"></span>
                  {post.date}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col flex-grow">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 leading-tight text-zinc-900 dark:text-zinc-100 group-hover:text-[var(--ifm-color-primary)] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3 mb-8 flex-grow">
                    {post.desc}
                  </p>

                  <div className="flex items-center text-xs font-bold tracking-widest uppercase text-[var(--ifm-color-primary)] opacity-80 group-hover:opacity-100 gap-2">
                    <span className="relative">
                      <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-[var(--ifm-color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                      <Translate id="homepage.insights.read_article">
                        Read Article
                      </Translate>
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ifm-color-primary)]"
          >
            <Translate id="homepage.insights.view_all_posts">
              View All Articles
            </Translate>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
