# Full Audit Report

- URL: `https://elbuenmaestro.vercel.app/`
- Generated: `2026-07-15T10:34:14.144775`
- Overall score: `70/100`
- Score confidence: `Medium`
- Scoring version: `1`

## Score Card

| Category | Weight | Score |
| --- | ---: | ---: |
| Security Headers | 8 | 45 |
| Social Meta | 5 | 85 |
| Robots and Crawlers | 8 | 100 |
| Broken Links | 10 | 100 |
| Internal Links | 8 | 60 |
| Redirects | 3 | 100 |
| AI Search | 5 | 90 |
| Performance and Core Web Vitals | 13 | 0 |
| On-Page SEO | 10 | 100 |
| Readability | 8 | 7 |
| Entity SEO | 5 | 0 |
| Link Profile | 7 | 55 |
| Hreflang | 5 | 0 |
| Content Uniqueness | 5 | 100 |

## Findings

| Severity | Area | Finding | Evidence | Fix |
| --- | --- | --- | --- | --- |
| Critical | environment | 5 security headers missing | Missing headers reduce trust and can expose the site to browser/security risks. | Set missing security headers at web server or CDN layer. |
| Critical | link_profile | 19 orphan page(s) with zero inbound internal links. |  | Add internal links from relevant content pages to these orphan pages. |
| Critical | sameAs | Entity schema exists but has no sameAs properties. |  | Add sameAs URLs pointing to Wikipedia, LinkedIn, Twitter/X, etc. |
| Critical | security | 🔴 5 security headers missing — poor security posture |  |  |
| Warning | environment | Content readability is difficult | Long, complex text can reduce engagement and comprehension. | Rewrite key sections with shorter sentences (15-20 words), shorter paragraphs (2-4 sentences), and clearer subheadings. |
| Warning | internal_links | ⚠️ 44 potential orphan page(s) (≤1 internal link pointing to them) |  |  |
| Warning | internal_links | ⚠️ 14 internal link(s) have nofollow — this wastes link equity |  |  |
| Warning | readability | ⚠️ Content is difficult to read (Flesch: 4.6) — may reduce engagement |  |  |
| Warning | readability | ⚠️ 33.3% complex words (3+ syllables) — consider simplifying |  |  |
| Warning | readability | ⚠️ Thin content (192 words) — may rank poorly |  |  |
| Warning | sameAs | Missing sameAs link to Wikipedia (Primary KG signal). |  | Add the existing official 'wikipedia.org' URL to sameAs; do not create this profile solely for SEO. |
| Warning | sameAs | Missing sameAs link to Wikidata (Primary KG signal). |  | Add the existing official 'wikidata.org' URL to sameAs; do not create this profile solely for SEO. |
| Info | Wikipedia | No Wikipedia article found for 'El Buen Maestro'. |  | Only pursue Wikipedia if the entity meets independent notability standards. Otherwise, strengthen official schema, sameAs profiles, citations, and About/Contact signals. |
| Info | environment | Performance measurement incomplete | PageSpeed API returned an error, so CWV recommendations are less reliable. | Set `PAGESPEED_API_KEY` in your environment or `.env` file (see `.env.example`), then rerun. The CLI also accepts `--api-key`. Prioritize LCP/INP/CLS fixes from that output. |
| info | pagespeed | pagespeed measurement incomplete | Rate limited by Google API. Wait a few minutes or add an API key. | Rerun this check after resolving the environment/API/network limitation. |
| Info | sameAs | Missing sameAs link to LinkedIn (Strong KG signal). |  | Add 'linkedin.com' profile URL to sameAs array in your entity schema. |
| Info | sameAs | Missing sameAs link to Twitter/X (Strong KG signal). |  | Add 'x.com' profile URL to sameAs array in your entity schema. |

## Measurement Notes

1 checks returned errors or incomplete measurements; treat affected scores as directional.
