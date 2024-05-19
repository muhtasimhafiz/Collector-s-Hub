"use client";
import React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

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
      // showScreenSharingButton: true,
      sharedLinks: [
        {
          name: "copy link",
          url: "http:/localhost:3000/room/" + roomID,
        },
      ],
    });
  };
  return (
    <div>
      <h1>Room {roomID}</h1>
      {/* <div ref={myLiveStream} /> */}
      <div  ref={myLiveStream} />
    </div>
  );
};

export default Page;
