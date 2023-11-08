import {
  ExchangeCode,
  IAccountAsset,
  ICancelLimitOrderRequest,
  ICancelLimitOrderResponse,
  ICandlestick,
  IGetCandlesticksRequest,
  IGetFilledLimitOrdersRequest,
  IGetFilledLimitOrdersResponse,
  IGetLimitOrderRequest,
  IGetLimitOrderResponse,
  IGetMarketPriceRequest,
  IGetMarketPriceResponse,
  IGetSymbolInfoRequest,
  IPlaceLimitOrderRequest,
  IPlaceLimitOrderResponse,
  ISymbolInfo,
  ITradingPairSymbolRequest,
  IWatchOrdersRequest,
  IWatchOrdersResponse,
} from "@opentrader/types";
import { Dictionary, Market, okex5, pro } from "ccxt";
import { IExchangeCredentials } from "#exchanges/types/exchange-credentials.interface";
import { IExchange } from "#exchanges/types/exchange.interface";
import { cache } from "../../cache";
import { fetcher } from "../../utils/next/fetcher";
import { normalize } from "./normalize";

export class OkxExchange implements IExchange {
  public ccxt: okex5;

  constructor(credentials?: IExchangeCredentials) {
    const ccxtCredentials = credentials
      ? {
          apiKey: credentials.apiKey,
          secret: credentials.secretKey,
          password: credentials.password,
        }
      : undefined;
    this.ccxt = new pro.okx(ccxtCredentials);
    this.ccxt.fetchImplementation = fetcher; // #57

    if (credentials?.isDemoAccount) {
      this.ccxt.setSandboxMode(true);
    }
  }

  async loadMarkets(): Promise<Dictionary<Market>> {
    const cacheProvider = cache.getCacheProvider();
    return cacheProvider.getMarkets(ExchangeCode.OKX, this.ccxt);
  }

  async accountAssets(): Promise<IAccountAsset[]> {
    const data = await this.ccxt.fetchBalance();

    return normalize.accountAssets.response(data);
  }

  async getLimitOrder(
    params: IGetLimitOrderRequest,
  ): Promise<IGetLimitOrderResponse> {
    const args = normalize.getLimitOrder.request(params);
    const data = await this.ccxt.fetchOrder(...args);

    return normalize.getLimitOrder.response(data);
  }

  async placeLimitOrder(
    params: IPlaceLimitOrderRequest,
  ): Promise<IPlaceLimitOrderResponse> {
    if ("clientOrderId" in params) {
      throw new Error(
        "Fetch limit order by `clientOrderId` is not supported yet",
      );
    }

    const args = normalize.placeLimitOrder.request(params);
    const data = await this.ccxt.createLimitOrder(...args);

    return normalize.placeLimitOrder.response(data);
  }

  async getFilledLimitOrders(
    params: IGetFilledLimitOrdersRequest,
  ): Promise<IGetFilledLimitOrdersResponse> {
    const args = normalize.getFilledLimitOrders.request(params);
    const data = await this.ccxt.fetchClosedOrders(...args);

    return normalize.getFilledLimitOrders.response(data);
  }

  async cancelLimitOrder(
    params: ICancelLimitOrderRequest,
  ): Promise<ICancelLimitOrderResponse> {
    const args = normalize.cancelLimitOrder.request(params);
    // The response is not typed properly.
    // Probably cause not all exchanges
    // return `orderId` in the response
    await this.ccxt.cancelOrder(...args);

    return {
      orderId: params.orderId,
    };
  }

  async getMarketPrice(
    params: IGetMarketPriceRequest,
  ): Promise<IGetMarketPriceResponse> {
    const args = normalize.getMarketPrice.request(params);
    const data = await this.ccxt.fetchTicker(...args);

    return normalize.getMarketPrice.response(data);
  }

  async getCandlesticks(
    params: IGetCandlesticksRequest,
  ): Promise<ICandlestick[]> {
    const args = normalize.getCandlesticks.request(params);
    const data = await this.ccxt.fetchOHLCV(...args);

    return normalize.getCandlesticks.response(data);
  }

  async getSymbol(params: IGetSymbolInfoRequest): Promise<ISymbolInfo> {
    const markets = await this.loadMarkets();

    const args = normalize.getSymbol.request(params);
    // method market() not typed by CCXT
    // const data: Market = await this.ccxt.market(...args);
    const data: Market = markets[args[0]]

    return normalize.getSymbol.response(data); // @todo refactor
  }

  async getSymbols(): Promise<ISymbolInfo[]> {
    const markets = await this.loadMarkets();

    return normalize.getSymbols.response(markets);
  }

  /**
   * OKx uses the `BTC-USDT` format for annotating trading pairs
   */
  tradingPairSymbol(params: ITradingPairSymbolRequest): string {
    const { baseCurrency, quoteCurrency } = params;

    return `${baseCurrency}-${quoteCurrency}`;
  }

  async watchOrders(
    params: IWatchOrdersRequest = {},
  ): Promise<IWatchOrdersResponse> {
    const args = normalize.watchOrders.request(params);
    const data = await this.ccxt.watchOrders(...args);

    return normalize.watchOrders.response(data);
  }
}
