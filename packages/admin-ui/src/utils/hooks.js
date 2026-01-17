import { useAppConfig } from "../App";
import { CURRENCY_MAP } from "./constants";

export const useCurrency = () => {
  const { currency } = useAppConfig();
  return {
    currency,
    currencySymbol: CURRENCY_MAP[currency] || '₹',
  };
}