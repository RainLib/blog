import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useGlobalData from "@docusaurus/useGlobalData";
import { motion } from "framer-motion";
import RecentRecommendations from "../components/Recommendation/RecentRecommendations";
import FilterableList from "../components/Recommendation/FilterableList";
import { Recommendation, Tag } from "../plugins/recommendation-plugin";
import Translate, { translate } from "@docusaurus/Translate";

export default function Recommend() {
  const { siteConfig } = useDocusaurusContext();
  const globalData = useGlobalData();
  const pluginData = globalData["recommendation-plugin"]?.["default"] as
    | { recommendations: Recommendation[]; tags: Record<string, Tag> }
    | undefined;
  const recommendations = pluginData?.recommendations || [];
  const tags = pluginData?.tags || {};

  return (
    <Layout
      title={translate({
        id: "recommend.page.title",
        message: `Recommended Sites | ${siteConfig.title}`,
      })}
      description={translate({
        id: "recommend.page.description",
        message: "A curated list of websites, tools, and resources.",
      })}
    >
      <main className="container margin-vert--xl relative">
        {/* Hero Section */}
        <div className="relative isolate overflow-hidden py-16 sm:py-24 lg:py-32 mb-12 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          <div
            className="absolute left-[calc(50%-11rem)] top-[calc(50%-30rem)] -z-10 transform-gpu blur-3xl sm:left-[calc(50%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mx-auto max-w-2xl px-6 lg:px-8 relative z-10"
          >
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-6xl mb-6">
              <Translate id="recommend.hero.title">
                Recommended Resources
              </Translate>
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              <Translate id="recommend.hero.subtitle">
                A curated collection of tools, libraries, and resources to
                supercharge your development.
              </Translate>
            </p>
          </motion.div>
        </div>

        <RecentRecommendations recommendations={recommendations} />

        <div className="margin-vert--xl" />

        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text--center margin-bottom--lg"
          >
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 inline-block">
              <Translate id="recommend.browse_all">Browse All</Translate>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              <Translate id="recommend.all.subtitle">
                Filter by tag to find exactly what you need.
              </Translate>
            </p>
          </motion.div>

          <FilterableList recommendations={recommendations} tags={tags} />
        </section>
      </main>
    </Layout>
  );
}
