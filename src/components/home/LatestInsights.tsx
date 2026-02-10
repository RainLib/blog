import React from "react";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";

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

function getRecentPosts() {
  return RECENT_POSTS_DATA.map((item) => {
    const { frontMatter } = item.module as any;
    const filename = item.filename;

    // Parse filename for date: 2026-02-09-slug.mdx
    const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.mdx?$/);
    const dateStr = match ? match[1] : null;
    const filenameSlug = match ? match[2] : filename.replace(".mdx", "");

    // Format Date
    const date = dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Recently";

    // Construct Link
    // User confirmed the path should be /blog/slug (no date prefix)
    const slug = frontMatter.slug || filenameSlug;
    const link = `/blog/${slug}`;

    return {
      title: frontMatter.title || "Untitled",
      desc:
        frontMatter.description ||
        "Deep dive into gRPC and distributed systems.", // Provide a default if missing
      date: date,
      rawDate: dateStr || "1970-01-01",
      link: link,
      tag: frontMatter.tags?.[0] || "Blog",
    };
  }).sort((a, b) => b.rawDate.localeCompare(a.rawDate));
}

export default function LatestInsights() {
  const posts = getRecentPosts();

  // Fallback if no posts found (should not happen with imports)
  const displayPosts = posts.length > 0 ? posts : [];

  return (
    <section className="py-24 relative z-10 bg-[var(--ifm-background-color)]">
      <div className="container px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="font-mono text-sm tracking-[0.2em] uppercase opacity-60 mb-2">
              <Translate id="homepage.insights.label">来自花园</Translate>
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              <Translate id="homepage.insights.title">最新洞见</Translate>
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden md:flex items-center gap-2 text-[var(--ifm-color-primary)] hover:opacity-80 transition-opacity"
          >
            <Translate id="homepage.insights.view_all">查看全部</Translate>{" "}
            <span aria-hidden="true">→</span>
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
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-mono px-3 py-1 rounded-full border border-[var(--glass-border)] bg-[var(--ifm-background-color)] opacity-70 uppercase">
                      {post.tag}
                    </span>
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
