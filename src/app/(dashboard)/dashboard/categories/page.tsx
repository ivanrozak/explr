"use client";
import Image from "next/image";
import { ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
// import DialogCategory from "@/components/pages/dashboard/categories/DialogCategory";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { formatDate } from "@/lib/helpers";
import { Category } from "@/db/types/database";

const CategoriesPage = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<Category[]>([]);
  const [currentData, setCurrentData] = useState<Category | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await axiosInstance.get("/category", {
      params: { type: activeTab },
    });
    setIsLoading(false);
    setData(res.data.data || []);
  };

  const handleEdit = (data: Category) => {
    setCurrentData(data);
    setOpen(true);
  };

  const handleDelete = async (data: Category) => {
    const res = await axiosInstance.delete("/category", {
      params: {
        id: data.id,
      },
    });

    if (res.status === 200) {
      toast.success("Category deleted successfully");
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      <Tabs
        defaultValue="themes"
        onValueChange={(value) => setActiveTab(value)}
        value={activeTab}
      >
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="THEME">Themes</TabsTrigger>
            <TabsTrigger value="ACTIVITY">Activities</TabsTrigger>
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
            {/* <DialogCategory
              open={open}
              onOpenChange={setOpen}
              refetch={fetchData}
              currentData={currentData}
              setCurrentData={setCurrentData}
            /> */}
          </div>
        </div>
        <Card x-chunk="dashboard-06-chunk-0" className="mt-4">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>List of all categories</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created at
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Updated at
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
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.type.toString()}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(item.createdAt.toString())}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {item?.updatedAt
                          ? formatDate(item?.updatedAt?.toString())
                          : "-"}
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
          {/* <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>32</strong> products
            </div>
          </CardFooter> */}
        </Card>
      </Tabs>
    </div>
  );
};

export default CategoriesPage;
