import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import MDXContent from "@theme/MDXContent";
import Translate from "@docusaurus/Translate";
import { motion } from "framer-motion";

// Define the props interface
interface Props {
  content: React.ComponentType<{}>; // The exported MDX component
  metadata: {
    title: string;
    description: string;
    url: string;
    tags?: string[];
    icon?: string;
  };
}

export default function RecommendationDetail({ content, metadata }: Props) {
  const { title, description, url, tags, icon } = metadata;
  const Content = content;

  return (
    <Layout title={title} description={description}>
      <main className="container container--fluid margin-vert--lg">
        <div className="row justify-center">
          <div className="col col--8">
            <div className="margin-bottom--lg text--center">
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center overflow-hidden shadow-xl">
                  {icon?.startsWith("http") || icon?.startsWith("/") ? (
                    <img
                      src={icon}
                      alt={title}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <span style={{ fontSize: "4rem" }}>{icon}</span>
                  )}
                </div>
              </div>
              <Heading as="h1">{title}</Heading>
              <p className="hero__subtitle">{description}</p>

              <div className="margin-bottom--md">
                {tags?.map((tag) => (
                  <span
                    key={tag}
                    className="badge badge--secondary margin-horiz--xs"
                  >
                    <Translate id={`recommend.tag.${tag.toLowerCase()}`}>
                      {tag}
                    </Translate>
                  </span>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Link to={url} className="no-underline">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group cursor-pointer"
                  >
                    {/* Glowing background Layer */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>

                    {/* Main Button */}
                    <div className="relative flex items-center gap-2 px-10 py-4 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-xl rounded-full text-zinc-900 dark:text-white font-bold text-lg shadow-2xl transition-all duration-300">
                      <Translate id="recommendation.detail.visit">
                        Visit Website
                      </Translate>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "easeInOut",
                        }}
                      >
                        →
                      </motion.span>

                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full group-hover:animate-[swipe-shimmer_2s_infinite]"></div>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>

            <div className="markdown">
              <MDXContent>
                <Content />
              </MDXContent>
            </div>

            <div className="margin-top--xl">
              <Link to="/recommend">
                <Translate id="recommendation.detail.back">
                  ← Back to Recommendations
                </Translate>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
