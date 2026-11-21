import { OFFER, formatOfferPrice } from "@/lib/offer";

export function OfferPrice() {
  return (
    <span className="offer-price-pair">
      <span className="offer-price-original">De <s>{formatOfferPrice(OFFER.regularPrice)}</s></span>
      <span className="offer-price-current">por <strong>{formatOfferPrice(OFFER.promotionalPrice)}</strong></span>
    </span>
  );
}