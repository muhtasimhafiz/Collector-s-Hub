import React, { useState } from 'react';
import VideoReelModal from './VideoReelModal';
import Image from 'next/image';
import { User } from '@/types/user';
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

const ReelList = ({user, initialReels}:{user:User, initialReels:IVideo[]}) => {
  const [selectedReel, setSelectedReel] = useState<IVideo | null>(null);

  const handleReelClick = (reel: IVideo) => {
    setSelectedReel(reel);
  };

  const handleCloseModal = () => {
    setSelectedReel(null);
  };

  return (
    <div>
      <div className="flex flex-row flex-wrap justify-start">
        {initialReels.map((reel) => (
          <div key={reel.id} className="w-24 m-2 text-xs text-center cursor-pointer" onClick={() => handleReelClick(reel)}>
            <Image src={reel.thumbnail} alt={reel.product.name} className="rounded-lg" height={100} width={100} />
            <p className="">{reel.product.name}</p>
          </div>
        ))}
      </div>
      {selectedReel && (
        <VideoReelModal reel={selectedReel} onClose={handleCloseModal} reels={initialReels} />
      )}
    </div>
  );
};

export default ReelList;
