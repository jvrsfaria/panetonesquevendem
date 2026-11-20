# Meta Pixel installation — 2026-11-15

## Replacement — 2026-11-20

- User requested removing the direct Facebook pixel and installing the supplied encoded loader instead.
- Decoded loader: https://cdn.utmify.com.br/scripts/pixel/pixel.js, window.pixelId = 6affbdeb3872e1106d428389, async and defer, no additional attributes. Installed readable equivalent; direct pixel 3540747909429722 and app-owned event callbacks removed from src.
- Existing UTMify UTMs script retained. Shared advertising permission retained: no unanswered loading in consent/unknown regions, GPC or refusal. Withdrawal reloads because the new SDK has observers, retries and timers without teardown.
- No personal-data forms exist on the sales page. Vendor SDK can observe forms; future form capture requires explicit acceptance. Its automatic event rules and configured destination datasets are vendor-managed, not verified here.
- No connected Meta account: dataset restrictions, conversion definitions and receipt could not be inspected. No account configuration or spending changed.
- Tests: 12 passing across pixel loader, UTM script and sales CTA suites; correct supplied ID, single load, denied loading, withdrawal reload, unmount race and native checkout navigation. Preview build OK.
- Actual vendor SDK returned HTTP 200 in mobile browser with simulated Brazil. No old Meta ID in observed requests. Vendor selects http://localhost:3001/tracking/v1/events on localhost; requests failed with connection refused. This is a vendor local-development branch, not provider receipt. Production sends and attribution remain unverified.
- Actual mobile touch opened https://pay.kiwify.com.br/g1qGR6r and displayed the payment form, preserving the animated button. No payment submitted. Germany and GPC prevented scripts, and refusal prevented reload installation.
- Privacy disclosure updated for UTMify recipients and vendor-managed events. Publishing not requested; live replacement pending publication.

## Historical installation (superseded)

- Requested pixel: 3540747909429722; requested base event: PageView only.
- No Meta account connection is configured; provider definitions, dataset restrictions and receipt could not be read.
- The builder requested “registrar todos os eventos” instead of selecting a consent route. This does not authorize bypassing refusals or creating unsupported success events. The no-banner route blocks unanswered advertising permission in consent/unresolved regions and respects Global Privacy Control everywhere. Regional setup remains open; no Purchase is emitted because checkout confirmation is owned by Kirvano.
- Pixel initialization uses an empty user-data object and the Lovable agent option. No matching, CAPI, uploads or unconditional noscript beacon was added.
- Privacy disclosure and a persistent refusal button are available on the site.
- Tests: supplied ID, one PageView per page load, denied installation, withdrawal, and checkout forwarding passed (6 tests).
- Browser: with simulated Brazil geography, the SDK and pixel configuration returned HTTP 200 and consumed the queue. No facebook.com/tr PageView request was observed on localhost; transmission remains unverified.
- Browser: simulated Germany and Global Privacy Control prevented SDK loading; refusing persisted across reload and privacy navigation worked.
- Publication was not requested and is pending. Published installation, traffic permissions and Meta Events Manager receipt still need verification. No attributed conversion claim is made.