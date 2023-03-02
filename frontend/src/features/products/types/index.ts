import { z } from "zod";

export const InputProductSchema = z.object({
  price: z.number().min(0),
  name: z.string().min(1).max(32),
  boughtSite: z.string().min(1).max(32),
  boughtDay: z.date(),
});

export type InputProduct = ReturnType<typeof InputProductSchema.parse>;
