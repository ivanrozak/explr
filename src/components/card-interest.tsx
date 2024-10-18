import Image from "next/image";
import React, { useState } from "react";
import {
  IconClock,
  IconHeart,
  IconHeartFilled,
  IconTag,
  IconThreeDots,
} from "./icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "./ui/skeleton";
import { PinExtended } from "../../types";

const CardInterest = ({
  pin,
  handleLike,
}: {
  pin: PinExtended;
  handleLike?: (data: PinExtended) => void;
}) => {
  const [loading, setLoading] = useState(true);
  return (
    <div className="relative overflow-hidden rounded-lg aspect-[240/352] flex-none">
      {loading && <Skeleton className="absolute w-full h-full" />}
      <Image
        src={pin.image_url}
        fill
        className="object-cover object-center"
        alt="destination"
        unoptimized
        onLoad={() => setLoading(false)}
      />
      <div className="absolute top-0 right-0 p-4">
        <button
          className="text-white hover:scale-110"
          onClick={() => (handleLike ? handleLike(pin) : null)}
        >
          {pin.is_liked ? (
            <IconHeartFilled className="w-8 h-8" />
          ) : (
            <IconHeart className="w-8 h-8" />
          )}
        </button>
      </div>
      <div className="absolute bottom-0 w-full p-4 text-white bg-background/20 backdrop-blur supports-[backdrop-filter]:bg-background/20">
        <p className="title-m line-clamp-2">{pin.title}</p>
        <p className="label-m line-clamp-2">{pin.place_name}</p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-end gap-2">
            <IconClock className="w-4 h-4" />{" "}
            <p className="label-s">
              {pin.activity_duration} {pin.duration_unit}
            </p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="w-8 h-8 text-background hover:text-background hover:bg-foreground/10 p-0 rounded-full"
              >
                <IconThreeDots />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top">
              <div className="flex flex-col gap-4">
                <div
                  className="flex items-center gap-2 cursor-pointer text-orange"
                  onClick={() => (handleLike ? handleLike(pin) : null)}
                >
                  {pin.is_liked ? (
                    <IconHeartFilled className="w-8 h-8" />
                  ) : (
                    <IconHeart className="w-8 h-8" />
                  )}
                  <p className="label-l text-orange">ADD TO INTEREST LIST</p>
                </div>
                <div>
                  <p className="title-m">{pin.title}</p>
                  <p className="label-m">{pin.place_name}</p>
                </div>
                <div>
                  <p className="body-s">{pin.description}</p>
                </div>
                <div className="flex gap-2 text-disabled">
                  <IconTag />
                  <p className="label-s">-</p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default CardInterest;
