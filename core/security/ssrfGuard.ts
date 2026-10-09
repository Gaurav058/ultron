/**
 * ULTRON Sovereign Security Layer: SSRF Guard & Secret Redaction
 * Protects against server-side request forgery (SSRF), internal network traversal,
 * cloud metadata harvesting, and inadvertent secret leakage into logs.
 */

export interface SSRFValidationResult {
  allowed: boolean;
  reason?: string;
  sanitizedUrl?: string;
}

export class SSRFGuard {
  // Blocked hostnames and prefixes
  private static readonly BLOCKED_HOSTS = new Set([
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "::1",
    "metadata.google.internal",
    "instance-data",
    "169.254.169.254", // AWS, GCP, Azure, OpenStack metadata
  ]);

  /**
   * Validates whether an outbound target URL is safe to fetch server-side.
   */
  public static validateUrl(inputUrl: string): SSRFValidationResult {
    try {
      const parsed = new URL(inputUrl);

      // 1. Protocol check: strictly HTTP or HTTPS
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return {
          allowed: false,
          reason: `Disallowed protocol "${parsed.protocol}". Only http: and https: are permitted.`,
        };
      }

      const hostname = parsed.hostname.toLowerCase();

      // 2. Exact blocked hosts check
      if (this.BLOCKED_HOSTS.has(hostname)) {
        return {
          allowed: false,
          reason: `Access to internal or cloud metadata endpoint "${hostname}" is forbidden by ULTRON security policy.`,
        };
      }

      // 3. IPv4 Private Subnet filtering (RFC 1918 & link-local)
      if (this.isPrivateOrLocalIpv4(hostname)) {
        return {
          allowed: false,
          reason: `Access to private or local IPv4 subnet "${hostname}" is forbidden.`,
        };
      }

      // 4. IPv6 link-local & private filtering
      if (hostname.startsWith("[") || hostname.includes(":")) {
        if (
          hostname === "::1" ||
          hostname.startsWith("fe80:") ||
          hostname.startsWith("fc00:") ||
          hostname.startsWith("fd00:")
        ) {
          return {
            allowed: false,
            reason: `Access to private IPv6 range "${hostname}" is forbidden.`,
          };
        }
      }

      return {
        allowed: true,
        sanitizedUrl: parsed.toString(),
      };
    } catch {
      return {
        allowed: false,
        reason: `Invalid or malformed URL: "${inputUrl}".`,
      };
    }
  }

  /**
   * Checks for RFC 1918 private subnets:
   * 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, 169.254.0.0/16, 100.64.0.0/10
   */
  private static isPrivateOrLocalIpv4(host: string): boolean {
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = host.match(ipv4Regex);
    if (!match) return false;

    const octets = [
      parseInt(match[1], 10),
      parseInt(match[2], 10),
      parseInt(match[3], 10),
      parseInt(match[4], 10),
    ];

    if (octets.some((o) => o < 0 || o > 255)) return true;

    const [o1, o2] = octets;

    // Loopback (127.0.0.0/8) or 0.0.0.0/8
    if (o1 === 127 || o1 === 0) return true;

    // 10.0.0.0/8
    if (o1 === 10) return true;

    // 172.16.0.0/12 (172.16.x.x - 172.31.x.x)
    if (o1 === 172 && o2 >= 16 && o2 <= 31) return true;

    // 192.168.0.0/16
    if (o1 === 192 && o2 === 168) return true;

    // Link-local (169.254.0.0/16)
    if (o1 === 169 && o2 === 254) return true;

    // Carrier Grade NAT (100.64.0.0/10)
    if (o1 === 100 && o2 >= 64 && o2 <= 127) return true;

    return false;
  }

  /**
   * Redacts sensitive API tokens, passwords, and authorization headers from strings or objects.
   */
  public static redactSecrets(input: string): string {
    return input
      .replace(/(AIza[0-9A-Za-z-_]{35})/g, "[REDACTED_GOOGLE_API_KEY]")
      .replace(/(sk-[a-zA-Z0-9_-]{20,})/g, "[REDACTED_API_KEY]")
      .replace(/(Bearer\s+)([A-Za-z0-9_\-\.]+)/gi, "$1[REDACTED_BEARER_TOKEN]")
      .replace(/([?&](?:key|token|api_key|secret|password)=)([^&\s]+)/gi, "$1[REDACTED]");
  }
}
