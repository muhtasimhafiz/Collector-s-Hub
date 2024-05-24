"use client"

import { IVideo } from '@/types/video';
import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

// const videoData = [
//   {
//     url: "https://res.cloudinary.com/dlcjonwcq/video/upload/sp_auto/v1716565320/1_video_1716565313898.m3u8"
//   },
//   // Add more video URLs here
// ];




const ReelsPlayer = ({videoData, index}:{videoData:IVideo[], index:number}) => {
  const [currentIndex, setCurrentIndex] = useState(index);
  const playerRef = useRef(null);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
      if (currentIndex < videoData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentIndex]);

  return (
    <div>
      {videoData.map((video, index) => (
        <div
          key={index}
          style={{
            display: index === currentIndex ? 'block' : 'none',
            height: '100vh',
            width: '100vw',
            position: 'relative',
          }}
        >
          <ReactPlayer
            ref={playerRef}
            url={video.video}
            playing={true}
            controls={false}
            width="100%"
            height="100%"
            loop
          />
        </div>
      ))}
    </div>
  );
};

export default ReelsPlayer;
