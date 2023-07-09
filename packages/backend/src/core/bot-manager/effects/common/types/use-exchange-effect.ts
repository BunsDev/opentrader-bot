import { IExchangeService } from "src/core/exchanges/types/exchange-service.interface";
import { BaseEffect } from "./base-effect";
import { USE_EXCHANGE } from "./effect-types";

export type ExchangeEffect = BaseEffect<typeof USE_EXCHANGE, IExchangeService>;