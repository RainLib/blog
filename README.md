# 🌧️ RainLib - Developer Tech Blog & Architecture Visualizer

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docusaurus](https://img.shields.io/badge/built%20with-Docusaurus-2e8555?logo=docusaurus&logoColor=white)
![React](https://img.shields.io/badge/framework-React-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6?logo=typescript&logoColor=white)

RainLib 是一套为高级全栈开发者、架构师和技术布道者打造的现代化数字花园系统。基于最新的 **Docusaurus 4** 架构深度定制，我们不仅提供极致的阅读体验与多语言支持，更是全球少数几家深度集成 [Motion Canvas](https://motioncanvas.io/) 以在博客文章内部直接原生地渲染**可交互的高级系统架构动态数据流**的技术博客站点。

---

## ✨ 核心特性 / Core Features

### 🚀 **Motion Canvas 架构图动态渲染引擎**

传统的架构组件往往使用静态的图片，我们在根目录下独立集成了 `/animation` 工程体系。配合 Webpack 和 Vite 的双核构建引擎，你可以直接在博客 (`.mdx` 文件) 中利用 `<MotionCanvasPlayer />` 引入流畅、硬核的动画。

- **现成案例**：集成了复杂的 GraphQL APISIX Gateway -> OPA -> DataLoader 的数据流可视化动画。

### 🌍 **深度定制的国际化与多语言 (i18n)**

支持 `zh-CN` (默认) 和 `en` 双语无缝切换引擎。对于技术名词保留原义的同时，框架会利用 Locale Dropdown 在右上角实时切换完整的知识体系流。

### 🔧 **学术与极客的原生语法树拓展**

- **Markdown & MDX**: 完美融入 React 组件体系，在文本中穿插图表与交互逻辑。
- **公式引擎**: 底层集成 `remark-math` 和 `rehype-katex`，对于微积分、复杂分布式哈希算法均能达到论文级别的 LaTeX 渲染。
- **Mermaid & Diagram**: 支持多套黑暗/明亮模式自适应的类图与甘特图。

### 🔍 **极速冷启动的本地全文检索**

废弃了对外部如 Algolia 的强依赖，采用了本地哈希计算的 `@easyops-cn/docusaurus-search-local`。纯离线即可在几十毫秒内索引中英文全双工文档。

### 🎁 **定制化 Recommend 推荐体系**

除了基础博客，工程内部实现了独有的 `recommendationPlugin`，将高质量的开源项目、论文、工具提炼为组件化卡片视图。

---

## 🛠️ 技术栈 / Tech Stack

| Component    | Technology                                 | Description                            |
| ------------ | ------------------------------------------ | -------------------------------------- |
| **框架核心** | React 18 + Docusaurus 4 (Future Flag)      | 提供静态渲染和水合 (Hydration) 能力    |
| **动画引擎** | Motion Canvas + Vite + FFmpeg              | 矢量级流畅系统架构动画的构建与播放底座 |
| **样式系统** | Tailwind CSS + Infima (Docusaurus Default) | 兼顾现代化原子类及文档专属排版         |
| **语言**     | TypeScript                                 | 全栈强类型校验                         |
| **部署**     | Vercel / GitHub Pages                      | 开箱即用，通过 `yarn deploy` 自动发版  |

---

## 💻 快速开始 / Getting Started

### 1. 环境准备

确保本机已安装 Node.js (>= 18) 与 Yarn：

```bash
node -v
yarn -v
```

### 2. 依赖安装

系统被巧妙地划分为主线文档域和动画独立编译域，需要分别安装各自的依赖：

```bash
# 1. 安装主站点依赖
yarn install

# 2. 安装动画引擎底层依赖
cd animation && yarn install && cd ..
```

### 3. 本地开发调试

启动带热更新 (HMR) 的全栈文档开发服务：

```bash
# 会启动本地服务器，默认 http://localhost:3000
yarn start
```

如果你需要创作新的架构动态流（Motion Canvas）：

```bash
# 进入动画工程启动独立的 Vite Renderer 可视化编辑器
cd animation
yarn start
```

---

## 🚢 生产构建与部署 / Build & Deploy

构建全站静态 HTML 以及打包后的 Motion Canvas js/wasm 代码到 `build` 文件夹。

```bash
# 1. 首先构建所有架构动画代码，其产物会推送到 /static/animation 下
cd animation && yarn build && cd ..

# 2. 编译主文档站 (包含检索 Index 等分析逻辑)
yarn build
```

你可以使用任意标准的静态服务进行测试：

```bash
yarn serve
```

或者一键部署到 GitHub Pages (如果你具备对应权限)：

```bash
USE_SSH=true yarn deploy
# 若未配置 SSH
GIT_USER=<Your GitHub username> yarn deploy
```

---

## 📜 开源协议 / License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
