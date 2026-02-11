import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import recommendationPlugin from "./src/plugins/recommendation-plugin";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "RainLib",
  tagline: "Full Stack Developer | Distributed Systems | Mobile | Web",
  favicon: "img/logo.ico", // Using logo as favicon for now

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  plugins: [
    [
      recommendationPlugin,
      {
        // Plugin options here
      },
    ],
    function (context, options) {
      return {
        name: "custom-webpack-plugin",
        configureWebpack(config, isServer) {
          return {
            resolve: {
              alias: {
                "@motion-canvas/core": require.resolve("@motion-canvas/core"),
              },
            },
          };
        },
      };
    },
  ],

  // Set the production url of your site here
  url: "https://rainlib.vercel.app", // Update this if you have a custom domain
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "RainLib", // Usually your GitHub org/user name.
  projectName: "idea_visual", // Usually your repo name.

  onBrokenLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "zh-CN",
    locales: ["zh-CN", "en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/RainLib/blog/tree/main/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/hero.png",
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: "RainLib",
      logo: {
        alt: "RainLib Logo",
        src: "img/logo.svg",
        srcDark: "img/logo.svg", // Ensure logo is visible in dark mode
        className: "custom-navbar-logo-class", // Add class for custom styling
      },
      hideOnScroll: true,
      items: [
        { to: "/blog", label: "Blog", position: "left" },
        { to: "/recommend", label: "Recommend", position: "left" },
        {
          href: "https://github.com/RainLib",
          label: "GitHub",
          position: "right",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Explore",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/RainLib",
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} RainLib. Built for the Future.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        "java",
        "protobuf",
        "go",
        "python",
        "typescript",
        "bash",
        "yaml",
      ],
    },
  } satisfies Preset.ThemeConfig,

  themes: [
    "@docusaurus/theme-mermaid",
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      {
        hashed: true,
        indexBlog: true,
        indexDocs: false, // Docs are disabled
        language: ["en"],
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],
  markdown: {
    mermaid: true,
  },
};

export default config;
