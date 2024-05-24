import { IProduct } from '@/types/product'
import React, { useState } from 'react'
import Image from 'next/image'
const VideoProductCardComponent = ({product}:{product:IProduct}) => {
  console.log("video product card component")
  console.log(product);
  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-64 h-36">
          <Image
           src={product.image}
            alt={product.name} className="w-full h-full object-cover" 
           width={256} height={144}
           />
        </div>
        <div className="text-center mt-2">
          <h1 className="text-lg font-semibold">{product.name}</h1>
          <p className="text-sm text-gray-500">{product.description}</p>
        </div>
      </div>
    </div>
  )
}

export default VideoProductCardComponent