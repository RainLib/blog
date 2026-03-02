import { makeScene2D, Rect, Txt, Line, Circle, Node } from "@motion-canvas/2d";
import {
  all,
  waitFor,
  createRef,
  easeInOutCubic,
  sequence,
} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  // === Colors & Styles ===
  const colors = {
    bg: "#0F172A",
    internet: "#F8FAF8",
    apisix: "#E535AB",
    router: "#A855F7",
    subgraph: "#38BDF8",
    db: "#10B981",
    textMain: "#F8FAF8",
    textDim: "#94A3B8",
    border: "#334155",
    highlight: "#FDE047",
    line: "#475569",
    packetInfo: "#FDE047",
    bubble: "#F59E0B",
  };

  const nodeStyle = {
    fill: "#1E293B",
    radius: 12,
    lineWidth: 3,
    shadowBlur: 15,
    shadowColor: "rgba(0,0,0,0.4)",
  };

  view.fill(colors.bg);

  // === Refs ===
  const apisixRef = createRef<Rect>();
  const routerRef = createRef<Rect>();

  const subUsersRef = createRef<Rect>();
  const subOrdersRef = createRef<Rect>();
  const subProductsRef = createRef<Rect>();

  const dbUsersRef = createRef<Rect>();
  const dbOrdersRef = createRef<Rect>();
  const dbProductsRef = createRef<Rect>();

  const lineIA = createRef<Line>();
  const lineAR = createRef<Line>();

  const lineR_SU = createRef<Line>();
  const lineR_SO = createRef<Line>();
  const lineR_SP = createRef<Line>();

  const lineSU_DU = createRef<Line>();
  const lineSO_DO = createRef<Line>();
  const lineSP_DP = createRef<Line>();

  const tracePacket = createRef<Circle>();
  const tracePacket2 = createRef<Circle>();

  const bubbleRef = createRef<Rect>();
  const bubbleTextRef = createRef<Txt>();

  // === UI Components ===
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
        y={-15}
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

  const createDBNode = (ref: any, pos: [number, number], title: string) => (
    <Rect
      ref={ref}
      x={pos[0]}
      y={pos[1]}
      width={200}
      height={80}
      fill={nodeStyle.fill}
      stroke={colors.db}
      lineWidth={nodeStyle.lineWidth}
      radius={nodeStyle.radius}
      opacity={0}
    >
      <Txt text={title} fill={colors.db} fontSize={24} fontWeight={700} />
    </Rect>
  );

  // Positions
  const startY = -400;
  const apisixY = -240;
  const routerY = -60;
  const subY = 140;
  const dbY = 320;

  const subXBase = 320;

  view.add(
    <Node>
      <Txt
        text="推荐生产部署拓扑：APISIX + Apollo Router"
        fill={colors.textMain}
        fontSize={44}
        fontWeight={800}
        y={-500}
      />
      <Txt
        text="公网 (Internet)"
        fill={colors.internet}
        fontSize={32}
        fontWeight={700}
        y={startY}
      />

      {/* Connection Lines */}
      <Line
        ref={lineIA}
        points={[
          [0, startY + 30],
          [0, apisixY - 60],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />
      <Line
        ref={lineAR}
        points={[
          [0, apisixY + 60],
          [0, routerY - 60],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />

      <Line
        ref={lineR_SU}
        points={[
          [-60, routerY + 60],
          [-subXBase, subY - 60],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />
      <Line
        ref={lineR_SO}
        points={[
          [0, routerY + 60],
          [0, subY - 60],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />
      <Line
        ref={lineR_SP}
        points={[
          [60, routerY + 60],
          [subXBase, subY - 60],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />

      <Line
        ref={lineSU_DU}
        points={[
          [-subXBase, subY + 60],
          [-subXBase, dbY - 40],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />
      <Line
        ref={lineSO_DO}
        points={[
          [0, subY + 60],
          [0, dbY - 40],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />
      <Line
        ref={lineSP_DP}
        points={[
          [subXBase, subY + 60],
          [subXBase, dbY - 40],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />

      {/* Nodes */}
      {createServiceNode(
        apisixRef,
        [0, apisixY],
        500,
        120,
        "APISIX 网关",
        "(SSL卸载 / IP 黑白名单 / 全局限流)",
        colors.apisix,
      )}
      {createServiceNode(
        routerRef,
        [0, routerY],
        500,
        120,
        "Apollo 路由中心",
        "(查询计划 / 联邦架构分发 / 深度限制)",
        colors.router,
      )}

      {createServiceNode(
        subUsersRef,
        [-subXBase, subY],
        240,
        120,
        "用户子图阶段",
        "Rust (async-graphql)",
        colors.subgraph,
      )}
      {createServiceNode(
        subOrdersRef,
        [0, subY],
        240,
        120,
        "订单子图阶段",
        "Java (graphql-java)",
        colors.subgraph,
      )}
      {createServiceNode(
        subProductsRef,
        [subXBase, subY],
        240,
        120,
        "商品子图阶段",
        "Go (gqlgen)",
        colors.subgraph,
      )}

      {createDBNode(dbUsersRef, [-subXBase, dbY], "用户库 (Users DB)")}
      {createDBNode(dbOrdersRef, [0, dbY], "订单库 (Orders DB)")}
      {createDBNode(dbProductsRef, [subXBase, dbY], "商品库 (Products DB)")}

      {/* Tracing Packets */}
      <Circle
        ref={tracePacket}
        width={18}
        height={18}
        fill={colors.packetInfo}
        opacity={0}
        shadowBlur={15}
        shadowColor={colors.packetInfo}
        x={0}
        y={startY}
      />
      <Circle
        ref={tracePacket2}
        width={18}
        height={18}
        fill={colors.packetInfo}
        opacity={0}
        shadowBlur={15}
        shadowColor={colors.packetInfo}
        x={0}
        y={routerY}
      />

      {/* Bubble Info */}
      <Rect
        layout
        ref={bubbleRef}
        x={-400}
        y={startY}
        fill={colors.packetInfo}
        radius={12}
        padding={16}
        opacity={0}
        scale={0.5}
        shadowBlur={20}
        shadowColor={"rgba(0,0,0,0.5)"}
      >
        <Txt
          ref={bubbleTextRef}
          text="气泡提示"
          fill={"#0F172A"}
          fontSize={24}
          fontWeight={700}
          fontFamily={"Inter, sans-serif"}
        />
      </Rect>
    </Node>,
  );

  // === Animation Sequence Setup ===
  function* showBubble(
    text: string,
    pos: [number, number],
    color: string,
    duration: number = 0.4,
  ) {
    bubbleRef().x(pos[0]);
    bubbleRef().y(pos[1]);
    bubbleTextRef().text(text);
    bubbleRef().fill(color);
    yield* all(
      bubbleRef().opacity(1, duration, easeInOutCubic),
      bubbleRef().scale(1, duration, easeInOutCubic),
    );
  }

  function* hideBubble(duration: number = 0.3) {
    yield* all(
      bubbleRef().opacity(0, duration, easeInOutCubic),
      bubbleRef().scale(0.5, duration, easeInOutCubic),
    );
  }

  // 1. Reveal Architecture Top to Bottom
  yield* sequence(
    0.2,
    apisixRef().opacity(1, 0.5),
    lineIA().end(1, 0.5),
    routerRef().opacity(1, 0.5),
    lineAR().end(1, 0.5),
    all(
      subUsersRef().opacity(1, 0.5),
      subOrdersRef().opacity(1, 0.5),
      subProductsRef().opacity(1, 0.5),
    ),
    all(lineR_SU().end(1, 0.5), lineR_SO().end(1, 0.5), lineR_SP().end(1, 0.5)),
    all(
      dbUsersRef().opacity(1, 0.5),
      dbOrdersRef().opacity(1, 0.5),
      dbProductsRef().opacity(1, 0.5),
    ),
    all(
      lineSU_DU().end(1, 0.5),
      lineSO_DO().end(1, 0.5),
      lineSP_DP().end(1, 0.5),
    ),
  );

  yield* waitFor(0.5);

  // 2. Request Trace Flow
  yield* tracePacket().opacity(1, 0.2);

  // Internet -> APISIX
  yield* showBubble(
    "阶段1: 流量进入 APISIX 网关验证",
    [-350, apisixY],
    colors.apisix,
  );
  yield* tracePacket().y(apisixY - 60, 0.6, easeInOutCubic);
  yield* apisixRef().stroke(colors.packetInfo, 0.2).to(colors.apisix, 0.2);
  yield* tracePacket().y(apisixY + 60, 0.3, easeInOutCubic);
  yield* hideBubble();

  // APISIX -> Router
  yield* showBubble(
    "阶段2: 代理至后台 Apollo GraphQL",
    [-350, routerY],
    colors.router,
  );
  yield* tracePacket().y(routerY - 60, 0.6, easeInOutCubic);
  yield* routerRef().stroke(colors.packetInfo, 0.2).to(colors.router, 0.2);
  yield* tracePacket().y(routerY + 60, 0.3, easeInOutCubic);
  yield* hideBubble();

  // Split Trace -> Subgraphs
  yield* showBubble(
    "阶段3: 切片并路由至下属子图",
    [-350, subY],
    colors.subgraph,
  );
  yield* all(
    tracePacket2().opacity(1, 0),
    tracePacket().x(-subXBase, 0.8, easeInOutCubic),
    tracePacket().y(subY - 60, 0.8, easeInOutCubic),
    tracePacket2().x(0, 0.8, easeInOutCubic),
    tracePacket2().y(subY - 60, 0.8, easeInOutCubic),
  );

  yield* all(
    subUsersRef().stroke(colors.packetInfo, 0.2).to(colors.subgraph, 0.2),
    subOrdersRef().stroke(colors.packetInfo, 0.2).to(colors.subgraph, 0.2),
  );

  yield* all(
    tracePacket().y(subY + 60, 0.3, easeInOutCubic),
    tracePacket2().y(subY + 60, 0.3, easeInOutCubic),
  );
  yield* hideBubble();

  // Subgraphs -> DB
  yield* showBubble("阶段4: 子图查询各自独立的数据库", [-350, dbY], colors.db);
  yield* all(
    tracePacket().y(dbY - 40, 0.6, easeInOutCubic),
    tracePacket2().y(dbY - 40, 0.6, easeInOutCubic),
  );

  yield* all(
    dbUsersRef().stroke(colors.packetInfo, 0.2).to(colors.db, 0.2),
    dbOrdersRef().stroke(colors.packetInfo, 0.2).to(colors.db, 0.2),
  );

  yield* all(
    dbUsersRef().scale(1.1, 0.2).to(1, 0.2),
    dbOrdersRef().scale(1.1, 0.2).to(1, 0.2),
  );
  yield* hideBubble();

  // Return Path
  yield* all(
    tracePacket().y(subY + 60, 0.6, easeInOutCubic),
    tracePacket2().y(subY + 60, 0.6, easeInOutCubic),
  );

  yield* all(
    tracePacket().y(subY - 60, 0.3, easeInOutCubic),
    tracePacket2().y(subY - 60, 0.3, easeInOutCubic),
  );

  // Merge at Router
  yield* showBubble(
    "阶段5: 路由合并返回数据给原路",
    [-350, routerY],
    colors.router,
  );
  yield* all(
    tracePacket().x(-60, 0.8, easeInOutCubic),
    tracePacket().y(routerY + 60, 0.8, easeInOutCubic),
    tracePacket2().x(0, 0.8, easeInOutCubic),
    tracePacket2().y(routerY + 60, 0.8, easeInOutCubic),
  );

  yield* tracePacket2().opacity(0, 0.2);

  // Return to Client
  yield* tracePacket().x(0, 0.2, easeInOutCubic);
  yield* tracePacket().y(routerY - 60, 0.3, easeInOutCubic);
  yield* hideBubble();

  yield* showBubble(
    "阶段6: 通过网关将 JSON 返回给客户端",
    [-350, apisixY],
    colors.apisix,
  );
  yield* tracePacket().y(apisixY + 60, 0.6, easeInOutCubic);
  yield* tracePacket().y(apisixY - 60, 0.3, easeInOutCubic);
  yield* tracePacket().y(startY + 30, 0.6, easeInOutCubic);

  yield* tracePacket().opacity(0, 0.3);
  yield* hideBubble();

  yield* waitFor(1.5);
});
