import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

// Augment the JSX namespace to include the custom element

export default function MotionCanvasPlayer({ src }: { src: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const playerRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setAttribute("auto", "");
    }
  }, []);

  return (
    <BrowserOnly fallback={<div>Loading animation...</div>}>
      {() => {
        // Dynamically import the player only on the client
        import("@motion-canvas/player");
        return (
          <div
            ref={containerRef}
            className="glass-panel p-1 rounded-xl shadow-[0_0_20px_rgba(0,242,254,0.3)] relative group bg-black/80 backdrop-blur-md"
            style={{ aspectRatio: "16/9" }}
          >
            <motion-canvas-player ref={playerRef} src={src} />

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Toggle Fullscreen"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </button>
          </div>
        );
      }}
    </BrowserOnly>
  );
}
