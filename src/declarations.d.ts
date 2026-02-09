import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "motion-canvas-player": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src: string;
        auto?: boolean;
        mode?: string;
      };
    }
  }
}
