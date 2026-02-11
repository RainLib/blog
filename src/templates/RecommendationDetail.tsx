import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import MDXContent from "@theme/MDXContent";
import Translate from "@docusaurus/Translate";

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

              <Link className="button button--primary button--lg" to={url}>
                <Translate id="recommendation.detail.visit">
                  Visit Website
                </Translate>
              </Link>
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
