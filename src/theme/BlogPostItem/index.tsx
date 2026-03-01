import React, { type ReactNode, useEffect, useState } from "react";
import BlogPostItem from "@theme-original/BlogPostItem";
import type BlogPostItemType from "@theme/BlogPostItem";
import type { WrapperProps } from "@docusaurus/types";
import { PROMOTIONS, type Promotion } from "../../data/promotions";
import PromoBanner from "../../components/PromoBanner";
import { useLocation } from "@docusaurus/router";

type Props = WrapperProps<typeof BlogPostItemType>;

export default function BlogPostItemWrapper(props: Props): ReactNode {
  const [randomPromo, setRandomPromo] = useState<Promotion | null>(null);
  const location = useLocation();

  // Only show on individual blog post pages, not in list views
  const isBlogPostPage =
    location.pathname.includes("/blog/") && location.pathname !== "/blog";

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
