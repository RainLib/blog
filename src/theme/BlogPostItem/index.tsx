import React, { type ReactNode, useEffect, useState } from "react";
import BlogPostItem from "@theme-original/BlogPostItem";
import type BlogPostItemType from "@theme/BlogPostItem";
import type { WrapperProps } from "@docusaurus/types";
import { PROMOTIONS, type Promotion } from "../../data/promotions";
import PromoBanner from "../../components/PromoBanner";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";

type Props = WrapperProps<typeof BlogPostItemType>;

export default function BlogPostItemWrapper(props: Props): ReactNode {
  const [randomPromo, setRandomPromo] = useState<Promotion | null>(null);

  // Use official hook to determine if it's an individual post page
  const { isBlogPostPage } = useBlogPost();

  useEffect(() => {
    // Select a random promotion on client-side to avoid hydration mismatches
    if (PROMOTIONS.length > 0) {
      const randomIndex = Math.floor(Math.random() * PROMOTIONS.length);
      setRandomPromo(PROMOTIONS[randomIndex]);
    }
  }, []);

  return (
    <>
      <BlogPostItem {...props} />

      {/* Inject Promo Banner for individual posts only */}
      {isBlogPostPage && randomPromo && (
        <div className="mt-12 blog-post-promo-container">
          <PromoBanner promotion={randomPromo} />
        </div>
      )}

      {/* Clean Footer */}
      <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800" />
    </>
  );
}
