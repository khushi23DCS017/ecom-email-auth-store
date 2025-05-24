
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const convertUSDToINR = (usdPrice: number): number => {
  // Assuming 1 USD = 83 INR (you can update this rate)
  return Math.round(usdPrice * 83);
};
