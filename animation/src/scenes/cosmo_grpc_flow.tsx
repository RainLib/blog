import { makeScene2D } from "@motion-canvas/2d";
import {
  Circle,
  Line,
  Rect,
  Txt,
  Layout,
  Node,
} from "@motion-canvas/2d/lib/components";
import { all, sequence, waitFor } from "@motion-canvas/core/lib/flow";
import { createRef } from "@motion-canvas/core/lib/utils";
import { Vector2 } from "@motion-canvas/core/lib/types";
import {
  linear,
  easeInOutCubic,
  easeOutElastic,
  easeInCubic,
} from "@motion-canvas/core/lib/tweening";

const FONT_FAMILY = "JetBrains Mono, PingFang SC, sans-serif";

export default makeScene2D(function* (view) {
  view.fill("#0E1117");

  const title = createRef<Txt>();

  // --- Phase 1: Initialization Setup ---
  const initContainer = createRef<Node>();
  const schemaFile = createRef<Rect>();
  const openApiFile = createRef<Rect>();
  const cliBox = createRef<Rect>();
  const protoFile = createRef<Rect>();
  const stubFile = createRef<Rect>();

  const lineGqlToCli = createRef<Line>();
  const lineOpenApiToCli = createRef<Line>();
  const lineCliToProto = createRef<Line>();
  const lineCliToStub = createRef<Line>();

  view.add(
    <Txt
      ref={title}
      text="WunderGraph Cosmo 异构联邦架构：gRPC & REST"
      y={-420}
      fill="#ffffff"
      fontFamily={FONT_FAMILY}
      fontSize={44}
      opacity={0}
    />,
  );

  view.add(<Node ref={initContainer} />);

  // Schema Definitions
  initContainer().add(
    <Rect
      ref={schemaFile}
      width={220}
      height={100}
      x={-600}
      y={-80}
      fill="#2d2d2d"
      radius={10}
      stroke="#FF4081"
      lineWidth={4}
      opacity={0}
    >
      <Txt
        text="GraphQL Schema"
        fill="#FF4081"
        fontFamily={FONT_FAMILY}
        fontSize={22}
      />
      <Txt
        text="(gRPC 服务契约)"
        y={30}
        fill="#aaa"
        fontFamily={FONT_FAMILY}
        fontSize={14}
      />
    </Rect>,
  );

  initContainer().add(
    <Rect
      ref={openApiFile}
      width={220}
      height={100}
      x={-600}
      y={80}
      fill="#2d2d2d"
      radius={10}
      stroke="#61dafb"
      lineWidth={4}
      opacity={0}
    >
      <Txt
        text="OpenAPI Spec"
        fill="#61dafb"
        fontFamily={FONT_FAMILY}
        fontSize={22}
      />
      <Txt
        text="(RESTful 服务契约)"
        y={30}
        fill="#aaa"
        fontFamily={FONT_FAMILY}
        fontSize={14}
      />
    </Rect>,
  );

  initContainer().add(
    <Rect
      ref={cliBox}
      width={180}
      height={180}
      x={-200}
      y={0}
      fill="#2d2d2d"
      radius={20}
      stroke="#a855f7"
      lineWidth={6}
      scale={0}
    >
      <Txt
        text="Cosmo CLI"
        y={-20}
        fill="#a855f7"
        fontFamily={FONT_FAMILY}
        fontSize={28}
        fontWeight={700}
      />
      <Txt
        text="(wgc 解析端)"
        y={20}
        fill="#ccc"
        fontFamily={FONT_FAMILY}
        fontSize={16}
      />
    </Rect>,
  );

  initContainer().add(
    <Rect
      ref={protoFile}
      width={160}
      height={100}
      x={240}
      y={-100}
      fill="#2d2d2d"
      radius={8}
      stroke="#4ade80"
      lineWidth={4}
      opacity={0}
    >
      <Txt
        text=".proto 映射"
        fill="#4ade80"
        fontFamily={FONT_FAMILY}
        fontSize={22}
      />
      <Txt
        text="(供 Router使用)"
        y={30}
        fill="#aaa"
        fontFamily={FONT_FAMILY}
        fontSize={14}
      />
    </Rect>,
  );

  initContainer().add(
    <Rect
      ref={stubFile}
      width={160}
      height={100}
      x={240}
      y={100}
      fill="#2d2d2d"
      radius={8}
      stroke="#e76f00"
      lineWidth={4}
      opacity={0}
    >
      <Txt
        text="HTTP / JSON"
        fill="#e76f00"
        fontFamily={FONT_FAMILY}
        fontSize={22}
      />
      <Txt
        text="(供 Router使用)"
        y={30}
        fill="#aaa"
        fontFamily={FONT_FAMILY}
        fontSize={14}
      />
    </Rect>,
  );

  initContainer().add(
    <Line
      ref={lineGqlToCli}
      points={[new Vector2(-490, -80), new Vector2(-290, -40)]}
      stroke="#555"
      lineWidth={4}
      endArrow
      arrowSize={12}
      end={0}
    />,
  );
  initContainer().add(
    <Line
      ref={lineOpenApiToCli}
      points={[new Vector2(-490, 80), new Vector2(-290, 40)]}
      stroke="#555"
      lineWidth={4}
      endArrow
      arrowSize={12}
      end={0}
    />,
  );
  initContainer().add(
    <Line
      ref={lineCliToProto}
      points={[new Vector2(-110, -20), new Vector2(160, -100)]}
      stroke="#4ade80"
      lineWidth={4}
      endArrow
      arrowSize={12}
      end={0}
    />,
  );
  initContainer().add(
    <Line
      ref={lineCliToStub}
      points={[new Vector2(-110, 20), new Vector2(160, 100)]}
      stroke="#e76f00"
      lineWidth={4}
      endArrow
      arrowSize={12}
      end={0}
    />,
  );

  // --- Phase 2: Runtime Setup ---
  const runtimeContainer = createRef<Node>();
  view.add(<Node ref={runtimeContainer} opacity={0} />);

  const clientBox = createRef<Rect>();
  const routerBox = createRef<Rect>();

  const grpcServer1Box = createRef<Rect>();
  const grpcServer2Box = createRef<Rect>();
  const restServerBox = createRef<Rect>();

  const lineClientRouter = createRef<Line>();
  const lineRouterGrpc1 = createRef<Line>();
  const lineRouterGrpc2 = createRef<Line>();
  const lineRouterRest = createRef<Line>();

  const packetMain = createRef<Rect>();
  const packetMainText = createRef<Txt>();

  const packetSub1 = createRef<Rect>();
  const packetSub1Text = createRef<Txt>();
  const packetSub2 = createRef<Rect>();
  const packetSub2Text = createRef<Txt>();
  const packetSub3 = createRef<Rect>();
  const packetSub3Text = createRef<Txt>();

  runtimeContainer().add(
    <Rect
      ref={clientBox}
      width={220}
      height={120}
      x={-700}
      y={0}
      fill="#2d2d2d"
      stroke="#FF4081"
      lineWidth={4}
      radius={16}
    >
      <Txt
        text="客户端"
        y={-20}
        fill="#FF4081"
        fontFamily={FONT_FAMILY}
        fontSize={28}
      />
      <Txt
        text="Web / App"
        y={20}
        fill="#ccc"
        fontFamily={FONT_FAMILY}
        fontSize={20}
      />
    </Rect>,
  );

  runtimeContainer().add(
    <Rect
      ref={routerBox}
      width={240}
      height={400}
      x={-150}
      y={0}
      fill="#2d2d2d"
      stroke="#a855f7"
      lineWidth={6}
      radius={20}
    >
      <Txt
        text="Cosmo Router"
        y={-140}
        fill="#a855f7"
        fontFamily={FONT_FAMILY}
        fontSize={28}
      />
      <Txt
        text="统一网关层"
        y={-100}
        fill="#aaa"
        fontFamily={FONT_FAMILY}
        fontSize={16}
      />

      <Rect y={20} width={200} height={60} fill="#333" radius={8}>
        <Txt
          text="协议转换引擎"
          fill="#fff"
          fontFamily={FONT_FAMILY}
          fontSize={20}
        />
      </Rect>
      <Rect y={100} width={200} height={60} fill="#333" radius={8}>
        <Txt
          text="请求拆分聚合"
          fill="#fff"
          fontFamily={FONT_FAMILY}
          fontSize={18}
        />
      </Rect>
    </Rect>,
  );

  runtimeContainer().add(
    <Rect
      ref={grpcServer1Box}
      width={240}
      height={100}
      x={500}
      y={-180}
      fill="#2d2d2d"
      stroke="#4ade80"
      lineWidth={4}
      radius={12}
    >
      <Txt
        text="User 微服务"
        y={-20}
        fill="#4ade80"
        fontFamily={FONT_FAMILY}
        fontSize={24}
      />
      <Txt
        text="gRPC (Go)"
        y={20}
        fill="#ccc"
        fontFamily={FONT_FAMILY}
        fontSize={18}
      />
    </Rect>,
  );

  runtimeContainer().add(
    <Rect
      ref={grpcServer2Box}
      width={240}
      height={100}
      x={500}
      y={0}
      fill="#2d2d2d"
      stroke="#4ade80"
      lineWidth={4}
      radius={12}
    >
      <Txt
        text="Order 微服务"
        y={-20}
        fill="#4ade80"
        fontFamily={FONT_FAMILY}
        fontSize={24}
      />
      <Txt
        text="gRPC (Java)"
        y={20}
        fill="#ccc"
        fontFamily={FONT_FAMILY}
        fontSize={18}
      />
    </Rect>,
  );

  runtimeContainer().add(
    <Rect
      ref={restServerBox}
      width={240}
      height={100}
      x={500}
      y={180}
      fill="#2d2d2d"
      stroke="#e76f00"
      lineWidth={4}
      radius={12}
    >
      <Txt
        text="Product 微服务"
        y={-20}
        fill="#e76f00"
        fontFamily={FONT_FAMILY}
        fontSize={24}
      />
      <Txt
        text="REST API (Node)"
        y={20}
        fill="#ccc"
        fontFamily={FONT_FAMILY}
        fontSize={18}
      />
    </Rect>,
  );

  runtimeContainer().add(
    <Line
      ref={lineClientRouter}
      points={[new Vector2(-590, 0), new Vector2(-270, 0)]}
      stroke="#555"
      lineWidth={6}
      lineDash={[10, 10]}
    />,
  );
  runtimeContainer().add(
    <Line
      ref={lineRouterGrpc1}
      points={[new Vector2(-30, -100), new Vector2(380, -180)]}
      stroke="#555"
      lineWidth={6}
      lineDash={[10, 10]}
    />,
  );
  runtimeContainer().add(
    <Line
      ref={lineRouterGrpc2}
      points={[new Vector2(-30, 0), new Vector2(380, 0)]}
      stroke="#555"
      lineWidth={6}
      lineDash={[10, 10]}
    />,
  );
  runtimeContainer().add(
    <Line
      ref={lineRouterRest}
      points={[new Vector2(-30, 100), new Vector2(380, 180)]}
      stroke="#555"
      lineWidth={6}
      lineDash={[10, 10]}
    />,
  );

  // Packets
  runtimeContainer().add(
    <Rect
      ref={packetMain}
      width={240}
      height={60}
      fill="#FF4081"
      radius={8}
      x={-800}
      y={0}
      opacity={0}
    >
      <Txt
        ref={packetMainText}
        text="GraphQL 联合查询"
        fill="#fff"
        fontFamily={FONT_FAMILY}
        fontSize={18}
      />
    </Rect>,
  );

  runtimeContainer().add(
    <Rect
      ref={packetSub1}
      width={160}
      height={40}
      fill="#4ade80"
      radius={6}
      x={-150}
      y={-100}
      opacity={0}
      scale={0.8}
    >
      <Txt
        ref={packetSub1Text}
        text="UserReq(Proto)"
        fill="#111"
        fontFamily={FONT_FAMILY}
        fontSize={16}
        fontWeight={700}
      />
    </Rect>,
  );

  runtimeContainer().add(
    <Rect
      ref={packetSub2}
      width={160}
      height={40}
      fill="#4ade80"
      radius={6}
      x={-150}
      y={0}
      opacity={0}
      scale={0.8}
    >
      <Txt
        ref={packetSub2Text}
        text="OrderReq(Proto)"
        fill="#111"
        fontFamily={FONT_FAMILY}
        fontSize={16}
        fontWeight={700}
      />
    </Rect>,
  );

  runtimeContainer().add(
    <Rect
      ref={packetSub3}
      width={160}
      height={40}
      fill="#e76f00"
      radius={6}
      x={-150}
      y={100}
      opacity={0}
      scale={0.8}
    >
      <Txt
        ref={packetSub3Text}
        text="GET /products"
        fill="#111"
        fontFamily={FONT_FAMILY}
        fontSize={16}
        fontWeight={700}
      />
    </Rect>,
  );

  // --- ANIMATION SEQUENCE ---

  // Intro
  yield* title().opacity(1, 1);
  yield* waitFor(0.5);

  // Phase 1
  yield* title().text("阶段一：多协议联合模型 (Schema + OpenAPI) 初始化", 0.5);
  yield* all(schemaFile().opacity(1, 1), openApiFile().opacity(1, 1));
  yield* all(lineGqlToCli().end(1, 1), lineOpenApiToCli().end(1, 1));
  yield* cliBox().scale(1, 1, easeOutElastic);

  yield* waitFor(0.5);
  yield* cliBox().scale(1.1, 0.1).to(1, 0.1);
  yield* all(lineCliToProto().end(1, 1), lineCliToStub().end(1, 1));
  yield* all(protoFile().opacity(1, 0.5), stubFile().opacity(1, 0.5));

  yield* waitFor(2);

  // Transition to Phase 2
  yield* all(
    initContainer().opacity(0, 1),
    runtimeContainer().opacity(1, 1),
    title().text("阶段二：运行时 GraphQL 智能拆分与多协议转换路由", 1),
  );

  yield* waitFor(0.5);

  // Sequence 1: GraphQL Request
  yield* title().text("1. 客户端发起复杂嵌套的单一 GraphQL 聚合请求", 0.5);
  yield* packetMain().opacity(1, 0.5);
  yield* packetMain().position(new Vector2(-700, -100), 0);
  yield* packetMain().position(new Vector2(-430, -50), 0.8, easeOutElastic);

  yield* waitFor(0.5);

  // Sequence 2: Engine parses and splits
  yield* packetMain().position(new Vector2(-150, -50), 0.8, easeInOutCubic);
  yield* routerBox().scale(1.05, 0.2).to(1, 0.2);
  yield* packetMain().opacity(0, 0.3);

  yield* title().text(
    "2. 引擎拆分请求，并行转换多重协议指令 (gRPC & REST)",
    0.5,
  );

  yield* all(
    packetSub1().opacity(1, 0.3),
    packetSub2().opacity(1, 0.3),
    packetSub3().opacity(1, 0.3),
  );

  yield* waitFor(0.5);

  // Sequence 3: Route out to microservices
  yield* title().text("3. 并发执行异构 RPC 与 HTTP(REST) 调用", 0.5);
  yield* all(
    packetSub1().position(new Vector2(300, -140), 0.8, easeInOutCubic),
    packetSub2().position(new Vector2(300, 0), 0.8, easeInOutCubic),
    packetSub3().position(new Vector2(300, 140), 0.8, easeInOutCubic),
  );

  yield* all(
    grpcServer1Box().scale(1.1, 0.2).to(1, 0.2),
    grpcServer2Box().scale(1.1, 0.2).to(1, 0.2),
    restServerBox().scale(1.1, 0.2).to(1, 0.2),
  );

  yield* waitFor(0.5);

  // Sequence 4: Response
  yield* title().text("4. 多服务以不同格式 (Protobuf & JSON) 响应数据", 0.5);
  yield* all(
    packetSub1Text().text("UserRes(Proto)", 0.2),
    packetSub2Text().text("OrderRes(Proto)", 0.2),
    packetSub3Text().text('{ "id": 1 } JSON', 0.2),
  );

  yield* all(
    packetSub1().position(new Vector2(-30, -80), 0.8, easeInOutCubic),
    packetSub2().position(new Vector2(-30, 0), 0.8, easeInOutCubic),
    packetSub3().position(new Vector2(-30, 80), 0.8, easeInOutCubic),
  );

  yield* routerBox().scale(1.05, 0.2).to(1, 0.2);

  yield* waitFor(0.5);

  // Sequence 5: Assemble and return
  yield* title().text(
    "5. 协议转换还原，中心化聚合为最终的 GraphQL JSON 树",
    0.5,
  );
  yield* all(
    packetSub1().opacity(0, 0.3),
    packetSub2().opacity(0, 0.3),
    packetSub3().opacity(0, 0.3),
  );
  yield* packetMainText().text('{"data": {"user": ...}}', 0.1);
  yield* packetMain().fill("#a855f7", 0.1);
  yield* packetMain().opacity(1, 0.3);

  yield* waitFor(0.5);

  yield* title().text("6. 极速响应并统一返回前端", 0.5);
  yield* packetMain().position(new Vector2(-430, 50), 0.8, easeOutElastic);
  yield* packetMain().position(new Vector2(-700, 100), 0.8, easeInOutCubic);
  yield* clientBox().scale(1.1, 0.2).to(1, 0.2);

  yield* waitFor(1);
  yield* packetMain().opacity(0, 0.5);

  yield* waitFor(2);
});
