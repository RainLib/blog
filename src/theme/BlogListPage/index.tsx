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
import BlogRow from "@site/src/components/blog/BlogRow";
import BrowserOnly from "@docusaurus/BrowserOnly";
import Translate from "@docusaurus/Translate";

function BlogListPageContent(props: Props) {
  const { metadata, items, sidebar } = props;
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { blogDescription, blogTitle, permalink } = metadata;

  return (
    <BlogLayout sidebar={sidebar}>
      {/* Background Shader - Fixed behind everything */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <BrowserOnly>
          {() => {
            const BlogHero = require("@site/src/components/BlogHero").default;
            return <BlogHero />;
          }}
        </BrowserOnly>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto pt-10">
        {/* Header for the List */}
        <div className="mb-8 pb-4 border-b border-neutral-200 dark:border-white/10 flex items-end justify-between px-6">
          <h1 className="text-3xl font-black tracking-tighter uppercase text-neutral-900 dark:text-white mb-0">
            <Translate id="blog.archive.title">Latest Transmissions</Translate>
          </h1>
          <span className="font-mono text-xs text-neutral-400 dark:text-cyan-500/50">
            // SYSTEM_READY
          </span>
        </div>

        {/* Uniform List Layout */}
        <div className="flex flex-col bg-white/50 dark:bg-black/40 backdrop-blur-md rounded-lg overflow-hidden border border-neutral-200 dark:border-white/10 shadow-sm">
          {items.map((item, index) => (
            <BlogRow
              key={item.content.metadata.permalink}
              item={item.content}
              index={index}
            />
          ))}
        </div>

        <div className="mt-12">
          <BlogListPaginator metadata={metadata} />
        </div>
      </div>
    </BlogLayout>
  );
}

export default function BlogListPage(props: Props): JSX.Element {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogListPage,
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
