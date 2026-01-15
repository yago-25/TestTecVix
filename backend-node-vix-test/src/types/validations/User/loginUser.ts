import { z } from "zod";

export const userLoginSchema = z
  .object({
    username: z.string().optional(),
    email: z.string().email("Invalid email").optional(),
    password: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.username || data.email, {
    message: "Either username or email must be provided",
  });

export type TUserLogin = z.infer<typeof userLoginSchema>;

