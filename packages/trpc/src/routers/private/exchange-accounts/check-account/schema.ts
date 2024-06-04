import { z } from "zod";

export const ZCheckExchangeAccountInputSchema = z.object({
  exchangeAccountId: z.number(),
});

export type TCheckExchangeAccountInputSchema = z.infer<
  typeof ZCheckExchangeAccountInputSchema
>;
