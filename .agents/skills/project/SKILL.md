---
name: project
description: Core guide for the RainLib/blog project (idea_visual), documenting the Docusaurus setup, recommendation plugin architecture, and Motion.dev aesthetic patterns.
version: 1.0.0
author: Antigravity
tags:
  [
    Docusaurus,
    React,
    Tailwind,
    Framer Motion,
    Recommendation System,
    TypeScript,
  ]
---

# RainLib/blog (idea_visual) - Project Guide

This skill documents the architecture, workflows, and design patterns for the RainLib/blog project.

## Project Overview

**RainLib/blog** is a modern documentation and blog site built with Docusaurus, featuring a custom recommendation system and programmatic animations.

### Tech Stack

- **Core**: Docusaurus 3.9.2 (React-based)
- **Styling**: Tailwind CSS (Dev/Utility), Vanilla CSS (Theme)
- **Animations**: Framer Motion (UI interactions), Motion Canvas (Programmatic video)
- **Data**: Content-driven via Markdown and YAML
- **Automation**: Makefile for common tasks

## Core Directory Structure

- `/recommend/`: Recommendation content and metadata.
  - `YYYY-MM-DD-slug.md`: Recommendation entries.
  - `tags.yml`: Centralized tag metadata (label, color).
- `/src/plugins/recommendation-plugin/`: Local plugin for processing recommendations.
- `/src/components/Recommendation/`: UI components for the recommendation page.
- `/src/templates/`: Page templates (e.g., `RecommendationDetail.tsx`).
- `/.agents/skills/`: Custom agent skills for this project.

## Recommendation System Architecture

The recommendation system is powered by a local Docusaurus plugin.

### 1. Data Processing (`recommendation-plugin`)

- Scans `/recommend/` for `.md` files.
- Extracts filename-based dates and slugs.
- Parses `tags.yml` for unified tag styling.
- Generates global data for use in React components.
- Creates dynamic routes for each recommendation entry.

### 2. UI Patterns

- **Motion.dev Aesthetic**: Uses glassmorphism (backdrop-blur), gradient borders, and staggered animations.
- **Stretched Link**: Cards are fully clickable to detail pages using the `after:absolute after:inset-0` technique.
- **Internationalization**: All text strings are wrapped in `<Translate>` or `translate()` from `@docusaurus/Translate`.
- **Motion Canvas Embedded Animations**: When inserting Motion Canvas animations into MDX files, _never_ use `<iframe>`. Use the dedicated React component standard as follows:
  ```tsx
  <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
    <MotionCanvasPlayer src="/animation/src/project_name.js" auto={true} />
  </div>
  ```
  Ensure all target animation entrypoints (`project_name.ts`) are registered manually within `/animation/vite.config.ts`.

## Development Workflows

### Running Locally

```bash
make start
# or
npm run start
```

### Building for Production

```bash
npm run build
```

### Adding a Recommendation

1.  Create a file in `/recommend/` satisfying `YYYY-MM-DD-slug.md`.
2.  Add required frontmatter:
    ```markdown
    ---
    title: "Tool Name"
    description: "Brief summary"
    url: "https://example.com"
    tags: ["tag1", "tag2"]
    icon: "🚀"
    ---
    ```
3.  Ensure tags are defined in `recommend/tags.yml` to have colors/labels.

## Best Practices

1.  **Prefer Description**: Use the `description` field in frontmatter for card summaries; fallback to `excerpt` only if description is missing.
2.  **Stretched Links**: When making cards clickable, wrap the primary action in a link with `after:absolute after:inset-0` and set nested links to `z-10 relative`.
3.  **Tag Consistency**: Always define new tags in `tags.yml` before usage to maintain brand colors.
4.  **I18n First**: Never use hardcoded strings; always use Docusaurus `Translate` components.
