"use client";
import { signIn } from "next-auth/react";
import React, { useState } from "react";

const Page = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };
  return (
    <div className="flex flex-col max-w-sm gap-4 mx-auto text-center p-6">
      <h1 className="text-xl">Sign Up Page</h1>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => signUp()}>Sign Up with Credentials</button>
      <button onClick={() => signIn("google")}>Sign Up with Google</button>
    </div>
  );
};

export default Page;
