# 🌧️ RainLib - Developer Content Platform & Architecture Visualizer

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docusaurus](https://img.shields.io/badge/built%20with-Docusaurus-2e8555?logo=docusaurus&logoColor=white)](https://docusaurus.io/)
[![React](https://img.shields.io/badge/framework-React-61dafb?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[中文版本 (README_CN.md)](./README_CN.md) | [Live Demo: blog.rainlib.com](https://blog.rainlib.com/)

RainLib is an open-source, developer-focused blogging platform and digital garden system. Built on **Docusaurus 3**, it is designed for technical content, documentation, and knowledge sharing. It uniquely integrates [Motion Canvas](https://motioncanvas.io/) to render **interactive high-level system architecture animations** directly within blog posts.

---

## ✨ Features

- **🚀 Motion Canvas Integration**: Independent `/animation` workspace for creating and embedding professional system architecture animations.
- **🌍 Advanced i18n**: Built-in support for multiple languages (English and Chinese) with seamless switching.
- **🔧 Technical Writing Toolkit**:
  - **MDX Support**: Use React components directly in your Markdown.
  - **LaTeX Rendering**: High-quality math equations using `remark-math` and `rehype-katex`.
  - **Mermaid Diagrams**: Responsive flowcharts and sequence diagrams.
- **🔍 Local Search**: Fast, offline full-text search powered by `@easyops-cn/docusaurus-search-local`.
- **🎁 Recommendation System**: Custom `recommendationPlugin` for showcasing curated tools, papers, and projects.
- **🎨 Modern UI**: Styled with Tailwind CSS and a premium dark-mode-first aesthetic.

---

## 🖼️ Showcase

### 🏠 Home Page

![Home Page](./images/home.png)
_A stunning, interactive home page with dynamic backgrounds and a premium look-and-feel._

### 📝 Blog List

![Blog List](./images/blog.png)
_A structured and clean blog listing page with category filtering and featured posts._

### 🎬 Interactive Animations (Motion Canvas)

![Blog Item](./images/blog_item.png)
_Embedded Motion Canvas animations that visualize complex system architectures directly within the content._

### 🎁 Recommendation Gallery

![Recommend Page](./images/recommend.png)
_A beautifully designed gallery for showcasing curated tools, papers, and high-quality resources._

---

## 🛠️ Tech Stack

| Component     | Technology                   | Role                              |
| :------------ | :--------------------------- | :-------------------------------- |
| **Framework** | React 19 + Docusaurus 3      | SSG & Hydration                   |
| **Animation** | Motion Canvas + Vite         | Interactive SVG/Canvas Animations |
| **Styling**   | Tailwind CSS + Framer Motion | Modern UI/UX                      |
| **Languages** | TypeScript                   | Type-safe development             |

---

## 💻 Getting Started

### 1. Prerequisites

Ensure you have Node.js (>= 20.0) and a package manager installed.

### 2. Installation

We use a `Makefile` to simplify multi-workspace management:

```bash
# Install dependencies for both the main site and the animation engine
make install
```

### 3. Development

To start the development server for the blog:

```bash
# This will build animations and start the Docusaurus dev server (default: http://localhost:3000)
make start
```

To work exclusively on system animations:

```bash
# Enter the animation workspace and start the Vite renderer
cd animation && npm run start
```

---

## 🚢 Build & Build

To generate a production-ready static site:

```bash
# Build animations, then build the Docusaurus site
make build
```

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
