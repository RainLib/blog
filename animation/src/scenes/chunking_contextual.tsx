import { makeScene2D, Rect, Txt, Node, Icon } from "@motion-canvas/2d";
import {
  all,
  waitFor,
  createRef,
  easeOutCubic,
  easeInOutCubic,
} from "@motion-canvas/core";
import { LlmBubble } from "../components/LlmBubble";

export default makeScene2D(function* (view) {
  const colors = {
    bg: "#0F172A",
    textMain: "#F8FAF8",
    textDim: "#94A3B8",
    chunkBg: "#1E293B",
    chunkBorder: "#334155",
    highlight: "#10B981", // Emerald for Contextual
  };

  view.fill(colors.bg);

  const subtitleRef = createRef<Txt>();
  const chunkRef = createRef<Rect>();
  const prefixRef = createRef<Rect>();
  const llmRef = createRef<Node>();

  view.add(
    <Node>
      <Txt
        ref={subtitleRef}
        text="上下文增强 (Contextual Retrieval)"
        fill={colors.textDim}
        fontSize={32}
        fontWeight={600}
        y={-300}
        opacity={0}
      />

      <Rect
        ref={chunkRef}
        width={500}
        height={100}
        fill={colors.chunkBg}
        stroke={colors.chunkBorder}
        lineWidth={4}
        radius={12}
        y={50}
        opacity={0}
      >
        <Txt
          text="'公司 Q3 净利润增长 23.5%'"
          fill={colors.textMain}
          fontSize={24}
        />
      </Rect>

      <Rect
        ref={prefixRef}
        width={500}
        height={80}
        fill={"rgba(16, 185, 129, 0.1)"}
        stroke={colors.highlight}
        lineWidth={2}
        radius={12}
        y={-60}
        opacity={0}
      >
        <Txt
          text="[Context: 2024财报，对比2023同期]"
          fill={colors.highlight}
          fontSize={18}
          fontWeight={600}
        />
      </Rect>

      <Node ref={llmRef} y={200} opacity={0}>
        <Icon icon="mdi:brain" size={60} color={colors.highlight} />
      </Node>
    </Node>,
  );

  // Animation
  yield* all(
    subtitleRef().opacity(1, 0.5),
    subtitleRef().y(-280, 0.5),
    chunkRef().opacity(1, 0.5),
  );

  yield* waitFor(0.8);
  yield* llmRef().opacity(1, 0.5);
  yield* subtitleRef().text("LLM 为 Chunk 生成概要前缀", 0.5);

  yield* prefixRef().opacity(1, 0.5);
  yield* prefixRef().y(-50, 0.5, easeOutCubic);

  yield* all(
    chunkRef().stroke(colors.highlight, 0.5),
    chunkRef().lineWidth(6, 0.5),
  );

  yield* waitFor(2);
});
