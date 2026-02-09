import { makeScene2D } from "@motion-canvas/2d";
import { Layout, Line, Rect, Txt } from "@motion-canvas/2d/lib/components";
import { all, waitFor } from "@motion-canvas/core/lib/flow";
import { createRef } from "@motion-canvas/core/lib/utils";
import { Vector2 } from "@motion-canvas/core/lib/types";
import { createSignal } from "@motion-canvas/core/lib/signals";
import { linear } from "@motion-canvas/core/lib/tweening";

export default makeScene2D(function* (view) {
  const clientRef = createRef<Rect>();
  const serverRef = createRef<Rect>();
  const connectionRef = createRef<Line>();
  const Title = createRef<Txt>();

  view.fill("#141414");

  view.add(
    <Layout>
      <Txt
        ref={Title}
        text="QUIC (HTTP/3): UDP & 独立流"
        y={-450}
        fill="#ffffff"
        fontFamily="JetBrains Mono"
        fontSize={48}
      />

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
        <Txt
          text="客户端 (Client)"
          fill="#ffffff"
          fontFamily="JetBrains Mono"
          fontSize={28}
        />
      </Rect>

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
        <Txt
          text="服务端 (Server)"
          fill="#ffffff"
          fontFamily="JetBrains Mono"
          fontSize={28}
        />
      </Rect>

      <Line
        ref={connectionRef}
        points={[new Vector2(-500, 0), new Vector2(500, 0)]}
        stroke="#ffaa00"
        lineWidth={10}
        lineDash={[20, 10]}
        end={1}
      />
    </Layout>,
  );

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
        y={-60}
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

  // --- ACT 3: QUIC ---
  yield* all(
    // Stream 3 (Normal)
    sendFrame("#4ecdc4", "QUIC Stream 3", "3", 0.2, 2),
    sendFrame("#4ecdc4", "QUIC Stream 3", "3", 1.2, 2),

    // Stream 1 (Packet Loss simulation)
    (function* () {
      yield* sendFrame("#ff6b6b", "Stream 1", "1", 0, 2);
      yield* waitFor(1.5);
      yield* sendFrame("#ff6b6b", "Stream 1 (Retries)", "1", 0, 1.0);
    })(),

    // Stream 5 (Normal)
    sendFrame("#ffe66d", "QUIC Stream 5", "5", 0.5, 2),
  );

  yield* waitFor(2);
});
