import { z } from "zod";

export const CreateUserSchema = z
  .object({
    email: z.string().trim().email(),
    password: z
      .string()
      .trim()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .trim()
      .min(6, { message: "Password must be at least 6 characters" }),
    name: z.string().trim().min(2, { message: "User name is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords doesn't match",
    path: ["confirmPassword"],
  });

export type CreateUser = z.infer<typeof CreateUserSchema>;
