import React, { ReactNode } from "react";
import { AuthProvider } from "./auth/AuthProvider";
import { ChakraProvider } from "@chakra-ui/react";

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <AuthProvider>
      <ChakraProvider>{children}</ChakraProvider>
    </AuthProvider>
  );
};

export default Providers;
