import React, { useContext } from "react";
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

const Stream = () => {
  const { login, user } = useContext(AuthContext);
  console.log(user);
  return (
    <div className="relative bg-background-image max-w-xs rounded-xl overflow-hidden shadow-lg">
      <Card className="rounded-xl">
        <CardContent className="p-0">
          <Image
            src={user?.image ?? ""}
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
    </div>
  );
};

export default Stream;
