import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import MDXContent from "@theme/MDXContent";

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
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
                {icon}
              </div>
              <Heading as="h1">{title}</Heading>
              <p className="hero__subtitle">{description}</p>

              <div className="margin-bottom--md">
                {tags?.map((tag) => (
                  <span
                    key={tag}
                    className="badge badge--secondary margin-horiz--xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link className="button button--primary button--lg" to={url}>
                Visit Website
              </Link>
            </div>

            <div className="markdown">
              <MDXContent>
                <Content />
              </MDXContent>
            </div>

            <div className="margin-top--xl">
              <Link to="/recommend">← Back to Recommendations</Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
