import React, { type ReactNode } from "react";
import CodeBlock from "@theme-original/CodeBlock";
import type CodeBlockType from "@theme/CodeBlock";
import type { WrapperProps } from "@docusaurus/types";

type Props = WrapperProps<typeof CodeBlockType>;

export default function CodeBlockWrapper(props: Props): ReactNode {
  const language =
    props.language || props.className?.match(/language-(\w+)/)?.[1];
  return (
    <div className="custom-code-block" data-language={language}>
      <CodeBlock {...props} />
    </div>
  );
}
