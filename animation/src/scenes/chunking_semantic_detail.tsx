import { makeScene2D, Rect, Txt, Node, Line } from "@motion-canvas/2d";
import { all, waitFor, createRef, easeInOutCubic } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const colors = {
    bg: "#0F172A",
    textMain: "#F8FAF8",
    textDim: "#94A3B8",
    chunkBg: "#1E293B",
    chunkBorder: "#334155",
    highlight: "#3B82F6",
    success: "#22C55E",
    error: "#EF4444",
  };

  view.fill(colors.bg);

  const subtitleRef = createRef<Txt>();
  const scannerRef = createRef<Rect>();
  const simTextRef = createRef<Txt>();

  const s1Ref = createRef<Rect>();
  const s2Ref = createRef<Rect>();
  const s3Ref = createRef<Rect>();
  const s4Ref = createRef<Rect>();

  view.add(
    <Node>
      <Txt
        ref={subtitleRef}
        text="语义切分逻辑 (Cosine Similarity Logic)"
        fill={colors.textDim}
        fontSize={32}
        fontWeight={600}
        fontFamily={"Inter, sans-serif"}
        y={-300}
        opacity={0}
      />

      {/* Sentences */}
      <Rect
        ref={s1Ref}
        width={800}
        height={60}
        y={-100}
        fill={colors.chunkBg}
        radius={8}
        opacity={0}
      >
        <Txt
          text="句子 S1: 机器学习是人工智能的核心。"
          fill={colors.textMain}
          fontSize={24}
        />
      </Rect>
      <Rect
        ref={s2Ref}
        width={800}
        height={60}
        y={-20}
        fill={colors.chunkBg}
        radius={8}
        opacity={0}
      >
        <Txt
          text="句子 S2: 它致力于研究如何通过数据改善性能。"
          fill={colors.textMain}
          fontSize={24}
        />
      </Rect>
      <Rect
        ref={s3Ref}
        width={800}
        height={60}
        y={60}
        fill={colors.chunkBg}
        radius={8}
        opacity={0}
      >
        <Txt
          text="句子 S3: 为了提高效率，我们需要优化算法。"
          fill={colors.textMain}
          fontSize={24}
        />
      </Rect>
      <Rect
        ref={s4Ref}
        width={800}
        height={60}
        y={140}
        fill={colors.chunkBg}
        radius={8}
        opacity={0}
      >
        <Txt
          text="句子 S4: 今天天气不错，适合出去郊游。"
          fill={colors.textMain}
          fontSize={24}
        />
      </Rect>

      {/* Scanner */}
      <Rect
        ref={scannerRef}
        width={820}
        height={10}
        fill={colors.highlight}
        opacity={0}
        shadowBlur={20}
        shadowColor={colors.highlight}
      />

      <Rect
        ref={simTextRef}
        layout
        padding={[8, 16]}
        fill={colors.chunkBg}
        stroke={colors.highlight}
        lineWidth={2}
        radius={12}
        x={500}
        opacity={0}
      >
        <Txt text="Similarity: " fill={colors.textDim} fontSize={20} />
        <Txt
          text="0.00"
          fill={colors.highlight}
          fontSize={20}
          fontWeight={700}
        />
      </Rect>
    </Node>,
  );

  // Animation
  yield* all(
    subtitleRef().opacity(1, 0.5),
    subtitleRef().y(-280, 0.5),
    s1Ref().opacity(1, 0.3),
    s2Ref().opacity(1, 0.3),
    s3Ref().opacity(1, 0.3),
    s4Ref().opacity(1, 0.3),
  );

  yield* waitFor(0.5);

  // Scan S1-S2
  scannerRef().y(-60);
  yield* scannerRef().opacity(1, 0.3);
  simTextRef().y(-60);
  (simTextRef().children()[1] as Txt).text("0.92");
  simTextRef().stroke(colors.success);
  (simTextRef().children()[1] as Txt).fill(colors.success);
  yield* simTextRef().opacity(1, 0.3);
  yield* waitFor(0.8);

  // Scan S2-S3
  yield* all(scannerRef().y(20, 0.5), simTextRef().y(20, 0.5));
  (simTextRef().children()[1] as Txt).text("0.85");
  yield* waitFor(0.8);

  // Scan S3-S4
  yield* all(scannerRef().y(100, 0.5), simTextRef().y(100, 0.5));
  (simTextRef().children()[1] as Txt).text("0.12");
  simTextRef().stroke(colors.error);
  (simTextRef().children()[1] as Txt).fill(colors.error);
  scannerRef().fill(colors.error);
  yield* waitFor(0.5);

  // Final Action: Split!
  yield* subtitleRef().text("低于阈值 -> 触发切分", 0.5);
  yield* all(
    s4Ref().y(200, 0.5, easeInOutCubic),
    scannerRef().width(900, 0.2).to(820, 0.2),
  );

  yield* waitFor(2);
});
