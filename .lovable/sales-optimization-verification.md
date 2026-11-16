# Sales optimization verification

- 2026-11-16: retained Celetus checkout URL and UTM/src/sck forwarding.
- Desktop 1280×1800, mobile 390×844 and 360×800: images loaded, 15 cardápio entries, six featured flavors, no horizontal overflow or runtime errors; FAQ expands.
- Nine selected tests pass: checkout forwarding, PageView and ViewContent deduplication, supplied pixel ID, concurrent checkout deduplication, advertising refusal, no Purchase event.
- Browser used an inert SDK to inspect calls without transmitting artificial events. Each actual CTA navigation produced one InitiateCheckout and retained query params. External checkout response was replaced only in the navigation test; separate HTTP check of Celetus returned 200. No payment attempted.
- Refusal through the existing privacy button persisted on reload and prevented SDK loading.
- PageView and ViewContent fire once per page load; InitiateCheckout once per page load, subject to advertising permission. Purchase remains unwired: only a verified payment confirmation owned by the external checkout can support it.
- No connected Meta provider receipt or dataset restriction read was available; actual Meta transmission, receipt and attribution remain unverified. Existing regional/GPC permission rules preserved.
- Original PDF was not supplied. No invented pages or mockup were added; that section awaits the original document.
- Removed unverified testimonial and artificial-timing copy from the optimized sales page. Product statements and price follow supplied brief.