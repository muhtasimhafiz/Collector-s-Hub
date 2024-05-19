// pages/api/get-chat-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { StreamChat } from 'stream-chat';

const apiKey = 'rtvz877pzexq';
const apiSecret = 'z43sjyab8fb9dbm7p2b46r3nfqyzbype55jdvkjdp5khkzg8x2qrafj7z8mkshfj';

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

type Data = {
  token?: string;
  message?: string;
  error?: string;
};

export default function getChatToken(userId: string, user: { name: string, id: number }) {

  try {
    const token = serverClient.createToken(userId);
    console.log(token);
    return token;
  } catch (error:any) {
     console.log(error.message);
  }
}
