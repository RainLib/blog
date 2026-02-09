import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

// Augment the JSX namespace to include the custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "motion-canvas-player": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src: string;
          auto?: boolean | string;
          mode?: string;
        },
        HTMLElement
      >;
    }
  }
}

export default function MotionCanvasPlayer({ src }: { src: string }) {
  return (
    <BrowserOnly fallback={<div>Loading animation...</div>}>
      {() => {
        // Dynamically import the player only on the client
        import("@motion-canvas/player");
        return (
          <div className="glass-panel p-4 my-8 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,242,254,0.3)]">
            <motion-canvas-player src={src} auto="true" />
          </div>
        );
      }}
    </BrowserOnly>
  );
}
