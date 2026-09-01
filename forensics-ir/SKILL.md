---
name: forensics-ir
description: Digital forensics, incident response, malware analysis, and threat-intelligence orchestrator. Use when the user is investigating an incident or artifacts: disk/memory/network/cloud forensics, evidence acquisition, timeline reconstruction, malware reverse-engineering and triage, IOC extraction and enrichment, breach/ransomware/phishing investigation, and CTI (MISP, STIX/TAXII, OpenCTI, OSINT, threat-actor profiling). Triggers on: forensics, DFIR, incident response, IR, breach investigation, malware analysis, reverse engineering, memory forensics, disk forensics, timeline, IOC, threat intelligence, MISP, ransomware investigation.
---

# Forensics, IR & Threat Intelligence Suite

**This is an orchestrator (a "suite"), not a single procedure.** It does not do the work itself — it routes to the specialized member skills listed below, which are installed alongside it in `~/.claude/skills/`.

## How to use it (smart-routing — the default)

1. Read the user's actual request and identify the specific target, technology, and objective.
2. Pick **only the member skills that fit** that request from the list below.
3. Invoke each selected skill with the **Skill tool** (by its exact name), one at a time, in a sensible order. Follow each skill's own instructions.
4. Do **not** run skills that don't apply. A request about one page, host, or control should pull in a handful of skills, not the whole list.

## Full-sweep mode (only when explicitly asked)

If the user says something like "run the **full** forensics-ir suite", "run **everything**", or "**all** forensics-ir skills", then work through the relevant members in order, skipping only those that are technically impossible for the given target (e.g. a cloud-only skill against an on-prem target). Announce the plan first, since this is a long, multi-step run.

## Guardrail

Only proceed with offensive or intrusive actions against systems the user is authorized to test (their own assets, an engagement with scope, a CTF, or a lab). If authorization is unclear for an intrusive step, ask before running it. Read-only analysis, planning, and defensive work need no such gate.

## Member skills (148)

- acquiring-disk-image-with-dd-and-dcfldd
- analyzing-android-malware-with-apktool
- analyzing-browser-forensics-with-hindsight
- analyzing-campaign-attribution-evidence
- analyzing-cyber-kill-chain
- analyzing-disk-image-with-autopsy
- analyzing-docker-container-forensics
- analyzing-golang-malware-with-ghidra
- analyzing-indicators-of-compromise
- analyzing-linux-elf-malware
- analyzing-linux-system-artifacts
- analyzing-lnk-file-and-jump-list-artifacts
- analyzing-macro-malware-in-office-documents
- analyzing-malware-behavior-with-cuckoo-sandbox
- analyzing-malware-family-relationships-with-malpedia
- analyzing-malware-persistence-with-autoruns
- analyzing-malware-sandbox-evasion-techniques
- analyzing-memory-dumps-with-volatility
- analyzing-memory-forensics-with-lime-and-volatility
- analyzing-network-covert-channels-in-malware
- analyzing-network-traffic-of-malware
- analyzing-outlook-pst-for-email-forensics
- analyzing-packed-malware-with-upx-unpacker
- analyzing-pdf-malware-with-pdfid
- analyzing-powershell-empire-artifacts
- analyzing-slack-space-and-file-system-artifacts
- analyzing-supply-chain-malware-artifacts
- analyzing-threat-actor-ttps-with-mitre-attack
- analyzing-threat-actor-ttps-with-mitre-navigator
- analyzing-threat-intelligence-feeds
- analyzing-threat-landscape-with-misp
- analyzing-windows-amcache-artifacts
- analyzing-windows-lnk-files-for-artifacts
- analyzing-windows-registry-for-artifacts
- analyzing-windows-shellbag-artifacts
- automating-ioc-enrichment
- building-adversary-infrastructure-tracking-system
- building-attack-pattern-library-from-cti-reports
- building-automated-malware-submission-pipeline
- building-incident-response-dashboard
- building-incident-response-playbook
- building-incident-timeline-with-timesketch
- building-ioc-defanging-and-sharing-pipeline
- building-ioc-enrichment-pipeline-with-opencti
- building-malware-incident-communication-template
- building-super-timelines-with-plaso
- building-threat-actor-profile-from-osint
- building-threat-feed-aggregation-with-misp
- building-threat-hunt-hypothesis-framework
- building-threat-intelligence-enrichment-in-splunk
- building-threat-intelligence-feed-integration
- building-threat-intelligence-platform
- collecting-indicators-of-compromise
- collecting-threat-intelligence-with-misp
- collecting-volatile-evidence-from-compromised-host
- conducting-cloud-incident-response
- conducting-external-reconnaissance-with-osint
- conducting-malware-incident-response
- conducting-memory-forensics-with-volatility
- conducting-phishing-incident-response
- conducting-post-incident-lessons-learned
- conducting-spearphishing-simulation-campaign
- containing-active-breach
- correlating-threat-campaigns
- deobfuscating-javascript-malware
- deobfuscating-powershell-obfuscated-malware
- detecting-container-escape-attempts
- detecting-container-escape-with-falco-rules
- detecting-fileless-malware-techniques
- detecting-mobile-malware-behavior
- eradicating-malware-from-infected-systems
- evaluating-threat-intelligence-platforms
- executing-phishing-simulation-campaign
- extracting-browser-history-artifacts
- extracting-config-from-agent-tesla-rat
- extracting-credentials-from-memory-dump
- extracting-iocs-from-malware-samples
- extracting-memory-artifacts-with-rekall
- extracting-windows-event-logs-artifacts
- generating-forensic-timelines-with-hayabusa
- generating-threat-intelligence-reports
- implementing-code-signing-for-artifacts
- implementing-diamond-model-analysis
- implementing-ot-incident-response-playbook
- implementing-security-information-sharing-with-stix2
- implementing-stix-taxii-feed-integration
- implementing-taxii-server-with-opentaxii
- implementing-threat-intelligence-lifecycle-management
- investigating-insider-threat-indicators
- investigating-phishing-email-incident
- investigating-ransomware-attack-artifacts
- managing-intelligence-lifecycle
- modeling-threats-with-opencti
- monitoring-darkweb-sources
- operationalizing-misp-threat-feeds
- parsing-artifacts-with-eric-zimmerman-tools
- performing-ai-driven-osint-correlation
- performing-automated-malware-analysis-with-cape
- performing-brand-monitoring-for-impersonation
- performing-cloud-forensics-investigation
- performing-cloud-forensics-with-aws-cloudtrail
- performing-cloud-log-forensics-with-athena
- performing-cloud-native-forensics-with-falco
- performing-cloud-storage-forensic-acquisition
- performing-container-escape-detection
- performing-dark-web-monitoring-for-threats
- performing-disk-forensics-investigation
- performing-dynamic-analysis-with-any-run
- performing-endpoint-forensics-investigation
- performing-file-carving-with-foremost
- performing-firmware-malware-analysis
- performing-indicator-lifecycle-management
- performing-ioc-enrichment-automation
- performing-ip-reputation-analysis-with-shodan
- performing-linux-log-forensics-investigation
- performing-log-analysis-for-forensic-investigation
- performing-malware-hash-enrichment-with-virustotal
- performing-malware-ioc-extraction
- performing-malware-persistence-investigation
- performing-malware-triage-with-yara
- performing-memory-forensics-with-volatility3
- performing-memory-forensics-with-volatility3-plugins
- performing-mobile-device-forensics-with-cellebrite
- performing-network-forensics-with-wireshark
- performing-osint-with-spiderfoot
- performing-paste-site-monitoring-for-credentials
- performing-sqlite-database-forensics
- performing-static-malware-analysis-with-pe-studio
- performing-threat-hunting-with-yara-rules
- performing-threat-intelligence-sharing-with-misp
- performing-threat-landscape-assessment-for-sector
- performing-timeline-reconstruction-with-plaso
- performing-windows-artifact-analysis-with-eric-zimmerman-tools
- performing-yara-rule-development-for-detection
- processing-stix-taxii-feeds
- profiling-threat-actor-groups
- recovering-deleted-files-with-photorec
- recovering-from-ransomware-attack
- reverse-engineering-android-malware-with-jadx
- reverse-engineering-dotnet-malware-with-dnspy
- reverse-engineering-ios-app-with-frida
- reverse-engineering-malware-with-ghidra
- reverse-engineering-ransomware-encryption-routine
- reverse-engineering-rust-malware
- tracking-threat-actor-infrastructure
- triaging-security-incident
- triaging-security-incident-with-ir-playbook
- triaging-windows-with-kape

*The list is a curated starting point. If a closely related installed skill fits the request better, use it too — these names are hints, not hard limits.*