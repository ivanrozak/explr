import Guides from "@/sections/home/guides";
import Heading from "@/sections/home/heading";
import InterestList from "@/sections/home/interest-list";
import StaticNav from "@/sections/home/static-nav";
import dynamic from "next/dynamic";
import React from "react";
const InterestPointGrids = dynamic(
  () => import("@/sections/home/interest-point-grids"),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Page = () => {
  return (
    <>
      <div className="bg-ex_artboard">
        <StaticNav />
        <Heading />
        <div className="container max-w-screen-2xl">
          <InterestPointGrids />
        </div>
      </div>
      <Guides />
      <InterestList />
    </>
  );
};

export default Page;
