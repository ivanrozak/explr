"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { IconInterest, IconMap, IconRoutes } from "@/components/icons";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import ActivityTabDialog from "@/components/dialog/dialog-activity-tab";
import qs from "qs";
import { PinType } from "@prisma/client";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { userStore } from "@/store/user";
import { pinStore } from "@/store/pins";
import CardInterest from "@/components/card-interest";
import { PinExtended } from "../../../types";

const tabClassName =
  "flex flex-col items-center justify-center py-4 cursor-pointer text-tertiary hover:bg-muted transition-colors duration-150 ease-in text-center text-xs sm:text-base sm:font-semibold";

const tabActiveClassName = "text-white bg-tertiary hover:bg-tertiary";

enum Tab {
  PLACE = "PLACE",
  POPULAR = "POPULAR",
  ACTIVITY = "ACTIVITY",
}

const RouteOptionTabs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = React.useState<Tab | null>(null);
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const typeParams = searchParams.get("type");

  useEffect(() => {
    if (activeTab === Tab.ACTIVITY) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [activeTab]);

  useEffect(() => {
    if (typeParams === Tab.PLACE) {
      setActiveTab(Tab.PLACE);
    } else {
      setActiveTab(Tab.POPULAR);
    }
  }, []);

  return (
    <section
      id="route-option-tabs"
      ref={sectionRef}
      className="max-w-[823px] mx-4 sm:mx-auto mt-8"
      style={{ scrollMarginTop: "70px" }}
    >
      <div className="bg-white overflow-hidden shadow-custom2 rounded-full grid grid-cols-3">
        <div
          className={cn(tabClassName, {
            [tabActiveClassName]: activeTab === Tab.PLACE,
          })}
          onClick={() => {
            setActiveTab(Tab.PLACE);
            router.replace(`/?type=PLACE`, { scroll: false });
          }}
        >
          <IconMap />
          <p className="mt-2">Map or Island</p>
        </div>
        <div
          className={cn(tabClassName, "border-r border-l", {
            [tabActiveClassName]: activeTab === Tab.POPULAR,
          })}
          onClick={() => {
            setActiveTab(Tab.POPULAR);
            router.replace("/", { scroll: false });
          }}
        >
          <IconRoutes />
          <p className="mt-2">Popular Routes</p>
        </div>
        <div
          className={cn(tabClassName, {
            [tabActiveClassName]: activeTab === Tab.ACTIVITY,
          })}
          onClick={() => setActiveTab(Tab.ACTIVITY)}
        >
          <IconInterest />
          <p className="mt-2">Based on Interest</p>
        </div>
      </div>
      <div className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: activeTab === Tab.ACTIVITY ? 1 : 0,
            y: activeTab === Tab.ACTIVITY ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          className={cn("absolute z-10 top-4 w-full max-w-[823px]", {
            hidden: activeTab !== Tab.ACTIVITY,
          })}
        >
          <ActivityTabDialog />
        </motion.div>
      </div>
    </section>
  );
};

const GridSkeletons = ({ totalTiles }: { totalTiles: number }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 sm:gap-x-6 gap-y-4 sm:gap-y-8">
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

const GridViews = () => {
  const searchParams = useSearchParams();
  const pinType = (searchParams.get("type") as PinType | undefined) || "ALL";
  const categories = searchParams.get("categories") as string;

  const { user } = userStore();
  const { pinData, setPinData } = pinStore();

  const [isLoading, setIsLoading] = useState(true);

  const [isOpenDialogInterest, setIsOpenDialogInterest] = React.useState(false);
  const [currentPin, setCurrentPin] = React.useState<PinExtended | null>(null);

  const fetchData = async (noLoading: boolean = false) => {
    if (!noLoading) {
      setIsLoading(true);
    }
    const res = await axiosInstance.get("/interest-point", {
      params: {
        type: pinType,
        categories: categories,
        userId: user?.id,
        anonymousId: localStorage.getItem("anonymousId"),
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "comma" });
      },
    });
    setPinData(res.data.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [pinType]);

  const like = async (payload: any) => {
    try {
      await axiosInstance.post("/interest-point/like", payload);
      await fetchData(true);
    } catch (error) {
      console.log(error);
    }
  };

  const unlike = async (payload: any) => {
    try {
      await axiosInstance.post("/interest-point/unlike", payload);
      await fetchData(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async (pin: PinExtended) => {
    if (pin.is_liked) {
      // do unlike
      await unlike({
        pinId: pin.id,
        anonymousId: localStorage.getItem("anonymousId"),
      });
      toast.success("Unliked successfully");
    } else {
      setIsOpenDialogInterest(true);
      setCurrentPin(pin);
    }
  };

  const submitLike = async (board_id: number) => {
    setIsOpenDialogInterest(false);

    if (!currentPin) return;
    try {
      await like({
        board_id,
        pin_id: currentPin.id,
        anonymousId: localStorage.getItem("anonymousId"),
      });
      toast.success("Liked successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const isMd = useMediaQuery({ query: "(min-width: 768px)" });
  const isLg = useMediaQuery({ query: "(min-width: 1024px)" });
  const isXl = useMediaQuery({ query: "(min-width: 1280px)" });

  const totalTiles = isXl ? 5 : isLg ? 4 : isMd ? 3 : 2;
  return (
    <div className="py-16">
      {pinData.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 sm:gap-x-6 gap-y-4 sm:gap-y-8 pb-16">
          {pinData?.map((pin, index) => (
            <div
              key={index}
              className={cn("relative", {
                "top-6 sm:top-16": ((index % totalTiles) + 1) % 2 === 0,
              })}
            >
              <CardInterest pin={pin} handleLike={handleLike} />
            </div>
          ))}
        </div>
      ) : (
        <GridSkeletons totalTiles={totalTiles} />
      )}
    </div>
  );
};

const InterestPointGrids = () => {
  return (
    <>
      <RouteOptionTabs />
      <GridViews />
    </>
  );
};

export default InterestPointGrids;
