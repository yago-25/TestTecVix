import { z } from "zod";

const EVMStatus = z.enum(["RUNNING", "STOPPED", "PAUSED"]);
// Password validation regex
export const passwordRegex = {
  numbers: /(?=.*\d.*\d)/,
  lowercase: /(?=.*[a-z].*[a-z])/,
  uppercase: /(?=.*[A-Z].*[A-Z])/,
  special:
    /(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?].*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
};

export const vMCreatedSchema = z.object({
  vmName: z.string().optional(),
  vCPU: z.number().min(1, "vCPU must be at least 1"),
  ram: z.number().min(1, "RAM must be at least 1 GB"),
  disk: z.number().min(20, "Disk must be at least 20 GBs"),
  hasBackup: z.boolean().optional().default(false),
  idBrandMaster: z.number().nullable().optional(),
  status: EVMStatus.optional(),
  os: z.string().optional(),
  pass: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(passwordRegex.numbers, "Must contain at least 2 numbers")
    .regex(passwordRegex.lowercase, "Must contain at least 2 lowercase letters")
    .regex(passwordRegex.uppercase, "Must contain at least 2 uppercase letters")
    .regex(passwordRegex.special, "Must contain at least 2 special characters"),
});

export type TVMCreate = z.infer<typeof vMCreatedSchema>;
