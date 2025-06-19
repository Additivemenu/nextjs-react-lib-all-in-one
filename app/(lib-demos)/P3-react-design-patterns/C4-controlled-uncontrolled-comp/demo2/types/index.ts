export type Currency = {
  symbol: string;
  name: string;
};

export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CAD";

export type CurrencyMap = {
  [key: string]: Currency;
};
