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
            <div className="max-h-full bg-gray-100 p-4 flex flex-col items-center">
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
                  <div className="w-full max-w-2xl flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleStartRecording(startRecording)}
                        disabled={status === "recording"}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-blue-300 mx-2"
                      >
                        Start Recording
                      </button>
                      <button
                        onClick={stopRecording}
                        disabled={status !== "recording"}
                        className="bg-red-500 text-white px-4 py-2 rounded-md disabled:bg-red-300 mx-2"
                      >
                        Stop Recording
                      </button>
                    </div>
                    {status === "recording" && previewStream && (
                      <div className="w-full bg-black rounded-md overflow-hidden">
                        <video
                          ref={(video) => {
                            if (video) {
                              video.srcObject = previewStream;
                            }
                          }}
                          autoPlay
                          muted
                          className="w-full"
                        />
                      </div>
                    )}
                    <div className="flex flex-col items-center space-y-4">
                      {imageUrl && (
                        <div className="w-full mb-3 sm:w-[450px] h-[200px] sm:h-[450px]">
                          <Image
                            width={600}
                            height={600}
                            src={imageUrl}
                            alt="Image"
                            className="rounded-md object-contain h-full w-full"
                          />
                        </div>
                      )}
                      <h1 className="text-xl font-semibold">Image</h1>
                      <input
                        type="file"
                        ref={image}
                        onChange={handleImageChange}
                        className="border p-2 rounded-md"
                      />
                      <h1 className="text-xl font-semibold">Upload Video Caption</h1>
                      <input
                        type="text"
                        ref={caption}
                        className="border p-2 rounded-md w-full"
                      />
                      <CustomMultiSelect
                        options={productDropDown}
                        onSelect={handleSelect}
                        multi={false}
                      />
                      {/* {selectedOption && (
                        <div className="w-full">
                          <VideoProductCardComponent product={selectedOption} />
                        </div>
                      )} */}
                    </div>
                    <button
                      onClick={handleUpload}
                      className="w-full bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </button>
                    {previewUrl && (
                      <div className="w-full bg-black rounded-md overflow-hidden mt-4">
                        <video src={previewUrl} controls autoPlay loop className="w-full" />
                        <div className="flex justify-between mt-2">
                          <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                          >
                            {uploading ? "Uploading..." : "Upload"}
                          </button>
                          <button
                            onClick={() => setPreviewUrl(null)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md"
                          >
                            Discard
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }}
            />
          </div>
          );
        }}
      />
    </div>
  );
};

export default ReelRecorder;
