import React from "react";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

// Explicitly import blog posts to ensure data availability
// @ts-ignore
import * as Post0 from "../../../blog/2026-02-08-grpc-idl.mdx";
// @ts-ignore
import * as Post1 from "../../../blog/2026-02-10-grpc-production.mdx";
// @ts-ignore
import * as Post2 from "../../../blog/2026-02-09-grpc-protocol.mdx";

const RECENT_POSTS_DATA = [
  { module: Post0, filename: "2026-02-08-grpc-idl.mdx" },
  { module: Post1, filename: "2026-02-10-grpc-production.mdx" },
  { module: Post2, filename: "2026-02-09-grpc-protocol.mdx" },
];

function getRecentPosts(locale: string) {
  return RECENT_POSTS_DATA.map((item) => {
    const module = item.module as any;
    const frontMatter = module.frontMatter || {};
    const filename = item.filename;

    // Parse filename for date: 2026-02-09-slug.mdx
    const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.mdx?$/);
    const dateStr = match ? match[1] : null;
    const filenameSlug = match ? match[2] : filename.replace(".mdx", "");

    // Format Date
    const date = dateStr
      ? new Date(dateStr).toLocaleDateString(locale, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Recently";

    // Construct Link
    const slug = frontMatter.slug || filenameSlug;
    const link = `/blog/${slug}`;

    return {
      title: frontMatter.title || "Untitled",
      desc:
        frontMatter.description ||
        translate({
          id: "homepage.insights.post_description_fallback",
          message: "深入探索 gRPC 与分布式系统的核心技术。",
          description: "Fallback description for blog posts on homepage",
        }),
      date: date,
      rawDate: dateStr || "1970-01-01",
      link: link,
      tags: frontMatter.tags || ["Blog"],
    };
  }).sort((a, b) => b.rawDate.localeCompare(a.rawDate));
}

export default function LatestInsights() {
  const { i18n } = useDocusaurusContext();
  const posts = getRecentPosts(i18n.currentLocale);

  // Fallback if no posts found (should not happen with imports)
  const displayPosts = posts.length > 0 ? posts : [];

  return (
    <section className="py-24 relative z-10 bg-[var(--ifm-background-color)]">
      <div className="container px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="font-mono text-sm tracking-[0.2em] uppercase opacity-70 mb-2 flex items-center gap-2">
              <span className="text-xl">🌱</span>
              <Translate id="homepage.insights.label">来自花园</Translate>
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              <Translate id="homepage.insights.title">最新洞见</Translate>
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden md:flex items-center gap-2 text-zinc-500 hover:text-[var(--ifm-color-primary)] transition-colors font-medium"
          >
            <Translate id="homepage.insights.view_all">查看全部</Translate>{" "}
            <span aria-hidden="true" className="text-lg">
              →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayPosts.map((post, i) => (
            <Link key={i} to={post.link} className="group block">
              <div className="relative overflow-hidden rounded-2xl glass-panel p-8 h-full border border-[var(--glass-border)] hover:border-[var(--ifm-color-primary)] transition-all duration-300">
                <div className="absolute top-0 right-0 p-6 opacity-10 font-mono text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[var(--ifm-text-color)] to-transparent group-hover:scale-110 transition-transform duration-500">
                  0{i + 1}
                </div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[var(--glass-border)] bg-[var(--ifm-background-color)] opacity-70 uppercase whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono opacity-50">
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--ifm-color-primary)] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm opacity-70 leading-relaxed mb-8 flex-grow line-clamp-3">
                    {post.desc}
                  </p>
                  <div className="flex items-center text-sm font-semibold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[var(--ifm-color-primary)]">
                    <Translate id="homepage.insights.read_article">
                      阅读文章
                    </Translate>{" "}
                    →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[var(--ifm-color-primary)] font-semibold"
          >
            <Translate id="homepage.insights.view_all_posts">
              查看所有文章
            </Translate>{" "}
            →
          </Link>
        </div>
      </div>
    </section>
  );
}
