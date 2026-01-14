import { z } from "zod";

export const brandMasterSchema = z.object({
  brandName: z.string().nullable().optional(),
  idBrandTheme: z.number().int().nullable().optional(),
  isActive: z.boolean().default(false).optional(),
  brandLogo: z.string().nullable().optional(),
  domain: z.string().nullable().optional(),
  contract: z.string().nullable().optional(),
  setorName: z.string().nullable().optional(),
  fieldName: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  emailContact: z.string().nullable().optional(),
  smsContact: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  street: z.string().nullable().optional(),
  placeNumber: z.string().nullable().optional(),
  cep: z.string().nullable().optional(),
  cnpj: z.string().nullable().optional(),
  cityCode: z.number().nullable().optional(),
  district: z.string().nullable().optional(),
  stripeUserId: z.string().nullable().optional(),
  isStripeActive: z.boolean().default(false).optional(),
  isPoc: z.boolean().default(false).optional(),
  discountRate: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) =>
      val !== undefined && val !== null ? Number(val) : undefined,
    )
    .refine((val) => val === undefined || val >= 0, {
      message: "Discount rate must be greater than or equal to 0",
    }),
  minConsumption: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) =>
      val !== undefined && val !== null ? Number(val) : undefined,
    )
    .refine((val) => val === undefined || val >= 0, {
      message: "Min consumption must be greater than or equal to 0",
    }),
  contractAt: z.date().nullable().optional(),
  pocOpenedAt: z.date().nullable().optional(),
  manual: z.string().nullable().optional(),
  termsOfUse: z.string().nullable().optional(),
  privacyPolicy: z.string().nullable().optional(),
  retailPercentageDefault: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) =>
      val !== undefined && val !== null ? Number(val) : undefined,
    )
    .refine((val) => val === undefined || val >= 0, {
      message: "Retail percentage default must be greater than or equal to 0",
    }),
  hasSelfRegister: z.boolean().optional(),
  hasPrepaid: z.boolean().optional(),
});

export type TBrandMaster = z.infer<typeof brandMasterSchema>;
