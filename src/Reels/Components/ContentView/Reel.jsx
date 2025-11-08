"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react"; // لو مش مركب iconify: npm i @iconify/react

export default function Reel({ videos }) {
  const [playingIndex, setPlayingIndex] = useState(null);
  const videoRefs = useRef([]);

  // ⏯️ Handle play/pause logic cleanly
  const handleVideoClick = (index) => {
    const currentVideo = videoRefs.current[index];
    if (!currentVideo) return;

    if (playingIndex === index) {
      // Pause if same video clicked again
      currentVideo.pause();
      setPlayingIndex(null);
    } else {
      // Pause all others
      videoRefs.current.forEach((video, i) => {
        if (video && i !== index) video.pause();
      });
      // Reset & play new one
      currentVideo.currentTime = 0;
      currentVideo.play();
      setPlayingIndex(index);
    }
  };

  // Pause all videos when unmounting
  useEffect(() => {
    return () => {
      videoRefs.current.forEach((v) => v && v.pause());
    };
  }, []);

  const handleEdit = (videoId) => {
    console.log("Edit clicked for video:", videoId);
    // ممكن تفتح Drawer أو Modal هنا
  };

  const handleDelete = (videoId) => {
    console.log("Delete clicked for video:", videoId);
    // هنا ممكن تعمل confirm delete أو call API
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 justify-items-center">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="relative cursor-pointer group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => handleVideoClick(index)}
          >
            {/* الفيديو */}
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="w-[180px] md:w-[325px] h-[320px] md:h-[656px] object-cover rounded-xl"
              src={video.src}
              loop
              muted
              playsInline
            />

            {/* overlay play/pause icon */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all">
              {playingIndex === index ? (
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 9v6m4-6v6"
                  />
                </svg>
              ) : (
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 5v14l11-7z"
                  />
                </svg>
              )}
            </div>

            {/* أيقونات Edit / Delete */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
              {/* Edit */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(video.id);
                }}
                className="bg-blueMain/50 hover:bg-blueMain text-white p-2 rounded-md shadow-sm transition"
              >
                <Icon icon="flowbite:edit-solid" width={18} />
              </button>

              {/* Delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(video.id);
                }}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md shadow-sm transition"
              >
                <Icon icon="wpf:delete" width={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
