import { makeScene2D, Rect, Txt, Node, Line } from "@motion-canvas/2d";
import { all, waitFor, createRef, easeInOutCubic } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const colors = {
    bg: "#0F172A",
    textMain: "#F8FAF8",
    textDim: "#94A3B8",
    chunkBg: "#1E293B",
    chunkBorder: "#334155",
    traditional: "#EF4444",
    late: "#22C55E",
  };

  view.fill(colors.bg);

  const subtitleRef = createRef<Txt>();
  const tradNode = createRef<Node>();
  const lateNode = createRef<Node>();

  view.add(
    <Node>
      <Txt
        ref={subtitleRef}
        text="Late Chunking vs Traditional"
        fill={colors.textDim}
        fontSize={32}
        fontWeight={600}
        y={-300}
        opacity={0}
      />

      {/* Traditional Side */}
      <Node ref={tradNode} x={-350} y={0} opacity={0}>
        <Txt text="Traditional" fill={colors.textDim} fontSize={24} y={-180} />
        <Rect
          width={300}
          height={250}
          stroke={colors.traditional}
          lineWidth={4}
          radius={20}
        />
        <Rect
          width={240}
          height={40}
          y={-60}
          fill={colors.chunkBg}
          radius={8}
        />
        <Rect width={240} height={40} y={0} fill={colors.chunkBg} radius={8} />
        <Rect width={240} height={40} y={60} fill={colors.chunkBg} radius={8} />
        <Txt
          text="切后仅存局部信息"
          fill={colors.traditional}
          fontSize={18}
          y={150}
        />
      </Node>

      {/* Late Side */}
      <Node ref={lateNode} x={350} y={0} opacity={0}>
        <Txt
          text="Late Chunking"
          fill={colors.textDim}
          fontSize={24}
          y={-180}
        />
        <Rect
          width={300}
          height={250}
          stroke={colors.late}
          lineWidth={4}
          radius={20}
        />
        {/* Global Attention lines */}
        <Line
          points={[
            [-120, -100],
            [120, 100],
            [-120, 100],
            [120, -100],
          ]}
          stroke={colors.late}
          lineWidth={1}
          opacity={0.3}
          lineDash={[5, 5]}
        />
        <Rect
          width={240}
          height={40}
          y={-60}
          fill={colors.chunkBg}
          stroke={colors.late}
          lineWidth={2}
          radius={8}
        />
        <Rect
          width={240}
          height={40}
          y={0}
          fill={colors.chunkBg}
          stroke={colors.late}
          lineWidth={2}
          radius={8}
        />
        <Rect
          width={240}
          height={40}
          y={60}
          fill={colors.chunkBg}
          stroke={colors.late}
          lineWidth={2}
          radius={8}
        />
        <Txt
          text="包含全文注意力上下文"
          fill={colors.late}
          fontSize={18}
          y={150}
        />
      </Node>
    </Node>,
  );

  // Animation
  yield* all(
    subtitleRef().opacity(1, 0.5),
    subtitleRef().y(-280, 0.5),
    tradNode().opacity(1, 1),
    lateNode().opacity(1, 1),
  );

  yield* waitFor(1);

  // Highlight Late Chunking's globality
  yield* lateNode().scale(1.1, 0.5).to(1, 0.5);
  yield* subtitleRef().text("Late Chunking: 先 Embedding 再切分", 0.5);

  yield* waitFor(2);
});
