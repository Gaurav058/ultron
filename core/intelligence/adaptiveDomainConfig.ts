/**
 * ULTRON ADAPTIVE RESEARCH DOMAIN CONFIGURATION
 * Directive Section 6
 * Server-side domain configurations with adaptive frequencies, priorities, and queries.
 */

import fs from "fs";
import path from "path";
import { AdaptiveDomainConfig } from "@/types/intelligence";

const DATA_DIR = path.join(process.cwd(), "data");
const CONFIG_FILE = path.join(DATA_DIR, "adaptive_domains.json");

export const DEFAULT_DOMAINS: AdaptiveDomainConfig[] = [
  {
    id: "ai",
    name: "AI",
    frequencyMinutes: 60,
    priority: "HIGH",
    queries: [
      "Artificial intelligence latest breakthroughs research models 2026",
      "LLM agent benchmarks reasoning architectures frontier labs",
    ],
    sources: ["Google Research", "arXiv", "Nature Machine Intelligence", "Hugging Face"],
    lastRun: null,
    nextRun: new Date().toISOString(),
    enabled: true,
  },
  {
    id: "world",
    name: "WORLD",
    frequencyMinutes: 60,
    priority: "HIGH",
    queries: [
      "Global breaking news geopolitics international relations treaties",
      "World economic forum summit global climate policy diplomacy",
    ],
    sources: ["Reuters", "AP News", "UN News", "BBC World"],
    lastRun: null,
    nextRun: new Date().toISOString(),
    enabled: true,
  },
  {
    id: "technology",
    name: "TECHNOLOGY",
    frequencyMinutes: 60,
    priority: "HIGH",
    queries: [
      "Semiconductor advanced manufacturing quantum computing silicon",
      "Next generation operating systems edge computing devices hardware",
    ],
    sources: ["IEEE Spectrum", "Ars Technica", "The Verge", "TechCrunch"],
    lastRun: null,
    nextRun: new Date().toISOString(),
    enabled: true,
  },
  {
    id: "business",
    name: "BUSINESS",
    frequencyMinutes: 120,
    priority: "MEDIUM",
    queries: [
      "Global macroeconomics market liquidity central banks interest rates",
      "Enterprise technology venture capital IPO public market mergers",
    ],
    sources: ["Bloomberg", "Financial Times", "Wall Street Journal", "CNBC"],
    lastRun: null,
    nextRun: new Date().toISOString(),
    enabled: true,
  },
  {
    id: "science",
    name: "SCIENCE",
    frequencyMinutes: 120,
    priority: "MEDIUM",
    queries: [
      "Breakthrough scientific discoveries physics biology genetics energy",
      "Nuclear fusion clean energy breakthroughs materials science",
    ],
    sources: ["Nature", "Science Magazine", "Phys.org", "MIT Technology Review"],
    lastRun: null,
    nextRun: new Date().toISOString(),
    enabled: true,
  },
  {
    id: "cybersecurity",
    name: "CYBERSECURITY",
    frequencyMinutes: 60,
    priority: "HIGH",
    queries: [
      "Zero day vulnerabilities active cyber threats infrastructure security",
      "Nation state cyber intelligence post quantum cryptography",
    ],
    sources: ["CISA", "Krebs on Security", "BleepingComputer", "Dark Reading"],
    lastRun: null,
    nextRun: new Date().toISOString(),
    enabled: true,
  },
  {
    id: "space",
    name: "SPACE",
    frequencyMinutes: 180,
    priority: "STANDARD",
    queries: [
      "Space exploration Artemis lunar orbital telescopes deep space missions",
      "Satellite mega constellations propulsion systems planetary science",
    ],
    sources: ["NASA", "ESA", "SpaceNews", "Ars Space"],
    lastRun: null,
    nextRun: new Date().toISOString(),
    enabled: true,
  },
  {
    id: "automotive",
    name: "AUTOMOTIVE",
    frequencyMinutes: 180,
    priority: "STANDARD",
    queries: [
      "Autonomous vehicles level 4 level 5 self driving regulatory approvals",
      "EV solid state battery technology electrification charging grid",
    ],
    sources: ["Automotive News", "Electrek", "Society of Automotive Engineers"],
    lastRun: null,
    nextRun: new Date().toISOString(),
    enabled: true,
  },
  {
    id: "india",
    name: "INDIA",
    frequencyMinutes: 60,
    priority: "HIGH",
    queries: [
      "India technology economy startups AI semiconductor mission digital infrastructure",
      "India economic growth policy reforms technology exports UPI",
    ],
    sources: ["Economic Times", "Livemint", "PIB India", "Inc42"],
    lastRun: null,
    nextRun: new Date().toISOString(),
    enabled: true,
  },
  {
    id: "uae",
    name: "UAE",
    frequencyMinutes: 60,
    priority: "HIGH",
    queries: [
      "UAE artificial intelligence initiatives Dubai Future Foundation investment",
      "Abu Dhabi MGX G42 sovereign technology funds MENA tech ecosystem",
    ],
    sources: ["Gulf Business", "The National News", "WAM Emirates News Agency"],
    lastRun: null,
    nextRun: new Date().toISOString(),
    enabled: true,
  },
  {
    id: "startups",
    name: "STARTUPS",
    frequencyMinutes: 120,
    priority: "MEDIUM",
    queries: [
      "Top early stage tech startups seed Series A fundings tech accelerators",
      "Emerging AI foundation startup founders product launches",
    ],
    sources: ["TechCrunch Disrupt", "Y Combinator", "VentureBeat", "Sifted"],
    lastRun: null,
    nextRun: new Date().toISOString(),
    enabled: true,
  },
  {
    id: "software",
    name: "SOFTWARE",
    frequencyMinutes: 60,
    priority: "HIGH",
    queries: [
      "Open source software releases compiler developments programming languages",
      "DevOps cloud native Kubernetes distributed systems architecture",
    ],
    sources: ["GitHub Trending", "Hacker News", "InfoQ", "The New Stack"],
    lastRun: null,
    nextRun: new Date().toISOString(),
    enabled: true,
  },
];

export class AdaptiveDomainService {
  private static domains: AdaptiveDomainConfig[] = [];
  private static initialized = false;

  private static ensureDataDir(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (e) {
      console.warn("Could not create data dir:", e);
    }
  }

  public static initialize(): void {
    if (this.initialized) return;
    this.ensureDataDir();

    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
        const loaded = JSON.parse(raw);
        if (Array.isArray(loaded) && loaded.length > 0) {
          this.domains = loaded;
          this.initialized = true;
          return;
        }
      }
    } catch (err) {
      console.warn("Failed to load adaptive domains config, using defaults:", err);
    }

    this.domains = [...DEFAULT_DOMAINS];
    this.save();
    this.initialized = true;
  }

  public static getDomains(): AdaptiveDomainConfig[] {
    this.initialize();
    return this.domains;
  }

  public static getDomain(id: string): AdaptiveDomainConfig | undefined {
    this.initialize();
    return this.domains.find((d) => d.id.toLowerCase() === id.toLowerCase());
  }

  public static getDomainsDueForScan(): AdaptiveDomainConfig[] {
    this.initialize();
    const now = Date.now();
    return this.domains.filter((domain) => {
      if (!domain.enabled) return false;
      const nextRunTime = new Date(domain.nextRun).getTime();
      return isNaN(nextRunTime) || now >= nextRunTime;
    });
  }

  public static markDomainScanned(domainId: string): void {
    this.initialize();
    const domain = this.domains.find((d) => d.id === domainId);
    if (domain) {
      const now = new Date();
      domain.lastRun = now.toISOString();
      domain.nextRun = new Date(now.getTime() + domain.frequencyMinutes * 60 * 1000).toISOString();
      this.save();
    }
  }

  public static updateDomain(
    domainId: string,
    updates: Partial<AdaptiveDomainConfig>
  ): AdaptiveDomainConfig | null {
    this.initialize();
    const idx = this.domains.findIndex((d) => d.id === domainId);
    if (idx === -1) return null;

    this.domains[idx] = { ...this.domains[idx], ...updates };
    this.save();
    return this.domains[idx];
  }

  private static save(): void {
    try {
      this.ensureDataDir();
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.domains, null, 2), "utf-8");
    } catch (e) {
      console.warn("Could not save adaptive domains:", e);
    }
  }
}
