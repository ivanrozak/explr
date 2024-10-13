"use client";
import { signIn, signOut } from "next-auth/react";
import React from "react";

const AuthActions = ({ session }: { session: any }) => {
  if (session) {
    return <button onClick={() => signOut()}>Sign Out</button>;
  }
  return <button onClick={() => signIn()}>Sign In</button>;
};

export default AuthActions;
