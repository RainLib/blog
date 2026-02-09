import { defineConfig } from "vite";
import motionCanvas from "@motion-canvas/vite-plugin";
import ffmpeg from "@motion-canvas/ffmpeg";
import { resolve } from "path";

export default defineConfig({
  plugins: [motionCanvas(), ffmpeg()],
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
