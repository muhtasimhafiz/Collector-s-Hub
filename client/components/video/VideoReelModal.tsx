import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import Image from 'next/image';
import { Dialog, DialogContent } from '../ui/dialog';
import { IVideo } from '@/types/video';

// interface Product {
//   id: number;
//   name: string;
//   image: string;
//   description: string;
//   price: string;
// }

// interface Reel {
//   id: number;
//   thumbnail: string;
//   video: string;
//   product: Product;
// }

interface VideoReelModalProps {
  reel: IVideo;
  onClose: () => void;
  reels: IVideo[];
}

const VideoReelModal: React.FC<VideoReelModalProps> = ({ reel, onClose, reels }) => {
  const [currentReel, setCurrentReel] = useState<IVideo>(reel);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setCurrentReel(reel);
  }, [reel]);

  const handleNext = () => {
    const currentIndex = reels.findIndex((r) => r.id === currentReel.id);
    const nextIndex = (currentIndex + 1) % reels.length;
    setCurrentReel(reels[nextIndex]);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.load();
    }
  };

  return (
    <Dialog open={!!reel} onOpenChange={onClose}>
      <DialogContent>
      <div className="w-full max-w-3xl mx-auto my-8 p-4 border rounded-lg shadow-lg text-center bg-white">
        <video ref={videoRef} src={currentReel.video} controls autoPlay className="w-full h-auto rounded-lg" />
        <div className="flex items-center mt-4 text-left">
          <Image src={currentReel.product.image} alt={currentReel.product.name} className="w-16 h-16 rounded-lg mr-4" width={100} height={100}/>
          <div className="flex flex-col">
            <h3 className="m-0">{currentReel.product.name}</h3>
            <p className="text-gray-600 mt-1">{currentReel.product.description}</p>
            <p className="font-bold mt-1">{`USD ${currentReel.product.price}`}</p>
          </div>
        </div>
        <button onClick={handleNext} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
          Next
        </button>
      </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoReelModal;
