import React, { useState } from "react";
import VideoReelModal from "./VideoReelModal";
import Image from "next/image";
import { User } from "@/types/user";
import { IVideo } from "@/types/video";

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

const ReelList = ({
  user,
  initialReels,
}: {
  user: User;
  initialReels: IVideo[];
}) => {
  const [selectedReel, setSelectedReel] = useState<IVideo | null>(null);

  const handleReelClick = (reel: IVideo) => {
    setSelectedReel(reel);
  };

  const handleCloseModal = () => {
    setSelectedReel(null);
  };

  return (
    <div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {initialReels.map((reel) => (
        <div key={reel.id} className="relative cursor-pointer" onClick={() => handleReelClick(reel)}>
          <Image src={reel.thumbnail} alt={reel.product.name} className="rounded-lg" height={200} width={200} />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-5.197-3.02a1 1 0 00-1.555.832v6.04a1 1 0 001.555.832l5.197-3.02a1 1 0 000-1.664z" />
            </svg>
          </div>
          <p className="text-center mt-2">{reel.product.name}</p>
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
