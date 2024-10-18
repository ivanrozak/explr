"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import Image from "next/image";
import { Category, CategoryType } from "@prisma/client";

const categoryOptions = Object.entries(CategoryType).map(([key, value]) => ({
  value,
  label: key.charAt(0) + key.slice(1).toLowerCase(),
}));

const DialogCategory = ({
  open,
  currentData,
  onOpenChange,
  refetch,
  setCurrentData,
}: {
  open: boolean;
  currentData: Category | null;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
  setCurrentData: (data: Category | null) => void;
}) => {
  const [isFileRequired, setIsFileRequired] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const FormSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    file: isFileRequired
      ? z.instanceof(File).refine((file) => file.size < 7000000, {
          message: "Your resume must be less than 7MB.",
        })
      : z.instanceof(File).optional(),
    type: z.enum(
      Object.values(CategoryType) as [CategoryType, ...CategoryType[]]
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      file: undefined,
      type: "THEME",
    },
  });

  const watchedFile = form.watch("file");

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("type", data.type);
    if (data.file) {
      formData.append("file", data.file);
    }
    if (currentData?.id) {
      formData.append("id", currentData.id.toString());
    }
    setIsLoading(true);

    let res = null;

    if (isFileRequired) {
      res = await axiosInstance.post("/category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      res = await axiosInstance.put("/category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    if (res.status === 200) {
      toast.success("Category created successfully");
      refetch();
      setIsLoading(false);
      onClose();
    } else {
      setIsLoading(false);
      toast.error("An error occured!");
    }
  }

  function onClose() {
    onOpenChange(false);
  }

  useEffect(() => {
    if (!open) {
      form.reset();
      setCurrentData(null);
      setIsFileRequired(true);
    } else {
      if (currentData) {
        setIsFileRequired(false);
        form.setValue("name", currentData.name);
        form.setValue("type", currentData.type.toString() as CategoryType);
      }
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {isFileRequired ? "Create" : "Update"} category
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Image File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      {...fieldProps}
                      onChange={(event) =>
                        onChange(event.target.files && event.target.files[0])
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
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
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
                      {categoryOptions.map((option) => (
                        <SelectItem value={option.value} key={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-4 flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCategory;
