"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { optionsDurationUnit } from "@/constants/variables";
import { AxiosError } from "axios";
import { Category, Pin, PinType, Tag } from "@prisma/client";
import { MapReturnValue } from "../../../types";
import MapsDialog from "./dialog-maps";

const pinTypeOptions = Object.entries(PinType).map(([key, value]) => ({
  value,
  label: key.charAt(0) + key.slice(1).toLowerCase(),
}));

const DialogInterestPoint = ({
  open,
  currentData,
  onOpenChange,
  refetch,
  setCurrentData,
}: {
  open: boolean;
  currentData: Pin | null;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
  setCurrentData: (data: Pin | null) => void;
}) => {
  const [isFileRequired, setIsFileRequired] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [categoryOptions, setCategoryOptions] = React.useState<Category[]>([]);
  const [tagOptions, setTagOptions] = React.useState<Tag[]>([]);
  const [image_url, setImage_url] = React.useState<string | null>(null);
  const [tagInput, setTagInput] = React.useState<string>("");
  const [tagInputLoading, setTagInputLoading] = React.useState(false);

  const categoryList = categoryOptions.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  const tagList = tagOptions.map((tag) => ({
    value: tag.id.toString(),
    label: tag.name,
  }));

  const FormSchema = z.object({
    title: z.string().min(2),
    description: z.string().min(2),
    activity_duration: z.number(),
    duration_unit: z.string().optional(),
    file: isFileRequired
      ? z.instanceof(File).refine((file) => file.size < 7000000, {
          message: "Your resume must be less than 7MB.",
        })
      : z.instanceof(File).optional(),
    type: z.enum(Object.values(PinType) as [PinType, ...PinType[]]),
    place_name: z.string().optional(),
    address: z.string().min(2),
    latitude: z.number(),
    longitude: z.number(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      activity_duration: 1,
      duration_unit: "day",
      file: undefined,
      type: PinType.ACTIVITY,
      place_name: "",
      categories: [],
      address: "",
      latitude: undefined,
      longitude: undefined,
      tags: [],
    },
  });

  const watchedFile = form.watch("file");

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("pin_type", data.type);
    formData.append("place_name", data.place_name as string);
    formData.append("address", data.address as string);
    formData.append("latitude", data.latitude.toString());
    formData.append("longitude", data.longitude.toString());
    formData.append("link", "default");
    formData.append("activity_duration", data.activity_duration.toString());
    formData.append("duration_unit", data.duration_unit as string);

    if (data.file) {
      formData.append("file", data.file as File);
    }

    if (currentData?.id) {
      formData.append("id", currentData.id.toString());
    }

    if (data.categories) {
      data.categories.forEach((category) => {
        formData.append("categories", category);
      });
    }

    if (data.tags) {
      data.tags.forEach((tag) => {
        formData.append("tags", tag);
      });
    }

    try {
      if (currentData) {
        const res = await axiosInstance.put("/interest-point", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success(
          res.data?.message || "Interest Point updated successfully"
        );
        refetch();
        setIsLoading(false);
        onOpenChange(false);
        setCurrentData(null);
      } else {
        const res = await axiosInstance.post("/interest-point", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success(
          res.data?.message || "Interest Point created successfully"
        );
        refetch();
        setIsLoading(false);
        onOpenChange(false);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occured");
    }
  }

  const fetchCategory = async () => {
    const res = await axiosInstance.get("/category");
    if (res.status === 200) {
      setCategoryOptions(res.data.data);
    }
  };

  const fetchCategoryByPin = async () => {
    const res = await axiosInstance.get("/category", {
      params: {
        pinId: currentData?.id,
      },
    });
    if (res.status === 200 && res.data?.data?.length > 0) {
      const result = res.data?.data?.map((category: any) =>
        category?.id?.toString()
      );
      form.setValue("categories", result as string[]);
    }
  };

  const fetchTagsByPin = async () => {
    const res = await axiosInstance.get("/tag", {
      params: {
        pinId: currentData?.id,
      },
    });
    if (res.status === 200 && res.data?.data?.length > 0) {
      const result = res.data?.data?.map((tag: any) => tag?.id?.toString());
      form.setValue("tags", result as string[]);
    }
  };

  const createNewTag = async () => {
    if (!tagInput.trim()) {
      return;
    }

    setTagInputLoading(true);
    try {
      const res: any = await axiosInstance.post("/tag", {
        name: tagInput,
      });
      if (res) {
        toast.success(res.data?.message || "Tag created successfully");
        fetchTags();
        setTagInput("");
        form.setValue("tags", [
          ...(form.getValues("tags") || []),
          res.data?.data?.toString(),
        ]);
      }
    } catch (error: AxiosError | any) {
      toast.error(error?.response?.data?.message);
    }
    setTagInputLoading(false);
  };

  const fetchTags = async () => {
    try {
      const res = await axiosInstance.get("/tag");
      if (res) {
        setTagOptions(res.data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (!open) {
      form.reset();
      setCurrentData(null);
      setIsFileRequired(true);
    } else {
      fetchCategory();
      fetchTags();
      if (currentData) {
        form.setValue("title", currentData.title);
        form.setValue("description", currentData?.description as string);
        form.setValue(
          "activity_duration",
          currentData?.activity_duration as number
        );
        form.setValue("duration_unit", currentData?.duration_unit as string);
        form.setValue("type", currentData?.pin_type?.toString() as PinType);
        form.setValue("place_name", currentData.place_name);
        form.setValue("address", currentData?.address as string);
        form.setValue("latitude", currentData.latitude);
        form.setValue("longitude", currentData.longitude);
        fetchCategoryByPin();
        fetchTagsByPin();
        setImage_url(currentData.image_url);
        setIsFileRequired(false);
      }
    }
  }, [open]);

  const [openMapDialog, setOpenMapDialog] = useState(false);

  const onMapSubmit = (data: MapReturnValue) => {
    form.setValue("latitude", data.latitude);
    form.setValue("longitude", data.longitude);
    form.setValue("address", data.address);
    form.setValue("place_name", data.place_name);
    setOpenMapDialog(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Add new Interest Point</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (Activity / Place)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="activity_duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(event) =>
                                field.onChange(event.target.value)
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            example of use comma: 1.5
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="duration_unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Duration Unit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {optionsDurationUnit.map((item) => (
                                  <SelectItem
                                    key={item.value}
                                    value={item.value}
                                  >
                                    {item.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            {...fieldProps}
                            onChange={(event) =>
                              onChange(
                                event.target.files && event.target.files[0]
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchedFile && (
                    <Image
                      src={URL.createObjectURL(watchedFile as File)}
                      height={200}
                      width={200}
                      className="w-full h-auto"
                      alt="Uploaded image"
                    />
                  )}
                  {image_url && !watchedFile && (
                    <Image
                      src={image_url}
                      height={200}
                      width={200}
                      className="w-full h-auto"
                      alt="Uploaded image"
                      unoptimized
                    />
                  )}
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest Point Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a verified email to display" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {pinTypeOptions.map((option) => (
                              <SelectItem
                                value={option.value}
                                key={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="pt-4">
                    <Button
                      variant={"primaryoutline"}
                      className="w-full"
                      onClick={(e) => {
                        setOpenMapDialog(true);
                        e.preventDefault();
                      }}
                    >
                      Prefill place information from Google Maps
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="place_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <MultiSelect
                          options={categoryList}
                          onValueChange={field.onChange}
                          defaultValue={field.value || []}
                          placeholder="Select options"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <MultiSelect
                          options={tagList}
                          onValueChange={field.onChange}
                          defaultValue={field.value || []}
                          placeholder="Select tags"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4 items-center">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                    />
                    <Button
                      variant="primaryoutline"
                      isLoading={tagInputLoading}
                      onClick={(e) => {
                        createNewTag();
                        e.preventDefault();
                      }}
                    >
                      + Add New Tags
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="submit" isLoading={isLoading} variant={"primary"}>
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <MapsDialog
        open={openMapDialog}
        onOpenChange={setOpenMapDialog}
        onSubmit={onMapSubmit}
      />
    </>
  );
};

export default DialogInterestPoint;
