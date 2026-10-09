# ULTRON — Tool Security, Privacy & SSRF Governance

## 1. Threat Model & Security Posture

ULTRON operates as an autonomous cognitive intelligence operating system. Because it interacts with external network resources, tools, and user-provided prompts, it incorporates a defense-in-depth security model.

---

## 2. Risk Levels (Directive Section 8)

All tool invocations and tasks are categorized into four formal risk tiers:

| Level | Risk Classification | Description & Policy |
| :--- | :--- | :--- |
| **L0** | Public Read-Only Lookup | Unauthenticated anonymous queries (Wayback lookup, Gutendex catalog query, MCP source discovery). Approved without policy gates. |
| **L1** | Reversible Local Processing | In-memory or client-side operations (Canvas image compression, format transcoding). Sandboxed within local bounds. |
| **L2** | External Data Transfer | Externally visible network queries containing user parameters (e.g., Have I Been Pwned). Mandatory informed consent gate. |
| **L3** | Destructive / High-Impact | File overwriting, network proxy modifications, or circumvention actions. Excluded tools or hard policy halts. |

---

## 3. Server-Side Request Forgery (SSRF) Protection

Implemented in `core/security/ssrfGuard.ts`, every outbound server-side HTTP request is audited prior to network connection:

### 3.1 Blocked Ranges & Targets
- **IPv4 Loopback**: `127.0.0.0/8`, `0.0.0.0/8`
- **RFC 1918 Private Subnets**:
  - `10.0.0.0/8`
  - `172.16.0.0/12`
  - `192.168.0.0/16`
- **Link-Local & Carrier-Grade NAT**:
  - `169.254.0.0/16`
  - `100.64.0.0/10`
- **Cloud Metadata Endpoints**:
  - `169.254.169.254` (AWS, GCP, Azure, OpenStack)
  - `metadata.google.internal`
- **IPv6 Private & Link-Local**:
  - `::1`, `fe80::/10`, `fc00::/7`
- **Disallowed Protocols**: Only `http:` and `https:` are permitted; `file:`, `ftp:`, `gopher:` are strictly rejected.

---

## 4. Privacy & Sensitive Data Safeguards

### 4.1 Mathematical k-Anonymity for Breach Checks
When checking password breach exposure via Have I Been Pwned (`SecurityChecker`):
1. The plaintext password is never sent over any network.
2. A SHA-1 hash is computed client-side.
3. Only the first **5 hex characters** of the hash are dispatched to `api.pwnedpasswords.com/range/{prefix}`.
4. Upstream responds with a batch of suffixes matching that 5-char prefix (~500 results).
5. The comparison occurs locally.
6. The input is discarded from memory immediately. Zero PII is committed to long-term memory or disk.

### 4.2 Informed Confirmation Gate
Before any external breach check is dispatched, the user must explicitly toggle:
> *"I authorize transmitting a 5-character SHA-1 hash prefix for breach verification."*
If the gate is not confirmed, execution aborts with HTTP 403.

---

## 5. Secret Redaction & Log Hygiene

`SSRFGuard.redactSecrets()` automatically sanitizes server responses and audit logs:
- Google Maps API Keys (`AIza[0-9A-Za-z-_]{35}`) -> `[REDACTED_GOOGLE_API_KEY]`
- OpenAI / Third-party API Keys (`sk-...`) -> `[REDACTED_API_KEY]`
- Bearer Tokens (`Bearer ...`) -> `Bearer [REDACTED_BEARER_TOKEN]`
- Query Parameters (`?key=...`, `&token=...`) -> `[REDACTED]`
- Environment variables containing secrets (`WORLDMONITOR_API_KEY`, etc.) are never exposed in `NEXT_PUBLIC_*` or client bundles.
