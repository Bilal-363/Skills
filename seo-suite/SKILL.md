---
name: seo-suite
description: Full SEO orchestrator. Use when the user wants search-engine-optimization work and wants the whole SEO toolkit considered: site and page audits, technical SEO, content and E-E-A-T, schema, sitemaps, backlinks, local/maps, international/hreflang, GEO / AI-search, image SEO, clustering, and planning. Triggers on: seo, full seo, seo suite, run all seo, search engine optimization, seo audit, optimize for search, rank on google.
---

# SEO Suite

**This is an orchestrator (a "suite"), not a single procedure.** It does not do the work itself — it routes to the specialized member skills listed below, which are installed alongside it in `~/.claude/skills/`.

## How to use it (smart-routing — the default)

1. Read the user's actual request and identify the specific target, technology, and objective.
2. Pick **only the member skills that fit** that request from the list below.
3. Invoke each selected skill with the **Skill tool** (by its exact name), one at a time, in a sensible order. Follow each skill's own instructions.
4. Do **not** run skills that don't apply. A request about one page, host, or control should pull in a handful of skills, not the whole list.

## Full-sweep mode (only when explicitly asked)

If the user says something like "run the **full** seo-suite suite", "run **everything**", or "**all** seo-suite skills", then work through the relevant members in order, skipping only those that are technically impossible for the given target (e.g. a cloud-only skill against an on-prem target). Announce the plan first, since this is a long, multi-step run.

## Guardrail

Only proceed with offensive or intrusive actions against systems the user is authorized to test (their own assets, an engagement with scope, a CTF, or a lab). If authorization is unclear for an intrusive step, ask before running it. Read-only analysis, planning, and defensive work need no such gate.

## Member skills (29)

- competitive-analysis
- content-scoring
- geo-loop
- schema-generator
- seo
- seo-audit
- seo-backlinks
- seo-cluster
- seo-competitor-pages
- seo-content
- seo-content-brief
- seo-dataforseo
- seo-drift
- seo-ecommerce
- seo-flow
- seo-geo
- seo-google
- seo-hreflang
- seo-image-gen
- seo-images
- seo-local
- seo-maps
- seo-page
- seo-plan
- seo-programmatic
- seo-schema
- seo-sitemap
- seo-sxo
- seo-technical

*The list is a curated starting point. If a closely related installed skill fits the request better, use it too — these names are hints, not hard limits.*