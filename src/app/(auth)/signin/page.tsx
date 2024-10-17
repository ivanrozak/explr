"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/password-input";
import { SignInUserSchema } from "@/schemas/signin";
import { signIn } from "next-auth/react";

const Page = () => {
  const form = useForm<z.infer<typeof SignInUserSchema>>({
    resolver: zodResolver(SignInUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof SignInUserSchema>) {
    console.log(data);
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = await res.json();

    if (response.data === "ok") {
      signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/",
      });
    } else {
      toast.error(response.message || "An error occured!");
    }
  }
  return (
    <Card className="mx-auto w-full max-w-md p-4 border-none shadow-none sm:shadow-lg">
      <CardHeader className="space-y-3">
        <CardTitle className="flex justify-center">
          <Image
            src="/main_lg.jpg"
            width={91.31}
            height={56}
            className="mix-blend-multiply"
            alt="explorindonesia"
          />
        </CardTitle>
        <CardDescription className="text-center title-m text-foreground">
          Welcome 👋
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordInput placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" variant={"primary"} className="w-full mt-2">
                Login
              </Button>
            </form>
          </Form>

          <p className="text-center label-m">or</p>
          <Button
            variant={"outline"}
            className="w-full label-l rounded-full"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            Continue with Google
          </Button>
        </div>
        <div className="mt-6 text-center body-s">
          Didn&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="hover:underline font-semibold uppercase"
          >
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;
