import {
  makeScene2D,
  Rect,
  Txt,
  Node,
  Line,
  Icon,
  Layout,
} from "@motion-canvas/2d";
import {
  all,
  waitFor,
  createRef,
  easeInOutCubic,
  easeOutCubic,
} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const colors = {
    bg: "#0F172A",
    textMain: "#F8FAF8",
    textDim: "#94A3B8",
    chunkBg: "#1E293B",
    chunkBorder: "#334155",
    highlight: "#3B82F6", // Blue
    success: "#10B981", // Emerald
    error: "#EF4444", // Red
    vector: "#8B5CF6", // Violet
  };

  view.fill(colors.bg);

  const subtitleRef = createRef<Txt>();
  const explanationRef = createRef<Txt>();

  const s1Ref = createRef<Rect>();
  const s2Ref = createRef<Rect>();
  const s3Ref = createRef<Rect>();
  const s4Ref = createRef<Rect>();

  const v1Ref = createRef<Txt>();
  const v2Ref = createRef<Txt>();
  const v3Ref = createRef<Txt>();
  const v4Ref = createRef<Txt>();

  const embedIconRef = createRef<Node>();
  const scannerRef = createRef<Rect>();
  const simLabelRef = createRef<Rect>();

  const group1BoxRef = createRef<Rect>();
  const group2BoxRef = createRef<Rect>();
  const splitLineRef = createRef<Line>();

  view.add(
    <Node>
      <Txt
        ref={subtitleRef}
        text="语义切分逻辑 (Semantic Chunking)"
        fill={colors.textDim}
        fontSize={36}
        fontWeight={700}
        fontFamily={"Inter, sans-serif"}
        y={-380}
        opacity={0}
      />
      <Txt
        ref={explanationRef}
        text=""
        fill={colors.highlight}
        fontSize={24}
        fontWeight={500}
        y={-320}
        opacity={0}
      />

      {/* Grouping Boxes (Behind Sentences) */}
      <Rect
        ref={group1BoxRef}
        width={920}
        height={0}
        x={-50}
        y={-170} // Top of S1
        fill={"rgba(16, 185, 129, 0.1)"}
        stroke={colors.success}
        lineWidth={3}
        radius={12}
        opacity={0}
        offsetY={-1}
      />
      <Rect
        ref={group2BoxRef}
        width={920}
        height={80}
        x={-50}
        y={140} // Top of S4
        fill={"rgba(59, 130, 246, 0.1)"}
        stroke={colors.highlight}
        lineWidth={3}
        radius={12}
        opacity={0}
        offsetY={-1}
      />

      {/* Sentences */}
      <Node x={-200}>
        <Rect
          ref={s1Ref}
          width={600}
          height={60}
          y={-140}
          fill={colors.chunkBg}
          radius={8}
          opacity={0}
        >
          <Txt
            text="S1: 机器学习是人工智能的核心。"
            fill={colors.textMain}
            fontSize={22}
          />
        </Rect>
        <Rect
          ref={s2Ref}
          width={600}
          height={60}
          y={-50}
          fill={colors.chunkBg}
          radius={8}
          opacity={0}
        >
          <Txt
            text="S2: 它致力于研究如何通过数据改善性能。"
            fill={colors.textMain}
            fontSize={22}
          />
        </Rect>
        <Rect
          ref={s3Ref}
          width={600}
          height={60}
          y={40}
          fill={colors.chunkBg}
          radius={8}
          opacity={0}
        >
          <Txt
            text="S3: 为了提高效率，我们需要优化算法。"
            fill={colors.textMain}
            fontSize={22}
          />
        </Rect>
        <Rect
          ref={s4Ref}
          width={600}
          height={60}
          y={130}
          fill={colors.chunkBg}
          radius={8}
          opacity={0}
        >
          <Txt
            text="S4: 今天天气不错，适合出去郊游。"
            fill={colors.textMain}
            fontSize={22}
          />
        </Rect>
      </Node>

      {/* Embeddings / Vectors */}
      <Node x={300}>
        <Txt
          ref={v1Ref}
          text="[0.42, 0.11, ...]"
          fill={colors.vector}
          fontSize={20}
          fontFamily="monospace"
          y={-140}
          opacity={0}
        />
        <Txt
          ref={v2Ref}
          text="[0.39, 0.15, ...]"
          fill={colors.vector}
          fontSize={20}
          fontFamily="monospace"
          y={-50}
          opacity={0}
        />
        <Txt
          ref={v3Ref}
          text="[0.45, 0.08, ...]"
          fill={colors.vector}
          fontSize={20}
          fontFamily="monospace"
          y={40}
          opacity={0}
        />
        <Txt
          ref={v4Ref}
          text="[-0.8, 0.92, ...]"
          fill={colors.error}
          fontSize={20}
          fontFamily="monospace"
          y={130}
          opacity={0}
        />
      </Node>

      {/* Embedding Icon */}
      <Node ref={embedIconRef} x={130} y={-5} opacity={0}>
        <Icon icon="mdi:function-variant" size={40} color={colors.textDim} />
        <Line
          points={[
            [0, -150],
            [0, 150],
          ]}
          stroke={colors.textDim}
          lineWidth={2}
          lineDash={[5, 5]}
          opacity={0.5}
          y={0}
          x={30}
        />
      </Node>

      {/* Scanner & Label */}
      <Rect
        ref={scannerRef}
        width={900}
        height={8}
        x={-50}
        fill={colors.highlight}
        opacity={0}
        shadowBlur={15}
        shadowColor={colors.highlight}
      />
      <Rect
        ref={simLabelRef}
        layout
        padding={[8, 16]}
        fill={colors.chunkBg}
        stroke={colors.highlight}
        lineWidth={2}
        radius={8}
        x={200}
        opacity={0}
      >
        <Txt text="Cosine Sim: " fill={colors.textDim} fontSize={18} />
        <Txt
          text="0.00"
          fill={colors.highlight}
          fontSize={18}
          fontWeight={700}
        />
      </Rect>

      {/* Split Line */}
      <Line
        ref={splitLineRef}
        points={[
          [-550, 85],
          [450, 85],
        ]}
        stroke={colors.error}
        lineWidth={6}
        shadowBlur={20}
        shadowColor={colors.error}
        opacity={0}
      />
    </Node>,
  );

  // --- Animation Sequence ---

  // 1. Intro
  yield* all(
    subtitleRef().opacity(1, 0.8),
    subtitleRef().y(-360, 0.8, easeOutCubic),
    explanationRef().text("Step 1: 将文本转化为 Embedding 向量", 0.5),
    explanationRef().opacity(1, 0.5),
  );

  // Show sentences
  yield* all(
    s1Ref().opacity(1, 0.3),
    s2Ref().opacity(1, 0.3),
    s3Ref().opacity(1, 0.3),
    s4Ref().opacity(1, 0.3),
  );
  yield* waitFor(0.5);

  // 2. Embedding process
  yield* embedIconRef().opacity(1, 0.5);
  yield* all(
    v1Ref().opacity(1, 0.2).to(1, 0.1),
    v2Ref().opacity(1, 0.2).to(1, 0.1),
    v3Ref().opacity(1, 0.2).to(1, 0.1),
    v4Ref().opacity(1, 0.2).to(1, 0.1),
  );
  yield* waitFor(0.8);

  // 3. Start Scanning
  yield* explanationRef().text(
    "Step 2: 计算相邻句子的余弦相似度 (Cosine Similarity)",
    0.5,
  );

  // Scan S1-S2
  scannerRef().y(-95);
  simLabelRef().y(-95);
  yield* all(scannerRef().opacity(1, 0.3), simLabelRef().opacity(1, 0.3));
  (simLabelRef().children()[1] as Txt).text("0.92");

  yield* waitFor(0.5);
  yield* explanationRef().text(
    "相似度 > 阈值 (0.5)：语义连贯，合并至同属 Chunk",
    0.5,
  );

  // Group 1 starts
  simLabelRef().stroke(colors.success);
  (simLabelRef().children()[1] as Txt).fill(colors.success);
  scannerRef().fill(colors.success);

  yield* all(
    group1BoxRef().opacity(1, 0.2),
    group1BoxRef().height(170, 0.5, easeOutCubic), // wraps S1 & S2
  );
  yield* waitFor(1);

  // Scan S2-S3
  yield* all(
    scannerRef().y(-5, 0.5, easeInOutCubic),
    simLabelRef().y(-5, 0.5, easeInOutCubic),
  );
  (simLabelRef().children()[1] as Txt).text("0.85");
  yield* all(
    group1BoxRef().height(260, 0.5, easeOutCubic), // absorbs S3
  );
  yield* waitFor(1);

  // Scan S3-S4
  yield* all(
    scannerRef().y(85, 0.5, easeInOutCubic),
    simLabelRef().y(85, 0.5, easeInOutCubic),
  );
  (simLabelRef().children()[1] as Txt).text("0.12");
  simLabelRef().stroke(colors.error);
  (simLabelRef().children()[1] as Txt).fill(colors.error);
  scannerRef().fill(colors.error);

  yield* explanationRef().text("相似度 < 阈值，且出现断崖式下跌！", 0.5);
  yield* explanationRef().fill(colors.error, 0.5);
  yield* waitFor(1);

  // The Split
  yield* explanationRef().text("触发语义断层 (Semantic Break) 切分！", 0.2);
  yield* splitLineRef().opacity(1, 0.1);
  yield* all(
    s4Ref().y(160, 0.3, easeOutCubic),
    v4Ref().y(160, 0.3, easeOutCubic),
    scannerRef().opacity(0, 0.2),
    simLabelRef().opacity(0, 0.2),
  );

  // Group 2 boxed
  group2BoxRef().y(120);
  yield* group2BoxRef().opacity(1, 0.3);

  yield* waitFor(0.5);

  // Conclusion
  yield* explanationRef().text(
    "结论：避免将不相干的知识点缝合，保证 Embedding 的纯净度",
    0.5,
  );
  yield* explanationRef().fill(colors.highlight, 0.5);
  yield* splitLineRef().opacity(0.5, 0.5);

  yield* waitFor(3);
});
