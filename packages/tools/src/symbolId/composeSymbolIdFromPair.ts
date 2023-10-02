import { ExchangeCode } from "@opentrader/types";
import { EXCHANGE_CODE_DELIMITER } from "./constants";

export function composeSymbolIdFromPair(
  exchangeCode: ExchangeCode,
  currencyPair: string
) {
  return (
    `${exchangeCode.toUpperCase()}` +
    EXCHANGE_CODE_DELIMITER +
    currencyPair
  );
}
