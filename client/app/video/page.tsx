"use client";
import React, { useState, useRef, useEffect, useContext, use } from "react";
import { ReactMediaRecorder } from "react-media-recorder-2";
import axios from "axios";
import CustomMultiSelect from "@/components/ui/single-select";
import { IProduct } from "@/types/product";
import { fetchProducts } from "@/Services/products/product";
import { ProductDropDown } from "@/components/streams/LiveBiddingHost";
import { MultiValue } from "react-select";
import { AuthContext } from "@/hooks/auth/AuthProvider";
import VideoProductCardComponent from "@/components/ui/video-product-component";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { SingleValue } from "react-select";
import toast from "react-hot-toast";
import { cldUpload } from "@/Services/cloudinary";
import { create } from "domain";
import { createVideo } from "@/Services/videoService";

const ReelRecorder: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  let user = localStorage.getItem("user");
  if (user) {
    user = JSON.parse(user);
  }
  const [selectedOption, setSelectedOption] = useState<IProduct | null>(null);
  const [options, setOptions] = useState<ProductDropDown[]>([]);
  const [products, setProducts] = useState<IProduct>([]);
  const [productDropDown, setProductDropDown] = useState<ProductDropDown[]>([]);
  const caption = useRef<HTMLInputElement | null>(null);
  const image = useRef<HTMLInputElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const router = useRouter();


  console.log("in method");
  useEffect(() => {
    console.log("fetching productss");
    const fetchUserProducts = async () => {
      if (!user) return;
      console.log("valid");
      try {
        const response = await fetchProducts({
          seller_id: user.id,
        });
        console.log(response);
        setProducts(response);
        setProductDropDown(
          response.map((product) => ({
            value: product.id,
            label: product.name,
            thumbnail: product.image,
          }))
        );
      } catch (err: any) {
        console.log(err);
      }
    };

    fetchUserProducts();
  }, []);

  if (!user) {
    router.push("/login");
  }

  const handleStop = (blobUrl: string) => {
    setPreviewUrl(blobUrl);
    setRecordedVideo(blobUrl);
    setStream(null); // Reset the stream when recording stops
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      const file = event.target.files[0];

      // form.setValue("image", file);

      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleSelect = (selected: ProductDropDown) => {
    // console.log(selectedOptions);
    // console.log(products);
    const selectedProduct = products.find(
      (product: IProduct) => product.id === selected
    );
    setSelectedOption(selectedProduct ? selectedProduct : null);
    console.log(selectedOption);
    // const selectedProductIds = selectedOptions.map((option) => option.value);
    // const selectedProduct = products.find((product) =>
    //   product.id == selectedOptions.value
    // );
    // setSelectedOptions(selectedProduct);
  };

  const handleUpload = async () => {
    
    // console.log(formData);
    console.log(caption.current.value);
    console.log(selectedOption);
    console.log(image.current?.files[0]);

    if (caption.current.value.trim() === "") {
      toast.error("Caption is missing");
      return;
    }

    if(image.current?.files[0] === undefined) {
      toast.error("Image is missing");
      return;
    }
    

    if (!recordedVideo) return;

    setUploading(true);

    const blob = await fetch(recordedVideo).then((res) => res.blob());
    const public_id = user.id + '_'+'video'+'_' + Date.now();


    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", "ggtwkfpx"); // Replace with your Cloudinary upload preset
    formData.append("public_id", public_id);


    // console.log(formData);
    // console.log(caption.current);
    // console.log(selectedOption);
    // console.log(image.current?.files[0]);
    // return;
    //validate image
    const imageFile = image.current?.files[0];
    if (imageFile) {
      const fileType = imageFile.type;
      const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
      if (!validImageTypes.includes(fileType)) {
        console.error("Invalid file type. Please select an image file.");
        setUploading(false);
        return;
      }
    } else {
      console.error("Please select an image file.");
      setUploading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dlcjonwcq/video/upload",
        formData
      ); 

      const imageResponse = await cldUpload(imageFile, user.id);

      console.log("Upload successful:", response.data);
      console.log("Upload successful:", imageResponse);

      const createObject = {
        caption: caption.current.value ?? "",
        video: response.data.secure_url,
        product_id: selectedOption.id??null,
        thumbnail: imageResponse.secure_url,
        user_id: user.id,
      };
      const res = await createVideo(createObject);
      console.log(res);
    } catch (error) {
      toast.error("Upload failed:");
      console.error("Upload failed:", error);
      // Handle upload error
    } finally {
      setUploading(false);
      setPreviewUrl(null);
      setRecordedVideo(null);
    }
  };

  const handleStartRecording = (startRecording: () => void) => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    startRecording();
  };

  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return (
    <div>
      <ReactMediaRecorder
        video
        onStop={handleStop}
        onStart={(stream) => setStream(stream)}
        render={({
          startRecording,
          stopRecording,
          mediaBlobUrl,
          status,
          mediaRecorder,
          previewStream,
        }) => {
          mediaRecorderRef.current = mediaRecorder;

          return (
            <div>
              <button
                onClick={() => handleStartRecording(startRecording)}
                disabled={status === "recording"}
              >
                Start Recording
              </button>
              <button onClick={stopRecording} disabled={status !== "recording"}>
                Stop Recording
              </button>
              {status === "recording" && previewStream && (
                <div>
                  <video
                    ref={(video) => {
                      if (video) {
                        video.srcObject = previewStream;
                      }
                    }}
                    autoPlay
                    muted
                  />
                </div>
              )}
              <div className="flex flex-col justify-center place-items-center">
                {imageUrl && (
                  <div className="w-full mb-3 sm:w-[450px] h-[200px] sm:h-[450px]">
                    {/* <AspectRatio ratio={16 / 9}> */}
                    <Image
                      width={1600}
                      height={900}
                      src={imageUrl}
                      alt="Image"
                      className="rounded-md object-contain h-full w-full" // Ensures the image fits within the div without stretching
                    />
                    {/* </AspectRatio> */}
                  </div>
                )}
                <h1>Image</h1>
                <input type="file" ref={image} onChange={handleImageChange} />
                <h1>Upload Video Caption</h1>
                <input type="text" ref={caption} />
                <CustomMultiSelect
                  options={productDropDown}
                  onSelect={handleSelect}
                  multi={false}
                />
                <div>
                  {selectedOption && (
                    <VideoProductCardComponent product={selectedOption} />
                  )}
                </div>
              </div>

              <button onClick={handleUpload}>
                {/* {uploading ? "Uploading..." : "Upload"} */}
                upload test
              </button>
              {previewUrl && (
                <div>
                  <video src={previewUrl} controls autoPlay loop />
                  <button onClick={handleUpload} disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                  <button onClick={() => setPreviewUrl(null)}>Discard</button>
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default ReelRecorder;
