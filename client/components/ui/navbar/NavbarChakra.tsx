"use client";
import React, { useContext, useEffect, useState } from "react";
import { InputGroup, InputLeftElement, Input, Icon } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { AuthContext } from "@/hooks/auth/AuthProvider";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";

const NavBar = () => {
  const { user } = useContext(AuthContext);
  // const router = useRouter();
  // const uniqueId = uuidv4();
  // const [uniqueId, setUniqueId] = useState<string>(uuidv4());
  const router = useRouter();
  const goLive = () => {
    const uniqueId = uuidv4();
    router.push(`/room/${uniqueId}/host`);
  };

  return (
<div className="fixed top-0 left-0 w-full bg-white z-50 shadow">
      <nav className="bg-white shadow-md border-2 text-black p-3 flex justify-between items-center rounded-full mx-10">
        <div className="flex items-center">
          {/* Icon on the left */}
          {/* <Icon
            as={SearchIcon}
            className="w-6 h-6 mx-3 text-gray-600"
            aria-label="Menu"
          /> */}
          <Link href={"/"}>Home</Link>
        </div>

        <div className="flex gap-4 items-center">
          {/* Search input */}
          {/* <InputGroup size="sm" className="hidden sm:flex">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-200 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg"
            />
          </InputGroup> */}

          {/* Login Button */}
          {user ? (
            <div>
              {/* <Link href={`/room/${uniqueId}/host`}> */}
              <button
                onClick={goLive}
                className="mr-2 px-4 py-2 rounded-md border border-black bg-white text-red-500 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              >
                Go Live
              </button>
              {/* </Link> */}

              <span className="text-gray-700 font-semibold">
                <Link href={`/account/${user.id}`}>
                  <button className="mr-2 px-4 py-2 rounded-md border border-black bg-white text-green-500 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
                    Hello {user.username}
                  </button>
                </Link>
              </span>
            </div>
          ) : (
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105">
              Login
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
