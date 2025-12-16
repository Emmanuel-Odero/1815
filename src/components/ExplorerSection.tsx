import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Search,
  Wallet,
  Hash,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  ExternalLink,
  Activity,
  Coins,
  Eye,
  TrendingUp,
} from "lucide-react";

interface SearchResult {
  type: "wallet" | "transaction" | "alias";
  data: any;
}

export function ExplorerSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string>("");
  const [searchType, setSearchType] = useState<
    "auto" | "wallet" | "transaction" | "alias"
  >("auto");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError("");
    setSearchResult(null);

    try {
      console.log("🔍 Starting search process...");
      console.log("🔍 Search query:", searchQuery.trim());

      // Import API functions and validation dynamically to avoid build issues
      const { explorerAPI, aliasAPI } = await import("@/lib/api");
      const { validation } = await import("@/lib/validation");
      console.log("✅ API and validation modules imported successfully");

      const query = searchQuery.trim();

      // Fast client-side validation first (no API calls)
      let queryType = searchType;
      if (queryType === "auto") {
        console.log("🔍 Performing client-side validation...");

        if (validation.isValidShortCode(query)) {
          queryType = "alias";
          console.log("✅ Detected as alias (16-digit code)");
        } else if (validation.isValidTransactionHash(query)) {
          queryType = "transaction";
          console.log("✅ Detected as transaction hash");
        } else if (validation.isValidCardanoAddress(query)) {
          queryType = "address";
          console.log("✅ Detected as valid Cardano address");
        } else if (validation.isLikelyCardanoAddress(query)) {
          // Might be a Cardano address but failed strict validation
          console.log(
            "⚠️ Looks like Cardano address but failed validation - trying API anyway"
          );
          queryType = "address";
        } else {
          // Invalid format - don't make API call
          console.log("❌ Invalid format detected");
          throw new Error(
            `Invalid format: "${query}" doesn't match any supported format (Cardano address, transaction hash, or 16-digit alias)`
          );
        }
      }

      console.log("🔍 Searching with backend API:", {
        query: query,
        type: queryType,
      });

      // Handle alias search using the explorer API (which includes real blockchain data)
      if (queryType === "alias") {
        console.log("🔍 Searching alias via explorer API:", query);

        try {
          // Use the explorer API which now returns consistent data for aliases
          const result = await explorerAPI.search({
            query: query,
            type: queryType,
          });

          console.log("✅ Alias search completed successfully:", result);

          // Handle the response format from the explorer API
          if (result.type === "alias" && result.data) {
            setSearchResult({
              type: "alias",
              data: {
                alias: result.data.alias || query,
                resolvedAddress:
                  result.data.resolvedAddress || result.data.address || "",
                customName: result.data.customName || "",
                expiresAt: result.data.expiresAt || "",
                useCount: result.data.useCount || 0,
                // Use real blockchain data from the API
                balance: result.data.balance || "0 ₳",
                totalTransactions: result.data.totalTransactions || 0,
                createdDate: result.data.createdDate || "Unknown",
                expiryDate: result.data.expiryDate || "Unknown",
                // Include raw data for debugging
                raw: result.data.raw,
                responseTime: result.responseTime,
                cached: result.cached,
              },
            });
            return;
          } else {
            throw new Error("Invalid alias search response format");
          }
        } catch (aliasError) {
          console.error("❌ Alias search failed:", aliasError);
          throw aliasError;
        }
      }

      // For other types, use the explorer API
      const result = await explorerAPI.search({
        query: query,
        type: queryType,
      });

      console.log("✅ Search completed successfully:", result);

      // Handle the response format from the updated API
      let formattedData = result.data;
      if (result.type === "address" && result.data.data) {
        // The API now returns nested data structure
        formattedData = {
          address: result.data.data.address,
          balance: result.data.data.balance || "0 ₳",
          totalTransactions: result.data.data.totalTransactions || 0,
          firstSeen: result.data.data.firstSeen || "Unknown",
          lastActivity: result.data.data.lastActivity || "Unknown",
          transactions: result.data.data.transactions || [],
          // Include raw blockchain data for debugging
          raw: result.data.data,
        };
      }

      setSearchResult({
        type: result.type === "address" ? "wallet" : result.type,
        data: formattedData,
      });
    } catch (error) {
      console.error("❌ Search failed:", error);

      // Show error message to user
      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          setSearchError(
            `No results found for "${searchQuery}". Please check your input and try again.`
          );
        } else if (error.message.includes("expired")) {
          setSearchError(
            `Alias "${searchQuery}" has expired and is no longer valid.`
          );
        } else if (error.message.includes("inactive")) {
          setSearchError(`Alias "${searchQuery}" is inactive.`);
        } else if (error.message.includes("fetch")) {
          setSearchError(
            "Unable to connect to server. Please check your connection and try again."
          );
        } else if (error.message.includes("temporarily unavailable")) {
          setSearchError(
            "Blockchain service is temporarily unavailable. This might be due to a network mismatch (mainnet address on testnet API) or service issues. Please try again later."
          );
        } else {
          setSearchError(`Search failed: ${error.message}`);
        }
      } else {
        setSearchError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSearching(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderWalletResult = (data: any) => {
    // Ensure data exists and has required properties
    if (!data) {
      return (
        <Card className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="text-red-700">Error: No wallet data available</div>
        </Card>
      );
    }

    // Handle case where address is provided but other data might be missing
    const address = data.address || searchQuery;
    const balance = data.balance || "Loading...";
    const totalTransactions = data.totalTransactions || "0";
    const firstSeen = data.firstSeen || "Unknown";
    const lastActivity = data.lastActivity || "Unknown";
    const transactions = data.transactions || [];

    return (
      <Card className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Wallet Details</h3>
          </div>
          <Button
            onClick={() => copyToClipboard(address)}
            size="sm"
            variant="outline"
            className="flex items-center space-x-1"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Coins className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">
                Balance
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{balance}</div>
          </div>

          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-900">
                Transactions
              </span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {totalTransactions}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">First Seen:</span>
            <span className="font-medium">{firstSeen}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Last Activity:</span>
            <span className="font-medium">{lastActivity}</span>
          </div>
        </div>

        {/* Show success message for real blockchain data */}
        {data.raw && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">
                ✅ Real blockchain data loaded from Cardano network
              </span>
            </div>
            <div className="text-xs text-green-600 mt-1">
              Data source: Blockfrost API • Network:{" "}
              {data.raw.type || "Cardano"} • Response time:{" "}
              {data.responseTime || "N/A"}ms
            </div>
          </div>
        )}

        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            Recent Transactions
          </h4>
          <div className="space-y-2">
            {transactions.length > 0 ? (
              transactions.map((tx: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {tx.type === "received" ? (
                      <ArrowDownLeft className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-red-600" />
                    )}
                    <div>
                      <div className="font-mono text-sm text-gray-600">
                        {tx.hash}
                      </div>
                      <div className="text-xs text-gray-500">{tx.time}</div>
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${
                      tx.type === "received" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.amount}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No recent transactions available</p>
                <p className="text-sm mt-1">
                  Transaction history would be loaded from the blockchain
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const renderTransactionResult = (data: any) => (
    <Card className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Hash className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-gray-900">Transaction Details</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            {data.status}
          </span>
          <Button
            onClick={() => copyToClipboard(data.hash)}
            size="sm"
            variant="outline"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Hash className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-900">Block</span>
          </div>
          <div className="text-xl font-bold text-purple-600">{data.block}</div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Fee</span>
          </div>
          <div className="text-xl font-bold text-blue-600">{data.fee}</div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-900">Time</span>
          </div>
          <div className="text-sm font-medium text-gray-600">
            {data.timestamp}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <ArrowUpRight className="w-4 h-4 text-red-600" />
            <span>Inputs</span>
          </h4>
          <div className="space-y-2">
            {data.inputs.map((input: any, index: number) => (
              <div key={index} className="p-3 bg-red-50 rounded-lg">
                <div className="font-mono text-sm text-gray-600 mb-1">
                  {input.address.substring(0, 20)}...
                </div>
                <div className="font-semibold text-red-600">{input.amount}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <ArrowDownLeft className="w-4 h-4 text-green-600" />
            <span>Outputs</span>
          </h4>
          <div className="space-y-2">
            {data.outputs.map((output: any, index: number) => (
              <div key={index} className="p-3 bg-green-50 rounded-lg">
                <div className="font-mono text-sm text-gray-600 mb-1">
                  {output.address.substring(0, 20)}...
                </div>
                <div className="font-semibold text-green-600">
                  {output.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );

  const renderAliasResult = (data: any) => {
    // Ensure data exists and has required properties
    if (!data) {
      return (
        <Card className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="text-red-700">Error: No alias data available</div>
        </Card>
      );
    }

    return (
      <Card className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-gray-900">Alias Details</h3>
          </div>
          <Button
            onClick={() => copyToClipboard(data.resolvedAddress)}
            size="sm"
            variant="outline"
            className="flex items-center space-x-1"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Address</span>
          </Button>
        </div>

        <div className="bg-amber-50 rounded-xl p-4 mb-6">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-amber-900 mb-1">
                Alias Code
              </div>
              <div className="text-2xl font-bold text-amber-600 font-mono">
                {data.alias}
              </div>
              {data.customName && (
                <div className="text-sm text-amber-700 mt-1">
                  "{data.customName}"
                </div>
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-amber-900 mb-2">
                Resolves To Full Address
              </div>
              <div className="bg-white rounded-lg p-3 border border-amber-200">
                <div className="font-mono text-sm text-gray-800 break-all">
                  {data.resolvedAddress}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    Full Cardano Address
                  </span>
                  <Button
                    onClick={() => copyToClipboard(data.resolvedAddress)}
                    size="sm"
                    variant="outline"
                    className="text-xs px-2 py-1 h-auto"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy Full Address
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Coins className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">
                Balance
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {data.balance || "Loading..."}
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-900">
                Transactions
              </span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {data.totalTransactions || "0"}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Created:</span>
            <span className="font-medium">{data.createdDate || "Unknown"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Expires:</span>
            <span className="font-medium text-red-600">
              {data.expiryDate || "Unknown"}
            </span>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <section
      id="explorer-section"
      className="relative w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 py-16"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-semibold mb-4 shadow-lg">
            <Eye className="w-4 h-4 mr-2" />
            Blockchain Explorer
          </div>

          <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Explore the Cardano Blockchain
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search for transactions, wallet addresses, or aliases to get
            detailed blockchain information.
            <span className="text-purple-600 font-semibold">
              {" "}
              Powered by CardanoResolve
            </span>
          </p>
          <div className="mt-3 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 max-w-2xl mx-auto">
            <strong>Network:</strong> Currently connected to Cardano
            Preprod/Testnet. Use testnet addresses (addr_test1...) for best
            results.
          </div>
        </div>

        {/* Search Section */}
        <Card className="bg-white/80 backdrop-blur-lg shadow-2xl border border-white/20 rounded-3xl p-8 mb-8">
          <div className="space-y-6">
            {/* Search Type Selector */}
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { key: "auto", label: "Auto Detect", icon: Search },
                { key: "wallet", label: "Wallet Address", icon: Wallet },
                { key: "transaction", label: "Transaction ID", icon: Hash },
                { key: "alias", label: "Alias", icon: TrendingUp },
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  onClick={() => setSearchType(key as any)}
                  variant={searchType === key ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center space-x-2 ${
                    searchType === key
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "hover:bg-purple-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Button>
              ))}
            </div>

            {/* Search Input */}
            <div className="flex flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-3">
              <div className="flex-1 relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-purple-400" />
                </div>
                <Input
                  id="explorer-search-input"
                  type="text"
                  placeholder="Enter transaction ID, wallet address, or alias..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 w-full border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-base font-medium bg-white/90 backdrop-blur-sm transition-all duration-300"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isSearching}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-base flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full lg:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSearching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                  </>
                )}
              </Button>
            </div>

            {/* Quick Examples */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-gray-600 font-medium">Try:</span>
              <button
                onClick={() => setSearchQuery("6273358125001101")}
                className="bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 font-mono text-xs font-semibold transition-colors"
              >
                6273358125001101 (alias)
              </button>
              <button
                onClick={() =>
                  setSearchQuery(
                    "addr_test1qpw0djgj0x59ngrjvqthn7enhvruxnsavsw5th63la3mjel3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqqjz6aa7"
                  )
                }
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 font-mono text-xs font-semibold transition-colors"
              >
                Testnet Address (Working)
              </button>
              <button
                onClick={() =>
                  setSearchQuery(
                    "addr1q9kfhmm42unymnq7hfzp96fg7jf3uth7pddms9857fnxadmmq5rhllaj069nwmswdu8rj82nrc2my9mnmggk4a2wnh8qc0jhlr"
                  )
                }
                className="bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200 font-mono text-xs font-semibold transition-colors"
              >
                Mainnet Address (Wrong Network)
              </button>
              <button
                onClick={async () => {
                  try {
                    console.log("🧪 Testing blockchain API call...");
                    const response = await fetch(
                      "/api/v1/explorer/search?query=addr_test1qpw0djgj0x59ngrjvqthn7enhvruxnsavsw5th63la3mjel3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqqjz6aa7"
                    );
                    const data = await response.json();
                    console.log("✅ Blockchain API test result:", data);
                    if (data.success && data.data.data.balance) {
                      alert(
                        `✅ Blockchain API working! Balance: ${data.data.data.balance}`
                      );
                    } else {
                      alert(
                        "❌ Blockchain API test failed! Check console for details."
                      );
                    }
                  } catch (error) {
                    console.error("❌ Blockchain API test failed:", error);
                    alert(
                      "❌ Blockchain API test failed! Check console for details."
                    );
                  }
                }}
                className="bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 font-mono text-xs font-semibold transition-colors"
              >
                Test Blockchain API
              </button>
            </div>
          </div>
        </Card>

        {/* Error Display */}
        {searchError && (
          <Card className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Search className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900 mb-1">
                  Search Failed
                </h3>
                <p className="text-red-700">{searchError}</p>
                <Button
                  onClick={() => setSearchError("")}
                  variant="outline"
                  size="sm"
                  className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Search Results */}
        {searchResult && (
          <div className="space-y-6">
            {searchResult.type === "wallet" &&
              renderWalletResult(searchResult.data)}
            {searchResult.type === "transaction" &&
              renderTransactionResult(searchResult.data)}
            {searchResult.type === "alias" &&
              renderAliasResult(searchResult.data)}
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Wallet Explorer</h3>
            <p className="text-sm text-gray-600">
              View wallet balances, transaction history, and activity using
              addresses or aliases
            </p>
          </div>

          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Hash className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">
              Transaction Details
            </h3>
            <p className="text-sm text-gray-600">
              Get complete transaction information including inputs, outputs,
              and fees
            </p>
          </div>

          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Alias Resolution</h3>
            <p className="text-sm text-gray-600">
              Search using simple 16-digit aliases and get full blockchain data
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
