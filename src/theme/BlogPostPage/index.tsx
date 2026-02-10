import React from "react";
import BlogPostPage from "@theme-original/BlogPostPage";
import type BlogPostPageType from "@theme/BlogPostPage";
import type { WrapperProps } from "@docusaurus/types";
import BrowserOnly from "@docusaurus/BrowserOnly";

type Props = WrapperProps<typeof BlogPostPageType>;

export default function BlogPostPageWrapper(props: Props): JSX.Element {
  return (
    <>
      {/* Background Shader - REMOVED from here, moved to BlogPostItem to be inside Layout */}

      {/* Content Wrapper */}
      <div className="blog-post-page-wrapper">
        <BlogPostPage {...props} />
      </div>
    </>
  );
}
