import Guides from "@/sections/home/guides";
import Heading from "@/sections/home/heading";
import InterestList from "@/sections/home/interest-list";
import StaticNav from "@/sections/home/static-nav";
import React from "react";

const Page = () => {
  return (
    <>
      <div className="bg-ex_artboard">
        <StaticNav />
        <Heading />
      </div>
      <Guides />
      <InterestList />
    </>
  );
};

export default Page;
