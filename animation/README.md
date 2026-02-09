# Animation Project

This project uses [Motion Canvas](https://motion-canvas.io/) to create programmatic animations for the RainLib blog.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
cd animation
npm install
```

## 🛠 Commands

### Development Server

Start the Motion Canvas editor to modify or preview animations:

```bash
npm start
```

This will open the editor at [http://localhost:9500](http://localhost:9500).

### Build for Production

Build the animations for embedding in the Docusaurus site:

```bash
npm run build
```

**Output**: The build artifacts are output to `../static/animation/`. This allows Docusaurus to serve them as static assets.

## 📂 Project Structure

- **`src/scenes/`**: Contains the individual animation scenes (e.g., `grpc_flow.tsx`).
- **`src/project.ts`**: The main entry point where scenes are registered.
- **`vite.config.ts`**: Configuration for the build process, including the output directory.

## 🔗 Integration with Docusaurus

The built `project.js` is embedded in blog posts using the custom `<MotionCanvasPlayer />` component.

Example usage in MDX:

```mdx
import MotionCanvasPlayer from "@site/src/components/MotionCanvasPlayer";

<MotionCanvasPlayer src="/animation/src/project.js" />
```
