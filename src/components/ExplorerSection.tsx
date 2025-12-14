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
  const [searchType, setSearchType] = useState<
    "auto" | "wallet" | "transaction" | "alias"
  >("auto");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    // Simulate API call with different result types
    setTimeout(() => {
      // Determine search type based on input format
      let resultType: "wallet" | "transaction" | "alias";

      if (searchQuery.length === 16 && /^\d+$/.test(searchQuery)) {
        resultType = "alias";
      } else if (searchQuery.length === 64) {
        resultType = "transaction";
      } else {
        resultType = "wallet";
      }

      // Mock data based on type
      const mockResults = {
        wallet: {
          address: searchQuery,
          balance: "1,234.56 ADA",
          totalTransactions: 156,
          firstSeen: "2023-01-15",
          lastActivity: "2024-12-13",
          transactions: [
            {
              hash: "a1b2c3d4e5f6...",
              type: "received",
              amount: "+50.00 ADA",
              time: "2 hours ago",
            },
            {
              hash: "f6e5d4c3b2a1...",
              type: "sent",
              amount: "-25.50 ADA",
              time: "1 day ago",
            },
            {
              hash: "9z8y7x6w5v4u...",
              type: "received",
              amount: "+100.00 ADA",
              time: "3 days ago",
            },
          ],
        },
        transaction: {
          hash: searchQuery,
          status: "Confirmed",
          block: 8234567,
          timestamp: "2024-12-13 14:30:25 UTC",
          fee: "0.17 ADA",
          inputs: [
            {
              address:
                "addr1qxy2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer...",
              amount: "100.00 ADA",
            },
          ],
          outputs: [
            {
              address: "addr1q9f8r7e6w5q4t3y2u1i0o9p8l7k6j5h4g3f2d1s0a9z8x...",
              amount: "75.50 ADA",
            },
            {
              address:
                "addr1qxy2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer...",
              amount: "24.33 ADA",
            },
          ],
        },
        alias: {
          alias: searchQuery,
          resolvedAddress:
            "addr1qxy2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt6yr69nqzz",
          balance: "2,456.78 ADA",
          totalTransactions: 89,
          createdDate: "2024-11-20",
          expiryDate: "2024-11-27",
        },
      };

      setSearchResult({
        type: resultType,
        data: mockResults[resultType],
      });
      setIsSearching(false);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderWalletResult = (data: any) => (
    <Card className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Wallet className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">Wallet Details</h3>
        </div>
        <Button
          onClick={() => copyToClipboard(data.address)}
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
            <span className="text-sm font-semibold text-blue-900">Balance</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{data.balance}</div>
        </div>

        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-900">
              Transactions
            </span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {data.totalTransactions}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">First Seen:</span>
          <span className="font-medium">{data.firstSeen}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Last Activity:</span>
          <span className="font-medium">{data.lastActivity}</span>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold text-gray-900 mb-3">
          Recent Transactions
        </h4>
        <div className="space-y-2">
          {data.transactions.map((tx: any, index: number) => (
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
          ))}
        </div>
      </div>
    </Card>
  );

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

  const renderAliasResult = (data: any) => (
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
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-amber-900 mb-1">
              Alias
            </div>
            <div className="text-2xl font-bold text-amber-600 font-mono">
              {data.alias}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-amber-900 mb-1">
              Resolves To
            </div>
            <div className="font-mono text-sm text-gray-600">
              {data.resolvedAddress.substring(0, 20)}...
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Coins className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Balance</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{data.balance}</div>
        </div>

        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-900">
              Transactions
            </span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {data.totalTransactions}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Created:</span>
          <span className="font-medium">{data.createdDate}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Expires:</span>
          <span className="font-medium text-red-600">{data.expiryDate}</span>
        </div>
      </div>
    </Card>
  );

  return (
    <section className="relative w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 py-16">
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
                onClick={() => setSearchQuery("1234567890123456")}
                className="bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 font-mono text-xs font-semibold transition-colors"
              >
                1234567890123456
              </button>
              <button
                onClick={() =>
                  setSearchQuery(
                    "addr1qxy2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer..."
                  )
                }
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 font-mono text-xs font-semibold transition-colors"
              >
                addr1qxy2fx...
              </button>
              <button
                onClick={() =>
                  setSearchQuery(
                    "a1b2c3d4e5f6789012345678901234567890123456789012345678901234"
                  )
                }
                className="bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 font-mono text-xs font-semibold transition-colors"
              >
                a1b2c3d4e5f6...
              </button>
            </div>
          </div>
        </Card>

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
