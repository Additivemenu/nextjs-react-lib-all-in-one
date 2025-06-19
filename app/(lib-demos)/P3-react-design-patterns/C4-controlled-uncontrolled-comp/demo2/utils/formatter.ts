import { CurrencyCode } from "../types";
import { currencies } from "../constants";

// Format number with commas
const formatNumber = (num: string): string => {
  if (!num) return "";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

//! Remove all non-digit characters to get raw number
const parseToPureNumber = (value: string): string => {
  //! this regex will prevent user to type anything other than digits
  return value.replace(/[^\d]/g, "");
};

// Format display value with currency symbol
const formatCurrency = (value: string, currencyCode: CurrencyCode): string => {
  if (!value) return "";
  const symbol: string = currencies[currencyCode].symbol;
  const formattedCurrencyNumber: string = formatNumber(value);
  return `${symbol}${formattedCurrencyNumber}`;
};

export { formatNumber, parseToPureNumber, formatCurrency };
