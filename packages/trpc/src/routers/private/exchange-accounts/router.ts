import { authorizedProcedure } from "../../../procedures";
import { router } from "../../../trpc";
import { getExchangeAccounts } from "./get-accounts/handler";
import { getExchangeAccount } from "./get-account/handler";
import { ZGetExchangeAccountInputSchema } from "./get-account/schema";
import { createExchangeAccount } from "./create-account/handler";
import { ZCreateExchangeAccountInputSchema } from "./create-account/schema";
import { updateExchangeAccount } from "./update-account/handler";
import { ZUpdateExchangeAccountInputSchema } from "./update-account/schema";
import { checkExchangeAccount } from "./check-account/handler";
import { ZCheckExchangeAccountInputSchema } from "./check-account/schema";

export const exchangeAccountsRouter = router({
  list: authorizedProcedure.query(getExchangeAccounts),

  getOne: authorizedProcedure
    .input(ZGetExchangeAccountInputSchema)
    .query(getExchangeAccount),

  create: authorizedProcedure
    .input(ZCreateExchangeAccountInputSchema)
    .mutation(createExchangeAccount),

  update: authorizedProcedure
    .input(ZUpdateExchangeAccountInputSchema)
    .mutation(updateExchangeAccount),

  check: authorizedProcedure
    .input(ZCheckExchangeAccountInputSchema)
    .mutation(checkExchangeAccount),
});
