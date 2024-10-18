"use client";
import React, { useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import Image from "next/image";
import { IconMinusCircle, IconPlusCircle } from "@/components/icons";
import { useRouter } from "next/navigation";
import { pinStore } from "@/store/pins";
import { Category, CategoryType } from "@prisma/client";
import TransitionPanel from "../ui/transition-panel";

export default function ActivityTabDialog() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [ref, bounds] = useMeasure();
  const [activeTab, setActiveTab] = useState<CategoryType>(CategoryType.THEME);
  const [selectedCategory, setSelectedCategory] = useState<Category[]>([]);

  const { categories, setCategories } = pinStore();

  const selectCategory = (category: Category) => {
    const index = selectedCategory.findIndex((cat) => cat.id === category.id);
    if (index !== -1) {
      // Category is already selected, remove it
      const updatedSelection = [...selectedCategory];
      updatedSelection.splice(index, 1);
      setSelectedCategory(updatedSelection);
    } else {
      // Category is not selected, add it
      setSelectedCategory([...selectedCategory, category]);
    }
  };

  const selectAll = () => {
    if (selectedCategory.length === categories.length) {
      setSelectedCategory([]);
    } else {
      setSelectedCategory(categories);
    }
  };

  const fetchData = async () => {
    const res = await axiosInstance.get("/category");
    setCategories(res.data.data || []);
  };

  const themes: Category[] = categories.filter(
    (item) => item.type.toString() === CategoryType.THEME
  );
  const activities: Category[] = categories.filter(
    (item) => item.type.toString() === CategoryType.ACTIVITY
  );

  useEffect(() => {
    fetchData();
  }, []);

  const handleSetActiveTab = (tab: CategoryType) => {
    setActiveTab(tab);

    if (tab === CategoryType.THEME) {
      handleSetActiveIndex(activeIndex - 1);
    } else {
      handleSetActiveIndex(activeIndex + 1);
    }
  };

  const handleSetActiveIndex = (newIndex: number) => {
    setDirection(newIndex > activeIndex ? 1 : -1);
    setActiveIndex(newIndex);
  };

  const goToSearch = () => {
    router.push(
      "/search?categories=" +
        selectedCategory.map((item) => item.name).join(",")
    );
  };

  const CategoryComponent = ({ data }: { data: Category }) => {
    return (
      <div
        className="relative aspect-[375/110] flex justify-center items-center bg-ex_disabled text-white cursor-pointer"
        onClick={() => selectCategory(data)}
      >
        <Image
          src={data.image_url}
          className="object-cover object-center"
          fill
          unoptimized
          alt="image"
        />
        <div className="absolute top-0 right-0 p-2">
          {selectedCategory.includes(data) ? (
            <IconMinusCircle />
          ) : (
            <IconPlusCircle />
          )}
        </div>
        <h6 className="title-m relative z-1">{data.name}</h6>
      </div>
    );
  };

  return (
    <>
      <Tabs
        defaultValue={CategoryType.THEME}
        onValueChange={(value) =>
          handleSetActiveTab(value.toString() as CategoryType)
        }
        value={activeTab}
        className="w-full mb-3"
      >
        <TabsList className="grid w-full grid-cols-2 p-0 h-auto rounded-xl shadow-custom2 overflow-hidden">
          <TabsTrigger
            value={CategoryType.THEME}
            className="h-20 flex flex-col rounded-none"
          >
            <p className="body-s text-foreground">I WANT TRIP THAT</p>
            <p className="title-l text-disabled">Choose themes</p>
          </TabsTrigger>
          <TabsTrigger
            value={CategoryType.ACTIVITY}
            className="h-20 flex flex-col rounded-none"
          >
            <p className="body-s text-foreground">WHERE I CAN</p>
            <p className="title-l text-disabled">Choose activities</p>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="w-full overflow-hidden rounded-xl border p-6 bg-white">
        <TransitionPanel
          activeIndex={activeIndex}
          variants={{
            enter: (direction) => ({
              x: direction > 0 ? 364 : -364,
              opacity: 0,
              height: bounds.height > 0 ? bounds.height : "auto",
              position: "initial",
            }),
            center: {
              zIndex: 1,
              x: 0,
              opacity: 1,
              height: bounds.height > 0 ? bounds.height : "auto",
            },
            exit: (direction) => ({
              zIndex: 0,
              x: direction < 0 ? 364 : -364,
              opacity: 0,
              position: "absolute",
              top: 0,
              width: "100%",
            }),
          }}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          custom={direction}
        >
          <div ref={ref} className="grid grid-cols-2 gap-4">
            {themes?.map((item, index) => (
              <CategoryComponent key={index} data={item} />
            ))}
          </div>
          <div ref={ref} className="grid grid-cols-2 gap-4">
            {activities?.map((item, index) => (
              <CategoryComponent key={index} data={item} />
            ))}
          </div>
        </TransitionPanel>
        <div className="flex justify-between items-center mt-6">
          <div className="label-l font-regular text-disabled">
            {selectedCategory.length} SELECTED
          </div>
          <div className="flex gap-4 items-center">
            <Button
              variant={"ghost"}
              size={"sm"}
              className="label-l font-semibold"
              onClick={selectAll}
            >
              CHOOSE ALL
            </Button>
            <Button
              variant={"primary"}
              size={"sm"}
              className="label-l font-semibold px-4"
              onClick={goToSearch}
            >
              NEXT
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
