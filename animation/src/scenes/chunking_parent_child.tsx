import { makeScene2D, Rect, Txt, Node, Icon } from "@motion-canvas/2d";
import {
  all,
  waitFor,
  createRef,
  easeInOutCubic,
  easeOutBounce,
  loop,
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
    highlightSearch: "#3B82F6", // 蓝色 (检索)
    highlightParent: "#8B5CF6", // 紫色 (Parent Context)
    bubbleBg: "#F59E0B",
  };

  view.fill(colors.bg);

  // === Refs ===
  const subtitleRef = createRef<Txt>();
  const stepDescRef = createRef<Txt>();

  const p3ContainerRef = createRef<Node>();
  const parentBoxRef = createRef<Rect>();
  const otherParentLeftRef = createRef<Rect>();
  const otherParentRightRef = createRef<Rect>();
  const child1Ref = createRef<Rect>();
  const child2Ref = createRef<Rect>();
  const child3Ref = createRef<Rect>();

  const searchIconRef = createRef<Icon>();
  const p3BubbleRef = createRef<Rect>();
  const p3BubbleTextRef = createRef<Txt>();

  const llmContainerRef = createRef<Node>();
  const llmIconRef = createRef<Icon>();
  const llmBubbleRef = createRef<Rect>();
  const llmTextRef = createRef<Txt>();

  // === Build UI ===
  view.add(
    <Node>
      <Txt
        ref={subtitleRef}
        text="父子节点检索 (Parent-Child Retrieval)"
        fill={colors.textDim}
        fontSize={32}
        fontWeight={600}
        fontFamily={"Inter, sans-serif"}
        y={-300}
        opacity={0}
      />
      <Txt
        ref={stepDescRef}
        text=""
        fill={colors.highlightSearch}
        fontSize={28}
        fontWeight={700}
        fontFamily={"Inter, sans-serif"}
        y={-240}
        opacity={0}
      />

      <Node ref={p3ContainerRef} y={-10}>
        {/* Glow effect for Parent */}
        <Rect
          ref={parentBoxRef}
          width={1000}
          height={300}
          fill={"rgba(0,0,0,0)"}
          stroke={colors.chunkBorder}
          lineWidth={6}
          lineDash={[15, 15]}
          radius={24}
          opacity={0}
          shadowBlur={0}
          shadowColor={colors.highlightParent}
        >
          <Txt
            text="Parent Context (完整段落，约 2000 token)"
            fill={colors.textDim}
            fontSize={24}
            y={-180}
            fontFamily={"Inter, sans-serif"}
          />
        </Rect>

        {/* Other Irrelevant Parent Chunks in DB */}
        <Rect
          ref={otherParentLeftRef}
          width={600}
          height={300}
          x={-850}
          fill={"rgba(0,0,0,0)"}
          stroke={colors.chunkBorder}
          lineWidth={4}
          lineDash={[10, 10]}
          radius={24}
          opacity={0}
        >
          <Txt
            text="Other Parent"
            fill={colors.chunkBorder}
            fontSize={24}
            fontFamily={"Inter, sans-serif"}
          />
        </Rect>

        <Rect
          ref={otherParentRightRef}
          width={600}
          height={300}
          x={850}
          fill={"rgba(0,0,0,0)"}
          stroke={colors.chunkBorder}
          lineWidth={4}
          lineDash={[10, 10]}
          radius={24}
          opacity={0}
        >
          <Txt
            text="Other Parent"
            fill={colors.chunkBorder}
            fontSize={24}
            fontFamily={"Inter, sans-serif"}
          />
        </Rect>

        <Rect
          ref={child1Ref}
          x={-300}
          width={260}
          height={200}
          fill={colors.chunkBg}
          stroke={colors.chunkBorder}
          lineWidth={4}
          radius={16}
          opacity={0}
          y={100} // Start offset for intro animation
        >
          <Txt
            text="Child 1\n(背景)"
            fill={colors.textDim}
            fontSize={28}
            textAlign="center"
            lineHeight={40}
            fontFamily={"Inter, sans-serif"}
          />
        </Rect>
        <Rect
          ref={child2Ref}
          x={0}
          width={260}
          height={200}
          fill={colors.chunkBg}
          stroke={colors.chunkBorder}
          lineWidth={4}
          radius={16}
          opacity={0}
          y={100} // Start offset
        >
          <Txt
            text="Child 2\n(核心观点)"
            fill={colors.textDim}
            fontSize={28}
            textAlign="center"
            lineHeight={40}
            fontFamily={"Inter, sans-serif"}
          />
        </Rect>
        <Rect
          ref={child3Ref}
          x={300}
          width={260}
          height={200}
          fill={colors.chunkBg}
          stroke={colors.chunkBorder}
          lineWidth={4}
          radius={16}
          opacity={0}
          y={100} // Start offset
        >
          <Txt
            text="Child 3\n(结论数据)"
            fill={colors.textDim}
            fontSize={28}
            textAlign="center"
            lineHeight={40}
            fontFamily={"Inter, sans-serif"}
          />
        </Rect>
      </Node>

      <Node x={0} y={180}>
        <Icon
          ref={searchIconRef}
          icon="mdi:magnify"
          size={80}
          color={colors.highlightSearch}
          opacity={0}
        />
        <Rect
          ref={p3BubbleRef}
          layout
          direction="row"
          alignItems="center"
          justifyContent="center"
          x={120}
          y={0}
          fill={colors.bubbleBg}
          radius={16}
          padding={[16, 24]}
          opacity={0}
          scale={0.5}
          shadowBlur={15}
          shadowColor={"rgba(0,0,0,0.5)"}
        >
          <Txt
            ref={p3BubbleTextRef}
            text="Query"
            fill={"#0F172A"}
            fontSize={28}
            fontWeight={700}
            fontFamily={"Inter, sans-serif"}
          />
        </Rect>
      </Node>

      {/* LLM Status Indicator for end of animation */}
      <LlmBubble
        ref={llmContainerRef}
        iconRef={llmIconRef}
        bubbleRef={llmBubbleRef}
        textRef={llmTextRef}
        x={0}
        y={380}
        opacity={0}
        initialText="收到完整上下文，回答非常精准！"
        textColor={colors.textMain}
        iconColor={colors.highlightParent}
        bubbleColor={colors.highlightParent}
      />
    </Node>,
  );

  // === ANIMATION SEQUENCE ===
  yield* all(
    subtitleRef().opacity(1, 0.5),
    subtitleRef().y(-320, 0.5, easeOutBounce),
    parentBoxRef().opacity(1, 0.8),
    otherParentLeftRef().opacity(0.3, 0.8),
    otherParentRightRef().opacity(0.3, 0.8),
  );

  // Staggered child entrance
  yield* child1Ref().opacity(1, 0.3);
  yield* child1Ref().y(0, 0.3, easeOutBounce);
  yield* child2Ref().opacity(1, 0.3);
  yield* child2Ref().y(0, 0.3, easeOutBounce);
  yield* child3Ref().opacity(1, 0.3);
  yield* child3Ref().y(0, 0.3, easeOutBounce);

  yield* waitFor(0.5);

  // STEP 1: Query Search
  stepDescRef().text("第一步：使用小切片进行稠密向量检索 (Child 匹配)");
  stepDescRef().fill(colors.textDim);
  yield* stepDescRef().opacity(1, 0.5);

  // Query comes in
  yield* all(
    searchIconRef().opacity(1, 0.5),
    searchIconRef().y(100, 1, easeOutBounce),
  );

  p3BubbleTextRef().text("Query: 结论是什么？");
  yield* all(p3BubbleRef().opacity(1, 0.3), p3BubbleRef().scale(1, 0.3));
  yield* waitFor(1);

  // Search scans the children
  yield* p3BubbleRef().opacity(0, 0.3); // Hide temporarily during scan
  yield* searchIconRef().x(-300, 0.5, easeInOutCubic);
  yield* searchIconRef().x(0, 0.5, easeInOutCubic);
  yield* searchIconRef().x(300, 0.5, easeInOutCubic); // Matches Child 3

  // Child 3 Glows (Match!)
  yield* all(
    child3Ref().stroke(colors.highlightSearch, 0.3),
    stepDescRef().text("第二步：精准命中 Child 3 小片段", 0.3),
    stepDescRef().fill(colors.highlightSearch, 0.3),
  );
  child3Ref().shadowColor(colors.highlightSearch);
  yield* child3Ref().shadowBlur(30, 0.3);
  yield* child3Ref().shadowBlur(0, 0.3);
  yield* child3Ref().shadowBlur(30, 0.3);
  yield* child3Ref().shadowBlur(10, 0.3);

  p3BubbleTextRef().text("向量命中小片段 (精度高)");
  p3BubbleRef().fill(colors.highlightSearch);
  p3BubbleRef().x(190);
  yield* p3BubbleRef().opacity(1, 0.3);
  yield* waitFor(1.5);

  // EXPAND to Parent Context
  yield* all(
    stepDescRef().text(
      "第三步：通过 ID 映射，提取出完整的 Parent Context",
      0.3,
    ),
    stepDescRef().fill(colors.highlightParent, 0.3),
  );
  p3BubbleTextRef().text("提取完整的 Parent Context");
  p3BubbleRef().fill(colors.highlightParent);

  yield* all(
    parentBoxRef().stroke(colors.highlightParent, 0.5),
    parentBoxRef().fill("rgba(139, 92, 246, 0.1)", 0.5), // Light purple bg
    searchIconRef().y(180, 0.5), // move down slightly to make room
    child1Ref().stroke(colors.chunkBorder, 0.5),
    child2Ref().stroke(colors.chunkBorder, 0.5),
    child3Ref().stroke(colors.chunkBorder, 0.5),
    child3Ref().shadowBlur(0, 0.3),
  );

  // Pulse the parent box to emphasize
  yield* parentBoxRef().shadowBlur(40, 0.5);
  yield* parentBoxRef().shadowBlur(0, 0.5);
  yield* parentBoxRef().shadowBlur(40, 0.5);
  yield* parentBoxRef().shadowBlur(20, 0.5);

  // Pass to LLM
  yield* all(
    stepDescRef().text(
      "第四步：将携带完整语义信息的 Parent 提交给 LLM 生成答案",
      0.3,
    ),
    stepDescRef().fill(colors.textMain, 0.3),
  );
  p3BubbleTextRef().text("发送给 LLM");
  yield* all(
    searchIconRef().opacity(0, 0.5),
    p3BubbleRef().opacity(0, 0.5),
    llmContainerRef().opacity(1, 0.5),
    llmContainerRef().y(180, 0.5, easeOutBounce),
  );

  yield* llmBubbleRef().opacity(1, 0.3, easeOutBounce);
  yield* llmBubbleRef().scale(1, 0.3, easeOutBounce);

  yield* waitFor(3);
});
