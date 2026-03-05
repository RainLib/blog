import { Node, Rect, Txt, Icon, NodeProps } from "@motion-canvas/2d";
import { Reference, SignalValue } from "@motion-canvas/core";

export interface LlmBubbleProps extends NodeProps {
  iconRef?: Reference<Icon>;
  bubbleRef?: Reference<Rect>;
  textRef?: Reference<Txt>;
  iconColor?: SignalValue<string>;
  bubbleColor?: SignalValue<string>;
  textColor?: SignalValue<string>;
  initialText?: SignalValue<string>;
}

export function LlmBubble(props: LlmBubbleProps) {
  return (
    <Node {...props}>
      <Icon
        ref={props.iconRef}
        icon="mdi:robot-outline"
        size={100}
        color={props.iconColor ?? "#94A3B8"}
      />
      <Rect
        ref={props.bubbleRef}
        layout
        direction="row"
        alignItems="center"
        justifyContent="center"
        offset={[-1, 0]} // Grow to the right of the icon
        x={60}
        y={-50}
        fill={props.bubbleColor ?? "#F8FAF8"}
        radius={16}
        padding={[16, 24]}
        opacity={0}
        scale={0.5}
      >
        <Txt
          ref={props.textRef}
          text={props.initialText ?? "思考中..."}
          fill={props.textColor ?? "#0F172A"}
          fontSize={24}
          fontWeight={700}
          fontFamily={"Inter, sans-serif"}
        />
      </Rect>
    </Node>
  );
}
