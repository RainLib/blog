import React, { type ReactNode } from "react";
import BlogPostItem from "@theme-original/BlogPostItem";
import type BlogPostItemType from "@theme/BlogPostItem";
import type { WrapperProps } from "@docusaurus/types";
import BrowserOnly from "@docusaurus/BrowserOnly";

type Props = WrapperProps<typeof BlogPostItemType>;

export default function BlogPostItemWrapper(props: Props): ReactNode {
  console.log("!!! CUSTOM BlogPostItem MOUNTED !!!");
  return (
    <>
      <BlogPostItem {...props} />

      {/* Background Shader (Moved here to be inside Layout Context) */}
      <div className="fixed inset-0 z-[-1] opacity-20 pointer-events-none">
        <BrowserOnly>
          {() => {
            const ShaderHero =
              require("@site/src/components/ShaderHero").default;
            return <ShaderHero />;
          }}
        </BrowserOnly>
      </div>

      {/* Tech Footer for the Article */}
      <div className="mt-16 pt-8 border-t border-dashed border-neutral-300 dark:border-white/10 text-center">
        <span className="font-mono text-xs font-bold text-neutral-400 dark:text-cyan-500/50 tracking-[0.2em] uppercase">
          // END_OF_TRANSMISSION
        </span>
      </div>
    </>
  );
}
