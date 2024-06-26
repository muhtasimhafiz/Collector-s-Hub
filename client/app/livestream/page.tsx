"use client"
import { useCall, useCallStateHooks, ParticipantView } from '@stream-io/video-react-sdk';

// add styles for the video UI
import '@stream-io/video-react-sdk/dist/css/styles.css';


// import { StreamCall, StreamVideo, StreamVideoClient, User } from '@stream-io/video-react-sdk';
// import { Channel, StreamChat } from 'stream-chat';
// import { ChannelHeader, Chat, MessageInput, MessageList } from 'stream-chat-react';


import React, { useEffect, useState } from 'react';
// import { useCall, useCallStateHooks, ParticipantView } from '@stream-io/video-react-sdk';
import { StreamCall, StreamVideo, StreamVideoClient, User } from '@stream-io/video-react-sdk';
import { Chat, Channel, ChannelHeader, MessageList, MessageInput, Window } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'stream-chat-react/dist/css/index.css';
import { v4 as uuidv4 } from 'uuid';


const apiKey = 'mmhfdzb5evj2'; // the API key can be found in the "Credentials" section
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiQ2FsbGlzdGFfTWluZyIsImlzcyI6Imh0dHBzOi8vcHJvbnRvLmdldHN0cmVhbS5pbyIsInN1YiI6InVzZXIvQ2FsbGlzdGFfTWluZyIsImlhdCI6MTcxNjA5NzYzMywiZXhwIjoxNzE2NzAyNDM4fQ.m1Mn7kl-8hnhj5BgOhsZH0xgeUjiIgExjBUpDjxgLqM'; // the token can be found in the "Credentials" section
const userId = 'Callista_Ming'; // the user id can be found in the "Credentials" section
// const callId = uuidv4(); // the call id can be found in the "Credentials" section
const callId = "6d48b08d-6e75-45a8-ad7a-3a8d34a63d99"


console.log(callId)
// set up the user object
const user: User = {
  id: userId,
  name: 'new',
  image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};

// Initialize chat client
const chatClient = StreamChat.getInstance(apiKey);
chatClient.connectUser(
  {
    id: userId,
    name: 'Oliver-Broadcaster',
    image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver-Broadcaster',
  },
  token,
);

const channel = chatClient.channel('livestream', callId, {
  name: 'Livestream Chat',
});

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call('livestream', callId);
call.join({ create: true });

export default function Page() {
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyLivestreamUI />
        <ChatUI />
      </StreamCall>
    </StreamVideo>
  );
};

export const MyLivestreamUI = () => {
  const call = useCall();
  const {
    useIsCallLive,
    useLocalParticipant,
    useParticipantCount,
    // ... more hooks
  } = useCallStateHooks();
  const totalParticipants = useParticipantCount();
  const localParticipant = useLocalParticipant();
  const isCallLive = useIsCallLive();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <div
        style={{
          alignSelf: 'flex-start',
          color: 'white',
          backgroundColor: 'blue',
          borderRadius: '8px',
          padding: '4px 6px',
        }}
      >
        Live: {totalParticipants}
      </div>
      <div style={{ flex: 1 }}>
        {localParticipant && (
          <ParticipantView
            participant={localParticipant}
            // disables the extra UI elements as such:
            // name, audio, video indicator, etc...
            ParticipantViewUI={null}
          />
        )}
      </div>
      <div style={{ alignSelf: 'center' }}>
        {isCallLive ? (
          <button onClick={() => call?.stopLive()}>Stop Livestream</button>
        ) : (
          <button onClick={() => call?.goLive()}>Start Livestream</button>
        )}
      </div>
    </div>
  );
};


export const ChatUI = () => {
  return (
    <Chat client={chatClient} theme="livestream dark">
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
};