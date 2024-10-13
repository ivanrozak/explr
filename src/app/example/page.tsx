import { getServerSession } from "next-auth";
import React from "react";
import AuthActions from "./AuthActions";

const Page = async () => {
  const session = await getServerSession();
  return (
    <div className="text-center flex flex-col gap-2">
      <h1>Auth Example Page</h1>
      <h2 className="break-all">Session: {JSON.stringify(session)}</h2>
      <AuthActions session={session} />
    </div>
  );
};

export default Page;
