import {
  BookHeart,
  Home,
  LibraryBig,
  Logs,
  Map,
  Settings,
  Users2,
} from "lucide-react";

export const topLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    exactSamePath: true,
  },
  {
    name: "Interest Points",
    href: "/dashboard/interest-point",
    icon: <Map className="h-5 w-5" />,
  },
  {
    name: "User Interest Lists",
    href: "/dashboard/boards",
    icon: <BookHeart className="h-5 w-5" />,
  },
  {
    name: "Itinerarys",
    href: "/dashboard/itinerary",
    icon: <Logs className="h-5 w-5" />,
  },
  {
    name: "Categories",
    href: "/dashboard/categories",
    icon: <LibraryBig className="h-5 w-5" />,
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: <Users2 className="h-5 w-5" />,
  },
];

export const bottomLinks = [
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];
