import {
  badRequestResponse,
  createdResponse,
  internalServerErrorResponse,
} from "@/lib/apiUtils";
import { imageUploader } from "@/lib/imageUploader";
import { prisma } from "@/lib/prisma";
import { ImageReferenceType } from "@prisma/client";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {};

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const type = formData.get("type") as ImageReferenceType;

  if (!file || file?.size === 0 || !type) {
    return badRequestResponse("file and type are required");
  }

  const image = await imageUploader(file);

  if (!image) {
    return internalServerErrorResponse("Failed to upload image");
  }

  try {
    const response = await prisma.imageReference.create({
      data: {
        image_url: image,
        type,
      },
    });

    return createdResponse(response);
  } catch (error) {
    return badRequestResponse();
  }
};
