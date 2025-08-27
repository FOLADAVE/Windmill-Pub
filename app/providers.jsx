"use client";

import { SessionProvider } from "next-auth/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { StoreProvider } from "./context/StoreContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <GoogleOAuthProvider clientId="940186451790-40ci0hou2mrk6hqve1depotlf22e0adu.apps.googleusercontent.com">
        <StoreProvider>{children}</StoreProvider>
      </GoogleOAuthProvider>
    </SessionProvider>
  );
}
