// components/VideoModal.tsx
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

interface VideoModalProps {
  videos: { url: string; thumbnail: string }[];
  initialIndex: number;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ videos, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
        if (currentIndex < videos.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setCurrentIndex(0); // Loop back to the first video
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentIndex, videos]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white p-2 rounded z-50"
        >
          Close
        </button>
        {videos.map((video, index) => (
          <div
            key={index}
            className={`${index === currentIndex ? 'block' : 'hidden'} w-full h-full`}
          >
            <ReactPlayer
              url={video.url}
              playing={true}
              controls={true}
              width="100%"
              height="100%"
              className="relative z-40"
              style={{ pointerEvents: 'auto' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoModal;
