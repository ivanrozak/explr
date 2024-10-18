import {
  badRequestResponse,
  createdResponse,
  internalServerErrorResponse,
  okResponse,
  unauthorizedResponse,
} from "@/lib/apiUtils";
import { imageUploader } from "@/lib/imageUploader";
import { prisma } from "@/lib/prisma";
import { PinType, Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const type = params.get("type") as string;
  const categories = params.getAll("categories") as string[];
  const tags = params.getAll("tags") as string[];

  const anonymous_id = params.get("anonymousId") || null;
  const userId = (await getToken({ req }).then((token) => token?.sub)) || null;

  try {
    let whereClause: Prisma.PinWhereInput = {};

    if (type && type !== "ALL") {
      whereClause.pin_type = type as PinType;
    }

    const categoryIdsArray = categories
      ?.map((id) => parseInt(id))
      .filter((id) => !isNaN(id));

    if (categoryIdsArray && categoryIdsArray.length > 0) {
      whereClause.category = {
        some: {
          id: { in: categoryIdsArray },
        },
      };
    }

    const tagIdsArray = tags
      ?.map((id) => parseInt(id))
      .filter((id) => !isNaN(id));

    if (tagIdsArray && tagIdsArray.length > 0) {
      whereClause.tags = {
        some: {
          id: { in: tagIdsArray },
        },
      };
    }

    const pins = await prisma.pin.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        description: true,
        image_url: true,
        link: true,
        place_name: true,
        address: true,
        latitude: true,
        longitude: true,
        activity_duration: true,
        duration_unit: true,
        pin_type: true,
        created_at: true,
        updated_at: true,
        user_id: true,
        total_like: true,
        likes: {
          where: {
            OR: [{ user_id: userId }, { anonymous_id: anonymous_id }],
          },
          select: { id: true },
        },
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      distinct: ["id"],
    });

    return okResponse(
      pins.map((pin) => ({
        ...pin,
        is_liked: pin.likes.length > 0,
      }))
    );
  } catch (error) {
    return internalServerErrorResponse();
  }
};

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const userId = await getToken({ req }).then((token) => token?.sub);

  if (!userId) {
    return unauthorizedResponse();
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const link = formData.get("link") as string;
  const place_name = formData.get("place_name") as string;
  const address = formData.get("address") as string;
  const latitude = formData.get("latitude") as string;
  const longitude = formData.get("longitude") as string;
  const pin_type = formData.get("pin_type") as PinType;
  const file = formData.get("file") as File;
  const activity_duration = formData.get("activity_duration") as string;
  const duration_unit = formData.get("duration_unit") as string;

  const categories = formData.getAll("categories") as string[];
  const tags = formData.getAll("tags") as string[];

  if (
    !title ||
    !description ||
    !place_name ||
    !latitude ||
    !longitude ||
    !pin_type ||
    !file
  ) {
    return badRequestResponse();
  }

  const image = await imageUploader(file);

  if (!image) {
    return internalServerErrorResponse("image uploader service error");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const pin = await tx.pin.create({
        data: {
          title,
          description,
          image_url: image,
          link,
          place_name,
          address,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          pin_type,
          user_id: userId,
          activity_duration: parseFloat(activity_duration),
          duration_unit,
        },
        select: { id: true },
      });

      if (tags?.length > 0) {
        await tx.pin.update({
          where: {
            id: pin.id,
          },
          data: {
            tags: {
              connect: tags.map((tag) => ({
                id: parseInt(tag),
              })),
            },
          },
        });
      }

      if (categories?.length > 0) {
        await tx.pin.update({
          where: { id: pin.id },
          data: {
            category: {
              connect: categories.map((categoryId) => ({
                id: Number(categoryId),
              })),
            },
          },
        });
      }

      return [pin];
    });

    return createdResponse();
  } catch (error) {
    return internalServerErrorResponse();
  }
};

export const PUT = async (req: NextRequest) => {
  const formData = await req.formData();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const link = formData.get("link") as string;
  const place_name = formData.get("place_name") as string;
  const address = formData.get("address") as string;
  const latitude = formData.get("latitude") as string;
  const longitude = formData.get("longitude") as string;
  const pin_type = formData.get("pin_type") as PinType;
  const file = formData.get("file") as File;
  const activity_duration = formData.get("activity_duration") as string;
  const duration_unit = formData.get("duration_unit") as string;

  const categories = formData.getAll("categories") as string[];
  const tags = formData.getAll("tags") as string[];

  let image = null;
  if (file) {
    image = await imageUploader(file);
    if (!image) {
      return internalServerErrorResponse("image uploader service error");
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      const updateData: Prisma.PinUpdateInput = {
        title,
        description,
        link,
        place_name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        pin_type,
        activity_duration: parseFloat(activity_duration),
        duration_unit,
      };

      if (image) {
        updateData.image_url = image as string;
      }

      await tx.pin.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      if (tags) {
        await tx.pin.update({
          where: { id: parseInt(id) },
          data: {
            tags: {
              set: [],
              connect: tags.map((tagId) => ({ id: parseInt(tagId) })),
            },
          },
        });
      }

      if (categories) {
        await tx.pin.update({
          where: { id: parseInt(id) },
          data: {
            category: {
              set: [],
              connect: categories.map((categoryId) => ({
                id: parseInt(categoryId),
              })),
            },
          },
        });
      }
    });

    return createdResponse();
  } catch (error) {
    return internalServerErrorResponse();
  }
};

export const DELETE = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const id = params.get("id") as string;

  try {
    await prisma.pin.delete({
      where: {
        id: parseInt(id),
      },
    });

    return createdResponse();
  } catch (error) {
    return badRequestResponse();
  }
};
