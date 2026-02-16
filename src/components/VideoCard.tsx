import React from "react";

interface VideoCardProps {
  src: string;
  type: "youtube" | "bilibili" | "local";
  description?: string;
  title?: string;
}

export default function VideoCard({
  src,
  type,
  description,
  title,
}: VideoCardProps) {
  let videoSrc = src;

  if (type === "youtube") {
    videoSrc =
      src.includes("youtube.com") || src.includes("youtu.be")
        ? src.replace(
            /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/,
            "https://www.youtube.com/embed/$1",
          )
        : `https://www.youtube.com/embed/${src}`;
  } else if (type === "bilibili") {
    const bvid = src.match(/BV[a-zA-Z0-9]+/)
      ? src.match(/BV[a-zA-Z0-9]+/)?.[0]
      : src;
    videoSrc = `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&as_wide=1&allowfullscreen=true`;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl bg-zinc-50 dark:bg-zinc-900/50 mb-8 mt-4 group transition-all hover:shadow-2xl">
      <div className="aspect-video relative">
        {type === "local" ? (
          <video
            controls
            width="100%"
            className="block h-full w-full object-cover"
            src={src}
          >
            您的浏览器不支持 video 标签。
          </video>
        ) : (
          <iframe
            width="100%"
            height="100%"
            src={videoSrc}
            title={title || `${type} video player`}
            frameBorder="0"
            allow={
              type === "youtube"
                ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                : ""
            }
            allowFullScreen
            className="block"
          ></iframe>
        )}
      </div>
      {(description || title) && (
        <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80">
          {title && (
            <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">
              {title}
            </h4>
          )}
          {description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic mb-0">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
