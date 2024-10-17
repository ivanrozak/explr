"use client";
import links, { linkArray, linkClassName } from "@/constants/links";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import UserActionButton from "./user-action-button";

const ActiveDots = () => {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="4" cy="4" r="4" fill="#F1644B" />
    </svg>
  );
};

const BaseNav = () => {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 shadow-sm transition-top ease-in-out duration-300 z-50 w-full bg-white">
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
              <Link
                key={link.name}
                href={link.href}
                className={cn("flex items-center gap-1", linkClassName, {
                  "text-orange": pathname.startsWith(link.href),
                })}
              >
                {link.name} {pathname.startsWith(link.href) && <ActiveDots />}
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

export default BaseNav;
