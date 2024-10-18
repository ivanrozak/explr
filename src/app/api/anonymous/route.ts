import { badRequestResponse, createdResponse } from "@/lib/apiUtils";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const response = await prisma.anonymousUser.create({
      data: {},
      select: {
        id: true,
      },
    });

    return createdResponse(response.id);
  } catch (error) {
    return badRequestResponse();
  }
};
