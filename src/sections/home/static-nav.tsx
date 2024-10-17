import UserActionButton from "@/components/layout/user-action-button";
import links, { linkClassName } from "@/constants/links";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const StaticNav = () => {
  return (
    <header className="w-full">
      <div className="container h-16 md:h-28 max-w-screen-2xl grid grid-cols-3 items-center">
        <div>
          <nav className="hidden md:flex gap-8 items-center">
            <Link href={links.createJourney} className={linkClassName}>
              create your journey
            </Link>
            <Link href={links.askGuides} className={linkClassName}>
              ask our guides
            </Link>
          </nav>
        </div>
        <div className="flex justify-center grid-cols-3 md:grid-cols-1 items-center">
          <Link href={links.home}>
            <Image
              src="/main_lg.jpg"
              width={91.31}
              height={56}
              className="mix-blend-multiply h-10 w-auto md:h-auto"
              alt="explorindonesia"
            />
          </Link>
        </div>
        <nav className="ml-auto hidden md:flex gap-8 items-center">
          <Link href={links.blog} className={linkClassName}>
            blog
          </Link>
          <Link href={links.contactUs} className={linkClassName}>
            contact us
          </Link>
          <UserActionButton withoutLogin />
        </nav>
      </div>
    </header>
  );
};

export default StaticNav;
