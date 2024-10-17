import DashboardNav from "@/components/layout/dashboard-nav";
import Sidebar from "@/components/layout/dashboard-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <DashboardNav />
          <main className="p-4 sm:px-6 sm:py-0">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DashboardLayout;
