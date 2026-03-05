import { makeScene2D, Rect, Txt, Node, Line, Layout } from "@motion-canvas/2d";
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
    traditional: "#EF4444", // Red
    late: "#10B981", // Emerald
    vector: "#8B5CF6", // Violet
    attention: "rgba(16, 185, 129, 0.4)",
    highlight: "#3B82F6",
  };

  view.fill(colors.bg);

  const subtitleRef = createRef<Txt>();
  const explanationRef = createRef<Txt>();

  const tradNode = createRef<Node>();
  const tradText1 = createRef<Rect>();
  const tradText2 = createRef<Rect>();
  const tradVec1 = createRef<Rect>();
  const tradVec2 = createRef<Rect>();
  const tradEmbed = createRef<Rect>();

  const lateNode = createRef<Node>();
  const lateText = createRef<Rect>();
  const lateEmbed = createRef<Rect>();
  const lateVecBox = createRef<Node>();
  const lateVec1 = createRef<Rect>();
  const lateVec2 = createRef<Rect>();

  const attentionLines = createRef<Node>();

  view.add(
    <Node>
      <Txt
        ref={subtitleRef}
        text="Late Chunking (延迟分块)"
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

      {/* --- Traditional Side --- */}
      <Node ref={tradNode} x={-400} y={-40} opacity={0}>
        <Txt
          text="Traditional (Split -> Embed)"
          fill={colors.traditional}
          fontSize={28}
          fontWeight={600}
          y={-180}
        />

        {/* Raw text chunks (Cut immediately) */}
        <Rect
          ref={tradText1}
          width={360}
          height={60}
          y={-90}
          fill={colors.chunkBg}
          stroke={colors.traditional}
          lineWidth={2}
          radius={8}
        >
          <Txt
            text="Chunk 1: Apple 发布..."
            fill={colors.textMain}
            fontSize={20}
          />
        </Rect>
        <Rect
          ref={tradText2}
          width={360}
          height={60}
          y={-10}
          fill={colors.chunkBg}
          stroke={colors.traditional}
          lineWidth={2}
          radius={8}
        >
          <Txt
            text="Chunk 2: 它搭载 M4 芯片..."
            fill={colors.textMain}
            fontSize={20}
          />
        </Rect>

        {/* Embedding Node */}
        <Rect
          ref={tradEmbed}
          width={360}
          height={40}
          y={80}
          fill={"rgba(239, 68, 68, 0.1)"}
          stroke={colors.traditional}
          lineWidth={2}
          radius={8}
          lineDash={[5, 5]}
          opacity={0}
        >
          <Txt text="Embedding Model" fill={colors.textDim} fontSize={18} />
        </Rect>

        {/* Output Vectors */}
        <Rect
          ref={tradVec1}
          width={360}
          height={40}
          y={160}
          fill={colors.bg}
          stroke={colors.traditional}
          lineWidth={2}
          radius={4}
          opacity={0}
        >
          <Txt text="Vector A" fill={colors.textMain} fontSize={18} />
        </Rect>
        <Rect
          ref={tradVec2}
          width={360}
          height={40}
          y={220}
          fill={colors.bg}
          stroke={colors.traditional}
          lineWidth={2}
          radius={4}
          opacity={0}
        >
          <Txt
            text="Vector B (丢失Apple上下文!)"
            fill={colors.traditional}
            fontSize={18}
          />
        </Rect>
      </Node>

      {/* --- Late Chunking Side --- */}
      <Node ref={lateNode} x={400} y={-40} opacity={0}>
        <Txt
          text="Late Chunking (Embed -> Split)"
          fill={colors.late}
          fontSize={28}
          fontWeight={600}
          y={-180}
        />

        {/* Full Text (No cut) */}
        <Rect
          ref={lateText}
          width={400}
          height={140}
          y={-50}
          fill={colors.chunkBg}
          stroke={colors.late}
          lineWidth={2}
          radius={8}
        >
          <Txt
            text="Apple 发布... \n\n它搭载 M4 芯片..."
            fill={colors.textMain}
            fontSize={22}
            textAlign="center"
            padding={20}
          />
        </Rect>

        {/* Long Context Embedding Note */}
        <Rect
          ref={lateEmbed}
          width={400}
          height={60}
          y={80}
          fill={"rgba(16, 185, 129, 0.1)"}
          stroke={colors.late}
          lineWidth={2}
          radius={8}
          lineDash={[5, 5]}
          opacity={0}
        >
          <Txt
            text="Long-Context Embedding"
            fill={colors.textDim}
            fontSize={18}
          />
        </Rect>

        {/* Cross Attention Web */}
        <Node ref={attentionLines} y={-50} opacity={0}>
          {/* Internal lines showing attention across the doc */}
          <Line
            points={[
              [-120, -30],
              [120, 30],
            ]}
            stroke={colors.late}
            lineWidth={2}
            opacity={0.6}
          />
          <Line
            points={[
              [-120, 30],
              [120, -30],
            ]}
            stroke={colors.late}
            lineWidth={2}
            opacity={0.6}
          />
          <Line
            points={[
              [0, -30],
              [0, 30],
            ]}
            stroke={colors.late}
            lineWidth={2}
            opacity={0.6}
          />
        </Node>

        {/* Late Split Output Vectors */}
        <Node ref={lateVecBox} opacity={0}>
          {/* Visual Split line right before splitting the vectors */}
          <Line
            points={[
              [-160, 190],
              [160, 190],
            ]}
            stroke={colors.late}
            lineWidth={4}
            lineDash={[10, 10]}
          />
          <Rect
            ref={lateVec1}
            width={400}
            height={40}
            y={160}
            fill={colors.bg}
            stroke={colors.late}
            lineWidth={4}
            shadowBlur={15}
            shadowColor={colors.late}
            radius={4}
          >
            <Txt
              text="Vector A*"
              fill={colors.textMain}
              fontSize={18}
              fontWeight={700}
            />
          </Rect>
          <Rect
            ref={lateVec2}
            width={400}
            height={40}
            y={220}
            fill={colors.bg}
            stroke={colors.late}
            lineWidth={4}
            shadowBlur={15}
            shadowColor={colors.late}
            radius={4}
          >
            <Txt
              text="Vector B* (包含Apple上下文)"
              fill={colors.late}
              fontSize={18}
              fontWeight={700}
            />
          </Rect>
        </Node>
      </Node>
    </Node>,
  );

  // --- Animation Sequence ---

  yield* all(
    subtitleRef().opacity(1, 0.8),
    subtitleRef().y(-360, 0.8, easeOutCubic),
    explanationRef().text("Step 1: 传统分块方法 (先切分，后 Embedding)", 0.5),
    explanationRef().opacity(1, 0.5),
  );

  // Show traditional
  yield* tradNode().opacity(1, 1);
  yield* waitFor(1);

  // Trad: embed
  yield* explanationRef().text(
    "传统切分导致 Chunk 2 的向量完全丢失前文主体 'Apple'",
    0.5,
  );
  yield* tradEmbed().opacity(1, 0.5);
  yield* waitFor(0.5);
  yield* all(
    tradVec1().opacity(1, 0.5),
    tradVec2().opacity(1, 0.5),
    tradVec1().y(140, 0.5, easeOutCubic),
    tradVec2().y(200, 0.5, easeOutCubic),
  );
  yield* waitFor(1.5);

  // Show Late
  yield* explanationRef().text(
    "Step 2: Late Chunking 方法 (不切分，整段传入模型)",
    0.5,
  );
  yield* explanationRef().fill(colors.late, 0.5);
  yield* lateNode().opacity(1, 1);
  yield* waitFor(1);

  // Late: Global Attention
  yield* explanationRef().text(
    "长文本模型在内部进行全局注意力 (Cross-Attention) 运算",
    0.5,
  );
  yield* lateEmbed().opacity(1, 0.5);
  yield* attentionLines().opacity(1, 0.8);

  yield* waitFor(1);

  yield* explanationRef().text(
    "使得每个 Token 都在切分前获得了整个文档的前后文视野！",
    0.5,
  );
  yield* waitFor(1);

  // Late: Split & Pool
  yield* explanationRef().text(
    "Step 3: 附带了全局视野后，最后才进行切分和 Mean Pooling",
    0.5,
  );
  yield* lateVecBox().opacity(1, 1);

  yield* waitFor(1.5);

  yield* explanationRef().text(
    "结论：生成的 Vector B* 完美包含 'Apple' 上下文，无惧断层",
    0.5,
  );
  yield* waitFor(3);
});
