export const OFFER = { price: 19.9 } as const;

export const formatOfferPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);