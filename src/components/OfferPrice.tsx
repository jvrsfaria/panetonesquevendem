import { OFFER, formatOfferPrice } from "@/lib/offer";

export function OfferPrice() {
  return (
    <strong className="offer-price">{formatOfferPrice(OFFER.price)}</strong>
  );
}