import { makeProject } from "@motion-canvas/core";

import http1_flow from "./scenes/http1_flow?scene";
import http2_flow from "./scenes/http2_flow?scene";
import quic_flow from "./scenes/quic_flow?scene";

export default makeProject({
  scenes: [http1_flow, http2_flow, quic_flow],
});
