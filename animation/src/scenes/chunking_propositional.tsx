import { makeScene2D, Rect, Txt, Node, Icon } from "@motion-canvas/2d";
import {
  all,
  waitFor,
  createRef,
  easeInCubic,
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
  };

  view.fill(colors.bg);

  const subtitleRef = createRef<Txt>();
  const rawBoxRef = createRef<Rect>();
  const machineRef = createRef<Node>();
  const propContainerRef = createRef<Node>();

  view.add(
    <Node>
      <Txt
        ref={subtitleRef}
        text="命题切分 (Propositional Chunking)"
        fill={colors.textDim}
        fontSize={32}
        fontWeight={600}
        fontFamily={"Inter, sans-serif"}
        y={-300}
        opacity={0}
      />

      {/* Raw Text Box */}
      <Rect
        ref={rawBoxRef}
        width={400}
        height={300}
        x={-450}
        fill={colors.chunkBg}
        stroke={colors.chunkBorder}
        lineWidth={4}
        radius={24}
        opacity={0}
      >
        <Txt
          text="张三生于1990年的北京，\n随后进入清华大学计算机系..."
          fill={colors.textMain}
          fontSize={20}
          width={350}
          padding={20}
          fontFamily={"Inter, sans-serif"}
        />
      </Rect>

      {/* LLM Machine */}
      <Node ref={machineRef} x={0} opacity={0}>
        <Icon icon="mdi:robot-industrial" size={120} color={colors.textDim} />
        <Rect
          width={140}
          height={140}
          stroke={colors.textDim}
          lineWidth={4}
          radius={20}
          lineDash={[10, 10]}
        />
      </Node>

      {/* Propositions */}
      <Node ref={propContainerRef} x={450} />
    </Node>,
  );

  // Animation
  yield* all(
    subtitleRef().opacity(1, 0.5),
    subtitleRef().y(-280, 0.5),
    rawBoxRef().opacity(1, 0.5),
    machineRef().opacity(1, 0.5),
  );

  const props = ["张三出生于1990年", "张三出生在北京", "张三就读于清华大学"];

  for (let i = 0; i < props.length; i++) {
    const pRef = createRef<Rect>();
    propContainerRef().add(
      <Rect
        ref={pRef}
        width={350}
        height={60}
        y={i * 80 - 80}
        fill={colors.highlight}
        radius={12}
        opacity={0}
        x={-100}
      >
        <Txt text={props[i]} fill={"#0F172A"} fontSize={18} fontWeight={700} />
      </Rect>,
    );

    yield* pRef().opacity(1, 0.3);
    yield* pRef().x(0, 0.5, easeOutCubic);
    yield* waitFor(0.2);
  }

  yield* subtitleRef().text("解构为独立的原子命题 (Atomic Propositions)", 0.5);
  yield* waitFor(2);
});
