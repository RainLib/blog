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
  },
  {
    title: "AI Agents",
    desc: "Autonomous Workflows",
    color: "#66fcf1",
    height: 400,
  },
  {
    title: "Creative Coding",
    desc: "Generative Art",
    color: "#d90166",
    height: 250,
  },
  {
    title: "Cloud Native",
    desc: "Kubernetes Operators",
    color: "#4dabf7",
    height: 350,
  },
  {
    title: "Microservices",
    desc: "gRPC & Protobuf",
    color: "#a6fcf6",
    height: 280,
  },
  { title: "Rust", desc: "Memory Safety", color: "#ff9f1c", height: 320 },
  { title: "React", desc: "Concurrent Mode", color: "#61dafb", height: 260 },
  {
    title: "System Design",
    desc: "Scalability",
    color: "#2ec4b6",
    height: 380,
  },
  {
    title: "Observability",
    desc: "Tracing & Metrics",
    color: "#e71d36",
    height: 310,
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
      className="mb-6 break-inside-avoid"
    >
      <div
        className="glass-panel p-6 rounded-2xl border border-transparent hover:border-[var(--ifm-color-primary)] transition-all duration-500 group overflow-hidden relative cursor-pointer"
        style={{ height: item.height }}
      >
        {/* Abstract Background Art */}
        <div
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${item.color}, transparent 70%)`,
          }}
        />

        <div className="relative z-10 flex flex-col h-full justify-end">
          <h3 className="text-xl font-bold mb-1 group-hover:text-[var(--ifm-color-primary)] transition-colors duration-300">
            {item.title}
          </h3>
          <p className="text-sm opacity-60 font-mono tracking-widest uppercase">
            {item.desc}
          </p>
        </div>
      </div>
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

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description="RainLib Digital Garden">
      <div className="min-h-screen">
        <HomepageHeader />
        <DriftingGallery />
        <div className="h-20" /> {/* Spacing */}
      </div>
    </Layout>
  );
}
