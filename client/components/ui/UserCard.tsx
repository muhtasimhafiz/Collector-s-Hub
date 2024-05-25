"use client";

import Image from 'next/image';
import React from 'react';
import avatar from "@/assets/photo-1633332755192-727a05c4013d.avif";



const UserCard = ({ imageUrl, name }:{imageUrl:string|null, name:string}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
        <Image
          src={imageUrl || avatar}
          alt={name}
          className="w-full h-full object-cover"
          width={100}
          height={100}
        />
      </div>
      <p className="mt-2 text-center text-lg font-semibold">{name}</p>
    </div>
  );
};

export default UserCard;
