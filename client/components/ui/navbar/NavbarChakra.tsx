"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { AuthContext } from "@/hooks/auth/AuthProvider";
import { v4 as uuidv4 } from "uuid";


const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const uniqueId = uuidv4();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 p-2 z-50">
      <div className="container mx-auto max-w-screen-xl w-11/12 rounded-lg bg-gradient-to-r from-gray-800 via-gray-900 to-black p-4 flex justify-between items-center shadow-lg">
        <div className="text-white text-xl font-bold">
          <Link href="/">Store</Link>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/product/create" className="text-gray-300 hover:text-white">
                Sell Products
              </Link>
              <Link href="/video" className="text-gray-300 hover:text-white">
                Reel
              </Link>
              <Link href={`/room/${uniqueId}/host`} className="text-gray-300 hover:text-white transition duration-300 ease-in-out transform hover:scale-105 hover:bg-red-600 px-4 py-1 rounded-md shadow-lg">
      <button  className="inline-flex h-6 animate-shimmer items-center justify-center rounded-md border border-red-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
      Go Live
          
        </button>
    </Link>
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="text-gray-300 hover:text-white flex items-center space-x-1"
                >
                  <span>Hello, {user.username}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                    <Link
                      href={`/account/${user.id}`}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link href="/login" className="text-gray-300 hover:text-white">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



