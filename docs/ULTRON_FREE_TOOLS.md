# ULTRON — Free Web Tools Hub Documentation

## 1. Architecture & Design Principles

The **Free Tools Hub** (`/tools`) extends ULTRON into a practical sovereign tools environment without misrepresenting website access as free automation or masking commercial API paywalls.

### Key Classifications:
1. **Execution Modes**:
   - `local`: Operates client-side (Canvas, Web Workers) or in isolated local Node.js buffers without external network transmission.
   - `approved_api`: Calls authorized, documented public REST or MCP endpoints.
   - `user_opened_website`: Launches official third-party web application in a secure browser tab for user-driven interactions.
2. **Pricing Tiers**:
   - `free_core`: Fully functional without payment for core features.
   - `freemium`: Basic or low-resolution workflow is free; HD exports or batch APIs require payment.
   - `paid`: Subscription mandatory for intended automation.
   - `unverified`: Third-party pricing terms not yet cryptographically verified.

---

## 2. Audited Tool Directory (17 Registered Tools)

### A. Image & Design Tools
| Tool | Execution Mode | Pricing Tier | Automation | Purpose & Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **Squoosh** | `local` | `free_core` | Approved | Local image compression (WebP/JPEG/PNG) with byte savings calculation and artifact generation. Max single payload: 15MB. |
| **Photopea** | `user_opened_website` | `free_core` | User Required | Browser-based Photoshop/PSD editor. Ad-supported free tier. User exports result and returns to ULTRON mission. |
| **remove.bg** | `user_opened_website` | `freemium` | User Required | Background remover. Free preview on web; HD exports and API calls require paid credits. |
| **Cleanup.pictures** | `user_opened_website` | `freemium` | User Required | Object inpainting. Free tier limited to 720p resolution; Pro tier required for full HD. |
| **Unscreen** | `user_opened_website` | `freemium` | User Required | Video background remover. Redirected to Canva Video suite. Free clips limited to 5-10s low-res preview. |

### B. Developer & Visual Communication Tools
| Tool | Execution Mode | Pricing Tier | Automation | Purpose & Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **Carbon** | `user_opened_website` | `free_core` | User Required | Code screenshots. Supports prefilled URL queries (`?code=...`). |
| **Ray.so** | `user_opened_website` | `free_core` | User Required | Code presentation cards with custom gradients and base64 prefilled code fragments. |
| **Shots** | `user_opened_website` | `freemium` | User Required | Mockup generator for phone and laptop mockups. Free core framing styles included. |
| **Smartmockups** | `user_opened_website` | `freemium` | User Required | Photorealistic mockups. Integrated into Canva Mockups; Canva Pro required for premium templates. |

### C. Discovery & Research Tools
| Tool | Execution Mode | Pricing Tier | Automation | Purpose & Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **AlternativeTo** | `user_opened_website` | `free_core` | Approved | Crowdsourced software alternative directory with open-source/free licensing filters. |
| **Internet Archive** | `approved_api` | `free_core` | Approved | Wayback Machine availability and historical metadata CDX search. Strictly respects crawl delays. |
| **Project Gutenberg** | `approved_api` | `free_core` | Approved | Public domain catalog with 70,000+ texts queried via Gutendex open catalog mirror. |
| **JustWatch** | `user_opened_website` | `freemium` | User Required | Streaming availability discovery. User search workflow; streaming content requires user subscription. |
| **WolframAlpha** | `user_opened_website` | `freemium` | User Required | Computational knowledge engine. Free web computation; developer API requires paid AppID. |
| **Open Culture** | `user_opened_website` | `free_core` | User Required | Curated directory of free cultural media, educational courses, and public domain materials. |

### D. Security & Account Safety
| Tool | Execution Mode | Pricing Tier | Automation | Purpose & Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **Have I Been Pwned** | `approved_api` | `free_core` | User Required | User-initiated password breach check via mathematical k-Anonymity (5-char SHA-1 prefix). Mandatory informed consent; zero persistent PII storage. |

### E. Global Intelligence
| Tool | Execution Mode | Pricing Tier | Automation | Purpose & Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **World Monitor** | `approved_api` | `freemium` | Approved | Official MCP connector for anonymous OSINT discovery (`get_sources`). High-frequency feeds require `WORLDMONITOR_API_KEY`. |

---

## 3. Explicitly Excluded Services (Section 5.F)

The following services are **strictly excluded** from automated execution and cataloged in the sovereign policy register:

1. **12ft.io**: Paywall circumvention violates access controls and publisher terms; service stability is degraded and poses DMCA anti-circumvention liabilities.
2. **LibGen**: Unauthorized distribution of copyrighted textbook and journal scans; subject to international legal injunctions and mirror DNS hijacking.
3. **Sci-Hub**: Bypasses publisher authentication systems without institutional licensing; excluded in favor of lawful preprint repositories (arXiv, bioRxiv, PubMed Central).
4. **PDF Drive**: Unverified third-party document hosting with elevated adware and malware payload risks.
