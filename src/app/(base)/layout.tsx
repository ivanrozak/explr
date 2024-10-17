"use client";
import BaseNav from "@/components/layout/base-nav";
import Footer from "@/components/layout/footer";
import HomeNav from "@/components/layout/home-nav";
import { usePathname } from "next/navigation";
import React from "react";

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col min-h-screen">
      {pathname === "/" ? <HomeNav /> : <BaseNav />}
      <main className="flex-1 bg-cream">{children}</main>
      <Footer />
    </div>
  );
};

export default BaseLayout;
