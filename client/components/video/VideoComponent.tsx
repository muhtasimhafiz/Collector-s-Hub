"use client"
import { fetchVideos } from '@/Services/videoService'
import { IVideo } from '@/types/video'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ReelsPlayer from './ReelsPlayer'
import ReelsPage from './Reels'


const VideoComponent = ({user_id=null}:{user_id:number|null}) => {
  const [videos, setVideos] = useState<IVideo[]>([])
  useEffect(() => {
    console.log('VideoComponent')
    const fetchData = async () => {
      try{
        let searchObj:any = {}
        if(user_id){
          searchObj = {
            user_id:user_id
          }
        }
        const data = await fetchVideos(searchObj)
        console.log(data)
        setVideos(data)
      } catch(error:any){
        console.log(error)
        toast.error('Error fetching videos ', error.message)
      }
    }

    fetchData();
  }, [])
  return (
    <div>
        <ReelsPage videoDataObj={videos} />
    </div>
  )
}

export default VideoComponent