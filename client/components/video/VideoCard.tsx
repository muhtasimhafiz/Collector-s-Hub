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
      <Image src={video.thumbnail} alt="thumbnail" className="rounded-lg" 
      width={100}
      height={100}
      />
    </div>
  );
};

export default VideoCard;
