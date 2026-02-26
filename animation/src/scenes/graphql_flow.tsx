import { makeScene2D, Rect, Txt, Line, Circle, Icon } from "@motion-canvas/2d";
import {
  all,
  waitFor,
  createRef,
  chain,
  easeInOutCubic,
  sequence,
  createSignal,
} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  // === Colors & Styles ===
  const colors = {
    bg: "#0F172A",
    client: "#61DAFB",
    gateway: "#E535AB",
    auth: "#3B82F6",
    server: "#E535AB",
    policy: "#F43F5E",
    data: "#10B981",
    cache: "#F59E0B",
    grpc: "#A855F7",
    textMain: "#F8FAF8",
    textDim: "#94A3B8",
    vpcBorder: "#334155",
    line: "#475569",
    highlight: "#FDE047",
    trace: "#38BDF8",
  };

  const nodeStyle = {
    fill: "#1E293B",
    radius: 16,
    lineWidth: 3,
    shadowBlur: 20,
    shadowColor: "rgba(0,0,0,0.4)",
  };

  view.fill(colors.bg);

  // === Signals & Refs ===
  const caption = createSignal("");
  const captionOpacity = createSignal(0);

  const clientRef = createRef<Rect>();
  const apisixRef = createRef<Rect>();
  const casdoorRef = createRef<Rect>();

  const vpcRef = createRef<Rect>();
  const graphqlRef = createRef<Rect>();
  const opaRef = createRef<Rect>();
  const cacheRef = createRef<Rect>();

  const grpcARef = createRef<Rect>();
  const grpcBRef = createRef<Rect>();
  const dbRef = createRef<Rect>();

  // Line drawing refs
  const lines = {
    c_g: createRef<Line>(), // Client -> Gateway
    g_a: createRef<Line>(), // Gateway -> Auth
    g_e: createRef<Line>(), // Gateway -> Engine
    e_o: createRef<Line>(), // Engine -> OPA
    e_c: createRef<Line>(), // Engine -> Cache
    e_sa: createRef<Line>(), // Engine -> Svc A
    e_sb: createRef<Line>(), // Engine -> Svc B
    sa_d: createRef<Line>(), // Svc A -> DB
    sb_d: createRef<Line>(), // Svc B -> DB
  };

  const traceA = createRef<Circle>();
  const traceB = createRef<Circle>(); // For splitting
  const traceTextOpacity = createSignal(0);

  // Step Number References
  const stepsRefs = Array.from({ length: 8 }, () => createRef<Rect>());

  // === Helpers ===
  const createServiceNode = (
    ref: any,
    pos: [number, number],
    width: number,
    height: number,
    title: string,
    subtitle: string,
    color: string,
  ) => (
    <Rect
      ref={ref}
      x={pos[0]}
      y={pos[1]}
      width={width}
      height={height}
      fill={nodeStyle.fill}
      stroke={color}
      lineWidth={nodeStyle.lineWidth}
      radius={nodeStyle.radius}
      shadowBlur={nodeStyle.shadowBlur}
      shadowColor={nodeStyle.shadowColor}
      opacity={0}
    >
      <Txt
        text={title}
        fill={color}
        fontSize={28}
        fontWeight={700}
        y={-20}
        fontFamily={"Inter, sans-serif"}
      />
      <Txt
        text={subtitle}
        fill={colors.textDim}
        fontSize={16}
        y={25}
        fontFamily={"Inter, sans-serif"}
      />
    </Rect>
  );

  const createStepIndicator = (
    ref: any,
    pos: [number, number],
    num: string,
  ) => (
    <Rect
      ref={ref}
      x={pos[0]}
      y={pos[1]}
      width={40}
      height={40}
      radius={20}
      fill={colors.highlight}
      opacity={0}
      scale={0}
    >
      <Txt text={num} fill={colors.bg} fontSize={24} fontWeight={800} />
    </Rect>
  );

  // === Compressed Coordinates (Ensuring Database fits within 1080p canvas) ===
  const clientX = -750;
  const gatewayX = -350;
  const engineX = 50;
  const grpcX = 450;
  const dbX = 800;

  // === UI Components ===
  view.add(
    <>
      <Txt
        text="Enterprise GraphQL & Distributed gRPC Tracing"
        fill={colors.textMain}
        fontSize={46}
        fontWeight={800}
        y={-480}
      />

      {/* VPC Container */}
      <Rect
        ref={vpcRef}
        x={420}
        y={0}
        width={1050}
        height={800}
        stroke={colors.vpcBorder}
        lineWidth={3}
        lineDash={[15, 15]}
        radius={32}
        opacity={0}
      >
        <Txt
          text="Secure VPC / Trust Zone"
          fill={colors.textDim}
          fontSize={20}
          x={-400}
          y={-360}
        />
      </Rect>

      {/* Connection Lines (Bi-directional arrows) */}
      <Line
        ref={lines.c_g}
        points={[
          [clientX + 100, 0],
          [gatewayX - 100, 0],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />
      <Line
        ref={lines.g_a}
        points={[
          [gatewayX, -80],
          [gatewayX, -220],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />
      <Line
        ref={lines.g_e}
        points={[
          [gatewayX + 100, 0],
          [engineX - 130, 0],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />

      <Line
        ref={lines.e_o}
        points={[
          [engineX, -90],
          [engineX, -220],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />
      <Line
        ref={lines.e_c}
        points={[
          [engineX, 90],
          [engineX, 220],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />

      <Line
        ref={lines.e_sa}
        points={[
          [engineX + 130, -30],
          [grpcX - 120, -180],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />
      <Line
        ref={lines.e_sb}
        points={[
          [engineX + 130, 30],
          [grpcX - 120, 180],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />

      <Line
        ref={lines.sa_d}
        points={[
          [grpcX + 120, -180],
          [dbX - 100, -50],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />
      <Line
        ref={lines.sb_d}
        points={[
          [grpcX + 120, 180],
          [dbX - 100, 50],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />

      {/* Step Indicators */}
      {createStepIndicator(stepsRefs[0], [-550, -40], "1")}
      {createStepIndicator(stepsRefs[1], [-400, -150], "2")}
      {createStepIndicator(stepsRefs[2], [-140, -40], "3")}
      {createStepIndicator(stepsRefs[3], [50, -150], "4")}
      {createStepIndicator(stepsRefs[4], [50, 150], "5")}
      {createStepIndicator(stepsRefs[5], [300, -150], "6")}
      {createStepIndicator(stepsRefs[6], [680, -150], "7")}
      {createStepIndicator(stepsRefs[7], [-550, 40], "8")}

      {/* Nodes */}
      {createServiceNode(
        clientRef,
        [clientX, 0],
        200,
        140,
        "Web App",
        "Client App",
        colors.client,
      )}
      {createServiceNode(
        apisixRef,
        [gatewayX, 0],
        200,
        140,
        "APISIX",
        "Gateway",
        colors.gateway,
      )}
      {createServiceNode(
        casdoorRef,
        [gatewayX, -280],
        200,
        120,
        "Casdoor",
        "IAM Service",
        colors.auth,
      )}

      {createServiceNode(
        graphqlRef,
        [engineX, 0],
        260,
        160,
        "GQL Engine",
        "Aggregator",
        colors.server,
      )}
      {createServiceNode(
        opaRef,
        [engineX, -280],
        200,
        120,
        "OPA",
        "Policy Org",
        colors.policy,
      )}
      {createServiceNode(
        cacheRef,
        [engineX, 280],
        200,
        120,
        "Redis",
        "APQ Cache",
        colors.cache,
      )}

      {createServiceNode(
        grpcARef,
        [grpcX, -180],
        240,
        140,
        "User Svc",
        "gRPC (Go)",
        colors.grpc,
      )}
      {createServiceNode(
        grpcBRef,
        [grpcX, 180],
        240,
        140,
        "Post Svc",
        "gRPC (Node)",
        colors.grpc,
      )}

      {createServiceNode(
        dbRef,
        [dbX, 0],
        200,
        160,
        "Database",
        "Master DB",
        colors.data,
      )}

      {/* Distributed Trace Packets */}
      <Circle
        ref={traceA}
        width={26}
        height={26}
        fill={colors.trace}
        x={clientX}
        opacity={0}
        shadowBlur={15}
        shadowColor={colors.trace}
      >
        <Txt
          text="TraceID: 0x91F"
          fill="#FFF"
          fontSize={16}
          y={-40}
          opacity={traceTextOpacity}
          fontWeight={700}
        />
      </Circle>
      <Circle
        ref={traceB}
        width={26}
        height={26}
        fill={colors.trace}
        x={engineX}
        y={0}
        opacity={0}
        shadowBlur={15}
        shadowColor={colors.trace}
      />

      {/* Caption Bar */}
      <Rect
        y={450}
        width={1300}
        height={90}
        fill={"rgba(15, 23, 42, 0.95)"}
        radius={16}
        opacity={captionOpacity}
        stroke={colors.vpcBorder}
        lineWidth={2}
      >
        <Txt text={() => caption()} fill={colors.textMain} fontSize={28} />
      </Rect>
    </>,
  );

  // === Animation Sequence ===

  yield* all(
    vpcRef().opacity(1, 0.8),
    sequence(
      0.05,
      clientRef().opacity(1, 0.5),
      apisixRef().opacity(1, 0.5),
      graphqlRef().opacity(1, 0.5),
      grpcARef().opacity(1, 0.5),
      grpcBRef().opacity(1, 0.5),
      dbRef().opacity(1, 0.5),
    ),
    captionOpacity(1, 0.5),
    caption("Starting enterprise-grade GraphQL distributed flow...", 1),
  );

  // 1. Client -> Gateway
  caption(
    "1. Client initiates request with Tracing Span (Jaeger/Skywalking)",
    1,
  );
  yield* all(
    lines.c_g().end(1, 1),
    traceA().opacity(1, 0.2),
    traceTextOpacity(1, 0.2),
    traceA().x(gatewayX, 1, easeInOutCubic),
    stepsRefs[0]().opacity(1, 0.5),
    stepsRefs[0]().scale(1, 0.5),
  );

  // 2. Gateway -> Auth
  caption(
    "2. APISIX intercepts and performs mTLS Auth side-call to Casdoor",
    1,
  );
  yield* all(
    casdoorRef().opacity(1, 0.5),
    lines.g_a().end(1, 0.6),
    traceA().y(-280, 0.6, easeInOutCubic),
    stepsRefs[1]().opacity(1, 0.5),
    stepsRefs[1]().scale(1, 0.5),
  );
  yield* waitFor(0.3);
  yield* all(traceA().y(0, 0.6));

  // 3. Gateway -> Engine
  caption("3. Gateway forwards sanctioned request to GraphQL Engine", 1);
  yield* all(
    lines.g_e().end(1, 0.8),
    traceA().x(engineX, 0.8, easeInOutCubic),
    stepsRefs[2]().opacity(1, 0.5),
    stepsRefs[2]().scale(1, 0.5),
  );

  // 4. Engine -> OPA
  caption(
    "4. Engine delegates fine-grained field-level authorization to OPA",
    1,
  );
  yield* all(
    opaRef().opacity(1, 0.5),
    lines.e_o().end(1, 0.6),
    traceA().y(-280, 0.6, easeInOutCubic),
    stepsRefs[3]().opacity(1, 0.5),
    stepsRefs[3]().scale(1, 0.5),
  );
  yield* all(traceA().y(0, 0.6));

  // 5. Cache check
  caption("5. Engine checks APQ Cache in Redis for query performance", 0.8);
  yield* all(
    cacheRef().opacity(1, 0.5),
    lines.e_c().end(1, 0.5),
    traceA().y(280, 0.5, easeInOutCubic),
    stepsRefs[4]().opacity(1, 0.5),
    stepsRefs[4]().scale(1, 0.5),
  );
  yield* all(traceA().y(0, 0.5));

  // 6. TRACE SPLIT: Engine -> gRPCs
  caption(
    "6. Cache MISS. Distributed tracing splits into parallel gRPC spans",
    1.2,
  );
  yield* all(
    traceB().opacity(1, 0.1),
    lines.e_sa().end(1, 1),
    lines.e_sb().end(1, 1),
    traceA().x(grpcX, 1, easeInOutCubic),
    traceA().y(-180, 1, easeInOutCubic),
    traceB().x(grpcX, 1, easeInOutCubic),
    traceB().y(180, 1, easeInOutCubic),
    stepsRefs[5]().opacity(1, 0.5),
    stepsRefs[5]().scale(1, 0.5),
  );

  // 7. gRPC -> DB
  caption("7. gRPC services fetch relational data from master database", 1);
  yield* all(
    lines.sa_d().end(1, 0.8),
    lines.sb_d().end(1, 0.8),
    traceA().x(dbX, 0.8, easeInOutCubic),
    traceA().y(0, 0.8, easeInOutCubic),
    traceB().x(dbX, 0.8, easeInOutCubic),
    traceB().y(0, 0.8, easeInOutCubic),
    stepsRefs[6]().opacity(1, 0.5),
    stepsRefs[6]().scale(1, 0.5),
  );
  yield* dbRef().scale(1.1, 0.2).to(1, 0.2);

  // 8. Return Path (Consolidating Trace)
  caption(
    "Step 8: Spans closed. Result aggregated and returned to client.",
    1.2,
  );
  yield* all(
    traceB().opacity(0, 0.3),
    traceA().x(clientX, 2, easeInOutCubic),
    stepsRefs[7]().opacity(1, 0.5),
    stepsRefs[7]().scale(1, 0.5),
  );

  yield* all(
    traceA().opacity(0, 0.5),
    traceTextOpacity(0, 0.5),
    caption("Architecture visualizer: End-to-end trace complete.", 2),
  );
  yield* waitFor(2);
});
