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
    client: "#61DAFB",
    router: "#E535AB",
    subgraph: "#38BDF8",
    data: "#10B981",
    textMain: "#F8FAF8",
    textDim: "#94A3B8",
    border: "#334155",
    highlight: "#FDE047",
    line: "#475569",
    packetInfo: "#A855F7",
    bubble: "#F59E0B",
  };

  const nodeStyle = {
    fill: "#1E293B",
    radius: 16,
    lineWidth: 3,
    shadowBlur: 20,
    shadowColor: "rgba(0,0,0,0.4)",
  };

  view.fill(colors.bg);

  // === Refs ===
  const clientRef = createRef<Rect>();
  const routerRef = createRef<Rect>();
  const subUsersRef = createRef<Rect>();
  const subOrdersRef = createRef<Rect>();
  const subProductsRef = createRef<Rect>();

  const lineCR = createRef<Line>();
  const lineRU = createRef<Line>();
  const lineRO = createRef<Line>();
  const lineRP = createRef<Line>();

  const packetIn = createRef<Circle>();
  const packetUsers = createRef<Circle>();
  const packetOrders = createRef<Circle>();
  const packetProducts = createRef<Circle>();

  const supergraphBoxRef = createRef<Rect>();

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
        fontSize={32}
        fontWeight={700}
        y={-20}
        fontFamily={"Inter, sans-serif"}
      />
      <Txt
        text={subtitle}
        fill={colors.textDim}
        fontSize={18}
        y={30}
        fontFamily={"Inter, sans-serif"}
      />
    </Rect>
  );

  const createPacket = (ref: any, pos: [number, number], color: string) => (
    <Circle
      ref={ref}
      x={pos[0]}
      y={pos[1]}
      width={24}
      height={24}
      fill={color}
      opacity={0}
      shadowBlur={15}
      shadowColor={color}
    />
  );

  // Positions
  const clientY = -350;
  const routerY = -50;
  const subXBase = 400;
  const subY = 250;

  view.add(
    <Node>
      <Txt
        text="Apollo 统一超级图 (Supergraph) 架构"
        fill={colors.textMain}
        fontSize={48}
        fontWeight={800}
        y={-480}
      />

      {/* Connection Lines */}
      <Line
        ref={lineCR}
        points={[
          [0, clientY + 70],
          [0, routerY - 80],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />
      <Line
        ref={lineRU}
        points={[
          [-80, routerY + 80],
          [-subXBase, subY - 80],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />
      <Line
        ref={lineRO}
        points={[
          [0, routerY + 80],
          [0, subY - 80],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />
      <Line
        ref={lineRP}
        points={[
          [80, routerY + 80],
          [subXBase, subY - 80],
        ]}
        stroke={colors.line}
        lineWidth={4}
        end={0}
        startArrow
        endArrow
        arrowSize={12}
      />

      {/* Logical Boundary */}
      <Rect
        ref={supergraphBoxRef}
        x={0}
        y={100}
        width={1200}
        height={500}
        stroke={colors.border}
        lineWidth={3}
        lineDash={[15, 15]}
        radius={32}
        opacity={0}
      >
        <Txt
          text="统一超级图 (Supergraph)"
          fill={colors.textDim}
          fontSize={24}
          x={-350}
          y={200}
        />
      </Rect>

      {/* Nodes */}
      {createServiceNode(
        clientRef,
        [0, clientY],
        450,
        140,
        "客户端 (Client)",
        "(只感知单一 GraphQL 端点 API)",
        colors.client,
      )}
      {createServiceNode(
        routerRef,
        [0, routerY],
        400,
        160,
        "Apollo 路由网关",
        "Rust 高性能网关节点",
        colors.router,
      )}

      {createServiceNode(
        subUsersRef,
        [-subXBase, subY],
        280,
        140,
        "用户子图阶段",
        "(Users Subgraph)",
        colors.subgraph,
      )}
      {createServiceNode(
        subOrdersRef,
        [0, subY],
        280,
        140,
        "订单子图阶段",
        "(Orders Subgraph)",
        colors.subgraph,
      )}
      {createServiceNode(
        subProductsRef,
        [subXBase, subY],
        280,
        140,
        "商品子图阶段",
        "(Products Subgraph)",
        colors.subgraph,
      )}

      {/* Packets */}
      {createPacket(packetIn, [0, clientY + 70], colors.client)}
      {createPacket(packetUsers, [-80, routerY + 80], colors.subgraph)}
      {createPacket(packetOrders, [0, routerY + 80], colors.subgraph)}
      {createPacket(packetProducts, [80, routerY + 80], colors.subgraph)}

      {/* Bubble Info */}
      <Rect
        layout
        ref={bubbleRef}
        x={350}
        y={clientY}
        fill={colors.client}
        radius={12}
        padding={16}
        opacity={0}
        scale={0.5}
        shadowBlur={20}
        shadowColor={"rgba(0,0,0,0.5)"}
      >
        <Txt
          ref={bubbleTextRef}
          text="1. 客户端发起合并查询"
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

  // 1. Show client and boundary
  yield* all(clientRef().opacity(1, 0.8), supergraphBoxRef().opacity(1, 0.8));
  yield* waitFor(0.5);

  // 2. Client sends query
  yield* showBubble("1. 发起联合查询", [350, clientY], colors.client);
  yield* waitFor(0.5);
  yield* all(
    lineCR().end(1, 1),
    packetIn().opacity(1, 0.2),
    packetIn().y(routerY - 120, 1, easeInOutCubic),
  );
  yield* hideBubble();

  // 3. Router appears
  packetIn().opacity(0);
  yield* routerRef().opacity(1, 0.6);
  yield* routerRef().scale(1.05, 0.2).to(1, 0.2);

  yield* showBubble("2. 生成查询计划并拆分", [380, routerY], colors.router);
  yield* waitFor(0.8);

  // 4. Subgraphs appear
  yield* sequence(
    0.2,
    subUsersRef().opacity(1, 0.6),
    subOrdersRef().opacity(1, 0.6),
    subProductsRef().opacity(1, 0.6),
  );
  yield* waitFor(0.2);

  // 5. Router splits query to subgraphs
  yield* all(
    lineRU().end(1, 0.8),
    lineRO().end(1, 0.8),
    lineRP().end(1, 0.8),
    packetUsers().opacity(1, 0.1),
    packetOrders().opacity(1, 0.1),
    packetProducts().opacity(1, 0.1),
    packetUsers().x(-subXBase, 0.8, easeInOutCubic),
    packetUsers().y(subY - 80, 0.8, easeInOutCubic),
    packetOrders().y(subY - 80, 0.8, easeInOutCubic),
    packetProducts().x(subXBase, 0.8, easeInOutCubic),
    packetProducts().y(subY - 80, 0.8, easeInOutCubic),
  );
  yield* hideBubble();

  yield* all(
    packetUsers().opacity(0, 0.2),
    packetOrders().opacity(0, 0.2),
    packetProducts().opacity(0, 0.2),
  );

  // 6. Subgraphs process (glow)
  yield* showBubble("3. 子图并发执行并返回", [350, subY + 90], colors.subgraph);
  yield* all(
    subUsersRef().stroke(colors.highlight, 0.4).to(colors.subgraph, 0.4),
    subOrdersRef().stroke(colors.highlight, 0.4).to(colors.subgraph, 0.4),
    subProductsRef().stroke(colors.highlight, 0.4).to(colors.subgraph, 0.4),
  );
  yield* hideBubble();

  // 7. Return to Router
  yield* all(
    packetUsers().opacity(1, 0.1),
    packetOrders().opacity(1, 0.1),
    packetProducts().opacity(1, 0.1),
    packetUsers().x(-80, 0.8, easeInOutCubic),
    packetUsers().y(routerY + 80, 0.8, easeInOutCubic),
    packetOrders().y(routerY + 80, 0.8, easeInOutCubic),
    packetProducts().x(80, 0.8, easeInOutCubic),
    packetProducts().y(routerY + 80, 0.8, easeInOutCubic),
  );

  yield* showBubble("4. 路由器合并最终结果", [380, routerY], colors.data);

  yield* all(
    packetUsers().opacity(0, 0.2),
    packetOrders().opacity(0, 0.2),
    packetProducts().opacity(0, 0.2),
  );
  yield* routerRef().stroke(colors.data, 0.4).to(colors.router, 0.4);
  yield* waitFor(0.5);
  yield* hideBubble();

  // 8. Return to Client
  packetIn().y(routerY - 120);
  packetIn().fill(colors.data);
  yield* all(
    packetIn().opacity(1, 0.2),
    packetIn().y(clientY + 70, 1, easeInOutCubic),
  );

  yield* showBubble("5. 成功响应客户端", [350, clientY], colors.client);
  yield* waitFor(1.5);

  yield* packetIn().opacity(0, 0.3);
  yield* hideBubble();

  yield* waitFor(1);
});
