export interface IGetMarketPriceResponse {
  /**
   * e.g. ADA-USDT
   */
  symbol: string;
  /**
   * Market price
   */
  price: number;
  /**
   * Timestamp
   */
  timestamp: number;
}
