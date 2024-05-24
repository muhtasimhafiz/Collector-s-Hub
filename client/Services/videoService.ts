import { IVideo } from '@/types/video';
import axios from 'axios';

"use client"

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


export const fetchVideos = async (where: Partial<IVideo> = {}) => {
  try {
    const encodedParams = new URLSearchParams();
    for (const key in where) {
      if (where.hasOwnProperty(key)) {
        const value = (where as any)[key];
        // Assuming the value is an object with operators and values
        if (typeof value === 'object' && value !== null) {
          for (const operator in value) {
            if (value.hasOwnProperty(operator)) {
              encodedParams.append(`${key}[${operator}]`, value[operator]);
            }
          }
        } else {
          encodedParams.append(key, value);
        }
      }
    }
    const queryParams = encodedParams.toString();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos?${queryParams}`);
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
};