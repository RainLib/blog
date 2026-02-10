import React from "react";
import BlogPostPage from "@theme-original/BlogPostPage";
import type BlogPostPageType from "@theme/BlogPostPage";
import type { WrapperProps } from "@docusaurus/types";
import BrowserOnly from "@docusaurus/BrowserOnly";

type Props = WrapperProps<typeof BlogPostPageType>;

export default function BlogPostPageWrapper(props: Props): JSX.Element {
  return (
    <>
      {/* Background Shader */}
      <div className="fixed inset-0 z-[-1] opacity-20 pointer-events-none">
        <BrowserOnly>
          {() => {
            const ShaderHero =
              require("@site/src/components/ShaderHero").default;
            return <ShaderHero />;
          }}
        </BrowserOnly>
      </div>

      {/* Content Wrapper */}
      <div className="blog-post-page-wrapper">
        <BlogPostPage {...props} />
      </div>
    </>
  );
}
