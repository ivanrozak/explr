"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import React from "react";
import { useMediaQuery } from "react-responsive";

const InterestPointGrids = () => {
  const isMd = useMediaQuery({ query: "(min-width: 768px)" });
  const isLg = useMediaQuery({ query: "(min-width: 1024px)" });
  const isXl = useMediaQuery({ query: "(min-width: 1280px)" });

  const totalTiles = isXl ? 5 : isLg ? 4 : isMd ? 3 : 2;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 sm:gap-x-6 gap-y-4 sm:gap-y-8 pb-16">
      {Array.from({ length: 15 }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "relative overflow-hidden rounded-lg aspect-[240/352]",
            {
              "top-6 sm:top-16": ((index % totalTiles) + 1) % 2 === 0,
            }
          )}
        >
          <Skeleton className="w-full h-full" />
        </div>
      ))}
    </div>
  );
};

export default InterestPointGrids;
