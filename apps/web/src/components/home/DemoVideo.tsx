import React from "react";

const DemoVideo: React.FC = () => (
  <div className="w-full flex justify-center my-8">
    <div className="relative w-full max-w-2xl aspect-video">
      <iframe
        src="https://www.youtube.com/embed/_98zhRBNSSE?si=LNnl2cTZis-VRHZL"
        title="YouTube video player"
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  </div>
);

export default DemoVideo;