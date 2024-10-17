import { cn } from "@/lib/utils";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="bg-ex_secondary pb-4">
      <div className="container max-w-screen-2xl py-6 flex flex-col gap-6">
        <Image
          src="/main_lg.jpg"
          width={91.31}
          height={55.08}
          className="mix-blend-multiply"
          alt="explorindonesia"
        />
        <div className="flex justify-between min-h-[150px] flex-col md:flex-row gap-6 md:gap-4">
          <div className="max-w-[360px] flex flex-col justify-between gap-4">
            <p className="body-l">
              Discover the best Indonesia’s traveling inspiration, as well as
              guidance and itineraries from local experts across the Indonesia
              and around the world.
            </p>
            <p className="text-sm text-disabled">
              <b>©2023</b> ExplorIndonesia, Inc.
            </p>
          </div>
          <div className="flex flex-col justify-between gap-4">
            <div>
              <p className="uppercase label-m-bold mb-2">Contact Us</p>
              <div className="flex gap-4 md:gap-10 text-sm flex-col md:flex-row">
                <div className="flex flex-col gap-2">
                  <p>Jl. Singaraja II No.9</p>
                  <p>Seminyak, Bali</p>
                  <p>Indonesia</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Email: info@exploreindonesia.com</p>
                  <p>Office: +62 811 88 22 22</p>
                  <p>Whatsapp: +62 811 88 22 22</p>
                </div>
              </div>
            </div>
            <AppLinks className="hidden md:flex" />
          </div>
          <div className="flex flex-col justify-between gap-4">
            <div className="uppercase label-m-bold flex flex-col gap-2">
              <Link href="#">create your journey</Link>
              <Link href="#">talk with our guides</Link>
              <Link href="#">about</Link>
              <Link href="#">blog</Link>
            </div>
            <div className="flex gap-4">
              <Link href="#">
                <div className="bg-black text-white rounded-md p-1">
                  <Twitter className="w-4 h-4" />
                </div>
              </Link>
              <Link href="#">
                <div className="bg-black text-white rounded-md p-1">
                  <Facebook className="w-4 h-4" />
                </div>
              </Link>
              <Link href="#">
                <div className="bg-black text-white rounded-md p-1">
                  <Instagram className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>
          <AppLinks className="flex md:hidden" />
        </div>
      </div>
    </div>
  );
};

export default Footer;

const AppLinks = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex justify-between sm:items-center sm:gap-6 flex-col sm:flex-row",
        className
      )}
    >
      <Link href="#" className="label-l text-disabled">
        FAQ
      </Link>
      <div className="text-disabled">•</div>
      <Link href="#" className="label-l text-disabled">
        SITE MAP
      </Link>
      <div className="text-disabled">•</div>
      <Link href="#" className="label-l text-disabled">
        TERMS & CONDITIONS
      </Link>
      <div className="text-disabled">•</div>
      <Link href="#" className="label-l text-disabled">
        PRIVACY POLICY
      </Link>
    </div>
  );
};
