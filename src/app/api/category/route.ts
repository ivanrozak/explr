import {
  badRequestResponse,
  internalServerErrorResponse,
  notFoundResponse,
  okResponse,
} from "@/lib/apiUtils";
import { imageUploader } from "@/lib/imageUploader";
import { prisma } from "@/lib/prisma";
import { CategoryType } from "@prisma/client";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get("type");
  const pinId = searchParams.get("pinId") as string | undefined;

  if (pinId) {
    const response = await prisma.category.findMany({
      where: {
        pins: {
          some: {
            id: parseInt(pinId),
          },
        },
      },
    });

    if (response) {
      return okResponse(response);
    } else {
      return notFoundResponse();
    }
  }

  let res = null;

  if (type && type !== "ALL") {
    res = await prisma.category.findMany({
      where: {
        type: type as CategoryType,
      },
    });
  } else {
    res = await prisma.category.findMany();
  }

  return okResponse(res);
};

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const file = formData.get("file") as File;
  const type = formData.get("type") as CategoryType;

  if (!name || !file || !type) {
    return badRequestResponse();
  }

  const image = await imageUploader(file);

  if (!image) {
    return internalServerErrorResponse("Failed to upload image");
  }

  const response = await prisma.category.create({
    data: {
      name,
      image_url: image,
      type,
    },
  });

  if (response) {
    return okResponse(response);
  } else {
    return internalServerErrorResponse("Failed to create category");
  }
};

export const PUT = async (req: NextRequest) => {
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const file = formData.get("file") as File;
  const type = formData.get("type") as CategoryType;
  const id = formData.get("id") as string;

  if (!name || !type || !id) {
    return badRequestResponse();
  }

  interface CategoryValues {
    name: string;
    type: CategoryType;
    updatedAt: Date;
    image_url?: string;
  }

  const values: CategoryValues = {
    name,
    type,
    updatedAt: new Date(),
  };

  if (file) {
    const image = await imageUploader(file);
    if (!image) {
      return internalServerErrorResponse("Failed to upload image");
    }

    values.image_url = image;
  }

  const response = await prisma.category.update({
    where: {
      id: parseInt(id),
    },
    data: values,
  });

  if (response) {
    return okResponse();
  } else {
    return internalServerErrorResponse("Failed to update category");
  }
};

export const DELETE = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const id = params.get("id") as string;

  const response = await prisma.category.delete({
    where: {
      id: parseInt(id),
    },
  });

  if (!response) {
    return notFoundResponse();
  }

  return okResponse();
};
