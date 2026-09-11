export const handleFormatPrice = (price: number, discount?: number) => {
  const finalPriceWithDiscount = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  })
    .format((price || 0) * (1 - (discount || 0) / 100))
    .replace(/,\d+$/, "");

  const originalPrice =
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    })
      .format(price || 0)
      .replace(/,\d+$/, "")

  return {
    finalPrice: finalPriceWithDiscount,
    originalPrice: originalPrice,
  };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(amount).replace(/,\d+$/, "")
}

export const formatCompactNumber = (value: number) => {
  const absoluteValue = Math.abs(value);
  const units = [
    { value: 1_000_000_000, suffix: "B" },
    { value: 1_000_000, suffix: "M" },
    { value: 1_000, suffix: "K" },
  ];
  const unit = units.find(({ value: unitValue }) => absoluteValue >= unitValue);

  if (!unit) return value.toString();

  const compactValue = value / unit.value;
  const formattedValue = compactValue.toFixed(1).replace(/\.0$/, "");

  return `${compactValue === 1 ? compactValue.toFixed(1) : formattedValue}${unit.suffix}`;
}

export const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}