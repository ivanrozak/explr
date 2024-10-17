import { z } from "zod";

export const SignInUserSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(1, { message: "Password is required" }),
});

export type SignInUser = z.infer<typeof SignInUserSchema>;
