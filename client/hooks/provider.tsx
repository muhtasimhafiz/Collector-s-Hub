import React, { ReactNode } from "react";
import { AuthProvider } from "./auth/AuthProvider";

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default Providers;
