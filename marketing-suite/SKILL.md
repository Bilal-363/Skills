---
name: marketing-suite
description: Full marketing / growth orchestrator. Use when the user wants marketing work and wants the whole toolkit considered: copywriting, ads and ad creative, email and cold outreach, SEO/ASO, content strategy, CRO and conversion, pricing and offers, launches, referrals, social, PR, product marketing, analytics and attribution. Triggers on: marketing, growth, marketing suite, go-to-market, campaign, copywriting, email marketing, ads, conversion, CRO, launch, pricing strategy.
---

# Marketing & Growth Suite

**This is an orchestrator (a "suite"), not a single procedure.** It does not do the work itself — it routes to the specialized member skills listed below, which are installed alongside it in `~/.claude/skills/`.

## How to use it (smart-routing — the default)

1. Read the user's actual request and identify the specific target, technology, and objective.
2. Pick **only the member skills that fit** that request from the list below.
3. Invoke each selected skill with the **Skill tool** (by its exact name), one at a time, in a sensible order. Follow each skill's own instructions.
4. Do **not** run skills that don't apply. A request about one page, host, or control should pull in a handful of skills, not the whole list.

## Full-sweep mode (only when explicitly asked)

If the user says something like "run the **full** marketing-suite suite", "run **everything**", or "**all** marketing-suite skills", then work through the relevant members in order, skipping only those that are technically impossible for the given target (e.g. a cloud-only skill against an on-prem target). Announce the plan first, since this is a long, multi-step run.

## Guardrail

Only proceed with offensive or intrusive actions against systems the user is authorized to test (their own assets, an engagement with scope, a CTF, or a lab). If authorization is unclear for an intrusive step, ask before running it. Read-only analysis, planning, and defensive work need no such gate.

## Member skills (49)

- ab-testing
- ad-creative
- ads
- ai-seo
- analytics
- aso
- attribution
- churn-prevention
- cold-email
- co-marketing
- community-marketing
- competitor-profiling
- competitors
- content-strategy
- copy-editing
- copywriting
- cro
- customer-research
- directory-submissions
- emails
- free-tools
- image
- influencer-marketing
- launch
- lead-magnets
- marketing-council
- marketing-ideas
- marketing-loops
- marketing-plan
- marketing-psychology
- offers
- onboarding
- paywalls
- popups
- pricing
- product-marketing
- programmatic-seo
- prospecting
- public-relations
- referrals
- revops
- sales-enablement
- schema
- seo-audit-mkt
- signup
- site-architecture
- sms
- social
- video

*The list is a curated starting point. If a closely related installed skill fits the request better, use it too — these names are hints, not hard limits.*