import { makeScene2D, Rect, Txt, Line, Node, Icon } from "@motion-canvas/2d";
import {
  all,
  waitFor,
  createRef,
  easeInOutCubic,
  easeOutBounce,
  sequence,
  loop,
  Vector2,
} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  // === Colors & Styles ===
  const colors = {
    bg: "#0F172A",
    textMain: "#F8FAF8",
    textDim: "#94A3B8",
    chunkBg: "#1E293B",
    chunkBorder: "#334155",
    highlightError: "#EF4444", // 红色 (错误/断裂)
    highlightSuccess: "#10B981", // 绿色 (正确/语义完整)
    highlightSearch: "#3B82F6", // 蓝色 (检索)
    highlightParent: "#8B5CF6", // 紫色 (Parent Context)
    knife: "#FDE047", // 剪刀/刀光
    bubbleBg: "#F59E0B",
  };

  view.fill(colors.bg);

  // === Refs ===
  // Titles
  const mainTitleRef = createRef<Txt>();
  const subtitleRef = createRef<Txt>();

  // Text Elements (Phase 1 & 2)
  const textContainerRef = createRef<Node>();
  const charNodes: Txt[] = [];
  const textString =
    "张三攻读计算机期间，因发表《高效RAG分块策略》而备受关注。";
  // 索引：0-8: 张三攻读计算机期间， (9字)
  // 索引：9-26: 因发表《高效RAG分块策略》而备受关注。 (18字)
  // 危险切分点: "高效" / "RAG分块策略" 之间 (索引 15)
  // 理想切分点: "，" (索引 8 之后) 和 "。" (索引 26 之后)

  // Knife
  const knifeRef = createRef<Rect>();
  const splitLineRef = createRef<Line>();

  // LLM Status
  const llmContainerRef = createRef<Node>();
  const llmIconRef = createRef<Icon>();
  const llmBubbleRef = createRef<Rect>();
  const llmTextRef = createRef<Txt>();

  // Phase 3 (Parent/Child) Elements
  const p3ContainerRef = createRef<Node>();
  const parentBoxRef = createRef<Rect>();
  const child1Ref = createRef<Rect>();
  const child2Ref = createRef<Rect>();
  const child3Ref = createRef<Rect>();
  const searchIconRef = createRef<Icon>();
  const p3BubbleRef = createRef<Rect>();
  const p3BubbleTextRef = createRef<Txt>();

  // === Build UI Phase 1/2 ===
  view.add(
    <Node>
      <Txt
        ref={mainTitleRef}
        text="RAG 文本分块 (Chunking) 策略演进"
        fill={colors.textMain}
        fontSize={48}
        fontWeight={800}
        fontFamily={"Inter, sans-serif"}
        y={-450}
        opacity={0}
      />
      <Txt
        ref={subtitleRef}
        text="1. 固定切片的痛点"
        fill={colors.textDim}
        fontSize={32}
        fontWeight={600}
        fontFamily={"Inter, sans-serif"}
        y={-380}
        opacity={0}
      />

      <Node ref={textContainerRef} y={-50} opacity={0}>
        <Rect
          width={1200}
          height={160}
          fill={colors.chunkBg}
          stroke={colors.chunkBorder}
          lineWidth={4}
          radius={16}
          shadowBlur={20}
          shadowColor={"rgba(0,0,0,0.5)"}
        />
        {/* Render text character by character for splitting effect */}
        {textString.split("").map((char, i) => {
          const charRef = createRef<Txt>();
          charNodes.push(charRef());
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

        {/* The Knife / Splitline */}
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

      {/* LLM Status Indicator */}
      <Node ref={llmContainerRef} x={0} y={250} opacity={0}>
        <Icon
          ref={llmIconRef}
          icon="mdi:robot-outline"
          size={120}
          color={colors.textDim}
        />
        <Rect
          ref={llmBubbleRef}
          x={180}
          y={-60}
          fill={colors.textMain}
          radius={16}
          padding={[16, 24]}
          opacity={0}
          scale={0.5}
        >
          <Txt
            ref={llmTextRef}
            text="理解困难..."
            fill={colors.bg}
            fontSize={28}
            fontWeight={700}
            fontFamily={"Inter, sans-serif"}
          />
        </Rect>
      </Node>
    </Node>,
  );

  // === Build UI Phase 3 ===
  view.add(
    <Node ref={p3ContainerRef} y={50} opacity={0}>
      {/* Parent Box */}
      <Rect
        ref={parentBoxRef}
        width={1000}
        height={300}
        fill={"transparent"}
        stroke={colors.chunkBorder}
        lineWidth={6}
        lineDash={[15, 15]}
        radius={24}
        opacity={0}
      >
        <Txt
          text="Parent Context (完整段落，约 2000 token)"
          fill={colors.textDim}
          fontSize={24}
          y={-180}
        />
      </Rect>

      {/* Children Boxes */}
      <Rect
        ref={child1Ref}
        x={-300}
        y={0}
        width={260}
        height={200}
        fill={colors.chunkBg}
        stroke={colors.chunkBorder}
        lineWidth={4}
        radius={16}
      >
        <Txt
          text="Child 1\n(背景)"
          fill={colors.textDim}
          fontSize={28}
          textAlign="center"
          lineHeight={40}
        />
      </Rect>
      <Rect
        ref={child2Ref}
        x={0}
        y={0}
        width={260}
        height={200}
        fill={colors.chunkBg}
        stroke={colors.chunkBorder}
        lineWidth={4}
        radius={16}
      >
        <Txt
          text="Child 2\n(核心观点)"
          fill={colors.textDim}
          fontSize={28}
          textAlign="center"
          lineHeight={40}
        />
      </Rect>
      <Rect
        ref={child3Ref}
        x={300}
        y={0}
        width={260}
        height={200}
        fill={colors.chunkBg}
        stroke={colors.chunkBorder}
        lineWidth={4}
        radius={16}
      >
        <Txt
          text="Child 3\n(结论数据)"
          fill={colors.textDim}
          fontSize={28}
          textAlign="center"
          lineHeight={40}
        />
      </Rect>

      {/* Search Icon */}
      <Node x={0} y={250}>
        <Icon
          ref={searchIconRef}
          icon="mdi:magnify"
          size={80}
          color={colors.highlightSearch}
          opacity={0}
        />
        <Rect
          ref={p3BubbleRef}
          x={200}
          y={-20}
          fill={colors.bubbleBg}
          radius={16}
          padding={[16, 24]}
          opacity={0}
          scale={0.5}
        >
          <Txt
            ref={p3BubbleTextRef}
            text="Query"
            fill={"#0F172A"}
            fontSize={28}
            fontWeight={700}
          />
        </Rect>
      </Node>
    </Node>,
  );

  // === Helper Functions ===
  function* showLLMBubble(
    text: string,
    bgColor: string,
    iconColor: string,
    delay: number = 0,
  ) {
    llmTextRef().text(text);
    llmBubbleRef().fill(bgColor);
    llmIconRef().color(iconColor);
    yield* waitFor(delay);
    yield* all(
      llmBubbleRef().opacity(1, 0.3, easeOutBounce),
      llmBubbleRef().scale(1, 0.3, easeOutBounce),
      llmIconRef().scale(1.2, 0.15).to(1, 0.15),
    );
  }

  function* hideLLMBubble() {
    yield* all(
      llmBubbleRef().opacity(0, 0.3, easeInOutCubic),
      llmBubbleRef().scale(0.5, 0.3, easeInOutCubic),
      llmIconRef().color(colors.textDim, 0.3),
    );
  }

  // === ANIMATION SEQUENCE ===

  // ---- Intro ----
  yield* all(
    mainTitleRef().opacity(1, 0.8),
    mainTitleRef().y(-400, 0.8, easeOutBounce),
  );
  yield* waitFor(0.5);

  // ==========================================
  // PHASE 1: Fixed Chunking (The Problem)
  // ==========================================
  subtitleRef().text("1. 物理切分：固定字数一刀切的痛点");
  yield* all(
    subtitleRef().opacity(1, 0.5),
    subtitleRef().y(-340, 0.5),
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

  // SPLIT! Shake text slightly
  yield* all(
    splitLineRef().opacity(1, 0.2),
    knifeRef().y(300, 0.3, easeInOutCubic),
    knifeRef().opacity(0, 0.3),
  );

  // Separate the chunks
  const leftCharsFixed = charNodes.slice(0, splitIndexFixed);
  const rightCharsFixed = charNodes.slice(splitIndexFixed);

  // Extract generator animations
  const leftAnims = leftCharsFixed.map((char) =>
    char.x(char.x() - 40, 0.5, easeInOutCubic),
  );
  const rightAnims = rightCharsFixed.map((char) =>
    char.x(char.x() + 40, 0.5, easeInOutCubic),
  );
  const rightFades = rightCharsFixed.map((char) => char.opacity(0.3, 0.5));

  yield* all(...leftAnims, ...rightAnims, ...rightFades);

  yield* showLLMBubble(
    "这是什么书？《高效》？",
    colors.highlightError,
    colors.highlightError,
    0,
  );
  yield* waitFor(2);

  // Reset Phase 1
  yield* hideLLMBubble();
  yield* all(
    ...charNodes.map((char, i) => char.x(-560 + i * 42, 0.5, easeInOutCubic)),
    ...charNodes.map((char) => char.opacity(1, 0.5)),
    splitLineRef().opacity(0, 0.5),
  );
  yield* waitFor(0.5);

  // ==========================================
  // PHASE 2: Semantic / Recursive Chunking
  // ==========================================
  yield* all(subtitleRef().opacity(0, 0.3), subtitleRef().y(-380, 0.3));
  subtitleRef().text("2. 结构感知/语义切分：寻找自然边界");
  yield* all(subtitleRef().opacity(1, 0.5), subtitleRef().y(-340, 0.5));
  yield* waitFor(0.5);

  // Radar/Scanner effect sweeping across text
  const scannerRef = createRef<Rect>();
  textContainerRef().add(
    <Rect
      ref={scannerRef}
      x={-600}
      width={10}
      height={140}
      fill={colors.highlightSearch}
      shadowBlur={20}
      shadowColor={colors.highlightSearch}
      opacity={0}
    />,
  );

  yield* scannerRef().opacity(1, 0.2);
  // Scan to the comma (index 8/9 barrier)
  const commaPos = -560 + 9 * 42 - 21;
  yield* scannerRef().x(commaPos, 1.5, easeInOutCubic);

  // Found boundary!
  splitLineRef().x(commaPos);
  splitLineRef().stroke(colors.highlightSuccess);
  yield* all(
    scannerRef().height(200, 0.2),
    scannerRef().fill(colors.highlightSuccess, 0.2),
    splitLineRef().opacity(1, 0.2),
  );
  yield* waitFor(0.5);

  // Split at comma
  const leftCharsSemantic = charNodes.slice(0, 9);
  const rightCharsSemantic = charNodes.slice(9);

  const leftAnims2 = leftCharsSemantic.map((char) =>
    char.x(char.x() - 40, 0.5, easeInOutCubic),
  );
  const rightAnims2 = rightCharsSemantic.map((char) =>
    char.x(char.x() + 40, 0.5, easeInOutCubic),
  );

  yield* all(...leftAnims2, ...rightAnims2, scannerRef().opacity(0, 0.3));

  yield* showLLMBubble(
    "懂了！《高效RAG分块策略》",
    colors.highlightSuccess,
    colors.highlightSuccess,
    0,
  );
  yield* waitFor(2.5);

  // Clean up Phase 2
  yield* all(
    textContainerRef().opacity(0, 0.8),
    llmContainerRef().opacity(0, 0.8),
    subtitleRef().opacity(0, 0.5),
  );
  yield* waitFor(0.5);

  // ==========================================
  // PHASE 3: Parent-Child Retrieval
  // ==========================================
  subtitleRef().text("3. 父子节点检索 (Parent-Child Retrieval)");
  yield* all(subtitleRef().opacity(1, 0.5), p3ContainerRef().opacity(1, 0.8));
  yield* waitFor(1);

  // Query comes in
  yield* all(
    searchIconRef().opacity(1, 0.5),
    searchIconRef().y(100, 1, easeOutBounce),
  );

  p3BubbleTextRef().text("Query: 结论是什么？");
  yield* all(p3BubbleRef().opacity(1, 0.3), p3BubbleRef().scale(1, 0.3));
  yield* waitFor(1);

  // Search scans the children
  yield* searchIconRef().x(-300, 0.5, easeInOutCubic);
  yield* searchIconRef().x(0, 0.5, easeInOutCubic);
  yield* searchIconRef().x(300, 0.5, easeInOutCubic); // Matches Child 3

  // Child 3 Glows (Match!)
  yield* child3Ref().stroke(colors.highlightSearch, 0.3);
  yield* child3Ref().shadowBlur(30, 0.3).to(0, 0.3);

  p3BubbleTextRef().text("向量命中小片段 (Child 3)");
  p3BubbleRef().fill(colors.highlightSearch);
  p3BubbleRef().x(250);
  yield* waitFor(1.5);

  // EXPAND to Parent Context
  p3BubbleTextRef().text("组装大上下文 (Parent Context) 发送给 LLM");
  p3BubbleRef().fill(colors.highlightParent);
  p3BubbleRef().x(350);

  yield* all(
    parentBoxRef().opacity(1, 0.5),
    parentBoxRef().stroke(colors.highlightParent, 0.5),
    parentBoxRef().fill("rgba(139, 92, 246, 0.1)", 0.5), // Light purple bg
    searchIconRef().y(200, 0.5), // move down slightly
    child1Ref().stroke(colors.chunkBorder, 0.5),
    child2Ref().stroke(colors.chunkBorder, 0.5),
    child3Ref().stroke(colors.chunkBorder, 0.5),
  );

  // Pulse the parent box to emphasize
  yield* loop(2, () => parentBoxRef().shadowBlur(40, 0.5).to(0, 0.5));

  yield* waitFor(2);

  // Outro
  yield* all(
    p3ContainerRef().opacity(0, 1),
    subtitleRef().opacity(0, 1),
    mainTitleRef().opacity(0, 1),
  );
  yield* waitFor(1);
});
