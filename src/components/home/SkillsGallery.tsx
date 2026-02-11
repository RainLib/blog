import React from "react";
import { motion } from "framer-motion";
import Translate, { translate } from "@docusaurus/Translate";

function getSkills() {
  return [
    {
      category: translate({
        id: "homepage.skills.backend",
        message: "分布式系统 & 后端",
      }),
      icon: "⚡",
      items: ["Java", "Go", "gRPC", "Netty", "Microservices", "Redis"],
      color: "#1062cd", // Match new primary
    },
    {
      category: translate({
        id: "homepage.skills.ai",
        message: "AI & 智能体",
      }),
      icon: "🤖",
      items: ["Python", "PyTorch", "LLMs", "LangChain", "RAG", "Agents"],
      color: "#8b5cf6", // Soft violet
    },
    {
      category: translate({
        id: "homepage.skills.frontend",
        message: "前端 & 可视化",
      }),
      icon: "✨",
      items: [
        "React",
        "TypeScript",
        "Docusaurus",
        "WebGL",
        "Tailwind",
        "Framer Motion",
      ],
      color: "#f59e0b", // Soft amber
    },
    {
      category: translate({
        id: "homepage.skills.devops",
        message: "云原生 & DevOps",
      }),
      icon: "☁️",
      items: [
        "Kubernetes",
        "Docker",
        "AWS",
        "CI/CD",
        "Prometheus",
        "Terraform",
      ],
      color: "#06b6d4", // Soft cyan
    },
  ];
}

export default function SkillsGallery() {
  const skills = getSkills();

  return (
    <section className="py-24 relative z-10 border-t border-[var(--glass-border)] bg-[var(--ifm-background-color)]">
      <div className="container px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-3">
            <span className="text-4xl">🛠️</span>
            <Translate
              id="homepage.skills.title"
              description="Title for skills section"
            >
              技术全景
            </Translate>
          </h2>
          <p className="opacity-60 max-w-2xl mx-auto text-lg font-light">
            <Translate
              id="homepage.skills.subtitle"
              description="Subtitle for skills section"
            >
              构建高性能分布式系统与智能接口的技术栈精选。
            </Translate>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((group, i) => (
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
