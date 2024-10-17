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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import { CreateUser, CreateUserSchema } from "@/schemas/signup";
import { signIn } from "next-auth/react";

const SignUpPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: CreateUser) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        name: data.name,
        password: data.password,
      }),
    });

    const response = await res.json();

    if (response.data) {
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="User Name" {...field} />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput placeholder="Confirm Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant={"primary"} className="w-full mt-2">
              CONTINUE
            </Button>
          </form>
        </Form>
        <p className="text-center label-m my-4">or</p>
        <Button
          variant={"outline"}
          className="w-full label-l rounded-full"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Continue with Google
        </Button>
        <div className="mt-6 text-center body-s">
          By continuing you agree to{" "}
          <Link href="/#" className="hover:underline font-semibold">
            Terms of Service
          </Link>{" "}
          and acknowledge you’ve read our{" "}
          <Link href="/#" className="hover:underline font-semibold">
            Privacy Policy.
          </Link>
        </div>
        <div className="mt-6 text-center body-s">
          Already a member?{" "}
          <Link
            href="/signin"
            className="hover:underline font-semibold uppercase"
          >
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUpPage;
