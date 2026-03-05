import { makeScene2D, Rect, Txt, Node } from "@motion-canvas/2d";
import {
  all,
  waitFor,
  createRef,
  easeInCubic,
  easeOutCubic,
} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const colors = {
    bg: "#0F172A",
    textMain: "#F8FAF8",
    textDim: "#94A3B8",
    chunkBg: "#1E293B",
    chunkBorder: "#334155",
    highlight: "#FDE047",
    overlap: "rgba(253, 224, 71, 0.2)",
  };

  view.fill(colors.bg);

  const subtitleRef = createRef<Txt>();
  const textBarRef = createRef<Rect>();
  const chunk1Ref = createRef<Rect>();
  const chunk2Ref = createRef<Rect>();
  const chunk3Ref = createRef<Rect>();
  const overlap1Ref = createRef<Rect>();
  const overlap2Ref = createRef<Rect>();

  view.add(
    <Node>
      <Txt
        ref={subtitleRef}
        text="滑动窗口分块 (Sliding Window with Overlap)"
        fill={colors.textDim}
        fontSize={32}
        fontWeight={600}
        fontFamily={"Inter, sans-serif"}
        y={-300}
        opacity={0}
      />

      {/* Main Text Resource Bar */}
      <Rect
        ref={textBarRef}
        width={1400}
        height={80}
        fill={colors.chunkBorder}
        radius={12}
        y={0}
        opacity={0}
      >
        <Txt
          text="The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
          fill={colors.textDim}
          fontSize={24}
          fontFamily={"monospace"}
        />
      </Rect>

      {/* Chunks */}
      <Rect
        ref={chunk1Ref}
        width={500}
        height={100}
        x={-400}
        y={-120}
        fill={colors.chunkBg}
        stroke={colors.textDim}
        lineWidth={4}
        radius={12}
        opacity={0}
      >
        <Txt text="Chunk 1" fill={colors.textMain} fontSize={20} y={-30} />
      </Rect>

      <Rect
        ref={chunk2Ref}
        width={500}
        height={100}
        x={0}
        y={-120}
        fill={colors.chunkBg}
        stroke={colors.textDim}
        lineWidth={4}
        radius={12}
        opacity={0}
      >
        <Txt text="Chunk 2" fill={colors.textMain} fontSize={20} y={-30} />
      </Rect>

      <Rect
        ref={chunk3Ref}
        width={500}
        height={100}
        x={400}
        y={-120}
        fill={colors.chunkBg}
        stroke={colors.textDim}
        lineWidth={4}
        radius={12}
        opacity={0}
      >
        <Txt text="Chunk 3" fill={colors.textMain} fontSize={20} y={-30} />
      </Rect>

      {/* Overlap Highlights */}
      <Rect
        ref={overlap1Ref}
        width={100}
        height={80}
        x={-175}
        fill={colors.highlight}
        opacity={0}
        radius={4}
      />
      <Rect
        ref={overlap2Ref}
        width={100}
        height={80}
        x={175}
        fill={colors.highlight}
        opacity={0}
        radius={4}
      />
    </Node>,
  );

  // Animation Sequence
  yield* all(
    subtitleRef().opacity(1, 0.8),
    subtitleRef().y(-280, 0.8, easeOutCubic),
    textBarRef().opacity(1, 1),
  );

  yield* waitFor(0.5);

  // Slide down Chunk 1
  yield* all(chunk1Ref().opacity(1, 0.5), chunk1Ref().y(0, 0.5, easeOutCubic));
  yield* waitFor(0.5);

  // Slide down Chunk 2 and show overlap 1
  yield* all(chunk2Ref().opacity(1, 0.5), chunk2Ref().y(0, 0.5, easeOutCubic));
  yield* overlap1Ref().opacity(0.4, 0.3);
  yield* overlap1Ref().shadowBlur(20, 0.3).to(0, 0.3);

  yield* waitFor(0.5);

  // Slide down Chunk 3 and show overlap 2
  yield* all(chunk3Ref().opacity(1, 0.5), chunk3Ref().y(0, 0.5, easeOutCubic));
  yield* overlap2Ref().opacity(0.4, 0.3);
  yield* overlap2Ref().shadowBlur(20, 0.3).to(0, 0.3);

  yield* waitFor(1);

  // Highlight the concept
  yield* subtitleRef().text("Overlap 保证了语义的连贯性", 0.5);
  yield* all(
    overlap1Ref().fill("#22C55E", 0.5),
    overlap2Ref().fill("#22C55E", 0.5),
    overlap1Ref().opacity(0.8, 0.5),
    overlap2Ref().opacity(0.8, 0.5),
  );

  yield* waitFor(2);
});
