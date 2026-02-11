import React from "react";
import Link from "@docusaurus/Link";
import { motion } from "framer-motion";

// --- Mock Data for Gallery ---
const GALLERY_ITEMS = [
  {
    title: "Distributed Systems",
    desc: "Consistency Patterns",
    color: "#1062cd",
    height: 300,
    link: "/blog/tags/distributed-systems",
    tag: "Architecture",
  },
  {
    title: "AI Agents",
    desc: "Autonomous Workflows",
    color: "#8b5cf6",
    height: 400,
    link: "/blog/tags/ai",
    tag: "GenAI",
  },
  {
    title: "Creative Coding",
    desc: "Generative Art",
    color: "#ec4899",
    height: 250,
    link: "/blog/tags/creative",
    tag: "Art",
  },
  {
    title: "Cloud Native",
    desc: "Kubernetes Operators",
    color: "#06b6d4",
    height: 350,
    link: "/blog/tags/cloud",
    tag: "DevOps",
  },
  {
    title: "Microservices",
    desc: "gRPC & Protobuf",
    color: "#3b82f6",
    height: 280,
    link: "/blog/tags/microservices",
    tag: "Backend",
  },
  {
    title: "Rust",
    desc: "Memory Safety",
    color: "#f59e0b",
    height: 320,
    link: "/blog/tags/rust",
    tag: "Language",
  },
  {
    title: "React",
    desc: "Concurrent Mode",
    color: "#0ea5e9",
    height: 260,
    link: "/blog/tags/react",
    tag: "Frontend",
  },
  {
    title: "System Design",
    desc: "Scalability",
    color: "#14b8a6",
    height: 380,
    link: "/blog/tags/system-design",
    tag: "Theory",
  },
  {
    title: "Observability",
    desc: "Tracing & Metrics",
    color: "#ef4444",
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

export default function DriftingGallery() {
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
