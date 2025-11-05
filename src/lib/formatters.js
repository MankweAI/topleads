// This is our new, 100% reliable currency formatter.
// It uses a simple RegEx to add commas, which works identically
// on the server and the client, fixing the hydration mismatch.
export const formatCurrency = (value) => {
  if (typeof value !== "number" || isNaN(value)) return "N/A";

  // Convert to string and add commas for thousands
  const formattedValue = value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `R ${formattedValue}`;
};
