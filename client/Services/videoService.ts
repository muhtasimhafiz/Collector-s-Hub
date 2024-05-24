import axios from 'axios';

"use client"


export async function getVideo(videoId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/videos/${videoId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting video:', error);
    throw error;
  }
}

export async function createVideo(videoData: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(videoData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
}