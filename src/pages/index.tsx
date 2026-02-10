import React, { useRef } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { motion, useScroll, useTransform } from "framer-motion";

// --- Mock Data for Gallery ---
const GALLERY_ITEMS = [
  {
    title: "Distributed Systems",
    desc: "Consistency Patterns",
    color: "#0071e3",
    height: 300,
    link: "/blog/tags/distributed-systems",
    tag: "Architecture",
  },
  {
    title: "AI Agents",
    desc: "Autonomous Workflows",
    color: "#66fcf1",
    height: 400,
    link: "/blog/tags/ai",
    tag: "GenAI",
  },
  {
    title: "Creative Coding",
    desc: "Generative Art",
    color: "#d90166",
    height: 250,
    link: "/blog/tags/creative",
    tag: "Art",
  },
  {
    title: "Cloud Native",
    desc: "Kubernetes Operators",
    color: "#4dabf7",
    height: 350,
    link: "/blog/tags/cloud",
    tag: "DevOps",
  },
  {
    title: "Microservices",
    desc: "gRPC & Protobuf",
    color: "#a6fcf6",
    height: 280,
    link: "/blog/tags/microservices",
    tag: "Backend",
  },
  {
    title: "Rust",
    desc: "Memory Safety",
    color: "#ff9f1c",
    height: 320,
    link: "/blog/tags/rust",
    tag: "Language",
  },
  {
    title: "React",
    desc: "Concurrent Mode",
    color: "#61dafb",
    height: 260,
    link: "/blog/tags/react",
    tag: "Frontend",
  },
  {
    title: "System Design",
    desc: "Scalability",
    color: "#2ec4b6",
    height: 380,
    link: "/blog/tags/system-design",
    tag: "Theory",
  },
  {
    title: "Observability",
    desc: "Tracing & Metrics",
    color: "#e71d36",
    height: 310,
    link: "/blog/tags/observability",
    tag: "Ops",
  },
];

function GalleryCard({
  item,
  index,
}: {
  item: (typeof GALLERY_ITEMS)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className="mb-8 break-inside-avoid"
    >
      <Link to={item.link || "#"} className="block group">
        <div
          className="glass-panel relative overflow-hidden rounded-2xl border border-white/10 group-hover:border-[var(--ifm-color-primary)] transition-all duration-500 cursor-pointer"
          style={{ height: item.height }}
        >
          {/* Generative Art Background Simulation */}
          <div
            className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700 ease-in-out"
            style={{
              background: `
                        radial-gradient(circle at 0% 0%, ${item.color}40, transparent 50%),
                        radial-gradient(circle at 100% 0%, ${item.color}20, transparent 50%),
                        radial-gradient(circle at 100% 100%, ${item.color}40, transparent 50%),
                        radial-gradient(circle at 0% 100%, ${item.color}20, transparent 50%)
                    `,
              filter: "blur(20px)",
            }}
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay" />

          {/* Content Content - Bottom Aligned */}
          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-xs font-mono tracking-[0.2em] text-[var(--ifm-color-primary-lightest)] uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.tag || "CONCEPT"}
              </p>
              <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[var(--ifm-color-primary)] transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-sm text-gray-300 font-light line-clamp-2 opacity-80 group-hover:opacity-100">
                {item.desc}
              </p>
            </div>
          </div>

          {/* Hover Shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}

function DriftingGallery() {
  // Split items into 3 columns for Masonry effect
  const col1 = GALLERY_ITEMS.filter((_, i) => i % 3 === 0);
  const col2 = GALLERY_ITEMS.filter((_, i) => i % 3 === 1);
  const col3 = GALLERY_ITEMS.filter((_, i) => i % 3 === 2);

  return (
    <section className="py-20 bg-transparent relative z-10">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col pt-0">
            {col1.map((item, i) => (
              <GalleryCard key={i} item={item} index={i} />
            ))}
          </div>
          <div className="flex flex-col pt-20">
            {" "}
            {/* Offset column */}
            {col2.map((item, i) => (
              <GalleryCard key={i} item={item} index={i} />
            ))}
          </div>
          <div className="flex flex-col pt-10">
            {" "}
            {/* Offset column */}
            {col3.map((item, i) => (
              <GalleryCard key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepageHeader() {
  return (
    <header className="relative w-full min-h-[60vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Restored WebGL Shader Background */}
      <BrowserOnly>
        {() => {
          const ShaderHero = require("../components/ShaderHero").default;
          return <ShaderHero />;
        }}
      </BrowserOnly>

      <div className="relative z-10 container flex flex-col items-center justify-center text-center px-4 mt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-6">
            RainLib
          </h1>
          <p className="text-xl md:text-2xl opacity-70 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Curating ideas in{" "}
            <span className="font-mono text-[var(--ifm-color-primary)]">
              Distributed Systems
            </span>{" "}
            &{" "}
            <span className="font-mono text-[var(--ifm-color-primary-light)]">
              GenAI
            </span>
            .
          </p>
        </motion.div>

        <div className="flex gap-4">
          <Link
            to="/blog"
            className="px-8 py-3 rounded-full bg-[var(--ifm-color-primary)] text-white hover:bg-[var(--ifm-color-primary-dark)] transition-all font-semibold"
          >
            Explore Garden
          </Link>
          <Link
            to="https://github.com/RainLib"
            className="px-8 py-3 rounded-full glass-panel hover:bg-white/10 transition-all font-semibold"
          >
            GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

// --- Skills Gallery Section ---
const SKILLS = [
  {
    category: "Distributed Systems & Backend",
    icon: "⚡",
    items: ["Java", "Go", "gRPC", "Netty", "Microservices", "Redis"],
    color: "#0071e3",
  },
  {
    category: "AI & Intelligent Agents",
    icon: "🤖",
    items: ["Python", "PyTorch", "LLMs", "LangChain", "RAG", "Agents"],
    color: "#a958a5",
  },
  {
    category: "Frontend & Visualization",
    icon: "✨",
    items: [
      "React",
      "TypeScript",
      "Docusaurus",
      "WebGL",
      "Tailwind",
      "Framer Motion",
    ],
    color: "#ff9f1c",
  },
  {
    category: "Cloud Native & DevOps",
    icon: "☁️",
    items: ["Kubernetes", "Docker", "AWS", "CI/CD", "Prometheus", "Terraform"],
    color: "#4dabf7",
  },
];

function SkillsGallery() {
  return (
    <section className="py-24 relative z-10 border-t border-[var(--glass-border)] bg-[var(--ifm-background-color)]">
      <div className="container px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Technical Landscape
          </h2>
          <p className="opacity-60 max-w-2xl mx-auto text-lg font-light">
            A curated stack of technologies powering high-performance
            distributed systems and intelligent interfaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILLS.map((group, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="relative group"
            >
              <div
                className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                style={{
                  background: `radial-gradient(circle at center, ${group.color}20, transparent 70%)`,
                }}
              />
              <div className="relative h-full glass-panel p-8 rounded-2xl border border-[var(--glass-border)] hover:border-[var(--ifm-color-primary)] transition-all duration-300 flex flex-col">
                <div className="text-4xl mb-6 bg-[var(--glass-bg)] w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm">
                  {group.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{group.category}</h3>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {group.items.map((skill, j) => (
                    <span
                      key={j}
                      className="px-3 py-1 text-xs font-mono rounded-md bg-[var(--ifm-background-color)] border border-[var(--glass-border)] opacity-80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Latest Insights Section ---
// Explicitly import blog posts to ensure data availability
// @ts-ignore
import * as Post1 from "../../blog/2026-02-09-grpc-production.mdx";
// @ts-ignore
import * as Post2 from "../../blog/2026-02-09-grpc-protocol.mdx";

const RECENT_POSTS_DATA = [
  { module: Post1, filename: "2026-02-09-grpc-production.mdx" },
  { module: Post2, filename: "2026-02-09-grpc-protocol.mdx" },
];

function getRecentPosts() {
  return RECENT_POSTS_DATA.map((item) => {
    const { frontMatter } = item.module;
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

function LatestInsights() {
  const posts = getRecentPosts();

  // Fallback if no posts found (should not happen with imports)
  const displayPosts = posts.length > 0 ? posts : [];

  return (
    <section className="py-24 relative z-10 bg-[var(--ifm-background-color)]">
      <div className="container px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="font-mono text-sm tracking-[0.2em] uppercase opacity-60 mb-2">
              From the Garden
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">Latest Insights</h2>
          </div>
          <Link
            to="/blog"
            className="hidden md:flex items-center gap-2 text-[var(--ifm-color-primary)] hover:opacity-80 transition-opacity"
          >
            View All <span aria-hidden="true">→</span>
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
                    Read Article →
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
            View All Posts →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description="RainLib Digital Garden">
      <div className="min-h-screen bg-[var(--ifm-background-color)] text-[var(--ifm-text-color)] selection:bg-[var(--ifm-color-primary)] selection:text-white">
        <HomepageHeader />

        <div className="relative">
          {/* Content Gradient Overlay */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[var(--ifm-background-color)] to-transparent z-20 pointer-events-none" />

          <DriftingGallery />
        </div>

        <LatestInsights />
        <SkillsGallery />
      </div>
    </Layout>
  );
}
