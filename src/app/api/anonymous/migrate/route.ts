import { okResponse, unauthorizedResponse } from "@/lib/apiUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const { anonymousId } = await req.json();
  const userId = await getToken({ req }).then((token) => token?.sub);

  if (!userId || !anonymousId) {
    return unauthorizedResponse();
  }

  return okResponse();
};
