"use client"
import React, { useState, useRef, useEffect } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder-2';
import axios from 'axios';

const ReelRecorder: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleStop = (blobUrl: string) => {
    setPreviewUrl(blobUrl);
    setRecordedVideo(blobUrl);
    setStream(null); // Reset the stream when recording stops
  };

  const handleUpload = async () => {
    if (!recordedVideo) return;

    setUploading(true);

    const blob = await fetch(recordedVideo).then(res => res.blob());
    const formData = new FormData();
    formData.append('file', blob);
    formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/your_cloud_name/video/upload', formData); // Replace with your Cloudinary cloud name
      console.log('Upload successful:', response.data);
      // Handle successful upload
    } catch (error) {
      console.error('Upload failed:', error);
      // Handle upload error
    } finally {
      setUploading(false);
      setPreviewUrl(null);
      setRecordedVideo(null);
    }
  };

  const handleStartRecording = (startRecording: () => void) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    startRecording();
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
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
        render={({ startRecording, stopRecording, mediaBlobUrl, status, mediaRecorder, previewStream }) => {
          mediaRecorderRef.current = mediaRecorder;

          return (
            <div>
              <button onClick={() => handleStartRecording(startRecording)} disabled={status === 'recording'}>
                Start Recording
              </button>
              <button onClick={stopRecording} disabled={status !== 'recording'}>
                Stop Recording
              </button>
              {status === 'recording' && previewStream && (
                <div>
                  <video
                    ref={video => {
                      if (video) {
                        video.srcObject = previewStream;
                      }
                    }}
                    autoPlay
                    muted
                  />
                </div>
              )}
              {previewUrl && (
                <div>
                  <video src={previewUrl} controls autoPlay loop />
                  <button onClick={handleUpload} disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
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
