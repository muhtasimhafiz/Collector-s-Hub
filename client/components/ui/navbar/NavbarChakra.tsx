"use client";
import React, { useContext, useEffect, useState } from "react";
import { InputGroup, InputLeftElement, Input, Icon } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { AuthContext } from "@/hooks/auth/AuthProvider";


const NavBar = () => {
  const {user} = useContext(AuthContext);


  return (
    <div>
      <nav className="bg-white shadow-sm border-2 text-black p-3 flex justify-between items-center rounded-full mr-ml-40">
        <div className="flex items-center">
          {/* Icon on the left */}
          <Icon as={SearchIcon} className="w-6 h-6 mx-3" aria-label="Menu" />
        </div>

        <div className="flex gap-2 items-center">
          {/* Search input */}
          <InputGroup size="sm" className="hidden sm:flex">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-700 text-white placeholder-gray-400"
            />
          </InputGroup>

          {/* Login Button */}
          {user ? (
            <span>Hello {user.username}</span>
          ): (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">
              Login
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
