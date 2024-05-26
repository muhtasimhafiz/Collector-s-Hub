// components/ProductReel.tsx
import { IVideo } from "@/types/video";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const ReelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  // border-radius: 8px;
  // border: 1px solid #ccc;
`;

const VideoCard = styled.div`
  width: 300px;
  margin: 20px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  background: linear-gradient(110deg, black 45%, #1e2631 55%, black);
  color: white;
`;

const VideoElement = styled.video`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const ProductInfo = styled.div`
  margin-top: 10px;
  text-align: left;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  margin-right: 10px;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.h3`
  margin: 0;
`;

const ProductDescription = styled.p`
  color: #777;
  margin: 5px 0;
`;

const ProductPrice = styled.p`
  font-weight: bold;
`;

const NextButton = styled.button`
  margin: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ProductReel = ({ videos }: { videos: IVideo[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const goToNextVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handleNextButtonClick = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    goToNextVideo();
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleEnded = () => {
        goToNextVideo();
      };
      videoElement.addEventListener("ended", handleEnded);
      return () => {
        videoElement.removeEventListener("ended", handleEnded);
      };
    }
  }, [currentIndex]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, [currentIndex]);

  return (
    <ReelContainer>
      <VideoCard key={videos[currentIndex].id}>
        <VideoElement
          ref={videoRef}
          src={videos[currentIndex].video}
          controls
          autoPlay
          muted
        />
        <ProductInfo>
          <div className="flex flex-row justify-between">
            <ProductImage
              src={videos[currentIndex].product.image}
              alt={videos[currentIndex].product.name}
            />
            <button
              onClick={handleNextButtonClick}
              className="inline-flex h-6 animate-shimmer items-center justify-center rounded-md border border-slate-600 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              Next
            </button>
          </div>
          <ProductDetails>
            <Link href={`/product/${videos[currentIndex].product.id}`}>
              <ProductName>{videos[currentIndex].product.name}</ProductName>
            </Link>

            <ProductDescription>
              {videos[currentIndex].product.description}
            </ProductDescription>
            <ProductPrice>$ {videos[currentIndex].product.price}</ProductPrice>
          </ProductDetails>
        </ProductInfo>
      </VideoCard>

      {/* <NextButton onClick={handleNextButtonClick}>Next</NextButton> */}
    </ReelContainer>
  );
};

export default ProductReel;
