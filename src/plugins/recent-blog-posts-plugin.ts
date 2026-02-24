import path from "path";
import fs from "fs";
import { LoadContext, Plugin } from "@docusaurus/types";
import matter from "gray-matter";

export interface BlogPostData {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags: string[];
}

export default function recentBlogPostsPlugin(
  context: LoadContext,
): Plugin<{ recentPosts: BlogPostData[] }> {
  const { siteDir } = context;
  const blogPath = path.resolve(siteDir, "blog");

  return {
    name: "recent-blog-posts-plugin",

    async loadContent() {
      if (!fs.existsSync(blogPath)) {
        return { recentPosts: [] };
      }

      const files = fs
        .readdirSync(blogPath)
        .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));

      const posts = files.map((file) => {
        const filePath = path.join(blogPath, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(fileContent);

        const match = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.mdx?$/);
        const dateStr = match ? match[1] : null;
        const filenameSlug = match ? match[2] : file.replace(/\.mdx?$/, "");

        const date = data.date || dateStr || "1970-01-01";
        const slug = data.slug || filenameSlug;

        return {
          title: data.title || "Untitled",
          description: data.description || "",
          date,
          slug,
          tags: data.tags || ["Blog"],
        };
      });

      posts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      // Return only the top 3 recent posts
      return { recentPosts: posts.slice(0, 3) };
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      setGlobalData(content);
    },
  };
}
