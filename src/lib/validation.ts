// Fast Cardano address validation utilities

/**
 * Validate Cardano address format (client-side validation)
 * This performs fast regex validation without API calls
 */
export function isValidCardanoAddress(address: string): boolean {
  if (!address || typeof address !== "string") {
    return false;
  }

  const cleanAddress = address.trim();

  // Simple but effective validation patterns
  // Shelley mainnet addresses: addr1 + 98 bech32 chars (103 total)
  if (/^addr1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{98}$/.test(cleanAddress)) {
    return true;
  }

  // Shelley testnet addresses: addr_test1 + 98 bech32 chars (108 total)
  if (/^addr_test1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{98}$/.test(cleanAddress)) {
    return true;
  }

  // Byron addresses: Ae2 or DdzFF + base58 chars
  if (
    /^(Ae2|DdzFF)[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{47,101}$/.test(
      cleanAddress
    )
  ) {
    return true;
  }

  // Stake addresses (mainnet): stake1 + 53 bech32 chars (59 total)
  if (/^stake1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{53}$/.test(cleanAddress)) {
    return true;
  }

  // Stake addresses (testnet): stake_test1 + 53 bech32 chars (64 total)
  if (
    /^stake_test1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{53}$/.test(cleanAddress)
  ) {
    return true;
  }

  return false;
}

/**
 * Quick format check for Cardano addresses (even faster validation)
 */
export function isLikelyCardanoAddress(address: string): boolean {
  if (!address || typeof address !== "string") {
    return false;
  }

  const cleanAddress = address.trim();

  // Quick checks for common patterns
  return (
    cleanAddress.startsWith("addr1") ||
    cleanAddress.startsWith("addr_test1") ||
    cleanAddress.startsWith("stake1") ||
    cleanAddress.startsWith("stake_test1") ||
    cleanAddress.startsWith("Ae2") ||
    cleanAddress.startsWith("DdzFF")
  );
}

/**
 * Validate short code format
 */
export function isValidShortCode(code: string): boolean {
  // 16-digit numeric code
  return /^\d{16}$/.test(code);
}

/**
 * Validate transaction hash format
 */
export function isValidTransactionHash(hash: string): boolean {
  // 64-character hexadecimal string
  return /^[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Export all validation functions as a single object for backward compatibility
export const validation = {
  isValidCardanoAddress,
  isLikelyCardanoAddress,
  isValidShortCode,
  isValidTransactionHash,
  isValidEmail,
};
