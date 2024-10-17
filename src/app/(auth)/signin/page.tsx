"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useState, Suspense } from "react";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col max-w-sm gap-4 mx-auto text-center p-6">
      <h1 className="text-xl">Sign In Page</h1>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Suspense>
        <ErrorMessage />
      </Suspense>
      <button onClick={() => signIn("credentials", { email, password })}>
        Sign In with Credentials
      </button>
      <button onClick={() => signIn("google")}>Sign In with Google</button>
      <button onClick={() => signIn("facebook")}>Sign In with Facebook</button>
    </div>
  );
};

export default Page;

const ErrorMessage = () => {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("error");
  return <>{errorMessage && <p>error on: {errorMessage}</p>}</>;
};
