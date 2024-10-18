import {
  badRequestResponse,
  createdResponse,
  okResponse,
} from "@/lib/apiUtils";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const query = params.get("query") as string | undefined;
  const pinId = params.get("pinId") as string | undefined;

  try {
    if (pinId) {
      const response = await prisma.tag.findMany({
        where: {
          pins: {
            some: {
              id: parseInt(pinId),
            },
          },
        },
      });

      return okResponse(response);
    }

    const response = await prisma.tag.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return okResponse(response);
  } catch (error) {
    return badRequestResponse();
  }
};

export const POST = async (req: NextRequest) => {
  const { name } = await req.json();

  if (!name) {
    return badRequestResponse();
  }

  try {
    const existingTag = await prisma.tag.findUnique({
      where: {
        name,
      },
    });

    if (existingTag) {
      return badRequestResponse("Tag already exists");
    }

    const response = await prisma.tag.create({
      data: {
        name,
      },
      select: {
        id: true,
      },
    });

    return createdResponse(response.id);
  } catch (error) {
    return badRequestResponse();
  }
};

export const DELETE = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const id = params.get("id") as string;

  if (!id) {
    return badRequestResponse();
  }

  const res = await prisma.tag.delete({
    where: {
      id: parseInt(id),
    },
  });

  if (!res) {
    return badRequestResponse();
  }

  return createdResponse();
};
