import React, { type ReactNode } from "react";
import BlogPostItem from "@theme-original/BlogPostItem";
import type BlogPostItemType from "@theme/BlogPostItem";
import type { WrapperProps } from "@docusaurus/types";

type Props = WrapperProps<typeof BlogPostItemType>;

export default function BlogPostItemWrapper(props: Props): ReactNode {
  return (
    <>
      <BlogPostItem {...props} />

      {/* Tech Footer for the Article */}
      <div className="mt-16 pt-8 border-t border-dashed border-neutral-300 dark:border-white/10 text-center">
        <span className="font-mono text-xs font-bold text-neutral-400 dark:text-cyan-500/50 tracking-[0.2em] uppercase">
          // END_OF_TRANSMISSION
        </span>
      </div>
    </>
  );
}
