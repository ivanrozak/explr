import { okResponse } from "@/lib/apiUtils";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  if (!body.email || !body.password) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return okResponse(null, "User not found");
    }

    const isCorrectPassword = await bcrypt.compare(
      body.password,
      user?.hashedPassword
    );

    if (!isCorrectPassword) {
      return okResponse(null, "Incorrect password");
    }

    return okResponse("ok");
  } catch (error) {
    return okResponse(null, "Something went wrong");
  }
};
