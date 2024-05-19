import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { AuthContext } from "@/hooks/auth/AuthProvider";
import { getStreams } from "@/Services/zego-stream";
import { ILivestream } from "@/types/streams";
import Link from "next/link";

const Stream = () => {
  const { login, user } = useContext(AuthContext);
  const [livestreams, setLivestreams] = useState<ILivestream[]>([]);
  console.log(user);
  useEffect(() => {
    const fetchLivestreams = async () => {
      try {
        const response = await getStreams({ status: "live" });
        setLivestreams(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLivestreams();
  }, []);
  return (
    <div className="mb-4">
      {livestreams.length>0 && <h1 className="font-bold text-lg">Stream</h1>}
      <div className="flex justify-center">
        {livestreams.map((stream) => (
          <div
            key={stream.id}
            className="relative bg-background-image max-w-xs rounded-xl overflow-hidden shadow-lg"
          >
            <Link href={`/room/${stream.uuid}/audience`}>
              <Card className="rounded-xl">
                <CardContent className="p-0">
                  <Image
                    src={stream.user?.image ?? ""}
                    alt="image"
                    height="100"
                    width="100"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {/* {isLive && ( */}
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Live
                  </div>
                  {/* )} */}
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stream;
