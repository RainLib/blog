import { makeScene2D } from "@motion-canvas/2d";
import {
  Circle,
  Layout,
  Line,
  Rect,
  Txt,
  Node,
} from "@motion-canvas/2d/lib/components";
import { all, delay, sequence, waitFor } from "@motion-canvas/core/lib/flow";
import { createRef } from "@motion-canvas/core/lib/utils";
import { Vector2 } from "@motion-canvas/core/lib/types";
import { createSignal } from "@motion-canvas/core/lib/signals";
import { linear, easeInOutCubic } from "@motion-canvas/core/lib/tweening";

export default makeScene2D(function* (view) {
  const clientRef = createRef<Rect>();
  const serverRef = createRef<Rect>();
  const connectionRef = createRef<Line>();
  const Title = createRef<Txt>();

  view.fill("#141414"); // Dark background

  view.add(
    <Layout>
      <Txt
        ref={Title}
        text="HTTP/1.1 vs HTTP/2 Framing"
        y={-450}
        fill="#ffffff"
        fontFamily="JetBrains Mono"
        fontSize={48}
      />

      {/* Client Node */}
      <Rect
        ref={clientRef}
        width={200}
        height={200}
        x={-600}
        fill="#1e1e1e"
        stroke="#61dafb"
        lineWidth={4}
        radius={20}
      >
        <Txt text="Client" fill="#ffffff" fontFamily="JetBrains Mono" />
      </Rect>

      {/* Server Node */}
      <Rect
        ref={serverRef}
        width={200}
        height={200}
        x={600}
        fill="#1e1e1e"
        stroke="#ff00ff"
        lineWidth={4}
        radius={20}
      >
        <Txt text="Server" fill="#ffffff" fontFamily="JetBrains Mono" />
      </Rect>

      {/* Connection Line */}
      <Line
        ref={connectionRef}
        points={[new Vector2(-500, 0), new Vector2(500, 0)]}
        stroke="#333"
        lineWidth={10}
        end={1}
      />
    </Layout>,
  );

  // Animation Helper: Create a Frame
  function* sendFrame(
    color: string,
    text: string,
    streamId: string,
    delayTime: number,
    speed: number = 1.5,
  ) {
    const frame = createRef<Rect>();
    const frameX = createSignal(-500);

    view.add(
      <Rect
        ref={frame}
        width={120}
        height={60}
        fill={color}
        radius={8}
        x={() => frameX()}
        y={-60} // Above the line
        opacity={0}
      >
        <Layout layout direction="column" alignItems="center">
          <Txt
            text={text}
            fontSize={20}
            fill="white"
            fontFamily="JetBrains Mono"
            fontWeight={700}
          />
          <Txt
            text={`ID:${streamId}`}
            fontSize={14}
            fill="rgba(255,255,255,0.8)"
            fontFamily="JetBrains Mono"
          />
        </Layout>
      </Rect>,
    );

    yield* waitFor(delayTime);

    yield* frame().opacity(1, 0.2);
    yield* frameX(500, speed, linear);
    yield* frame().opacity(0, 0.2);

    frame().remove();
  }

  // --- ACT 1: HTTP/1.1 Blocking ---
  yield* Title().text("HTTP/1.1: Blocking / Hol", 1);

  // Request 1
  yield* sendFrame("#ff6b6b", "GET /Bg", "1", 0, 1.5);
  yield* waitFor(1.5); // Wait for round trip (simulated)

  // Response 1
  // We'll just show requests piling up for simplicity in this demo, or sequential
  yield* sendFrame("#4ecdc4", "GET /Img", "2", 0, 1.5);
  yield* waitFor(1.6);

  yield* sendFrame("#ffe66d", "GET /Api", "3", 0, 1.5);
  yield* waitFor(2);

  // --- ACT 2: HTTP/2 Multiplexing ---
  yield* Title().text("HTTP/2: Multiplexing", 1);

  // Send multiple frames interleaved
  yield* all(
    sendFrame("#ff6b6b", "HEADERS", "1", 0, 2), // Stream 1 start
    sendFrame("#4ecdc4", "HEADERS", "3", 0.3, 2), // Stream 3 start
    sendFrame("#ff6b6b", "DATA (1)", "1", 0.6, 2), // Stream 1 data
    sendFrame("#ffe66d", "HEADERS", "5", 0.9, 2), // Stream 5 start
    sendFrame("#4ecdc4", "DATA (1)", "3", 1.2, 2), // Stream 3 data
    sendFrame("#ff6b6b", "DATA (2)", "1", 1.5, 2), // Stream 1 data
    sendFrame("#ffe66d", "DATA (1)", "5", 1.8, 2), // Stream 5 data
  );

  yield* waitFor(3);
});
