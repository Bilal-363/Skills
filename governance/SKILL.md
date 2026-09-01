---
name: governance
description: Security governance, risk & compliance (GRC) plus vulnerability-management orchestrator. Use when the user wants audits, frameworks, risk work, or vuln prioritization: NIST CSF/RMF, ISO 27001, PCI DSS, HIPAA, GDPR, SOC 2, CMMC, risk assessment, access reviews and recertification, vendor/third-party risk, privacy impact assessments, and vulnerability management (scanning, CVSS/EPSS/SSVC prioritization, remediation SLAs). Triggers on: GRC, governance, compliance, audit, risk assessment, NIST, ISO 27001, PCI DSS, HIPAA, GDPR, SOC 2, CMMC, vulnerability management, CVSS, EPSS, access review, vendor risk.
---

# Governance, Risk & Compliance Suite

**This is an orchestrator (a "suite"), not a single procedure.** It does not do the work itself — it routes to the specialized member skills listed below, which are installed alongside it in `~/.claude/skills/`.

## How to use it (smart-routing — the default)

1. Read the user's actual request and identify the specific target, technology, and objective.
2. Pick **only the member skills that fit** that request from the list below.
3. Invoke each selected skill with the **Skill tool** (by its exact name), one at a time, in a sensible order. Follow each skill's own instructions.
4. Do **not** run skills that don't apply. A request about one page, host, or control should pull in a handful of skills, not the whole list.

## Full-sweep mode (only when explicitly asked)

If the user says something like "run the **full** governance suite", "run **everything**", or "**all** governance skills", then work through the relevant members in order, skipping only those that are technically impossible for the given target (e.g. a cloud-only skill against an on-prem target). Announce the plan first, since this is a long, multi-step run.

## Guardrail

Only proceed with offensive or intrusive actions against systems the user is authorized to test (their own assets, an engagement with scope, a CTF, or a lab). If authorization is unclear for an intrusive step, ask before running it. Read-only analysis, planning, and defensive work need no such gate.

## Member skills (36)

- achieving-cmmc-level-2-compliance
- building-vulnerability-aging-and-sla-tracking
- building-vulnerability-dashboard-with-defectdojo
- building-vulnerability-exception-tracking-system
- building-vulnerability-scanning-workflow
- conducting-cyber-risk-assessment-with-nist-800-30
- executing-nist-rmf-authorization-to-operate
- implementing-aws-config-rules-for-compliance
- implementing-aws-security-hub-compliance
- implementing-epss-score-for-vulnerability-prioritization
- implementing-gdpr-data-protection-controls
- implementing-gdpr-data-subject-access-request
- implementing-hipaa-security-rule-safeguards
- implementing-iso-27001-information-security-management
- implementing-nerc-cip-compliance-controls
- implementing-pci-dss-compliance-controls
- implementing-vulnerability-management-with-greenbone
- implementing-vulnerability-remediation-sla
- implementing-vulnerability-sla-breach-alerting
- managing-third-party-vendor-risk
- performing-access-recertification-with-saviynt
- performing-access-review-and-certification
- performing-agentless-vulnerability-scanning
- performing-asset-criticality-scoring-for-vulns
- performing-authenticated-vulnerability-scan
- performing-cve-prioritization-with-kev-catalog
- performing-endpoint-vulnerability-remediation
- performing-entitlement-review-with-sailpoint-iiq
- performing-nist-csf-maturity-assessment
- performing-ot-vulnerability-scanning-safely
- performing-privacy-impact-assessment
- performing-privileged-account-access-review
- performing-soc2-type2-audit-preparation
- performing-vulnerability-scanning-with-nessus
- prioritizing-vulnerabilities-with-cvss-scoring
- triaging-vulnerabilities-with-ssvc-framework

*The list is a curated starting point. If a closely related installed skill fits the request better, use it too — these names are hints, not hard limits.*