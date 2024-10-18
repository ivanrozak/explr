"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import UserActionButton from "./user-action-button";

const DashboardNav = () => {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter((path) => path);
    const breadcrumbs = [];
    let href = "";

    breadcrumbs.push({ label: "Home", href: "/" });

    paths.forEach((path, index) => {
      href += `/${path}`;
      breadcrumbs.push({
        label: path.charAt(0).toUpperCase() + path.slice(1),
        href: href,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Breadcrumb className="flex">
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <BreadcrumbItem>
                <BreadcrumbLink href={breadcrumb.href}>
                  {breadcrumb.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto grow-0 flex-1 inline-flex gap-2">
        <UserActionButton />
      </div>
    </header>
  );
};

export default DashboardNav;
