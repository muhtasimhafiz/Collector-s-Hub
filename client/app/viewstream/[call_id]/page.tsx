"use client"

// import { LivestreamLayout, StreamCall, StreamVideo, StreamVideoClient, User } from '@stream-io/video-react-sdk';

import { LivestreamLayout, StreamCall, StreamVideo, StreamVideoClient, User } from '@stream-io/video-react-sdk';
import { Chat, Channel, ChannelHeader, MessageList, MessageInput, Window } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'stream-chat-react/dist/css/index.css';

const apiKey = 'mmhfdzb5evj2'; // the API key can be found in the "Credentials" section
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiS2ktQWRpLU11bmRpIiwiaXNzIjoiaHR0cHM6Ly9wcm9udG8uZ2V0c3RyZWFtLmlvIiwic3ViIjoidXNlci9LaS1BZGktTXVuZGkiLCJpYXQiOjE3MTYwMjIxMTYsImV4cCI6MTcxNjYyNjkyMX0.G0D3ZRZd-nwuRtlvRhBT6B_T3UlLnjDxYaXD0TNqC8E'; // the token can be found in the "Credentials" section
const userId = 'Ki-Adi-Mundi'; // the user id can be found in the "Credentials" section
const callId = 'RHimLHqfasdfaTp9k1'; // the call id can be found in the "Credentials" section
const chatToken = token;
const chatApiKey = apiKey;
// set up the user object
const user: User = {
  id: userId,
  name: 'Oliver-Viewer',
  image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver-Viewer',
};

// Initialize video client
const videoClient = new StreamVideoClient({ apiKey: apiKey, user, token: token });
const call = videoClient.call('livestream', callId);

// Disable camera and microphone for the viewer
call.camera.disable();
call.microphone.disable();

// Join the call and handle any errors
call.join().catch((error) => {
  console.error("Error joining the call:", error);
});

// Initialize chat client
const chatClient = StreamChat.getInstance(chatApiKey);
chatClient.connectUser(
  {
    id: userId,
    name: 'Oliver-Viewer',
    image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver-Viewer',
  },
  chatToken,
);

const channel = chatClient.channel('livestream', callId, {
  name: 'Livestream Chat',
});

const Page = () => {
  return (
    <StreamVideo client={videoClient}>
      <StreamCall call={call}>
      <LivestreamLayout showParticipantCount={true} showDuration={true} showLiveBadge={true} />
          <Chat client={chatClient} theme="livestream dark">
            <Channel channel={channel}>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
            </Channel>
          </Chat>
        {/* </LivestreamLayout> */}
      </StreamCall>
    </StreamVideo>
  );
};

export default Page;
