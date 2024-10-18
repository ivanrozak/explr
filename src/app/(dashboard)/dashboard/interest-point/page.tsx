"use client";
import Image from "next/image";
import { ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { Pin, PinType } from "@prisma/client";
import { formatDate } from "@/lib/helpers";
import DialogInterestPoint from "@/components/dialog/dialog-interest-point";
const qs = require("qs");

const Page = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<Pin[]>([]);
  const [currentData, setCurrentData] = useState<Pin | null>(null);
  const [activeTab, setActiveTab] = useState<PinType | "ALL">("ALL");

  const fetchData = async () => {
    setIsLoading(true);
    const res = await axiosInstance.get("/interest-point", {
      params: {
        type: activeTab,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "comma" });
      },
    });
    setIsLoading(false);
    setData(res.data.data || []);
  };

  const handleEdit = (data: Pin) => {
    setCurrentData(data);
    setOpen(true);
  };

  const handleDelete = async (data: Pin) => {
    if (
      !window.confirm("Are you sure you want to delete this interest point?")
    ) {
      return;
    }
    const res = await axiosInstance.delete("/interest-point", {
      params: {
        id: data.id,
      },
    });
    if (res.data.success) {
      toast.success("Interest point deleted successfully");
      fetchData();
    } else {
      toast.error("Error deleting interest point");
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);
  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      <Tabs
        defaultValue="all"
        onValueChange={(value) => setActiveTab(value as PinType)}
        value={activeTab}
      >
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="ACTIVITY">Activity</TabsTrigger>
            <TabsTrigger value="PLACE">Map/Island</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Sort
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>ASC</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>DESC</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              className="h-8 gap-1"
              onClick={() => setOpen(true)}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add New
              </span>
            </Button>
          </div>
        </div>
        <Card x-chunk="dashboard-06-chunk-0" className="mt-4">
          <CardHeader>
            <CardTitle>Interest Point</CardTitle>
            <CardDescription>List of all interest point</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Place Name</TableHead>
                  <TableHead className="hidden md:table-cell">type</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Total Like
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created at
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading &&
                  data?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt="Product image"
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={item.image_url}
                          width="64"
                          unoptimized
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.title}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {item.place_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item?.pin_type?.toString()}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-center">
                        {parseInt(item?.total_like?.toString() || "0")}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(item?.created_at?.toString() || "")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(item)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(item)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>
      <DialogInterestPoint
        open={open}
        onOpenChange={setOpen}
        currentData={currentData}
        setCurrentData={setCurrentData}
        refetch={fetchData}
      />
    </div>
  );
};

export default Page;
