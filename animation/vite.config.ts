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
        "./src/project_apollo_supergraph.ts",
        "./src/project_apollo_request.ts",
        "./src/project_apollo_deploy.ts",
        "./src/project_chunking_fixed.ts",
        "./src/project_chunking_semantic.ts",
        "./src/project_chunking_parent_child.ts",
        "./src/project_chunking_overlap.ts",
        "./src/project_chunking_semantic_detail.ts",
        "./src/project_chunking_propositional.ts",
        "./src/project_chunking_late.ts",
        "./src/project_chunking_contextual.ts",
        "./src/project_cosmo_grpc.ts",
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
