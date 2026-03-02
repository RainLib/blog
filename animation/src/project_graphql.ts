import { makeProject } from "@motion-canvas/core";
import graphql_flow from "./scenes/graphql_flow?scene";
import apollo_supergraph from "./scenes/apollo_supergraph?scene";
import apollo_request_lifecycle from "./scenes/apollo_request_lifecycle?scene";
import apollo_deployment from "./scenes/apollo_deployment?scene";

export default makeProject({
  scenes: [
    graphql_flow,
    apollo_supergraph,
    apollo_request_lifecycle,
    apollo_deployment,
  ],
});
