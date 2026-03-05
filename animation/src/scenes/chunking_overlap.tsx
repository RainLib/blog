import { makeScene2D, Rect, Txt, Node, Line } from "@motion-canvas/2d";
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
    chunkBg: "rgba(30, 41, 59, 0.4)", // highly transparent
    chunk1Border: "#3B82F6", // Blue
    chunk2Border: "#10B981", // Emerald
    chunk3Border: "#F59E0B", // Amber
    overlapBg: "rgba(253, 224, 71, 0.4)", // Yellow
    highlight: "#FDE047",
  };

  view.fill(colors.bg);

  const subtitleRef = createRef<Txt>();
  const textBarRef = createRef<Rect>();
  const chunk1Ref = createRef<Rect>();
  const chunk2Ref = createRef<Rect>();
  const chunk3Ref = createRef<Rect>();
  const overlap1Ref = createRef<Rect>();
  const overlap2Ref = createRef<Rect>();

  const pointer1Ref = createRef<Line>();
  const pointer1TextRef = createRef<Txt>();

  const pointer2Ref = createRef<Line>();
  const pointer2TextRef = createRef<Txt>();

  const chunkInfoRef = createRef<Txt>();

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
        fill={"rgba(255, 255, 255, 0.05)"}
        radius={12}
        y={0}
        opacity={0}
      >
        <Txt
          text="The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
          fill={colors.textMain}
          fontSize={24}
          fontFamily={"monospace"}
        />
      </Rect>

      {/* Overlap Highlights (placed behind the chunk borders) */}
      <Rect
        ref={overlap1Ref}
        width={150}
        height={80}
        x={-175}
        fill={colors.overlapBg}
        opacity={0}
        radius={8}
      />
      <Rect
        ref={overlap2Ref}
        width={150}
        height={80}
        x={175}
        fill={colors.overlapBg}
        opacity={0}
        radius={8}
      />

      {/* Chunks */}
      <Rect
        ref={chunk1Ref}
        width={500}
        height={100}
        x={-350}
        y={-120}
        fill={colors.chunkBg}
        stroke={colors.chunk1Border}
        lineWidth={4}
        radius={12}
        opacity={0}
      >
        <Txt
          text="Chunk 1"
          fill={colors.chunk1Border}
          fontWeight={600}
          fontSize={20}
          y={-70}
        />
      </Rect>

      <Rect
        ref={chunk2Ref}
        width={500}
        height={100}
        x={0}
        y={-120}
        fill={colors.chunkBg}
        stroke={colors.chunk2Border}
        lineWidth={4}
        radius={12}
        opacity={0}
      >
        <Txt
          text="Chunk 2"
          fill={colors.chunk2Border}
          fontWeight={600}
          fontSize={20}
          y={-70}
        />
      </Rect>

      <Rect
        ref={chunk3Ref}
        width={500}
        height={100}
        x={350}
        y={-120}
        fill={colors.chunkBg}
        stroke={colors.chunk3Border}
        lineWidth={4}
        radius={12}
        opacity={0}
      >
        <Txt
          text="Chunk 3"
          fill={colors.chunk3Border}
          fontWeight={600}
          fontSize={20}
          y={-70}
        />
      </Rect>
      {/* Info Texts and Pointers */}
      <Txt
        ref={chunkInfoRef}
        text="Chunk Size: 250 Tokens"
        fill={colors.textDim}
        fontSize={20}
        x={0}
        y={100}
        opacity={0}
      />

      <Line
        ref={pointer1Ref}
        points={[
          [-175, 40],
          [-175, -40],
        ]}
        stroke={colors.highlight}
        lineWidth={2}
        endArrow
        endOffset={10}
        opacity={0}
      />
      <Txt
        ref={pointer1TextRef}
        text="Overlap: 50 Tokens (20%)"
        fill={colors.highlight}
        fontSize={16}
        fontWeight={600}
        x={-175}
        y={60}
        opacity={0}
      />

      <Line
        ref={pointer2Ref}
        points={[
          [175, 40],
          [175, -40],
        ]}
        stroke={colors.highlight}
        lineWidth={2}
        endArrow
        endOffset={10}
        opacity={0}
      />
      <Txt
        ref={pointer2TextRef}
        text="Overlap: 50 Tokens (20%)"
        fill={colors.highlight}
        fontSize={16}
        fontWeight={600}
        x={175}
        y={60}
        opacity={0}
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
  yield* overlap1Ref().opacity(1, 0.3);
  yield* overlap1Ref().scale(1.1, 0.2);
  yield* overlap1Ref().scale(1, 0.2);

  // Show Pointer 1
  yield* all(
    pointer1Ref().opacity(1, 0.5),
    pointer1TextRef().opacity(1, 0.5),
    chunkInfoRef().opacity(1, 0.5),
  );

  yield* waitFor(0.5);

  // Slide down Chunk 3 and show overlap 2
  yield* all(chunk3Ref().opacity(1, 0.5), chunk3Ref().y(0, 0.5, easeOutCubic));
  yield* overlap2Ref().opacity(1, 0.3);
  yield* overlap2Ref().scale(1.1, 0.2);
  yield* overlap2Ref().scale(1, 0.2);

  // Show Pointer 2
  yield* all(pointer2Ref().opacity(1, 0.5), pointer2TextRef().opacity(1, 0.5));

  yield* waitFor(1);

  // Highlight the concept
  yield* subtitleRef().text(
    "相邻 Chunk 之间保留一部分重叠 (Overlap) 保证语义不断层",
    0.5,
  );
  yield* all(
    overlap1Ref().fill("rgba(34, 197, 94, 0.6)", 0.5),
    overlap2Ref().fill("rgba(34, 197, 94, 0.6)", 0.5),
  );

  yield* waitFor(2);
});
