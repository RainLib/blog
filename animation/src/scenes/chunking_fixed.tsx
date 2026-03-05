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
    highlightError: "#EF4444", // 红色 (错误/断裂)
    knife: "#FDE047", // 剪刀/刀光
    bubbleBg: "#F59E0B",
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

  const knifeRef = createRef<Rect>();
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
        text="物理切分：固定字数一刀切的痛点"
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
          width={708}
          height={160}
          x={-266}
          fill={colors.chunkBg}
          stroke={colors.chunkBorder}
          lineWidth={4}
          radius={16}
          opacity={0}
        />
        <Txt
          ref={leftLabelRef}
          text="Chunk 1 (语意不完整)"
          fill={colors.highlightError}
          fontSize={24}
          fontWeight={600}
          y={-120}
          x={-266}
          opacity={0}
        />

        {/* Split Right Background */}
        <Rect
          ref={rightBgRef}
          width={708}
          height={160}
          x={364}
          fill={colors.chunkBg}
          stroke={colors.chunkBorder}
          lineWidth={4}
          radius={16}
          opacity={0}
        />
        <Txt
          ref={rightLabelRef}
          text="Chunk 2 (主语丢失)"
          fill={colors.highlightError}
          fontSize={24}
          fontWeight={600}
          y={-120}
          x={364}
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
          stroke={colors.highlightError}
          lineWidth={6}
          lineDash={[10, 10]}
          opacity={0}
        />
        <Rect
          ref={knifeRef}
          width={8}
          height={300}
          fill={colors.knife}
          radius={4}
          shadowBlur={15}
          shadowColor={colors.knife}
          y={-300}
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
        initialText="理解困难..."
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
  yield* waitFor(1);

  // The Knife drops at exactly character index 15 ("高效"| "RAG")
  const splitIndexFixed = 15;
  const splitPosFixed = -560 + splitIndexFixed * 42 - 21;

  knifeRef().x(splitPosFixed);
  splitLineRef().x(splitPosFixed);
  splitLineRef().stroke(colors.highlightError);

  yield* all(knifeRef().opacity(1, 0.2), knifeRef().y(0, 0.3, easeInOutCubic));

  // SPLIT!
  yield* all(
    splitLineRef().opacity(1, 0.2),
    knifeRef().y(300, 0.3, easeInOutCubic),
    knifeRef().opacity(0, 0.3),
    masterBgRef().opacity(0, 0.1),
    leftBgRef().opacity(1, 0.1),
    rightBgRef().opacity(1, 0.1),
  );

  // Separate chunks
  const leftCharsFixed = charNodes.slice(0, splitIndexFixed);
  const rightCharsFixed = charNodes.slice(splitIndexFixed);

  const leftMove = -40;
  const rightMove = 40;

  const leftAnims = leftCharsFixed.map((charRef) =>
    charRef().x(charRef().x() + leftMove, 0.5, easeInOutCubic),
  );
  const rightAnims = rightCharsFixed.map((charRef) =>
    charRef().x(charRef().x() + rightMove, 0.5, easeInOutCubic),
  );
  const rightFades = rightCharsFixed.map((charRef) =>
    charRef().opacity(0.3, 0.5),
  );

  yield* all(
    ...leftAnims,
    ...rightAnims,
    ...rightFades,
    leftBgRef().x(leftBgRef().x() + leftMove, 0.5, easeInOutCubic),
    rightBgRef().x(rightBgRef().x() + rightMove, 0.5, easeInOutCubic),
    leftLabelRef().x(leftLabelRef().x() + leftMove, 0.5, easeInOutCubic),
    rightLabelRef().x(rightLabelRef().x() + rightMove, 0.5, easeInOutCubic),
    leftLabelRef().opacity(1, 0.5, easeInOutCubic),
    rightLabelRef().opacity(1, 0.5, easeInOutCubic),
  );

  // LLM Error Bubble
  llmTextRef().text("这是什么书？《高效》？");
  llmBubbleRef().fill(colors.highlightError);
  llmIconRef().color(colors.highlightError);

  yield* all(
    llmBubbleRef().opacity(1, 0.3, easeOutBounce),
    llmBubbleRef().scale(1, 0.3, easeOutBounce),
    llmIconRef().scale(1.2, 0.15).to(1, 0.15),
  );

  yield* waitFor(2.5);
});
