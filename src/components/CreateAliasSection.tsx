import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Wallet,
  Copy,
  Clock,
  Shield,
  User,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Check,
} from "lucide-react";

export function CreateAliasSection() {
  const [walletAddress, setWalletAddress] = useState("");
  const [generatedAlias, setGeneratedAlias] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const handleGenerateAlias = async () => {
    if (!walletAddress.trim()) return;

    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const alias =
        Math.floor(Math.random() * 9000000000000000) + 1000000000000000;
      setGeneratedAlias(alias.toString());
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(generatedAlias);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  return (
    <section className="relative w-full bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative bg-blue-600 rounded-3xl p-8 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          </div>

          <div className="relative">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-4 shadow-lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Create Your First Alias
              </div>

              <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                <span className="text-white">
                  Transform Your Wallet Address
                </span>
              </h2>

              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                Paste your Cardano wallet address below and get a simple
                16-digit alias instantly.
                <span className="text-yellow-300 font-semibold">
                  {" "}
                  Free for everyone
                </span>{" "}
                - no account required.
              </p>
            </div>
            {/* Main Create Alias Card */}
            <Card className="bg-white/80 backdrop-blur-lg shadow-2xl border border-white/20 rounded-3xl p-8 mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left Column - Input Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Cardano Wallet Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Wallet className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        type="text"
                        placeholder="addr1qxy2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt6yr69nqzz..."
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm bg-white/90 backdrop-blur-sm transition-all duration-300"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Paste your full Cardano wallet address (starts with
                      "addr1")
                    </p>
                  </div>

                  <Button
                    onClick={handleGenerateAlias}
                    disabled={!walletAddress.trim() || isGenerating}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isGenerating ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating Alias...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Free Alias</span>
                      </div>
                    )}
                  </Button>

                  {/* Free Tier Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 text-sm">
                          Free Tier Limits
                        </h4>
                        <ul className="text-xs text-blue-700 mt-1 space-y-1">
                          <li>• One free alias per wallet address</li>
                          <li>• 7-day lifespan (expires automatically)</li>
                          <li>• No account management features</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Generated Alias & Account Upgrade */}
                <div className="space-y-6">
                  {/* Credit Card Style Account Upgrade */}
                  <div className="relative">
                    {/* Credit Card */}
                    <div className="relative w-full h-56 bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                      {/* Card Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full"></div>
                        <div className="absolute bottom-4 left-4 w-24 h-24 border border-white/20 rounded-full"></div>
                      </div>

                      {/* Card Content */}
                      <div className="relative h-full p-6 flex flex-col justify-between text-white">
                        {/* Top Row - Logo and Chip */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-2">
                            {/* Cardano Logo Placeholder */}
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                ₳
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-gray-300">
                              CardanoResolve
                            </span>
                          </div>

                          {/* EMV Chip */}
                          <div className="w-8 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-sm"></div>
                        </div>

                        {/* Middle - Alias Number */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {generatedAlias ? (
                                <>
                                  <code className="text-xl font-mono font-bold tracking-wider">
                                    {generatedAlias
                                      .match(/.{1,4}/g)
                                      ?.join(" ") || generatedAlias}
                                  </code>
                                  <Button
                                    onClick={handleCopyAlias}
                                    size="sm"
                                    variant="ghost"
                                    className="text-white hover:bg-white/20 p-1 h-auto"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <div className="text-xl font-mono font-bold tracking-wider text-gray-400">
                                  •••• •••• •••• ••••
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-gray-400 uppercase tracking-wide">
                              Your Cardano Alias
                            </div>
                            {generatedAlias && (
                              <div className="flex items-center space-x-1 text-xs text-yellow-300">
                                <Clock className="w-3 h-3" />
                                <span>Expires in 7 days</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bottom Row - CardanoResolve Link and Expiry */}
                        <div className="flex justify-between items-end">
                          <div className="flex-1 mr-4">
                            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                              Sharable Link
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-sm font-semibold truncate">
                                {generatedAlias
                                  ? `1815.host/${generatedAlias}`
                                  : "1815.to/••••••••••••••••"}
                              </div>
                              {generatedAlias && (
                                <Button
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      `cardanoresolve.host/${generatedAlias}`
                                    );
                                    setShowCopyToast(true);
                                    setTimeout(
                                      () => setShowCopyToast(false),
                                      2000
                                    );
                                  }}
                                  size="sm"
                                  variant="ghost"
                                  className="text-white hover:bg-white/20 p-1 h-auto"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                              Valid Thru
                            </div>
                            <div className="text-sm font-semibold">
                              {generatedAlias
                                ? (() => {
                                    const expiryDate = new Date();
                                    expiryDate.setDate(
                                      expiryDate.getDate() + 7
                                    );
                                    const month = String(
                                      expiryDate.getMonth() + 1
                                    ).padStart(2, "0");
                                    const year = String(
                                      expiryDate.getFullYear()
                                    ).slice(-2);
                                    return `${month}/${year}`;
                                  })()
                                : "∞ / ∞"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Holographic Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-full animate-pulse"></div>
                    </div>

                    {/* Card Info Below */}
                    <div className="mt-6 space-y-4">
                      <div className="text-center">
                        <h3 className="font-bold text-gray-900 mb-2">
                          Want More Control?
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Upgrade to premium for unlimited aliases and advanced
                          features
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Shield className="w-4 h-4 text-blue-500" />
                          <span>Unlimited aliases</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="w-4 h-4 text-green-500" />
                          <span>Never expires</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <User className="w-4 h-4 text-purple-500" />
                          <span>Account dashboard</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Sparkles className="w-4 h-4 text-yellow-500" />
                          <span>Priority support</span>
                        </div>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center justify-center space-x-2">
                          <span>Upgrade to Premium</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Toast Message */}
      {showCopyToast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-in slide-in-from-right duration-300">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">
            Alias copied to clipboard!
          </span>
        </div>
      )}
    </section>
  );
}
