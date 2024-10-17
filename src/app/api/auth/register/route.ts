import { okResponse } from "@/lib/apiUtils";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { email, name, password } = body;

  if (!email || !name || !password) {
    return okResponse(null, "Missing fields");
  }

  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (exists) {
    return okResponse(null, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      emailVerified: new Date(),
    },
  });

  return okResponse(
    JSON.stringify({ ...user, hashedPassword: undefined }),
    "Account created successfully"
  );
};
