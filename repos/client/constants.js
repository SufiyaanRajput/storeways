const CURRENCY_MAP = {
  INR: '₹',
  USD: '$',
}

console.log(process.env.NEXT_PUBLIC_CURRENCY);

export const CURRENCY = CURRENCY_MAP[process.env.NEXT_PUBLIC_CURRENCY] || '₹';