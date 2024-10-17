import CardGuide from "@/components/card-guide";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";

const Guides = () => {
  return (
    <section
      id="guides"
      className="bg-[url('/paralayang_sm.jpg')] md:bg-[url('/paralayang.jpg')] bg-cover bg-center bg-no-repeat"
    >
      <div className="bg-guides">
        <div className="container max-w-screen-2xl pt-12 pb-14 md:pt-16 md:pb-16">
          <div className="md:h-[240px]">&nbsp;</div>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:max-w-[400px] flex-none md:pt-20">
              <p className="label-l uppercase">ultimate guides</p>
              <h2 className="headline-l mt-2">
                The ultimate guide for the ultimate trip
              </h2>
              <p className="mt-6">
                From dedicated nature and surf guides to dive instructors and
                underwater photographers, we have amassed a network of experts
                in their respective fields to offer the height of specialized
                services on a charter.
              </p>
              <Button
                className="label-l uppercase mt-6"
                variant="primary"
                size={"lg"}
              >
                talk with our guides
              </Button>
            </div>
            <div className="flex-1 max-w-[calc(100%+32px)] -mr-8 overflow-x-hidden">
              <div className="relative pb-20 md:pb-0 md:pt-20">
                <Carousel
                  className="w-full"
                  opts={{ align: "start", loop: false }}
                >
                  <CarouselContent className="-ml-1">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <CarouselItem key={index} className="pl-1 basis-64">
                        <CardGuide />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-0 md:left-auto -bottom-20 md:right-24 md:-top-20" />
                  <CarouselNext className="absolute left-16 md:left-auto -bottom-20 md:right-4 md:-top-20" />
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Guides;
