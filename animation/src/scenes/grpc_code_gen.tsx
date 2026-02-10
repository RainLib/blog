import { makeScene2D } from "@motion-canvas/2d";
import {
  Circle,
  Line,
  Rect,
  Txt,
  Img,
  Layout,
} from "@motion-canvas/2d/lib/components";
import { all, delay, sequence, waitFor } from "@motion-canvas/core/lib/flow";
import { createRef } from "@motion-canvas/core/lib/utils";
import { Vector2 } from "@motion-canvas/core/lib/types";
import { createSignal } from "@motion-canvas/core/lib/signals";
import {
  linear,
  easeInOutCubic,
  easeOutElastic,
  easeInCubic,
} from "@motion-canvas/core/lib/tweening";

export default makeScene2D(function* (view) {
  view.fill("#141414"); // Dark background

  const protoFile = createRef<Rect>();
  const protocBox = createRef<Rect>();
  const javaFile = createRef<Rect>();
  const pyFile = createRef<Rect>(); // We'll focus on Java + Python as per blog post
  const title = createRef<Txt>();

  const clientApp = createRef<Rect>();
  const serverApp = createRef<Rect>();
  const networkLine = createRef<Line>();
  const packet = createRef<Circle>();

  // Lines
  const lineToProtoc = createRef<Line>();
  const lineToJava = createRef<Line>();
  const lineToPy = createRef<Line>();

  // --- Layout Setup ---

  view.add(
    <Txt
      ref={title}
      text="1. Definition & Generation"
      y={-450}
      fill="#ffffff"
      fontFamily="JetBrains Mono"
      fontSize={48}
      opacity={0}
    />,
  );

  // 1. user.proto file
  view.add(
    <Rect
      ref={protoFile}
      width={120}
      height={160}
      x={-600}
      y={0}
      fill="#ff69b4"
      radius={10}
      stroke="#333"
      lineWidth={4}
      opacity={0}
    >
      <Txt
        text=".proto"
        fill="#333"
        fontFamily="JetBrains Mono"
        fontWeight={700}
        fontSize={32}
      />
    </Rect>,
  );

  // 2. protoc Compiler
  view.add(
    <Rect
      ref={protocBox}
      width={180}
      height={180}
      x={-200}
      y={0}
      fill="#2d2d2d"
      stroke="#61dafb"
      lineWidth={6}
      radius={20}
      scale={0}
    >
      <Txt
        text="protoc"
        fill="#61dafb"
        fontFamily="JetBrains Mono"
        fontWeight={700}
        fontSize={32}
      />
    </Rect>,
  );

  // Connection Lines
  view.add(
    <Line
      ref={lineToProtoc}
      points={[new Vector2(-540, 0), new Vector2(-290, 0)]}
      stroke="#666"
      lineWidth={4}
      end={0}
      endArrow
      arrowSize={12}
    />,
  );

  // Generated Files (Java & Python)
  // Re-position them to be clearly "output"
  view.add(
    <Rect
      ref={javaFile}
      width={140}
      height={100}
      x={200}
      y={-100}
      fill="#e76f00"
      radius={8}
      opacity={0}
    >
      <Txt
        text="Java Stub"
        fill="white"
        fontFamily="JetBrains Mono"
        fontSize={20}
      />
    </Rect>,
  );

  view.add(
    <Rect
      ref={pyFile}
      width={140}
      height={100}
      x={200}
      y={100}
      fill="#3776ab"
      radius={8}
      opacity={0}
    >
      <Txt
        text="Py Server"
        fill="white"
        fontFamily="JetBrains Mono"
        fontSize={20}
      />
    </Rect>,
  );

  view.add(
    <Line
      ref={lineToJava}
      points={[new Vector2(-110, -20), new Vector2(130, -100)]}
      stroke="#e76f00"
      lineWidth={4}
      end={0}
      endArrow
      arrowSize={12}
    />,
  );

  view.add(
    <Line
      ref={lineToPy}
      points={[new Vector2(-110, 20), new Vector2(130, 100)]}
      stroke="#3776ab"
      lineWidth={4}
      end={0}
      endArrow
      arrowSize={12}
    />,
  );

  // --- PHASE 1: GENERATION ---

  yield* sequence(
    0.3,
    title().opacity(1, 1),
    protoFile().opacity(1, 1),
    lineToProtoc().end(1, 1),
    protocBox().scale(1, 1, easeOutElastic),
  );

  yield* waitFor(0.5);

  // Generation Pulse
  yield* protocBox().scale(1.1, 0.1).to(1, 0.1);

  // Output Lines
  yield* all(lineToJava().end(1, 1), lineToPy().end(1, 1));

  // Reveal Files
  yield* all(javaFile().opacity(1, 0.5), pyFile().opacity(1, 0.5));

  yield* waitFor(2);

  // --- PHASE 2: INTEGRATION ---

  yield* title().text("2. Integration", 1);

  // Fade out generation artifacts
  yield* all(
    protoFile().opacity(0, 0.5),
    protocBox().scale(0, 0.5),
    lineToProtoc().opacity(0, 0.5),
    lineToJava().opacity(0, 0.5),
    lineToPy().opacity(0, 0.5),
  );

  // Create Client/Server Containers
  view.add(
    <Rect
      ref={clientApp}
      width={400}
      height={300}
      x={-400}
      y={100} // Start lower
      stroke="#e76f00"
      lineWidth={4}
      radius={16}
      opacity={0}
    >
      <Txt
        text="Java Client App"
        y={-120}
        fill="#e76f00"
        fontFamily="JetBrains Mono"
        fontSize={24}
      />
      <Txt
        text="stub.getUser({...})"
        fill="#ccc"
        fontFamily="JetBrains Mono"
        fontSize={20}
      />
    </Rect>,
  );

  view.add(
    <Rect
      ref={serverApp}
      width={400}
      height={300}
      x={400}
      y={100} // Start lower
      stroke="#3776ab"
      lineWidth={4}
      radius={16}
      opacity={0}
    >
      <Txt
        text="Python AI Model"
        y={-120}
        fill="#3776ab"
        fontFamily="JetBrains Mono"
        fontSize={24}
      />
      <Txt
        text="def GetUser(req):"
        fill="#ccc"
        fontFamily="JetBrains Mono"
        fontSize={20}
      />
    </Rect>,
  );

  // Move generated files into their apps
  yield* all(
    clientApp().opacity(1, 1),
    clientApp().position(new Vector2(-400, 0), 1, easeOutElastic),

    serverApp().opacity(1, 1),
    serverApp().position(new Vector2(400, 0), 1, easeOutElastic), // Move up to center

    javaFile().position(new Vector2(-400, 50), 1, easeInOutCubic),
    javaFile().scale(0.8, 1),

    pyFile().position(new Vector2(400, 50), 1, easeInOutCubic),
    pyFile().scale(0.8, 1),
  );

  yield* waitFor(1);

  // --- PHASE 3: INTERACTION ---

  yield* title().text("3. High-Performance RPC Call", 1);

  // Network Line
  view.add(
    <Line
      ref={networkLine}
      points={[new Vector2(-200, 0), new Vector2(200, 0)]}
      stroke="#444"
      lineWidth={8}
      lineDash={[10, 10]}
      end={0}
      endArrow
      arrowSize={16}
    />,
  );

  yield* networkLine().end(1, 1);

  // Serialize Request
  view.add(
    <Circle ref={packet} size={30} fill="#fff" x={-400} y={0} opacity={0} />,
  );

  // Call initiated
  yield* packet().opacity(1, 0.2);
  yield* packet().position(new Vector2(-400, 0), 0);

  // Move to Network
  yield* packet().position(new Vector2(-200, 0), 0.5, easeInCubic);

  // Travel Network (Protobuf)
  yield* packet().fill("#00ff00", 0.2); // Green = Serialized/Protobuf
  yield* packet().position(new Vector2(200, 0), 0.8, linear);

  // Reach Server
  yield* packet().position(new Vector2(400, 0), 0.5, easeOutElastic);

  // Server Processing
  yield* serverApp().scale(1.05, 0.1).to(1, 0.1);
  yield* waitFor(0.5);

  // Response
  yield* packet().fill("#00ffff", 0.2); // Cyan = Response
  yield* packet().position(new Vector2(200, 0), 0.5, easeInCubic);
  yield* packet().position(new Vector2(-200, 0), 0.8, linear);
  yield* packet().position(new Vector2(-400, 0), 0.5, easeOutElastic);

  yield* clientApp().scale(1.05, 0.1).to(1, 0.1);

  yield* waitFor(2);
});
