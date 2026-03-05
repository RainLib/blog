import { makeScene2D, Rect, Txt, Line, Node, Icon } from "@motion-canvas/2d";
import {
  all,
  waitFor,
  createRef,
  easeInOutCubic,
  easeOutBounce,
} from "@motion-canvas/core";
import { LlmBubble } from "../components/LlmBubble";

export default makeScene2D(function* (view) {
  // === Colors & Styles ===
  const colors = {
    bg: "#0F172A",
    textMain: "#F8FAF8",
    textDim: "#94A3B8",
    chunkBg: "#1E293B",
    chunkBorder: "#334155",
    highlightSuccess: "#10B981", // 绿色 (正确/语义完整)
    highlightSearch: "#3B82F6", // 蓝色 (检索)
  };

  view.fill(colors.bg);

  // === Refs ===
  const subtitleRef = createRef<Txt>();
  const textContainerRef = createRef<Node>();
  const masterBgRef = createRef<Rect>();
  const leftBgRef = createRef<Rect>();
  const rightBgRef = createRef<Rect>();
  const leftLabelRef = createRef<Txt>();
  const rightLabelRef = createRef<Txt>();
  const charNodes: ReturnType<typeof createRef<Txt>>[] = [];
  const textString =
    "张三攻读计算机期间，因发表《高效RAG分块策略》而备受关注。";

  const scannerRef = createRef<Rect>();
  const splitLineRef = createRef<Line>();

  const llmContainerRef = createRef<Node>();
  const llmIconRef = createRef<Icon>();
  const llmBubbleRef = createRef<Rect>();
  const llmTextRef = createRef<Txt>();

  // === Build UI ===
  view.add(
    <Node>
      <Txt
        ref={subtitleRef}
        text="语义切分：寻找自然句号边界"
        fill={colors.textDim}
        fontSize={32}
        fontWeight={600}
        fontFamily={"Inter, sans-serif"}
        y={-280}
        opacity={0}
      />

      <Node ref={textContainerRef} y={-50} opacity={0}>
        {/* Master Context Background */}
        <Rect
          ref={masterBgRef}
          width={1350}
          height={160}
          x={49}
          fill={colors.chunkBg}
          stroke={colors.chunkBorder}
          lineWidth={4}
          radius={16}
          shadowBlur={20}
          shadowColor={"rgba(0,0,0,0.5)"}
        />
        {/* Split Left Background */}
        <Rect
          ref={leftBgRef}
          width={498}
          height={160}
          x={-371}
          fill={colors.chunkBg}
          stroke={colors.chunkBorder}
          lineWidth={4}
          radius={16}
          opacity={0}
        />
        <Txt
          ref={leftLabelRef}
          text="Chunk 1 (完整背景)"
          fill={colors.highlightSuccess}
          fontSize={24}
          fontWeight={600}
          y={-120}
          x={-371}
          opacity={0}
        />

        {/* Split Right Background */}
        <Rect
          ref={rightBgRef}
          width={918}
          height={160}
          x={259}
          fill={colors.chunkBg}
          stroke={colors.chunkBorder}
          lineWidth={4}
          radius={16}
          opacity={0}
        />
        <Txt
          ref={rightLabelRef}
          text="Chunk 2 (完整事件)"
          fill={colors.highlightSuccess}
          fontSize={24}
          fontWeight={600}
          y={-120}
          x={259}
          opacity={0}
        />
        {textString.split("").map((char, i) => {
          const charRef = createRef<Txt>();
          charNodes.push(charRef);
          return (
            <Txt
              ref={charRef}
              text={char}
              fill={colors.textMain}
              fontSize={40}
              fontWeight={600}
              fontFamily={"monospace"}
              x={-560 + i * 42}
              y={0}
            />
          );
        })}

        <Line
          ref={splitLineRef}
          points={[
            [0, -120],
            [0, 120],
          ]}
          stroke={colors.highlightSuccess}
          lineWidth={6}
          lineDash={[10, 10]}
          opacity={0}
        />
        <Rect
          ref={scannerRef}
          x={-600}
          width={10}
          height={140}
          fill={colors.highlightSearch}
          shadowBlur={20}
          shadowColor={colors.highlightSearch}
          opacity={0}
        />
      </Node>

      <LlmBubble
        ref={llmContainerRef}
        iconRef={llmIconRef}
        bubbleRef={llmBubbleRef}
        textRef={llmTextRef}
        x={0}
        y={200}
        opacity={0}
        initialText="思考中..."
        textColor={colors.bg}
      />
    </Node>,
  );

  // === ANIMATION SEQUENCE ===
  yield* all(
    subtitleRef().opacity(1, 0.5),
    subtitleRef().y(-240, 0.5, easeOutBounce),
    textContainerRef().opacity(1, 0.8),
    llmContainerRef().opacity(1, 0.8),
  );
  yield* waitFor(0.5);

  yield* scannerRef().opacity(1, 0.2);

  // Scan to the comma (index 9 barrier)
  const commaPos = -560 + 9 * 42 - 21;
  yield* scannerRef().x(commaPos, 1.5, easeInOutCubic);

  // Found boundary!
  splitLineRef().x(commaPos);

  yield* all(
    scannerRef().height(200, 0.2),
    scannerRef().fill(colors.highlightSuccess, 0.2),
    scannerRef().shadowColor(colors.highlightSuccess, 0.2),
    splitLineRef().opacity(1, 0.2),
    masterBgRef().opacity(0, 0.1),
    leftBgRef().opacity(1, 0.1),
    rightBgRef().opacity(1, 0.1),
  );
  yield* waitFor(0.5);

  // Split at comma
  const leftCharsSemantic = charNodes.slice(0, 10);
  const rightCharsSemantic = charNodes.slice(10);

  const leftAnims = leftCharsSemantic.map((charRef) =>
    charRef().x(charRef().x() - 40, 0.5, easeInOutCubic),
  );
  const rightAnims = rightCharsSemantic.map((charRef) =>
    charRef().x(charRef().x() + 40, 0.5, easeInOutCubic),
  );

  yield* all(
    ...leftAnims,
    ...rightAnims,
    scannerRef().opacity(0, 0.3),
    leftBgRef().x(leftBgRef().x() - 40, 0.5, easeInOutCubic),
    rightBgRef().x(rightBgRef().x() + 40, 0.5, easeInOutCubic),
    leftLabelRef().x(leftLabelRef().x() - 40, 0.5, easeInOutCubic),
    rightLabelRef().x(rightLabelRef().x() + 40, 0.5, easeInOutCubic),
    leftLabelRef().opacity(1, 0.5, easeInOutCubic),
    rightLabelRef().opacity(1, 0.5, easeInOutCubic),
  );

  // LLM Success Bubble
  llmTextRef().text("懂了！《高效RAG分块策略》");
  llmBubbleRef().fill(colors.highlightSuccess);
  llmIconRef().color(colors.highlightSuccess);

  yield* all(
    llmBubbleRef().opacity(1, 0.3, easeOutBounce),
    llmBubbleRef().scale(1, 0.3, easeOutBounce),
    llmIconRef().scale(1.2, 0.15).to(1, 0.15),
  );
  yield* waitFor(3);
});
