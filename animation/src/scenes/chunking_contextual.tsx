import {
  makeScene2D,
  Rect,
  Txt,
  Node,
  Icon,
  Layout,
  Line,
} from "@motion-canvas/2d";
import {
  all,
  waitFor,
  createRef,
  easeOutCubic,
  easeInOutCubic,
} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const colors = {
    bg: "#0F172A",
    textMain: "#F8FAF8",
    textDim: "#94A3B8",
    chunkBg: "#1E293B",
    chunkBorder: "#334155",
    highlight: "#10B981", // Emerald for Contextual
    docBg: "rgba(51, 65, 85, 0.4)",
    error: "#EF4444",
    success: "#10B981",
  };

  view.fill(colors.bg);

  const subtitleRef = createRef<Txt>();
  const explanationRef = createRef<Txt>();

  const docRef = createRef<Rect>();
  const chunkRef = createRef<Rect>();
  const chunkTextRef = createRef<Txt>();

  const llmRef = createRef<Node>();
  const llmBeamRef = createRef<Line>();

  const prefixRef = createRef<Rect>();
  const finalContainerRef = createRef<Node>();

  view.add(
    <Node>
      <Txt
        ref={subtitleRef}
        text="上下文增强 (Contextual Retrieval)"
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

      {/* The Source Document (Background) */}
      <Rect
        ref={docRef}
        width={300}
        height={400}
        x={-350}
        y={20}
        fill={colors.docBg}
        stroke={colors.chunkBorder}
        lineWidth={2}
        radius={12}
        opacity={0}
      >
        <Txt
          text="== ACME 2024年报 ==\n\n行业概述...\n\nQ3 财务表现...\n\n风险提示...\n\n高管薪酬..."
          fill={colors.textDim}
          fontSize={18}
          y={-80}
        />
      </Rect>

      {/* The Isolated Chunk */}
      <Rect
        ref={chunkRef}
        width={400}
        height={80}
        fill={colors.chunkBg}
        stroke={colors.chunkBorder}
        lineWidth={4}
        radius={12}
        x={300}
        y={-20} // Slightly raised to make room for prefix
        opacity={0}
      >
        <Txt
          ref={chunkTextRef}
          text='"利润强劲增长 23.5%"'
          fill={colors.textMain}
          fontSize={24}
        />
      </Rect>

      {/* LLM Agent */}
      <Node ref={llmRef} x={0} y={150} opacity={0}>
        <Icon icon="mdi:brain" size={80} color={colors.highlight} />
        <Line
          ref={llmBeamRef}
          points={[
            [-50, 0],
            [-250, -50],
          ]}
          stroke={colors.highlight}
          lineWidth={4}
          lineDash={[10, 10]}
          opacity={0}
        />
      </Node>

      {/* The Synthesized Prefix */}
      <Rect
        ref={prefixRef}
        width={400}
        height={60}
        fill={"rgba(16, 185, 129, 0.2)"}
        stroke={colors.highlight}
        lineWidth={3}
        radius={12}
        x={300}
        y={150} // Starts near LLM
        opacity={0}
      >
        <Txt
          text="[文档: ACME 2024年报. 主题: Q3 财务表现]"
          fill={colors.highlight}
          fontSize={16}
          fontWeight={700}
        />
      </Rect>

      {/* Fusion Container outline */}
      <Rect
        ref={finalContainerRef}
        width={420}
        height={160}
        x={300}
        y={-50}
        stroke={colors.highlight}
        lineWidth={4}
        radius={16}
        shadowBlur={20}
        shadowColor={colors.highlight}
        opacity={0}
      />
    </Node>,
  );

  // --- Animation Sequence ---

  // 1. Intro & Isolated Chunk
  yield* all(
    subtitleRef().opacity(1, 0.8),
    subtitleRef().y(-360, 0.8, easeOutCubic),
    explanationRef().text(
      "Step 1: 传统切分容易产生包含歧义的「孤儿碎块」(Orphan Chunks)",
      0.5,
    ),
    explanationRef().opacity(1, 0.5),
    chunkRef().opacity(1, 0.8),
    chunkRef().stroke(colors.error, 0.5),
  );
  yield* waitFor(1.5);

  // 2. The Source Document & LLM
  yield* explanationRef().text(
    "Step 2: 让 LLM 在切分前通览「完整的骨干文档」",
    0.5,
  );
  yield* docRef().opacity(1, 0.8);
  yield* llmRef().opacity(1, 0.5);
  yield* llmBeamRef().opacity(0.8, 0.5); // LLM scans doc
  yield* waitFor(1.5);

  // 3. Synthesize Prefix
  yield* explanationRef().text(
    "Step 3: 提取关键背景信息，生成特定的「上下文前缀」",
    0.5,
  );
  yield* prefixRef().opacity(1, 0.5);
  yield* llmBeamRef().opacity(0, 0.3);

  // Prefix flies up to the chunk
  yield* all(prefixRef().y(-95, 0.8, easeInOutCubic));
  yield* waitFor(1);

  // 4. Fusion
  yield* explanationRef().text(
    "Step 4: 将前缀与原块「无缝融合」后再 Embedding",
    0.5,
  );
  yield* all(
    chunkRef().stroke(colors.textDim, 0.5),
    finalContainerRef().opacity(1, 0.5),
  );

  yield* explanationRef().text(
    "检索命中率提升显著：Chunk 不再丢失 GPS 坐标",
    0.5,
  );
  yield* explanationRef().fill(colors.success, 0.5);

  yield* waitFor(3);
});
