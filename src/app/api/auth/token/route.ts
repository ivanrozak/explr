import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const token = await getToken({ req });

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  } else {
    return new Response(JSON.stringify(token), { status: 200 });
  }
};
