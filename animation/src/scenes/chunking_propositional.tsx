import {
  makeScene2D,
  Rect,
  Txt,
  Node,
  Icon,
  Line,
  Layout,
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
    highlight: "#F59E0B", // Orange for Proposition
    success: "#10B981",
    error: "#EF4444",
  };

  view.fill(colors.bg);

  const subtitleRef = createRef<Txt>();
  const explanationRef = createRef<Txt>();

  const rawBoxRef = createRef<Rect>();
  const machineRef = createRef<Node>();
  const promptRef = createRef<Rect>();
  const propContainerRef = createRef<Node>();

  const inLineRef = createRef<Line>();
  const outLineRef = createRef<Line>();

  view.add(
    <Node>
      <Txt
        ref={subtitleRef}
        text="命题切分 (Propositional Chunking)"
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

      {/* Raw Text Box */}
      <Rect
        ref={rawBoxRef}
        width={440}
        height={340}
        x={-460}
        y={0}
        fill={colors.chunkBg}
        stroke={colors.chunkBorder}
        lineWidth={4}
        radius={24}
        opacity={0}
      >
        <Txt
          text={`原始文本：\n张三生于1990年的北京，随后进入清华大学计算机系。2015年毕业后加入某知名互联网公司担任算法工程师，期间发表了多篇关于向量检索的顶会论文。`}
          fill={colors.textDim}
          fontSize={22}
          width={400}
          textWrap={true}
          padding={20}
          lineHeight={32}
          fontFamily={"Inter, sans-serif"}
        />
      </Rect>

      {/* LLM Machine */}
      <Node ref={machineRef} x={-50} opacity={0}>
        <Icon
          icon="mdi:robot-industrial"
          size={140}
          color={colors.textMain}
          y={10}
        />
        <Rect
          width={160}
          height={160}
          stroke={colors.textDim}
          lineWidth={4}
          radius={20}
          lineDash={[10, 10]}
        />
        {/* Processing prompt */}
        <Rect
          ref={promptRef}
          y={-120}
          opacity={0}
          fill={"rgba(16, 185, 129, 0.1)"}
          stroke={colors.success}
          lineWidth={2}
          radius={8}
          padding={10}
        >
          <Txt
            text={`System Prompt:\n- 提取独立原子事实\n- 去除无用代词\n- 补全所有缺失主语`}
            fill={colors.success}
            fontSize={16}
            fontWeight={600}
            lineHeight={24}
            fontFamily={"monospace"}
          />
        </Rect>
      </Node>

      {/* Assembly Lines */}
      <Line
        ref={inLineRef}
        points={[
          [-280, 0],
          [-130, 0],
        ]}
        stroke={colors.textDim}
        lineWidth={6}
        lineDash={[10, 10]}
        endArrow
        endOffset={10}
        opacity={0}
      />
      <Line
        ref={outLineRef}
        points={[
          [30, 0],
          [250, 0],
        ]}
        stroke={colors.highlight}
        lineWidth={6}
        lineDash={[10, 10]}
        endArrow
        endOffset={10}
        opacity={0}
      />

      {/* Propositions Container */}
      <Node ref={propContainerRef} x={450} y={-100} />
    </Node>,
  );

  // Animation Sequence

  // 1. Intro & Raw Text
  yield* all(
    subtitleRef().opacity(1, 0.8),
    subtitleRef().y(-360, 0.8, easeOutCubic),
    explanationRef().text(
      "Step 1: 遇到充满代词、长难句和混杂信息的长文本",
      0.5,
    ),
    explanationRef().opacity(1, 0.5),
    rawBoxRef().opacity(1, 0.8),
  );
  yield* waitFor(1);

  // 2. The Engine
  yield* all(
    explanationRef().text("Step 2: 喂入 LLM 提取/改写引擎", 0.5),
    inLineRef().opacity(1, 0.5),
    machineRef().opacity(1, 0.5),
  );
  yield* waitFor(0.5);

  // 3. Prompting
  yield* promptRef().opacity(1, 0.5);
  yield* promptRef().y(-140, 0.5, easeOutCubic);
  yield* rawBoxRef().x(-420, 1, easeInOutCubic); // Feed in slightly

  yield* waitFor(1);

  // 4. Output lines
  yield* explanationRef().text(
    "Step 3: 输出极高纯度、结构化的「原子事实」",
    0.5,
  );
  yield* outLineRef().opacity(1, 0.5);

  const props = [
    "[张三] [出生于] [1990年]",
    "[张三] [出生在] [北京]",
    "[张三] [进入] [清华大学计算机系]",
    "[张三] [2015年毕业]",
    "[张三] [担任] [算法工程师]",
  ];

  for (let i = 0; i < props.length; i++) {
    const pRef = createRef<Rect>();
    propContainerRef().add(
      <Rect
        ref={pRef}
        width={400}
        height={50}
        y={i * 65} // Stacking down
        fill={"rgba(245, 158, 11, 0.1)"}
        stroke={colors.highlight}
        lineWidth={2}
        radius={12}
        opacity={0}
        x={-80}
      >
        <Txt
          text={props[i]}
          fill={colors.textMain}
          fontSize={18}
          fontWeight={700}
        />
      </Rect>,
    );

    yield* pRef().opacity(1, 0.2);
    yield* pRef().x(0, 0.3, easeOutCubic);
    yield* waitFor(0.1);
  }

  yield* waitFor(1);

  // 5. Conclusion
  yield* all(
    explanationRef().text("极高信息密度，极其精准，零检索干扰", 0.5),
    explanationRef().fill(colors.success, 0.5),
    rawBoxRef().stroke(colors.error, 0.5), // mark traditional as flawed
  );

  yield* waitFor(3);
});
