// components/VideoCard.tsx
import Image from 'next/image';
import React from 'react';

interface VideoCardProps {
  video: {
    url: string;
    thumbnail: string;
  };
  onClick: (video: { url: string; thumbnail: string }) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  return (
    <div className="video-card" onClick={() => onClick(video)}>
      <Image src={video.thumbnail} alt="thumbnail" className="w-full h-auto" 
      width={300}
      height={200}
      />
    </div>
  );
};

export default VideoCard;
