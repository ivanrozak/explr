"use client";
import { Toaster } from "@/components/ui/sonner";
import React from "react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Toaster richColors position="bottom-center" closeButton />
    </>
  );
};

export default Provider;
