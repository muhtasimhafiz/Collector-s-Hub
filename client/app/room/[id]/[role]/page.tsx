"use client";
import React, { useContext, useEffect, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { create } from "domain";
import { AuthContext } from "@/hooks/auth/AuthProvider";
import { createStream, updateStream, updateStream_all } from "@/Services/zego-stream";
import { useRouter } from "next/navigation";

interface RoomId {
  params: { id: string; role: string };
}

function randomID(len) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

const Page = ({ params }: RoomId) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // useEffect(() => {
  //   if (isMounted && !user?.id) {
  //     router.back();
  //   }
  // }, [isMounted, user, router]);

  if (!isMounted) {
    return null;
  }

  const roomID = params.id;
  const myLiveStream = async (element) => {
    // generate Kit Token
    const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
    const serverSecret = "" + process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      Date.now().toString(),
      "BroadCaster"
    );
    const role_str = params.role;

    console.log(role_str);
    //create instance for live room
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    
    const role =
    role_str === 'host'
    ? ZegoUIKitPrebuilt.Host
    : role_str === 'cohost'
    ? ZegoUIKitPrebuilt.Cohost
    : ZegoUIKitPrebuilt.Audience;
    
    console.log(role);
    //join room
    zc.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.LiveStreaming,
        config: {
          role,
          
        },
      },
      onJoinRoom: async () => {
        if(role_str === 'host'){
          console.log("host");
          try{
            await createStream({uuid: roomID, user_id:user?.id, status:'live'});
          } catch(error:any) {
            console.log("error creating stream");
          }
        }
      },
      onLeaveRoom: async () => {
        if(role_str === 'host'){
          console.log("host");
          try{
            await updateStream_all({uuid: roomID}, {status:'offline'});
          } catch(error:any) {
            console.log("error creating stream");
          }
        }
      },
      // showScreenSharingButton: true,
      sharedLinks: [
        {
          name: "copy link",
          url: "http:/localhost:3000/room/" + roomID,
        },
      ],
    });
  };
  // useEffect(() => {});
  return (
    <div>
      <h1>Room {roomID}</h1>
      {/* <div ref={myLiveStream} /> */}
      <div  ref={myLiveStream} />
    </div>
  );
};

export default Page;
