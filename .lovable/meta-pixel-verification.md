# Meta Pixel installation — 2026-11-15

- Requested pixel: 3540747909429722; requested base event: PageView only.
- No Meta account connection is configured; provider definitions, dataset restrictions and receipt could not be read.
- The builder requested “registrar todos os eventos” instead of selecting a consent route. This does not authorize bypassing refusals or creating unsupported success events. The no-banner route blocks unanswered advertising permission in consent/unresolved regions and respects Global Privacy Control everywhere. Regional setup remains open; no Purchase is emitted because checkout confirmation is owned by Kirvano.
- Pixel initialization uses an empty user-data object and the Lovable agent option. No matching, CAPI, uploads or unconditional noscript beacon was added.
- Privacy disclosure and a persistent refusal button are available on the site.
- Tests: supplied ID, one PageView per page load, denied installation, withdrawal, and checkout forwarding passed (6 tests).
- Browser: with simulated Brazil geography, the SDK and pixel configuration returned HTTP 200 and consumed the queue. No facebook.com/tr PageView request was observed on localhost; transmission remains unverified.
- Browser: simulated Germany and Global Privacy Control prevented SDK loading; refusing persisted across reload and privacy navigation worked.
- Publication was not requested and is pending. Published installation, traffic permissions and Meta Events Manager receipt still need verification. No attributed conversion claim is made.