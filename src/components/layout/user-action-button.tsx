"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconChevronDownFilled } from "@/components/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import links from "@/constants/links";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const UserActionButton = ({
  withoutLogin = false,
}: {
  withoutLogin?: boolean;
}) => {
  const session = useSession();
  const pathname = usePathname();
  if (session?.data?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="inline-flex items-center cursor-pointer">
            <Avatar>
              <AvatarImage src={session.data.user.image!} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <IconChevronDownFilled />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!pathname.startsWith(links.dashboard) && (
            <DropdownMenuItem asChild>
              <Link href={links.dashboard}>Dashboard</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem disabled>Settings</DropdownMenuItem>
          <DropdownMenuItem disabled>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      {!withoutLogin && (
        <Link href={links.login}>
          <Button
            variant="ghost"
            className="text-xs font-bold uppercase tracking-widest"
            size={"xs"}
          >
            login
          </Button>
        </Link>
      )}
      <Link href={links.signup}>
        <Button
          className="uppercase font-semibold"
          variant="primary"
          size={"xs"}
        >
          sign up
        </Button>
      </Link>
    </>
  );
};

export default UserActionButton;
