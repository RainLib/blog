import { makeProject } from "@motion-canvas/core";

import http1_flow from "./scenes/http1_flow?scene";
import http2_flow from "./scenes/http2_flow?scene";
import quic_flow from "./scenes/quic_flow?scene";

const scenesMap = {
  http1_flow,
  http2_flow,
  quic_flow,
};

// Parse ?scene=... from the import URL
const url = new URL(import.meta.url);
const sceneName = url.searchParams.get("scene");

const selectedScenes =
  sceneName && sceneName in scenesMap
    ? [scenesMap[sceneName as keyof typeof scenesMap]]
    : [http1_flow, http2_flow, quic_flow];

export default makeProject({
  scenes: selectedScenes,
});
