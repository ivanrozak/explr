"use client";
import NextAuthProvider from "@/components/provider/next-auth-provider";
import { Toaster } from "@/components/ui/sonner";
import React from "react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NextAuthProvider>
        {children}
        <Toaster position="bottom-center" closeButton />
      </NextAuthProvider>
    </>
  );
};

export default Provider;
