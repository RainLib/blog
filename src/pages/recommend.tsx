import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useGlobalData from "@docusaurus/useGlobalData";
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
      <main className="container margin-vert--xl">
        <header className="text--center margin-bottom--xl">
          <h1>
            <Translate id="recommend.header.title">Recommended Sites</Translate>
          </h1>
          <p className="hero__subtitle">
            <Translate id="recommend.header.subtitle">
              Curated tools and resources for developers.
            </Translate>
          </p>
        </header>

        <RecentRecommendations recommendations={recommendations} />

        <hr className="margin-vert--xl" />

        <section>
          <h2 className="margin-bottom--lg">
            <Translate id="recommend.browse_all">Browse All</Translate>
          </h2>
          <FilterableList recommendations={recommendations} tags={tags} />
        </section>
      </main>
    </Layout>
  );
}
