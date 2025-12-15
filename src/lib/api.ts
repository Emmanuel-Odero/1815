// API configuration and utility functions for connecting to the 1815-api backend

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

// API response types
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

// Alias types
interface CreateAliasRequest {
  cardanoAddress: string;
  userEmail?: string;
  customName?: string;
  expiryDays?: number;
}

interface AliasPreviewRequest {
  cardanoAddress: string;
  userEmail?: string;
  customName?: string;
  expiryDays?: number;
}

interface ConfirmAliasRequest {
  shortCode: string;
  cardanoAddress: string;
  userEmail?: string;
  customName?: string;
  expiryDays?: number;
}

interface AliasResponse {
  shortCode: string;
  cardanoAddress: string;
  customName?: string;
  expiresAt: string;
  qrCodeUrl: string;
  createdAt: string;
}

interface AliasPreviewResponse {
  shortCode: string;
  cardanoAddress: string;
  customName?: string;
  expiresAt: string;
  qrCodeUrl: string;
  previewOnly: true;
}

// Explorer types
interface SearchRequest {
  query: string;
  type?: "auto" | "address" | "transaction" | "block" | "alias";
}

interface AddressDetails {
  address: string;
  balance: string;
  totalTransactions: number;
  firstSeen: string;
  lastActivity: string;
  transactions: Array<{
    hash: string;
    type: "received" | "sent";
    amount: string;
    time: string;
  }>;
}

interface TransactionDetails {
  hash: string;
  status: string;
  block: number;
  timestamp: string;
  fee: string;
  inputs: Array<{
    address: string;
    amount: string;
  }>;
  outputs: Array<{
    address: string;
    amount: string;
  }>;
}

interface AliasDetails {
  alias: string;
  resolvedAddress: string;
  balance: string;
  totalTransactions: number;
  createdDate: string;
  expiryDate: string;
}

interface SearchResult {
  type: "address" | "transaction" | "block" | "alias";
  data: AddressDetails | TransactionDetails | AliasDetails;
  cached: boolean;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || `HTTP error! status: ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Alias API functions
export const aliasAPI = {
  /**
   * Generate a preview of an alias without saving to database
   */
  async previewAlias(
    request: AliasPreviewRequest
  ): Promise<AliasPreviewResponse> {
    const response = await apiRequest<AliasPreviewResponse>(
      "/aliases/preview",
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );

    if (!response.success || !response.data) {
      throw new Error(
        response.error?.message || "Failed to generate alias preview"
      );
    }

    return response.data;
  },

  /**
   * Confirm and save an alias to the database
   */
  async confirmAlias(request: ConfirmAliasRequest): Promise<AliasResponse> {
    const response = await apiRequest<AliasResponse>("/aliases/confirm", {
      method: "POST",
      body: JSON.stringify(request),
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to confirm alias");
    }

    return response.data;
  },

  /**
   * Create a new alias for a Cardano address (legacy - direct creation)
   */
  async createAlias(request: CreateAliasRequest): Promise<AliasResponse> {
    const response = await apiRequest<AliasResponse>("/aliases", {
      method: "POST",
      body: JSON.stringify(request),
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to create alias");
    }

    return response.data;
  },

  /**
   * Resolve an alias to get the full Cardano address
   */
  async resolveAlias(shortCode: string): Promise<AliasResponse> {
    const response = await apiRequest<AliasResponse>(`/resolve/${shortCode}`);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to resolve alias");
    }

    return response.data;
  },

  /**
   * Get alias details by short code
   */
  async getAliasDetails(shortCode: string): Promise<AliasResponse> {
    const response = await apiRequest<AliasResponse>(`/aliases/${shortCode}`);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to get alias details");
    }

    return response.data;
  },

  /**
   * Get existing alias by Cardano address
   */
  async getExistingAliasByAddress(address: string): Promise<AliasResponse> {
    const response = await apiRequest<AliasResponse>(
      `/aliases/by-address/${encodeURIComponent(address)}`
    );

    if (!response.success || !response.data) {
      throw new Error(
        response.error?.message || "No active alias found for this address"
      );
    }

    return response.data;
  },
};

// Explorer API functions
export const explorerAPI = {
  /**
   * Search for addresses, transactions, blocks, or aliases
   */
  async search(request: SearchRequest): Promise<SearchResult> {
    const queryParams = new URLSearchParams({
      query: request.query,
      ...(request.type && { type: request.type }),
    });

    const response = await apiRequest<SearchResult>(
      `/explorer/search?${queryParams}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Search failed");
    }

    return response.data;
  },

  /**
   * Get address details and transaction history
   */
  async getAddressDetails(address: string): Promise<AddressDetails> {
    const response = await apiRequest<AddressDetails>(
      `/explorer/address/${address}`
    );

    if (!response.success || !response.data) {
      throw new Error(
        response.error?.message || "Failed to get address details"
      );
    }

    return response.data;
  },

  /**
   * Get transaction details
   */
  async getTransactionDetails(hash: string): Promise<TransactionDetails> {
    const response = await apiRequest<TransactionDetails>(
      `/explorer/transaction/${hash}`
    );

    if (!response.success || !response.data) {
      throw new Error(
        response.error?.message || "Failed to get transaction details"
      );
    }

    return response.data;
  },

  /**
   * Bulk resolve multiple aliases
   */
  async bulkResolve(codes: string[]): Promise<AliasResponse[]> {
    const response = await apiRequest<AliasResponse[]>("/resolve/bulk", {
      method: "POST",
      body: JSON.stringify({ codes }),
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Bulk resolve failed");
    }

    return response.data;
  },
};

// Notification API functions
export const notificationAPI = {
  /**
   * Subscribe to notifications for alias expiry
   */
  async subscribe(email: string, preferences?: any): Promise<void> {
    const response = await apiRequest("/notifications/subscribe", {
      method: "POST",
      body: JSON.stringify({ email, preferences }),
    });

    if (!response.success) {
      throw new Error(
        response.error?.message || "Failed to subscribe to notifications"
      );
    }
  },

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: any): Promise<void> {
    const response = await apiRequest("/notifications/preferences", {
      method: "PUT",
      body: JSON.stringify({ preferences }),
    });

    if (!response.success) {
      throw new Error(
        response.error?.message || "Failed to update preferences"
      );
    }
  },

  /**
   * Unsubscribe from notifications
   */
  async unsubscribe(token: string): Promise<void> {
    const response = await apiRequest(`/notifications/unsubscribe/${token}`, {
      method: "POST",
    });

    if (!response.success) {
      throw new Error(response.error?.message || "Failed to unsubscribe");
    }
  },
};

// Health check function
export const healthAPI = {
  /**
   * Check API health status
   */
  async checkHealth(): Promise<any> {
    const response = await apiRequest("/health");

    if (!response.success) {
      throw new Error(response.error?.message || "Health check failed");
    }

    return response.data;
  },
};

// Error handling utilities
export class APIError extends Error {
  constructor(message: string, public code?: string, public details?: any) {
    super(message);
    this.name = "APIError";
  }
}

// Validation utilities
export const validation = {
  /**
   * Validate Cardano address format (client-side validation)
   * This performs fast regex validation without API calls
   */
  isValidCardanoAddress(address: string): boolean {
    if (!address || typeof address !== "string") {
      return false;
    }

    const cleanAddress = address.trim();

    // Cardano addresses can be:
    // - Shelley mainnet addresses: start with 'addr1' + bech32 chars (59 chars total)
    // - Shelley testnet addresses: start with 'addr_test1' + bech32 chars (63 chars total)
    // - Byron addresses: start with 'Ae2' or 'DdzFF' + base58 chars (variable length)
    // - Stake addresses: start with 'stake1' or 'stake_test1' + bech32 chars

    // Bech32 character set (used in Shelley addresses)
    const bech32Chars = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
    const bech32Regex = `[${bech32Chars}]`;

    // Base58 character set (used in Byron addresses)
    const base58Chars =
      "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    const base58Regex = `[${base58Chars}]`;

    // Shelley mainnet address: addr1 + 54 bech32 chars = 59 total
    const shelleyMainnetRegex = new RegExp(`^addr1${bech32Regex}{54}$`);

    // Shelley testnet address: addr_test1 + 54 bech32 chars = 63 total
    const shelleyTestnetRegex = new RegExp(`^addr_test1${bech32Regex}{54}$`);

    // Byron addresses: Ae2 or DdzFF + base58 chars (50-104 chars total)
    const byronRegex = new RegExp(`^(Ae2|DdzFF)${base58Regex}{47,101}$`);

    // Stake mainnet address: stake1 + 50 bech32 chars = 56 total
    const stakeMainnetRegex = new RegExp(`^stake1${bech32Regex}{50}$`);

    // Stake testnet address: stake_test1 + 50 bech32 chars = 61 total
    const stakeTestnetRegex = new RegExp(`^stake_test1${bech32Regex}{50}$`);

    return (
      shelleyMainnetRegex.test(cleanAddress) ||
      shelleyTestnetRegex.test(cleanAddress) ||
      byronRegex.test(cleanAddress) ||
      stakeMainnetRegex.test(cleanAddress) ||
      stakeTestnetRegex.test(cleanAddress)
    );
  },

  /**
   * Quick format check for Cardano addresses (even faster validation)
   */
  isLikelyCardanoAddress(address: string): boolean {
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
  },

  /**
   * Validate short code format
   */
  isValidShortCode(code: string): boolean {
    // 16-digit numeric code
    return /^\d{16}$/.test(code);
  },

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate transaction hash format
   */
  isValidTransactionHash(hash: string): boolean {
    // 64-character hexadecimal string
    return /^[a-fA-F0-9]{64}$/.test(hash);
  },
};

// Export types for use in components
export type {
  APIResponse,
  CreateAliasRequest,
  AliasPreviewRequest,
  ConfirmAliasRequest,
  AliasResponse,
  AliasPreviewResponse,
  SearchRequest,
  SearchResult,
  AddressDetails,
  TransactionDetails,
  AliasDetails,
};
