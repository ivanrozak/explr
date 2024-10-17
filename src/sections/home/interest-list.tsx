import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const InterestList = () => {
  const imageSliderList = [
    {
      url: "/int_spiritual_summer.png",
      title: "Spiritual Summer",
    },
    {
      url: "/int_under_the_sea.png",
      title: "Under the Sea",
    },
    {
      url: "/int_romantic_birthday.png",
      title: "Romantic Birthday",
    },
    {
      url: "/int_family_cruise.png",
      title: "Family Cruise",
    },
  ];
  return (
    <section
      id="interest-list"
      style={{
        background: "linear-gradient(260.14deg, #06564A 0%, #098673 90.83%)",
      }}
    >
      <div className="container max-w-screen-2xl py-16 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        <div className="hidden sm:block">
          <Image
            src={"/free_collection_journey.png"}
            width={1264}
            height={1024}
            alt="free collection journey"
          />
        </div>
        <div className="flex sm:hidden">
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-slider pb-4">
            {imageSliderList.map((item, index) => (
              <div
                key={index}
                className="snap-center shrink-0 w-full aspect-[203/160] rounded-md relative overflow-hidden"
              >
                <Image
                  src={item.url}
                  alt={item.title}
                  width={203}
                  height={160}
                  className="w-full h-full"
                />
                <div className="absolute bottom-0 left-0 text-background p-4">
                  <p>{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-background">
          <p className="label-m uppercase">YOUR INTEREST LIST</p>
          <h2 className="headline-l mt-2">
            Start your journey with a free collection
          </h2>
          <p className="mt-6">
            Save ideas you like, collect your favorites to personalised your own
            journey free for 1 time. You just need less than $10 to consult with
            our guides to get the ultimate peace of mind itinerary.
          </p>
          <Button className="label-l mt-6" variant="primary" size={"lg"}>
            CREATE YOUR JOURNEY
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InterestList;
