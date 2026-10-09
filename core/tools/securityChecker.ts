/**
 * ULTRON Sovereign Security Checker: Have I Been Pwned Connector
 * Uses cryptographic k-Anonymity (5-character SHA-1 range API) to check password breaches
 * without ever transmitting the full password or full hash.
 * Requires explicit user confirmation before any network query.
 * Zero persistent PII storage in ULTRON memory or storage.
 */

export interface BreachCheckConsent {
  userConfirmed: boolean;
  timestamp: string;
}

export interface PasswordBreachResult {
  pwned: boolean;
  breachCount: number;
  hashPrefix: string;
  checkedAt: string;
  privacyMode: "k-Anonymity SHA-1 Range Query (Zero PII Transmitted)";
  attribution: "Have I Been Pwned (Troy Hunt)";
}

export class SecurityChecker {
  /**
   * Performs an authentic k-Anonymity breach check against the official Pwned Passwords API.
   * Only the first 5 characters of the SHA-1 hash are sent to the external provider.
   */
  public static async checkPasswordKAnonymity(
    passwordInput: string,
    consent: BreachCheckConsent
  ): Promise<PasswordBreachResult> {
    if (!consent.userConfirmed) {
      throw new Error(
        "User consent required: You must explicitly authorize external breach verification before dispatching queries."
      );
    }

    if (!passwordInput || passwordInput.trim().length === 0) {
      throw new Error("Password input cannot be empty.");
    }

    // 1. Compute SHA-1 hash (universal web crypto or fallback)
    const sha1Hash = await this.computeSha1(passwordInput);
    const prefix = sha1Hash.substring(0, 5).toUpperCase();
    const suffix = sha1Hash.substring(5).toUpperCase();

    // 2. Query official public k-Anonymity endpoint
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        "User-Agent": "ULTRON-Intelligence-OS-SecurityChecker/1.0",
        "Add-Padding": "true", // Mathematical padding prevents response length side-channel attacks
      },
    });

    if (!response.ok) {
      throw new Error(`HIBP API responded with HTTP status ${response.status}`);
    }

    const text = await response.text();
    const lines = text.split("\r\n");

    let count = 0;
    for (const line of lines) {
      const [hashSuffix, occurences] = line.split(":");
      if (hashSuffix && hashSuffix.trim() === suffix) {
        count = parseInt(occurences.trim(), 10) || 0;
        break;
      }
    }

    return {
      pwned: count > 0,
      breachCount: count,
      hashPrefix: prefix,
      checkedAt: new Date().toISOString(),
      privacyMode: "k-Anonymity SHA-1 Range Query (Zero PII Transmitted)",
      attribution: "Have I Been Pwned (Troy Hunt)",
    };
  }

  private static async computeSha1(message: string): Promise<string> {
    if (typeof crypto !== "undefined" && crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    // Fallback simple SHA-1 implementation if crypto.subtle unavailable
    return this.fallbackSha1(message);
  }

  private static fallbackSha1(msg: string): string {
    function rotateLeft(n: number, s: number) {
      return (n << s) | (n >>> (32 - s));
    }
    function cvtHex(val: number) {
      let str = "";
      for (let i = 7; i >= 0; i--) {
        const v = (val >>> (i * 4)) & 0x0f;
        str += v.toString(16);
      }
      return str;
    }

    const blocktrail = [0x80000000, 0x00800000, 0x00008000, 0x00000080];
    const words: number[] = [];
    let len = msg.length;
    for (let i = 0; i < len; i++) {
      words[i >> 2] |= (msg.charCodeAt(i) & 0xff) << ((3 - (i & 3)) * 8);
    }
    words[len >> 2] |= blocktrail[len & 3];
    words[(((len + 8) >> 6) << 4) + 15] = len * 8;

    let H0 = 0x67452301;
    let H1 = 0xefcdab89;
    let H2 = 0x98badcfe;
    let H3 = 0x10325476;
    let H4 = 0xc3d2e1f0;

    const W: number[] = new Array(80);
    for (let i = 0; i < words.length; i += 16) {
      for (let t = 0; t < 16; t++) W[t] = words[i + t] || 0;
      for (let t = 16; t < 80; t++) {
        W[t] = rotateLeft(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
      }

      let A = H0, B = H1, C = H2, D = H3, E = H4;
      for (let t = 0; t < 80; t++) {
        let f = 0, K = 0;
        if (t < 20) {
          f = (B & C) | (~B & D);
          K = 0x5a827999;
        } else if (t < 40) {
          f = B ^ C ^ D;
          K = 0x6ed9eba1;
        } else if (t < 60) {
          f = (B & C) | (B & D) | (C & D);
          K = 0x8f1bbcdc;
        } else {
          f = B ^ C ^ D;
          K = 0xca62c1d6;
        }
        const temp = (rotateLeft(A, 5) + f + E + K + (W[t] || 0)) & 0xffffffff;
        E = D;
        D = C;
        C = rotateLeft(B, 30);
        B = A;
        A = temp;
      }
      H0 = (H0 + A) & 0xffffffff;
      H1 = (H1 + B) & 0xffffffff;
      H2 = (H2 + C) & 0xffffffff;
      H3 = (H3 + D) & 0xffffffff;
      H4 = (H4 + E) & 0xffffffff;
    }

    return (cvtHex(H0) + cvtHex(H1) + cvtHex(H2) + cvtHex(H3) + cvtHex(H4)).toLowerCase();
  }
}
