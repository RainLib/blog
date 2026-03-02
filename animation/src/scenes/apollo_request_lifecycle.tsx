import {
  makeScene2D,
  Rect,
  Txt,
  Line,
  Circle,
  Node,
  Layout,
} from "@motion-canvas/2d";
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
    routerReq: "#E535AB",
    supergraphReq: "#A855F7",
    executionReq: "#F43F5E",
    subgraphReq: "#38BDF8",
    textMain: "#F8FAF8",
    textDim: "#94A3B8",
    border: "#475569",
    packet: "#FDE047",
    bubble: "#F59E0B",
    success: "#10B981",
  };

  view.fill(colors.bg);

  // === Refs ===
  const routerRef = createRef<Rect>();
  const supergraphRef = createRef<Rect>();
  const executionRef = createRef<Rect>();
  const subServicesRef = createRef<Rect>();

  const packetRef = createRef<Rect>();
  const packetTextRef = createRef<Txt>();

  const subPacket1 = createRef<Circle>();
  const subPacket2 = createRef<Circle>();
  const subPacket3 = createRef<Circle>();

  const l1 = createRef<Line>();
  const l2 = createRef<Line>();
  const l3 = createRef<Line>();
  const lf1 = createRef<Line>();
  const lf2 = createRef<Line>();
  const lf3 = createRef<Line>();

  const bubbleRef = createRef<Rect>();
  const bubbleTextRef = createRef<Txt>();

  // === Factory ===
  const createLayer = (
    ref: any,
    yPos: number,
    title: string,
    desc: string,
    color: string,
  ) => (
    <Rect
      ref={ref}
      x={0}
      y={yPos}
      width={700}
      height={120}
      fill={"#1E293B"}
      stroke={color}
      lineWidth={3}
      radius={16}
      shadowBlur={20}
      shadowColor={"rgba(0,0,0,0.3)"}
      opacity={0}
    >
      <Txt
        text={title}
        fill={color}
        fontSize={36}
        fontWeight={700}
        y={-15}
        fontFamily={"Inter, sans-serif"}
      />
      <Txt
        text={desc}
        fill={colors.textDim}
        fontSize={20}
        y={30}
        fontFamily={"Inter, sans-serif"}
      />
    </Rect>
  );

  const startY = -350;
  const gap = 180;

  view.add(
    <Node>
      <Txt
        text="Apollo Router 四层请求生命周期"
        fill={colors.textMain}
        fontSize={48}
        fontWeight={800}
        y={-480}
      />

      {/* Layers */}
      {createLayer(
        routerRef,
        startY,
        "1. 路由服务 (Router Service)",
        "处理 APQ、JSON解析、Schema校验验证",
        colors.routerReq,
      )}
      {createLayer(
        supergraphRef,
        startY + gap,
        "2. 超级图服务 (Supergraph Service)",
        "计算生成最优 Query Plan (查询计划)",
        colors.supergraphReq,
      )}
      {createLayer(
        executionRef,
        startY + gap * 2,
        "3. 执行服务 (Execution Service)",
        "严格按照计划进行串并行调度与数据组合",
        colors.executionReq,
      )}
      {createLayer(
        subServicesRef,
        startY + gap * 3,
        "4. 子图服务 (Subgraph Service)",
        "通过 HTTP/REST 实际触发数据获取",
        colors.subgraphReq,
      )}

      {/* Connection Lines */}
      <Line
        ref={l1}
        points={[
          [0, startY + 60],
          [0, startY + gap - 60],
        ]}
        stroke={colors.border}
        lineWidth={4}
        end={0}
        endArrow
        arrowSize={12}
      />
      <Line
        ref={l2}
        points={[
          [0, startY + gap + 60],
          [0, startY + gap * 2 - 60],
        ]}
        stroke={colors.border}
        lineWidth={4}
        end={0}
        endArrow
        arrowSize={12}
      />
      <Line
        ref={l3}
        points={[
          [0, startY + gap * 2 + 60],
          [0, startY + gap * 3 - 60],
        ]}
        stroke={colors.border}
        lineWidth={4}
        end={0}
        endArrow
        arrowSize={12}
      />

      {/* Fork Lines at Bottom */}
      <Line
        ref={lf1}
        points={[
          [-60, startY + gap * 3 + 60],
          [-250, startY + gap * 3 + 140],
        ]}
        stroke={colors.border}
        lineWidth={4}
        end={0}
        endArrow
        arrowSize={12}
      />
      <Line
        ref={lf2}
        points={[
          [0, startY + gap * 3 + 60],
          [0, startY + gap * 3 + 140],
        ]}
        stroke={colors.border}
        lineWidth={4}
        end={0}
        endArrow
        arrowSize={12}
      />
      <Line
        ref={lf3}
        points={[
          [60, startY + gap * 3 + 60],
          [250, startY + gap * 3 + 140],
        ]}
        stroke={colors.border}
        lineWidth={4}
        end={0}
        endArrow
        arrowSize={12}
      />

      {/* Subgraph Nodes */}
      <Rect
        x={-250}
        y={startY + gap * 3 + 180}
        width={180}
        height={60}
        fill="#0F172A"
        stroke={colors.subgraphReq}
        lineWidth={2}
        radius={8}
      >
        <Txt text="用户服务" fill={colors.textMain} fontSize={24} />
      </Rect>
      <Rect
        x={0}
        y={startY + gap * 3 + 180}
        width={180}
        height={60}
        fill="#0F172A"
        stroke={colors.subgraphReq}
        lineWidth={2}
        radius={8}
      >
        <Txt text="订单服务" fill={colors.textMain} fontSize={24} />
      </Rect>
      <Rect
        x={250}
        y={startY + gap * 3 + 180}
        width={180}
        height={60}
        fill="#0F172A"
        stroke={colors.subgraphReq}
        lineWidth={2}
        radius={8}
      >
        <Txt text="商品服务" fill={colors.textMain} fontSize={24} />
      </Rect>

      {/* Floating Payload Box */}
      <Rect
        ref={packetRef}
        x={350 + 170} // Off to the right side
        y={startY}
        width={340}
        height={80}
        fill={"rgba(15,23,42,0.9)"}
        stroke={colors.routerReq}
        lineWidth={3}
        radius={12}
        opacity={0}
      >
        <Txt
          ref={packetTextRef}
          text="外部 HTTP 请求 ->"
          fill={colors.routerReq}
          fontSize={25}
          fontWeight={700}
        />
      </Rect>

      {/* Splitting Packets */}
      <Circle
        ref={subPacket1}
        width={24}
        height={24}
        fill={colors.packet}
        x={-60}
        y={startY + gap * 3 + 60}
        opacity={0}
        shadowBlur={15}
        shadowColor={colors.packet}
      />
      <Circle
        ref={subPacket2}
        width={24}
        height={24}
        fill={colors.packet}
        x={0}
        y={startY + gap * 3 + 60}
        opacity={0}
        shadowBlur={15}
        shadowColor={colors.packet}
      />
      <Circle
        ref={subPacket3}
        width={24}
        height={24}
        fill={colors.packet}
        x={60}
        y={startY + gap * 3 + 60}
        opacity={0}
        shadowBlur={15}
        shadowColor={colors.packet}
      />

      {/* Bubble Info */}
      <Rect
        layout
        ref={bubbleRef}
        x={-400}
        y={startY}
        fill={colors.packet}
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

  // Fade in all layers
  yield* sequence(
    0.2,
    routerRef().opacity(1, 0.5),
    l1().end(1, 0.4),
    supergraphRef().opacity(1, 0.5),
    l2().end(1, 0.4),
    executionRef().opacity(1, 0.5),
    l3().end(1, 0.4),
    subServicesRef().opacity(1, 0.5),
    all(lf1().end(1, 0.4), lf2().end(1, 0.4), lf3().end(1, 0.4)),
  );
  yield* waitFor(0.5);

  // Payload at Router
  yield* showBubble("阶段1: 接收请求并解析", [-400, startY], colors.routerReq);
  yield* all(
    packetRef().opacity(1, 0.5),
    routerRef().stroke(colors.packet, 0.3).to(colors.routerReq, 0.3),
  );
  yield* waitFor(0.5);
  yield* hideBubble();

  // Down to Supergraph
  yield* all(
    packetRef().y(startY + gap, 1, easeInOutCubic),
    packetRef().stroke(colors.supergraphReq, 1),
  );
  packetTextRef().text("[ 封装 RouterRequest ]");
  packetTextRef().fill(colors.supergraphReq);
  yield* supergraphRef()
    .stroke(colors.packet, 0.3)
    .to(colors.supergraphReq, 0.3);
  yield* showBubble(
    "阶段2: 规划最佳数据抓取路径",
    [-420, startY + gap],
    colors.supergraphReq,
  );
  yield* waitFor(0.8);
  yield* hideBubble();

  // Down to Execution
  yield* all(
    packetRef().y(startY + gap * 2, 1, easeInOutCubic),
    packetRef().stroke(colors.executionReq, 1),
  );
  packetTextRef().text("[ 封装 SupergraphRequest ]");
  packetTextRef().fill(colors.executionReq);
  yield* executionRef().stroke(colors.packet, 0.3).to(colors.executionReq, 0.3);
  yield* showBubble(
    "阶段3: 分配任务到执行队列",
    [-400, startY + gap * 2],
    colors.executionReq,
  );
  yield* waitFor(0.8);
  yield* hideBubble();

  // Down to SubServices
  yield* all(
    packetRef().y(startY + gap * 3, 1, easeInOutCubic),
    packetRef().stroke(colors.subgraphReq, 1),
  );
  packetTextRef().text("[ 封装 ExecutionRequest ]");
  packetTextRef().fill(colors.subgraphReq);
  yield* subServicesRef()
    .stroke(colors.packet, 0.3)
    .to(colors.subgraphReq, 0.3);
  yield* showBubble(
    "阶段4: 将请求拆分为单个实体",
    [-400, startY + gap * 3],
    colors.subgraphReq,
  );
  yield* waitFor(0.5);
  yield* hideBubble();

  // Dispatch payloads
  yield* showBubble(
    "并发发送物理 HTTP 请求",
    [-350, startY + gap * 3 + 120],
    colors.packet,
  );
  yield* all(
    packetRef().opacity(0, 0.5),
    subPacket1().opacity(1, 0.2),
    subPacket2().opacity(1, 0.2),
    subPacket3().opacity(1, 0.2),
    subPacket1().x(-250, 1, easeInOutCubic),
    subPacket1().y(startY + gap * 3 + 140, 1, easeInOutCubic),
    subPacket2().y(startY + gap * 3 + 140, 1, easeInOutCubic),
    subPacket3().x(250, 1, easeInOutCubic),
    subPacket3().y(startY + gap * 3 + 140, 1, easeInOutCubic),
  );

  yield* all(
    subPacket1().opacity(0, 0.2),
    subPacket2().opacity(0, 0.2),
    subPacket3().opacity(0, 0.2),
  );
  yield* waitFor(0.5);
  yield* hideBubble();

  // Turn all headers green to represent responses
  yield* showBubble(
    "子图服务成功响应返回",
    [-350, startY + gap * 3 + 120],
    colors.success,
  );
  yield* all(
    subPacket1().opacity(1, 0.2),
    subPacket2().opacity(1, 0.2),
    subPacket3().opacity(1, 0.2),
    subPacket1().x(-60, 1, easeInOutCubic),
    subPacket1().y(startY + gap * 3 + 60, 1, easeInOutCubic),
    subPacket2().y(startY + gap * 3 + 60, 1, easeInOutCubic),
    subPacket3().x(60, 1, easeInOutCubic),
    subPacket3().y(startY + gap * 3 + 60, 1, easeInOutCubic),
  );

  yield* all(
    subPacket1().opacity(0, 0.1),
    subPacket2().opacity(0, 0.1),
    subPacket3().opacity(0, 0.1),
  );
  yield* hideBubble();

  packetTextRef().text("[ 子图响应 SubgraphResponse ]");
  packetTextRef().fill(colors.success);
  yield* all(
    packetRef().opacity(1, 0.2),
    packetRef().stroke(colors.success, 0.2),
  );

  // Bubble up Execution
  yield* showBubble(
    "执行器合并多块数据",
    [-400, startY + gap * 2],
    colors.success,
  );
  yield* packetRef().y(startY + gap * 2, 0.8, easeInOutCubic);
  packetTextRef().text("[ 执行完毕 ExecutionResponse ]");
  yield* waitFor(0.5);
  yield* hideBubble();

  // Bubble up Supergraph
  yield* showBubble(
    "返回完整 GraphQL 响应形",
    [-400, startY + gap],
    colors.success,
  );
  yield* packetRef().y(startY + gap, 0.8, easeInOutCubic);
  packetTextRef().text("[ 包装最终图 SupergraphResponse ]");
  yield* waitFor(0.5);
  yield* hideBubble();

  // Bubble up Router
  yield* showBubble(
    "转换为 HTTP 响应发送给客户端",
    [-420, startY],
    colors.success,
  );
  yield* packetRef().y(startY, 0.8, easeInOutCubic);
  packetTextRef().text("<- HTTP Response JSON (200 OK)");

  yield* waitFor(1.5);
  yield* hideBubble();

  yield* waitFor(1);
});
