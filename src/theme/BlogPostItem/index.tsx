import React, { type ReactNode } from "react";
import BlogPostItem from "@theme-original/BlogPostItem";
import type BlogPostItemType from "@theme/BlogPostItem";
import type { WrapperProps } from "@docusaurus/types";
import BrowserOnly from "@docusaurus/BrowserOnly";

type Props = WrapperProps<typeof BlogPostItemType>;

export default function BlogPostItemWrapper(props: Props): ReactNode {
  return (
    <>
      <BlogPostItem {...props} />

      {/* Clean Footer can be added here if needed, or left empty for natural flow */}
      <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800" />
    </>
  );
}
