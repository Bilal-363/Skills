---
name: offensive
description: Offensive-security / red-team orchestrator. Use when the user wants to attack, exploit, pentest, or actively test defenses: penetration testing (web, API, network, Active Directory, cloud, mobile, wireless, IoT/OT), exploitation, red-team and C2 operations, phishing / social-engineering simulation, privilege escalation, lateral movement, password / hash cracking, attacker recon / OSINT, or LLM red-teaming. Triggers on: offensive, pentest, penetration test, red team, exploit, attack simulation, ethical hacking, appsec testing, OWASP, kerberoasting, bloodhound, metasploit, C2, phishing simulation, hack (authorized).
---

# Offensive Security Suite

**This is an orchestrator (a "suite"), not a single procedure.** It does not do the work itself — it routes to the specialized member skills listed below, which are installed alongside it in `~/.claude/skills/`.

## How to use it (smart-routing — the default)

1. Read the user's actual request and identify the specific target, technology, and objective.
2. Pick **only the member skills that fit** that request from the list below.
3. Invoke each selected skill with the **Skill tool** (by its exact name), one at a time, in a sensible order. Follow each skill's own instructions.
4. Do **not** run skills that don't apply. A request about one page, host, or control should pull in a handful of skills, not the whole list.

## Full-sweep mode (only when explicitly asked)

If the user says something like "run the **full** offensive suite", "run **everything**", or "**all** offensive skills", then work through the relevant members in order, skipping only those that are technically impossible for the given target (e.g. a cloud-only skill against an on-prem target). Announce the plan first, since this is a long, multi-step run.

## Guardrail

Only proceed with offensive or intrusive actions against systems the user is authorized to test (their own assets, an engagement with scope, a CTF, or a lab). If authorization is unclear for an intrusive step, ask before running it. Read-only analysis, planning, and defensive work need no such gate.

## Member skills (192)

- abusing-dpapi-for-credential-access
- abusing-shadow-credentials-for-privesc
- analyzing-cobaltstrike-malleable-c2-profiles
- attacking-entra-id-with-roadtools
- attacking-oauth-with-device-code-phishing
- auditing-entra-id-with-aadinternals
- building-c2-infrastructure-with-sliver-framework
- building-c2-redirector-infrastructure
- building-red-team-c2-infrastructure-with-havoc
- bypassing-authentication-with-forced-browsing
- coercing-authentication-with-coercer-petitpotam
- conducting-cloud-penetration-testing
- conducting-domain-persistence-with-dcsync
- conducting-full-scope-red-team-engagement
- conducting-internal-network-penetration-test
- conducting-internal-reconnaissance-with-bloodhound-ce
- conducting-man-in-the-middle-attack-simulation
- conducting-mobile-app-penetration-test
- conducting-network-penetration-test
- conducting-pass-the-ticket-attack
- conducting-social-engineering-penetration-test
- conducting-social-engineering-pretext-call
- conducting-wireless-network-penetration-test
- continuous-llm-red-teaming-with-promptfoo
- deploying-cloud-deception-with-decoy-resources
- deploying-decoy-files-for-ransomware-detection
- detecting-ai-model-prompt-injection-attacks
- detecting-api-enumeration-attacks
- detecting-attacks-on-historian-servers
- detecting-attacks-on-scada-systems
- detecting-azure-lateral-movement
- detecting-bluetooth-low-energy-attacks
- detecting-dcsync-attack-in-active-directory
- detecting-deepfake-audio-in-vishing-attacks
- detecting-dll-sideloading-attacks
- detecting-email-forwarding-rules-attack
- detecting-fileless-attacks-on-endpoints
- detecting-golden-ticket-attacks-in-kerberos-logs
- detecting-kerberoasting-attacks
- detecting-lateral-movement-in-network
- detecting-lateral-movement-with-splunk
- detecting-lateral-movement-with-zeek
- detecting-living-off-the-land-attacks
- detecting-modbus-command-injection-attacks
- detecting-model-extraction-attacks
- detecting-pass-the-hash-attacks
- detecting-pass-the-ticket-attacks
- detecting-rdp-brute-force-attacks
- detecting-stuxnet-style-attacks
- detecting-supply-chain-attacks-in-ci-cd
- emulating-cloud-attacks-with-stratus-red-team
- enumerating-cloud-with-cloudfox
- escaping-containers-to-host
- executing-active-directory-attack-simulation
- executing-red-team-engagement-planning
- executing-red-team-exercise
- exploiting-active-directory-certificate-services-esc1
- exploiting-active-directory-with-bloodhound
- exploiting-adcs-with-certipy
- exploiting-api-injection-vulnerabilities
- exploiting-aws-with-pacu
- exploiting-bgp-hijacking-vulnerabilities
- exploiting-broken-function-level-authorization
- exploiting-broken-link-hijacking
- exploiting-constrained-delegation-abuse
- exploiting-deeplink-vulnerabilities
- exploiting-excessive-data-exposure-in-api
- exploiting-http-request-smuggling
- exploiting-idor-vulnerabilities
- exploiting-insecure-data-storage-in-mobile
- exploiting-insecure-deserialization
- exploiting-ipv6-vulnerabilities
- exploiting-jwt-algorithm-confusion-attack
- exploiting-kerberoasting-with-impacket
- exploiting-mass-assignment-in-rest-apis
- exploiting-ms17-010-eternalblue-vulnerability
- exploiting-nopac-cve-2021-42278-42287
- exploiting-nosql-injection-vulnerabilities
- exploiting-oauth-misconfiguration
- exploiting-prototype-pollution-in-javascript
- exploiting-race-condition-vulnerabilities
- exploiting-server-side-request-forgery
- exploiting-smb-vulnerabilities-with-metasploit
- exploiting-sql-injection-vulnerabilities
- exploiting-sql-injection-with-sqlmap
- exploiting-template-injection-vulnerabilities
- exploiting-type-juggling-vulnerabilities
- exploiting-vulnerabilities-with-metasploit-framework
- exploiting-websocket-vulnerabilities
- exploiting-zerologon-vulnerability-cve-2020-1472
- hunting-credential-stuffing-attacks
- hunting-for-dcom-lateral-movement
- hunting-for-dcsync-attacks
- hunting-for-domain-fronting-c2-traffic
- hunting-for-lateral-movement-via-wmi
- hunting-for-ntlm-relay-attacks
- implementing-attack-path-analysis-with-xm-cyber
- implementing-attack-surface-management
- implementing-mimecast-targeted-attack-protection
- implementing-mitre-attack-coverage-mapping
- implementing-threat-modeling-with-mitre-attack
- intercepting-mobile-traffic-with-burpsuite
- mapping-attack-paths-with-bloodhound-ce
- mapping-mitre-attack-techniques
- moving-laterally-with-netexec
- operating-havoc-c2
- operating-sliver-c2
- orchestrating-llm-attacks-with-pyrit
- performing-active-directory-bloodhound-analysis
- performing-active-directory-compromise-investigation
- performing-active-directory-forest-trust-attack
- performing-active-directory-penetration-test
- performing-active-directory-vulnerability-assessment
- performing-api-fuzzing-with-restler
- performing-api-rate-limiting-bypass
- performing-arp-spoofing-attack-simulation
- performing-aws-account-enumeration-with-scout-suite
- performing-bandwidth-throttling-attack-simulation
- performing-binary-exploitation-analysis
- performing-blind-ssrf-exploitation
- performing-bluetooth-security-assessment
- performing-clickjacking-attack-test
- performing-cloud-penetration-testing-with-pacu
- performing-content-security-policy-bypass
- performing-csrf-attack-simulation
- performing-directory-traversal-testing
- performing-dns-enumeration-and-zone-transfer
- performing-external-network-penetration-test
- performing-firmware-extraction-with-binwalk
- performing-fuzzing-with-aflplusplus
- performing-gcp-penetration-testing-with-gcpbucketbrute
- performing-graphql-depth-limit-attack
- performing-graphql-introspection-attack
- performing-graphql-security-assessment
- performing-hash-cracking-with-hashcat
- performing-http-parameter-pollution-attack
- performing-initial-access-with-evilginx3
- performing-iot-security-assessment
- performing-jwt-none-algorithm-attack
- performing-kerberoasting-attack
- performing-kubernetes-penetration-testing
- performing-lateral-movement-detection
- performing-lateral-movement-with-wmiexec
- performing-mobile-app-certificate-pinning-bypass
- performing-open-source-intelligence-gathering
- performing-packet-injection-attack
- performing-physical-intrusion-assessment
- performing-purple-team-atomic-testing
- performing-purple-team-exercise
- performing-red-team-phishing-with-gophish
- performing-red-team-with-covenant
- performing-second-order-sql-injection
- performing-ssl-stripping-attack
- performing-ssrf-vulnerability-exploitation
- performing-subdomain-enumeration-with-subfinder
- performing-supply-chain-attack-simulation
- performing-thick-client-application-penetration-test
- performing-threat-emulation-with-atomic-red-team
- performing-vlan-hopping-attack
- performing-web-application-firewall-bypass
- performing-web-application-penetration-test
- performing-web-cache-deception-attack
- performing-web-cache-poisoning-attack
- performing-wifi-password-cracking-with-aircrack
- performing-wireless-network-penetration-test
- post-exploiting-microsoft-graph-with-graphrunner
- red-teaming-llms-with-garak
- relaying-ntlm-for-adcs-esc8
- scanning-network-with-nmap-advanced
- testing-android-intents-for-vulnerabilities
- testing-api-authentication-weaknesses
- testing-api-for-broken-object-level-authorization
- testing-api-for-mass-assignment-vulnerability
- testing-api-security-with-owasp-top-10
- testing-cors-misconfiguration
- testing-for-broken-access-control
- testing-for-business-logic-vulnerabilities
- testing-for-email-header-injection
- testing-for-host-header-injection
- testing-for-json-web-token-vulnerabilities
- testing-for-open-redirect-vulnerabilities
- testing-for-sensitive-data-exposure
- testing-for-system-prompt-leakage
- testing-for-xml-injection-vulnerabilities
- testing-for-xss-vulnerabilities
- testing-for-xss-vulnerabilities-with-burpsuite
- testing-for-xxe-injection-vulnerabilities
- testing-jwt-token-security
- testing-mobile-api-authentication
- testing-oauth2-implementation-flaws
- testing-prompt-injection-in-rag-pipelines
- testing-websocket-api-security

*The list is a curated starting point. If a closely related installed skill fits the request better, use it too — these names are hints, not hard limits.*