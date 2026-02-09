import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "RainLib",
  tagline: "Full Stack Developer | Distributed Systems | Mobile | Web",
  favicon: "img/logo.png", // Using logo as favicon for now

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  plugins: [
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
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: false, // Disabling docs as per user request to remove unrelated content
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/RainLib/idea_visual/tree/main/",
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
        src: "img/logo.png",
      },
      items: [
        { to: "/blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/RainLib",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/RainLib",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/RainLib", // Placeholder, or remove if unknown
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} RainLib. Built with Docusaurus.`,
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

  themes: ["@docusaurus/theme-mermaid"],
  markdown: {
    mermaid: true,
  },
};

export default config;
