import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageHeader from "../components/home/HomepageHeader";
import DriftingGallery from "../components/home/DriftingGallery";
import LatestInsights from "../components/home/LatestInsights";
import SkillsGallery from "../components/home/SkillsGallery";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description="RainLib Digital Garden">
      <div className="min-h-screen bg-[var(--ifm-background-color)] text-[var(--ifm-text-color)] selection:bg-[var(--ifm-color-primary)] selection:text-white">
        <HomepageHeader />
        <LatestInsights />
        {/* <SkillsGallery /> */}
      </div>
    </Layout>
  );
}
