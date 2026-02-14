---
title: "Framer Motion"
description: "React 生态中最受欢迎的高性能动画库，专为创意和交互而生。"
url: "https://www.framer.com/motion/"
tags: ["Development", "Animation"]
icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPznwv7OeqDgGjrlZfT28XyX4J9oJyZ9TYwg&s"
sort: 50
---

# Framer Motion：React 交互动画的艺术

> 为 React 应用提供生产级的动画能力。

Framer Motion 是 React 生态中最先进的动画库。与传统的动画库不同，它不仅关注“物体如何从 A 移动到 B”，更关注**人机交互的顺滑感**（Framer 称之为 "Motion"）。它是实现现代 Web 应用中“丝滑感”的终极工具。

---

## 核心功能深度解析

### 1. **声明式动画：Simple but Powerful**

只需将普通的 HTML 标签替换为 `motion.div` 等组件，即可通过属性驱动动画。

- **Initial, Animate, Exit**：轻松控制组件进入、呈现和离开时的状态。
- **Transition**：精细控制贝塞尔曲线、物理弹簧 (Spring) 或时间段。
- **Variants (变体)**：通过对象定义一套状态，并在子组件中自动继承，实现复杂的级联动画。

### 2. **原生手势支持 (Gestures)**

Framer Motion 让 Web 端的交互像原生 App 一样自然。

- **Hover & Tap**：通过 `whileHover` 和 `whileTap` 快速响应用户操作。
- **Drag (拖拽)**：支持约束范围、惯性滑动和弹性回弹。
- **Pan (平铺刷动)**：用于处理复杂的滑动逻辑。

### 3. **布局动画 (Layout Animations) ⭐ 杀手锏**

这是 Framer Motion 区别于其他库的核心优势。

- **一行代码解决布局切换**：只需添加 `layout` 属性，即使是子元素重新排序、父容器尺寸变化，它也会自动补间每一帧。
- **Shared Layout**：通过 `layoutId` 在两个完全不同的组件之间实现“无缝连接”的平滑过渡（例如：从列表缩略图无缝变为全屏详情页）。

### 4. **滚动联动 (Scroll Animations)**

- **useScroll**：获取全局或局部容器的滚动进度，驱动进度条或视差效果。
- **useInView**：检测元素是否进入视口，触发“懒加载”式动画。
- **WhileInView**：声明式的进入视口触发器。

---

## 使用方法：实战技巧

### 基础模式

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.5 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5, type: "spring" }}
/>
```

### 进阶优化建议

- **利用 Spring 代替 Duration**：尝试 `stiffness`, `damping` 等物理参数，能让交互更加真实且富有生命力。
- **Orchestration (编排)**：在父级使用 `variants` 并设置 `staggerChildren`，可以轻松实现子元素的交错排队进入效果。
- **AnimatePresence**：在组件被 React 卸载时保留其动画轨迹。

---

## 深度使用场景

### 场景 1: 磁吸式导航与悬停反馈

**需求**：一个极具质感的多级菜单。
**实现**：结合 `whileHover` 的缩放和 `layout` 属性的背景色跟随，打造本站顶栏那种“如影随形”的交互感。

### 场景 2: 响应式卡片流

**需求**：列表项增删或筛选时，其他项平滑移动到新位置。
**实现**：给所有卡片加上 `layout` 属性，配合 `AnimatePresence` 处理元素消失，极简代码即可实现高度复杂的流式布局过渡。

---

## 业界对比

| 特性         | Framer Motion     | GSAP (GreenSock) | React Spring | CSS Animations |
| :----------- | :---------------- | :--------------- | :----------- | :------------- |
| **易用性**   | 极高 (React 友好) | 中等 (命令式)    | 较高         | 高 (原生)      |
| **手势集成** | 原生内置          | 需配合插件       | 需配合库     | 无             |
| **布局映射** | 自动处理          | 通过 FLIP 实现   | 需手动计算   | 极其困难       |
| **性能**     | 优秀 (GPU)        | 顶级             | 优秀         | 视场景而定     |

---

## 总结与建议

**推荐指数**：⭐⭐⭐⭐⭐ (如果你用 React)

**Framer Motion 适合谁？**

- 想要提升产品**品质感**的前端开发者。
- 需要实现**复杂拖拽交互**或**列表布局动画**的项目。
- 设计驱动型 (Design-led) 的公司和个人站点。

**注意事项**：

- 包体积相对 CSS 大一些（建议在大型项目中使用 `m` 组件减小体积）。
- 过度动画会导致认知负担，建议遵循“微交互”原则。

**总结**：它是 React 开发者的动画“银弹”。如果你想要让你的网页看起来“不仅能用，而且好用”，它是必学之作。
