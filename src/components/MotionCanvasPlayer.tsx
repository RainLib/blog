import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import clsx from "clsx";

// Declare global to avoid TS errors
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "motion-canvas-player": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src: string;
        auto?: boolean | string;
        mode?: string;
        state?: string;
        setPlaying?: (playing: boolean) => void;
      };
    }
  }
}
export default function MotionCanvasPlayer({ src }: { src: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<any>(null); // Use any to access specific methods
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  // Toggle Native Fullscreen
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling play
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Sync fullscreen state
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player) return;

    if (player.state === "ready" && typeof player.setPlaying === "function") {
      player.setPlaying(!isPlaying);
      setIsPlaying(!isPlaying);
    } else if (
      player.player &&
      typeof player.player.togglePlayback === "function"
    ) {
      player.player.togglePlayback(!isPlaying);
      setIsPlaying(!isPlaying);
    }
  };

  // 高效、安全的播放状态控制函数
  const setPlaybackState = React.useCallback((shouldPlay: boolean) => {
    const player = playerRef.current;
    if (!player) return;

    setIsPlaying((prev) => {
      // 避免重复触发相同的状态，提升性能
      if (prev === shouldPlay) return prev;

      if (player.state === "ready" && typeof player.setPlaying === "function") {
        player.setPlaying(shouldPlay);
      } else if (
        player.player &&
        typeof player.player.togglePlayback === "function"
      ) {
        player.player.togglePlayback(shouldPlay);
      }

      return shouldPlay;
    });
  }, []);

  // 高效、不阻塞主线程的页面滚动监测 (IntersectionObserver原生API)
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 进入屏幕中部区域时触发 true，离开进入上下边缘区域时触发 false
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        // 核心逻辑：定义“中间区域”。通过 rootMargin 缩小视口触发范围：
        // 排除顶部 25% 和底部 25%，相当于元素只有进入屏幕中间区 50% 时才会播放
        // 移动到上下边缘则会自动暂停播放
        rootMargin: "-25% 0px -25% 0px",
        threshold: 0,
      },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // 监听可见性状态并同步播放状态
  React.useEffect(() => {
    setPlaybackState(isVisible);
  }, [isVisible, setPlaybackState]);

  React.useEffect(() => {
    const player = playerRef.current;
    if (player) {
      // player.setAttribute("auto", "true"); // Manual control

      const initPlayer = () => {
        if (player.state !== "ready") {
          requestAnimationFrame(initPlayer);
          return;
        }

        // Apply initial playback state once ready
        setPlaybackState(isVisible);

        // Inject shadow DOM styles
        const shadow = player.shadowRoot;
        if (shadow && !shadow.querySelector("#custom-styles")) {
          const style = document.createElement("style");
          style.id = "custom-styles";
          style.textContent = `
                .overlay { display: none !important; opacity: 0 !important; pointer-events: none !important; }
                :host {
                  display: flex !important;
                  align-items: center !important;
                  justify-content: center !important;
                  width: 100% !important;
                  height: 100% !important;
                  background: black !important;
                }
                #canvas {
                  width: auto !important;
                  height: auto !important;
                  max-width: 100% !important;
                  max-height: 100% !important;
                  display: block !important;
                }
              `;
          shadow.appendChild(style);
        }
      };

      initPlayer();
    }
  }, [isVisible, setPlaybackState]);

  return (
    <BrowserOnly
      fallback={
        <div className="animate-pulse bg-zinc-800/50 rounded-3xl w-full aspect-video" />
      }
    >
      {() => {
        import("@motion-canvas/player");
        return (
          <div
            ref={containerRef}
            onClick={togglePlay}
            className={clsx(
              "group motion-player-container relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl transition-all duration-500 cursor-pointer border border-white/10 flex items-center justify-center",
              isPlaying
                ? "hover:shadow-none"
                : "hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]",
            )}
          >
            {/* The Player Component - Disable pointer events to prevent native hover overlay */}
            <motion-canvas-player
              ref={playerRef}
              src={src}
              className="w-full h-full flex items-center justify-center object-contain max-h-screen pointer-events-none"
            />

            {/* Custom Play Button Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-300 z-10">
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {/* Modern Play Icon - Minimalist */}
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-white/20 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-10 h-10 text-white ml-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Controls Bar (Fullscreen) */}
            <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={toggleFullscreen}
                className="p-3 bg-black/40 hover:bg-black/60 text-white rounded-xl transition-all border border-white/10 backdrop-blur-md hover:scale-105 active:scale-95"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
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
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                  </svg>
                ) : (
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
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        );
      }}
    </BrowserOnly>
  );
}
