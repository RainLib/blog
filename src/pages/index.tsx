import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageHeader from "../components/home/HomepageHeader";
import HomeRecommendations from "../components/home/HomeRecommendations";
import LatestInsights from "../components/home/LatestInsights";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description="RainLib Digital Garden">
      <div className="home-wrapper min-h-screen bg-[var(--ifm-background-color)] text-[var(--ifm-text-color)] selection:bg-[var(--ifm-color-primary)] selection:text-white">
        <HomepageHeader />
        <LatestInsights />
        <HomeRecommendations />
        {/* <SkillsGallery /> */}
      </div>
    </Layout>
  );
}
