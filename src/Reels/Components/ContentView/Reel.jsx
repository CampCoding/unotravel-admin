import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { img } from "../../../utils/imageUrl.js";

export default function Reel({ videos, onDelete, onEdit }) {
  const [playingIndex, setPlayingIndex] = useState(null);
  const videoRefs = useRef([]);

  const handleVideoClick = (index) => {
    const currentVideo = videoRefs.current[index];
    if (!currentVideo) return;
    if (playingIndex === index) {
      currentVideo.pause();
      setPlayingIndex(null);
    } else {
      videoRefs.current.forEach((video, i) => { if (video && i !== index) video.pause(); });
      currentVideo.currentTime = 0;
      currentVideo.play();
      setPlayingIndex(index);
    }
  };

  useEffect(() => { return () => { videoRefs.current.forEach((v) => v && v.pause()); }; }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
      {videos.map((video, index) => {
        const thumbnailUrl = img(video.thumbnail);
        return (
          <div key={video.id} className="relative cursor-pointer group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 w-full" style={{ aspectRatio: "9/16", maxWidth: 200 }} onClick={() => handleVideoClick(index)}>
            <video ref={(el) => (videoRefs.current[index] = el)} className="w-full h-full object-cover" src={video.src} poster={thumbnailUrl || undefined} loop muted playsInline />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100`}>
                {playingIndex === index ? <Icon icon="mdi:pause" className="text-white" width={22} /> : <Icon icon="mdi:play" className="text-white ml-0.5" width={22} />}
              </div>
            </div>
            {playingIndex === index && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <span className="flex gap-0.5 items-end h-4">
                  {[...Array(3)].map((_, i) => (
                    <span key={i} className="w-1 bg-white rounded-full animate-pulse" style={{ height: `${[60, 100, 75][i]}%`, animationDelay: `${i * 150}ms` }} />
                  ))}
                </span>
                <span className="text-white text-[10px] font-medium">Playing</span>
              </div>
            )}
            <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <button onClick={(e) => { e.stopPropagation(); onEdit && onEdit(video); }} className="w-7 h-7 bg-white/20 backdrop-blur-sm hover:bg-blueMain text-white rounded-lg flex items-center justify-center transition shadow" title="Edit">
                <Icon icon="flowbite:edit-solid" width={13} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete && onDelete(video.id); }} className="w-7 h-7 bg-white/20 backdrop-blur-sm hover:bg-red-500 text-white rounded-lg flex items-center justify-center transition shadow" title="Delete">
                <Icon icon="wpf:delete" width={13} />
              </button>
            </div>
            <div className="absolute bottom-3 right-3 text-white/60 text-[10px] font-medium">#{video.id}</div>
          </div>
        );
      })}
    </div>
  );
}
