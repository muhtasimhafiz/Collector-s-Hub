// pages/reels.tsx
import React, { useState } from 'react';
import VideoCard from './VideoCard';
import VideoModal from './VideoModal';
import { IVideo } from '@/types/video';

// const videoData = [
//   {
//     url: "https://res.cloudinary.com/dlcjonwcq/video/upload/sp_auto/v1716565320/1_video_1716565313898.m3u8",
//     thumbnail: "/path/to/thumbnail1.jpg"
//   },
//   // Add more video objects with url and thumbnail
// ];

const ReelsPage = ({videoDataObj}:{videoDataObj:IVideo[]}) => {
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; thumbnail: string } | null>(null);
  const videoData = videoDataObj.map((video) => ({
    url: video.video,
    thumbnail: video.thumbnail,
  }));
  const handleCardClick = (video: { url: string; thumbnail: string }) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videoData.map((video, index) => (
          <VideoCard key={index} video={video} onClick={handleCardClick} />
        ))}
      </div>
      {selectedVideo && (
        <VideoModal
          videos={videoData}
          initialIndex={videoData.indexOf(selectedVideo)}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ReelsPage;
