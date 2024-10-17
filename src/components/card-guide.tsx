import Image from "next/image";
import React from "react";
import { IconHeart, IconTag, IconThreeDots } from "./icons";

const CardGuide = () => {
  return (
    <div className="relative overflow-hidden rounded-lg aspect-[240/352] w-[240px]">
      <Image
        src="/destination-placeholder.jpg"
        fill
        className="object-cover object-center"
        alt="destination"
      />
      <div className="absolute top-0 right-0 p-4">
        <div className="text-white">
          <IconHeart className="w-8 h-8" />
        </div>
      </div>
      <div className="absolute bottom-0 w-full p-4 pt-8 text-white bg-background/20 backdrop-blur supports-[backdrop-filter]:bg-background/20">
        <div className="absolute -top-10 border-[3px] border-white aspect-square w-16 h-16 overflow-hidden rounded-xl">
          <Image
            src="/destination-placeholder.jpg"
            fill
            className="object-cover object-center"
            alt=""
          />
        </div>
        <p className="title-m">Heronimus Y. Belutowe</p>
        <p className="label-m line-clamp-2">
          Specialized in Sea Activities Eastern, Indonesia
        </p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-end gap-2">
            <IconTag className="w-4 h-4 flex-none" />{" "}
            <p className="label-s line-clamp-1">
              Surf Guide, Dive Guides Lorem ipsum dolor sit amet.
            </p>
          </div>
          <div>
            <IconThreeDots />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardGuide;
