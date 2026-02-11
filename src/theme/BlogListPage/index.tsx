import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import BlogLayout from "@theme/BlogLayout";
import BlogListPaginator from "@theme/BlogListPaginator";
import SearchMetadata from "@theme/SearchMetadata";
import type { Props } from "@theme/BlogListPage";
import BlogRow from "@site/src/components/blog/BlogRow"; // Back to BlogRow
import FeaturedPost from "@site/src/components/blog/FeaturedPost";
import BrowserOnly from "@docusaurus/BrowserOnly";
import Translate from "@docusaurus/Translate";

function BlogListPageContent(props: Props) {
  const { metadata, items, sidebar } = props;
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { blogDescription, blogTitle, permalink } = metadata;

  // Split items: First one is featured, rest are list
  const featuredItem = items[0];
  const listItems = items.slice(1);

  return (
    <BlogLayout sidebar={sidebar}>
      <div className="relative z-10 w-full max-w-6xl mx-auto pt-10 px-4">
        {/* Featured Post - Full Width */}
        {featuredItem && (
          <div className="mb-12">
            <FeaturedPost item={featuredItem.content} />
          </div>
        )}

        {/* List Layout - Single Column */}
        <div className="flex flex-col bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
          {listItems.map((item, index) => (
            <BlogRow
              key={item.content.metadata.permalink}
              item={item.content}
              index={index}
            />
          ))}
        </div>

        <div className="mt-20">
          <BlogListPaginator metadata={metadata} />
        </div>
      </div>
    </BlogLayout>
  );
}

export default function BlogListPage(props: Props) {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}
    >
      <PageMetadata
        title={props.metadata.blogTitle}
        description={props.metadata.blogDescription}
      />
      <SearchMetadata tag="blog_posts_list" />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
