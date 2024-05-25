"use client";
import React, { useContext } from "react";
import { AuthContext } from "@/hooks/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";

const NavBar = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const goLive = () => {
    const uniqueId = uuidv4();
    router.push(`/room/${uniqueId}/host`);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
      <nav className="bg-white border-2 text-black p-3 flex justify-between items-center rounded-full mx-10">
        <div className="flex items-center">
          <Link href="/" className="text-lg font-semibold text-gray-800 hover:text-gray-600 transition duration-200">
            Home
          </Link>
        </div>

        <div className="flex gap-2 items-center">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={goLive}
                className="px-3 py-1 rounded-md border border-black bg-white text-red-500 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              >
                Go Live
              </button>

              <button
                onClick={() => router.push(`/video`)}
                className="px-3 py-1 rounded-md border border-black bg-white text-green-500 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              >
                Record Video
              </button>

              <Link href={`/account/${user.id}`}>
                <button className="px-3 py-1 rounded-md border border-black bg-white text-green-500 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
                  Hello {user.username}
                </button>
              </Link>
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105">
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
