export const formatCurrency = (value: number): string => {
  if (value < 0) return formatCurrency(0);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
