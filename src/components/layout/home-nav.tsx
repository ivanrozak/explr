"use client";
// import UserActionButton from "@/components/commons/UserActionButton";
import links, { linkArray, linkClassName } from "@/constants/links";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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
    <>
      {/* navbar with show on scroll */}
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
                <Link
                  key={link.name}
                  href={link.href}
                  className={linkClassName}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
          <nav className="ml-auto flex gap-6 items-center">
            {/* <UserActionButton /> */}
          </nav>
        </div>
      </header>
      {/* static navbar */}
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
            {/* <UserActionButton withoutLogin /> */}
          </nav>
        </div>
      </header>
    </>
  );
};

export default HomeNav;
