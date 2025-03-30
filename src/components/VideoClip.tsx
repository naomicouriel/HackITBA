// components/VideoClip.tsx
"use client";

import React from "react";
import YouTube from "react-youtube";

interface VideoClipProps {
  title: string;
  start: number;
  end: number;
}

const VideoClip: React.FC<VideoClipProps> = ({ title, start, end }) => {
  return (
    <div className="mb-8 border p-4 rounded">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <YouTube
        videoId="2ibqfxEAESo"
        opts={{
          width: "560",
          height: "315",
          playerVars: {
            start: Math.floor(start),
            end: Math.floor(end),
            controls: 1,
            enablejsapi: 1,
            origin: window.location.origin,
          },
        }}
      />
    </div>
  );
};

export default VideoClip;
