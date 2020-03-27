export interface OkResponse {
  trackingId: string;
  payload: {
    total: number;
  };
  status: "Ok";
}

export interface ErrorResponse {
  payload: {
    message: string;
    code: string;
  };
  status: "Error";
}

export type Response = OkResponse | ErrorResponse

export type InstrumentType = "Stock" | "Currency" | "Bond" | "Etf"

export type OperationType =
  "Buy" |
  "BuyCard" |
  "Sell" |
  "BrokerCommission" |
  "ExchangeCommission" |
  "ServiceCommission" |
  "MarginCommission" |
  "OtherCommission" |
  "PayIn" |
  "PayOut" |
  "Tax" |
  "TaxLucre" |
  "TaxDividend" |
  "TaxCoupon" |
  "TaxBack" |
  "Repayment" |
  "PartRepayment" |
  "Coupon" |
  "Dividend" |
  "SecurityIn" |
  "SecurityOut"

export type Currency = "RUB" | "USD" | "EUR"

export interface MoneyAmount {
  currency: Currency;
  value: number;
}

export interface Trade {
  tradeId: string;
  date: string;
  price: number;
  quantity: number;
}

export interface Operation {
  id: string;
  status: "Done" | "Decline" | "Progress";
  trades?: Trade[];
  commission?: MoneyAmount;
  currency: Currency;
  payment: number;
  price: number;
  quantity?: number;
  figi?: string;
  instrumentType?: InstrumentType;
  isMarginCall?: boolean;
  date: string;
  operationType: OperationType;
}
