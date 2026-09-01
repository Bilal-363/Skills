# Writing the copy

When the brief is only a niche, every word on the page is authored. Mark each
authored line `‹authored — confirm›` in the spec, then write it properly.

Bad generated copy is the fastest way to make an expensive layout look cheap.

---

## The H1 — five formulas that work

Pick one. Six to nine words. Two lines. No colon.

| formula | shape | example |
|---|---|---|
| **Outcome** | `<verb> <the thing they want>` | *Ship AI workers that grind while you rest* |
| **Place** | `<noun phrase> for <who/when>` | *A quiet room for difficult decisions* |
| **Claim** | `<subject> <does something surprising>` | *The bridge is the city's compass* |
| **Contrast** | `<not this>. <this>.` | *Not a clinic. A morning you don't dread.* |
| **Plain name** | the thing, stated flatly | *Implant Dentistry* |

**Plain name is not a failure.** For clinics, law, and trades, saying the thing
plainly beats a metaphor. Reserve the poetic formulas for hospitality, creative
and consumer.

### Rules
- **Never a colon.** `Modern Dentistry: Reimagined` is the single most obvious
  AI tell on the internet.
- Banned openers: *Unlock, Unleash, Elevate, Transform, Revolutionize, Discover,
  Experience, Empower, Seamless, Cutting-edge, Next-level, Redefining,
  Where X meets Y, More than just.*
- No sentence-case-Title-Case-Mixing. Pick one and hold it.
- One idea. If it needs "and", it is two headlines.
- Say it out loud. If you would not say it to a customer, delete it.
- The accent `<em>` span must be a real phrase, not one random word.

---

## The sub — one sentence, ~18 words

Answers the question the H1 raises. Concrete nouns, no adjectives stacked.

```
H1  : AI Voice Agents That Capture Every Lead
sub : AIWonderz helps service businesses automate calls, follow-ups, and lead
      handling using AI voice agents, chatbots, and workflow automation.
```
That works because it names **who** (service businesses), **what** (calls,
follow-ups, leads), and **how** (voice agents, chatbots, workflows). Three
concrete things beat any amount of "streamline your operations".

Never open the sub by restating the H1 in different words.

---

## Buttons

Two per viewport, maximum. Primary is a verb the user would say.

| good | bad |
|---|---|
| Book a consultation | Get started |
| See the menu | Learn more |
| Call the clinic | Explore |
| Get a quote | Discover more |
| View available times | Click here |

`Get Started` is acceptable **only** for software, where it is literal.
The secondary is always lower-commitment than the primary — never two CTAs of
equal weight.

---

## Section headings

Same rules as the H1, one size down. A heading that could sit on any site in
the niche is not a heading — it is a label. `Our Services` is a label.
`Everything we do happens in one building` is a heading.

Eyebrows: 1–3 words, uppercase, tracked. A category, not a sentence.

---

## Per-niche voice

| niche family | voice | avoid |
|---|---|---|
| Health & care | plain, calm, specific. Times, names, what happens next | "journey", "wellness experience", anything aspirational about being ill |
| Law & finance | flat, precise, no metaphor. Say what you do and where | "navigate", "landscape", "partner with you" |
| Trades | direct, practical, time-bound. "Same-day", "24 hours", named area | "solutions", "excellence", "passionate" |
| Restaurants & hotels | sensory and concrete: one dish, one hour, one room | "culinary journey", "unforgettable experience" |
| Creative & agency | short, confident, slightly cold. Let the work speak | "we're storytellers", "we craft experiences" |
| Consumer & retail | warm, second person, specific benefit | "curated", "elevate your routine" |
| Software & AI | precise, technical, no hype. Name the mechanism | "revolutionize", "powered by AI", "supercharge" |

---

## Placeholder facts

Never invent verifiable specifics — years in business, patient counts, awards,
review scores, prices, certifications. If a number is needed for the layout,
write it as `‹e.g. 12 years — confirm›` and list every one at the end of the
spec under **Facts to confirm**.

Testimonials, staff names, and case studies are invented facts about real
people. Either the user supplies them, or the section is cut. **Never generate
a fake review.**

---

## SEO copy

`<title>` — 50–60 chars, `Primary thing | Brand`. Not the H1 verbatim.
`<meta description>` — 140–160 chars, one sentence, contains the thing and the
place. Written for a human scanning results, not for a crawler.

### Schema per niche
Emit JSON-LD from the same source array as the visible copy, so they cannot drift.

| niche | types |
|---|---|
| any local business | `LocalBusiness` + `PostalAddress` + `OpeningHoursSpecification` + `GeoCoordinates` |
| clinic / dental / vet | `MedicalBusiness` / `Dentist` / `VeterinaryCare` |
| restaurant / café | `Restaurant` + `Menu` + `servesCuisine` + `priceRange` |
| hotel | `Hotel` + `amenityFeature` |
| law / accounting | `LegalService` / `AccountingService` |
| trades | `HomeAndConstructionBusiness` + `areaServed` |
| retail / D2C | `Store` + `Product` + `Offer` |
| software / SaaS | `SoftwareApplication` + `Offer` |
| any page with an FAQ | `FAQPage` |
| any page with a service list | `Service` per item |

Also: one `Organization` block sitewide with `name`, `url`, `logo`, `telephone`,
`email`, `address`, `sameAs[]`. `sitemap.xml` + `robots.txt` listing every URL.

**Never emit `AggregateRating` or `Review` schema for ratings the user did not
supply.** That is fabricated structured data and it gets sites penalised.

---

## The last pass

Read the whole page aloud, top to bottom. Every line that makes you wince or
that you skim past — cut it or rewrite it. Pages get better by deletion far
more often than by addition.
