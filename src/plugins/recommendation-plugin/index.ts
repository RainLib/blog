import path from "path";
import fs from "fs";
import { LoadContext, Plugin } from "@docusaurus/types";
import { Joi } from "@docusaurus/utils-validation";
import { normalizeUrl } from "@docusaurus/utils";
import matter from "gray-matter";
import yaml from "js-yaml";

// Define the shape of our data
export interface Recommendation {
  title: string;
  description: string;
  url: string;
  tags?: string[];
  icon?: string;
  sort?: number;
  slug?: string;
  filePath?: string;
  date?: string;
  excerpt?: string;
}

export interface Tag {
  label: string;
  color: string;
  description?: string;
}

export interface PluginData {
  recommendations: Recommendation[];
  tags: Record<string, Tag>;
}

// Define specific options if needed (none for now)
export interface PluginOptions {}

export default function recommendationPlugin(
  context: LoadContext,
  options: PluginOptions,
): Plugin<PluginData> {
  const { siteDir, baseUrl } = context;
  const contentPath = path.resolve(siteDir, "recommend");
  const tagsPath = path.resolve(siteDir, "recommend/tags.yml");

  return {
    name: "recommendation-plugin",

    async loadContent() {
      // Load Recommendations
      let recommendations: Recommendation[] = [];
      if (fs.existsSync(contentPath)) {
        const files = fs
          .readdirSync(contentPath)
          .filter((file) => file.endsWith(".md"));

        recommendations = files.map((file) => {
          const filePath = path.join(contentPath, file);
          const fileContent = fs.readFileSync(filePath, "utf-8");
          const { data, content } = matter(fileContent);

          const filenameMatch = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
          const filenameDate = filenameMatch ? filenameMatch[1] : null;
          const filenameSlug = filenameMatch ? filenameMatch[2] : null;

          const date =
            data.date || filenameDate || new Date().toISOString().split("T")[0];
          const slug =
            data.slug ||
            filenameSlug ||
            data.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");
          const excerpt =
            data.excerpt || content.slice(0, 150).replace(/\n/g, " ") + "...";

          return {
            ...(data as Omit<
              Recommendation,
              "filePath" | "slug" | "date" | "excerpt"
            >),
            filePath,
            slug,
            date,
            excerpt,
          };
        });

        recommendations.sort((a, b) => {
          return (
            new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
          );
        });
      }

      // Load Tags
      let tags: Record<string, Tag> = {};
      if (fs.existsSync(tagsPath)) {
        try {
          const tagsContent = fs.readFileSync(tagsPath, "utf-8");
          tags = yaml.load(tagsContent) as Record<string, Tag>;
        } catch (e) {
          console.error("Failed to load tags.yml", e);
        }
      }

      return { recommendations, tags };
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData, addRoute, createData } = actions;
      const { recommendations, tags } = content;

      setGlobalData({ recommendations, tags });

      await Promise.all(
        recommendations.map(async (item) => {
          const metadataPath = await createData(
            `${item.slug}.json`,
            JSON.stringify(item),
          );

          addRoute({
            path: normalizeUrl([baseUrl, "recommend", item.slug]),
            component: "@site/src/templates/RecommendationDetail.tsx",
            modules: {
              content: item.filePath,
              metadata: metadataPath,
            },
            exact: true,
          });
        }),
      );
    },
  };
}

// Validation schema for the plugin options (if any)
export function validateOptions({ options, validate }) {
  const schema = Joi.object({});
  return validate(schema, options);
}
