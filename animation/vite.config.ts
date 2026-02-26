import { defineConfig } from "vite";
import motionCanvas from "@motion-canvas/vite-plugin";
import ffmpeg from "@motion-canvas/ffmpeg";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    motionCanvas({
      project: [
        "./src/project.ts",
        "./src/project_http1.ts",
        "./src/project_http2.ts",
        "./src/project_quic.ts",
        "./src/project_graphql.ts",
      ],
    }),
    ffmpeg(),
  ],
  base: "/animation/",
  server: {
    port: 9500,
  },
  build: {
    outDir: "../static/animation",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
