"use client";
import links, { linkArray, linkClassName } from "@/constants/links";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import UserActionButton from "./user-action-button";

const HomeNav = () => {
  const [showNavbar, setShowNavbar] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 112) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed -top-16 shadow-sm transition-top ease-in-out duration-300 z-50 w-full bg-white",
        {
          "top-0": showNavbar,
        }
      )}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link className="mr-12" href={links.home}>
          <Image
            src="/main.jpg"
            width={62}
            height={34}
            className="mix-blend-multiply"
            alt="explorindonesia"
          />
        </Link>
        <div>
          <nav className="flex gap-8 items-center">
            {linkArray.map((link) => (
              <Link key={link.name} href={link.href} className={linkClassName}>
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <nav className="ml-auto flex gap-6 items-center">
          <UserActionButton />
        </nav>
      </div>
    </header>
  );
};

export default HomeNav;
