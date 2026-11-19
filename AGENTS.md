<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- The sales page lives at `/` (src/routes/index.tsx); its ported styles are component classes in `src/styles.css` under `@layer components`, driven by brand tokens. Why: keeps the original page's look in one design-system file.
- Only the final offer button (`#comprar`) links out to checkout, built with `buildCheckoutUrl` from `src/lib/checkout.ts`; every CTA above it scrolls to that section instead of leaving the page (tested in `src/test/sales-cta.test.tsx`). Why: ad tracking params must still reach the external checkout, and the page funnel must end at one decision point.
- Photos are Lovable Assets pointers; the original 15 cardápio photos live in `src/assets/cardapio/` and their optimized WebP copies in `src/assets/cardapio-webp/` named `NN-sabor.webp.asset.json` and are matched to RECEITAS by the NN prefix. Why: keeps the repo light and each photo tied to its flavor.
- The first-screen video uses a compressed Lovable Assets pointer, muted inline looping playback, a pause control and reduced-motion handling. Why: preserves the uploaded clip's proportions and keeps motion controllable without adding media binaries to the repository.
- Initialize the browser Meta Pixel only through the shared advertising permission gate on the sales route; do not add an unconditional noscript beacon. Why: regional restrictions and refusals must block every transmission, and external checkout clicks are not purchases.

- Use the shared sales Button variant for checkout anchors and gate all Meta events in the shared pixel module; deduplicate product views and checkout initiation per page load. Why: every CTA preserves checkout forwarding and privacy without duplicate reporting.
- Keep checkout navigation native to the anchor; never prevent it or await advertising measurement. Why: mobile taps and repeat visits must work even when tracking is blocked or pending.
