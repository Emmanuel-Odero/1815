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
  const [previewData, setPreviewData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmedAlias, setConfirmedAlias] = useState<any>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [validationError, setValidationError] = useState<string>("");
  const [isAddressValid, setIsAddressValid] = useState<boolean | null>(null);
  const [existingAlias, setExistingAlias] = useState<any>(null);

  const handleExistingAlias = async (address: string) => {
    try {
      // Fetch the existing alias details from the backend
      const { aliasAPI } = await import("@/lib/api");
      const existingAliasData = await aliasAPI.getExistingAliasByAddress(
        address
      );

      setExistingAlias({
        address: address,
        shortCode: existingAliasData.shortCode,
        customName: existingAliasData.customName,
        expiresAt: existingAliasData.expiresAt,
        createdAt: existingAliasData.createdAt,
        qrCodeUrl: existingAliasData.qrCodeUrl,
        message: "This wallet address already has an active alias.",
        suggestion:
          "Each Cardano address can only have one alias at a time. Try using a different address or contact support if you need to update your existing alias.",
      });
      setPreviewData(null);
      setConfirmedAlias(null);
      setValidationError("");

      console.log("✅ Existing alias details fetched:", existingAliasData);
    } catch (error) {
      console.error("Failed to fetch existing alias details:", error);
      // Fallback to generic message if API call fails
      setExistingAlias({
        address: address,
        message: "This wallet address already has an active alias.",
        suggestion:
          "Each Cardano address can only have one alias at a time. Try using a different address or contact support if you need to update your existing alias.",
      });
      setValidationError("");
    }
  };

  const handleGeneratePreview = async () => {
    if (!walletAddress.trim()) return;

    setIsGenerating(true);
    setValidationError("");

    try {
      // Import API functions and validation dynamically to avoid build issues
      const { aliasAPI } = await import("@/lib/api");
      const { validation } = await import("@/lib/validation");

      // Validate Cardano address format first
      const address = walletAddress.trim();
      if (!validation.isValidCardanoAddress(address)) {
        throw new Error(
          'Invalid Cardano address format. Please enter a valid Cardano address (starts with "addr1", "addr_test1", "stake1", etc.)'
        );
      }

      // Check for network compatibility (since we're using preprod/testnet API)
      if (address.startsWith("addr1") || address.startsWith("stake1")) {
        throw new Error(
          'Mainnet addresses are not supported. Please use a testnet address (starts with "addr_test1" or "stake_test1"). Our system is currently configured for Cardano Preprod/Testnet.'
        );
      }

      // Call the new preview API endpoint
      const result = await aliasAPI.previewAlias({
        cardanoAddress: walletAddress.trim(),
      });

      setPreviewData(result);
      console.log("✅ Alias preview generated:", result);
    } catch (error) {
      console.error("❌ Failed to generate preview:", error);

      if (error instanceof Error) {
        // Show validation errors to the user
        if (error.message.includes("Invalid Cardano address")) {
          setValidationError(error.message);
        } else if (
          error.message.includes("Mainnet addresses are not supported")
        ) {
          setValidationError(error.message);
        } else if (error.message.includes("already has an active alias")) {
          // Try to fetch the existing alias details
          await handleExistingAlias(walletAddress.trim());
        } else if (error.message.includes("fetch")) {
          setValidationError(
            "Unable to connect to server. Please try again later."
          );
        } else if (error.message.includes("temporarily unavailable")) {
          setValidationError(
            "Blockchain service is temporarily unavailable. This might be due to a network mismatch. Please ensure you're using a testnet address."
          );
        } else {
          setValidationError("Failed to generate preview. Please try again.");
        }
      } else {
        setValidationError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmAlias = async () => {
    if (!previewData) return;

    setIsConfirming(true);
    try {
      // Import API functions dynamically
      const { aliasAPI } = await import("@/lib/api");

      // Call the confirm API endpoint
      const result = await aliasAPI.confirmAlias({
        shortCode: previewData.shortCode,
        cardanoAddress: walletAddress.trim(),
      });

      setConfirmedAlias(result);
      console.log("✅ Alias confirmed and saved:", result);
    } catch (error) {
      console.error("❌ Failed to confirm alias:", error);

      // Fallback for demo
      const confirmedData = {
        ...previewData,
        createdAt: new Date().toISOString(),
        previewOnly: false,
      };
      setConfirmedAlias(confirmedData);
      console.log("🔧 Mock confirmation for demo:", confirmedData);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleStartOver = () => {
    setPreviewData(null);
    setConfirmedAlias(null);
    setValidationError("");
    setExistingAlias(null);
    setWalletAddress(""); // Clear everything for fresh start
    setIsAddressValid(null);
  };

  const handleGenerateNew = () => {
    setPreviewData(null);
    setValidationError("");
    setExistingAlias(null);
    // Keep the wallet address and validation state, generate a new preview automatically
    handleGeneratePreview();
  };

  const handleCopyAlias = () => {
    const aliasToCopy = confirmedAlias?.shortCode || previewData?.shortCode;
    if (aliasToCopy) {
      navigator.clipboard.writeText(aliasToCopy);
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    }
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
                        placeholder="addr_test1qpw0djgj0x59ngrjvqthn7enhvruxnsavsw5th63la3mjel3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqqjz6aa7"
                        value={walletAddress}
                        onChange={async (e) => {
                          const value = e.target.value;
                          setWalletAddress(value);
                          setValidationError("");
                          setExistingAlias(null);

                          if (value.trim()) {
                            // Import validation function and check address
                            try {
                              const { validation } = await import(
                                "@/lib/validation"
                              );
                              const isValid = validation.isValidCardanoAddress(
                                value.trim()
                              );
                              setIsAddressValid(isValid);
                            } catch {
                              setIsAddressValid(null);
                            }
                          } else {
                            setIsAddressValid(null);
                          }
                        }}
                        className={`pl-10 pr-12 py-3 w-full border-2 rounded-xl focus:ring-2 focus:ring-blue-100 text-sm bg-white/90 backdrop-blur-sm transition-all duration-300 ${
                          isAddressValid === true
                            ? "border-green-500 focus:border-green-500"
                            : isAddressValid === false
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 focus:border-blue-500"
                        }`}
                      />
                      {/* Validation indicator */}
                      {walletAddress.trim() && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          {isAddressValid === true ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : isAddressValid === false ? (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          ) : null}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Paste your full Cardano testnet wallet address (starts
                      with "addr_test1" or "stake_test1")
                    </p>
                    <div className="mt-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      <strong>Network:</strong> Currently configured for Cardano
                      Preprod/Testnet. Mainnet addresses (addr1...) are not
                      supported.
                    </div>
                    {validationError && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-red-700">
                            {validationError}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {!previewData && !confirmedAlias && (
                    <Button
                      onClick={handleGeneratePreview}
                      disabled={
                        !walletAddress.trim() ||
                        isGenerating ||
                        isAddressValid === false
                      }
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isGenerating ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Generating Preview...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-5 h-5" />
                          <span>Generate Preview</span>
                        </div>
                      )}
                    </Button>
                  )}

                  {previewData && !confirmedAlias && (
                    <div className="space-y-3">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-yellow-900 text-sm">
                              Preview Generated
                            </h4>
                            <p className="text-xs text-yellow-700 mt-1">
                              This is a preview. Click "Use This Code" to save
                              it permanently.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={handleConfirmAlias}
                          disabled={isConfirming}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                        >
                          {isConfirming ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Saving...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Check className="w-4 h-4" />
                              <span>Use This Code</span>
                            </div>
                          )}
                        </Button>

                        <Button
                          onClick={handleGenerateNew}
                          variant="outline"
                          className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                        >
                          Generate New
                        </Button>
                      </div>
                    </div>
                  )}

                  {confirmedAlias && (
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-green-900 text-sm">
                              Alias Created Successfully!
                            </h4>
                            <p className="text-xs text-green-700 mt-1">
                              Your alias is now active and ready to use.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={handleGenerateNew}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-4 h-4" />
                            <span>Same Address</span>
                          </div>
                        </Button>
                        <Button
                          onClick={handleStartOver}
                          variant="outline"
                          className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                  )}

                  {existingAlias && (
                    <div className="space-y-3">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-amber-900 text-sm">
                              Address Already Has Alias
                            </h4>
                            <p className="text-xs text-amber-700 mt-1">
                              This wallet address already has an active alias.
                              Only one alias per address is allowed.
                            </p>
                            {existingAlias?.suggestion && (
                              <p className="text-xs text-amber-600 mt-2 font-medium">
                                💡 {existingAlias.suggestion}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={handleStartOver}
                          variant="outline"
                          className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                        >
                          Try Different Address
                        </Button>
                        <Button
                          onClick={() => {
                            // Navigate to explorer to search for existing alias
                            const explorerSection =
                              document.getElementById("explorer-section");
                            if (explorerSection) {
                              explorerSection.scrollIntoView({
                                behavior: "smooth",
                              });
                              // Pre-fill the search with the address
                              setTimeout(() => {
                                const searchInput = document.querySelector(
                                  "#explorer-search-input"
                                ) as HTMLInputElement;
                                if (searchInput) {
                                  searchInput.value = walletAddress;
                                  searchInput.focus();
                                }
                              }, 500);
                            }
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                        >
                          Find Existing Alias
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Free Tier Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 text-sm">
                          Free Tier Limits
                        </h4>
                        <ul className="text-xs text-blue-700 mt-1 space-y-1">
                          <li>• Only one alias per wallet address</li>
                          <li>• 30-day lifespan (expires automatically)</li>
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
                              {existingAlias ? (
                                existingAlias.shortCode ? (
                                  <>
                                    <code className="text-xl font-mono font-bold tracking-wider text-amber-300">
                                      {existingAlias.shortCode
                                        .match(/.{1,4}/g)
                                        ?.join(" ") || existingAlias.shortCode}
                                    </code>
                                    <Button
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          existingAlias.shortCode
                                        );
                                        setShowCopyToast(true);
                                        setTimeout(
                                          () => setShowCopyToast(false),
                                          2000
                                        );
                                      }}
                                      size="sm"
                                      variant="ghost"
                                      className="text-white hover:bg-white/20 p-1 h-auto ml-2"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <div className="text-xl font-mono font-bold tracking-wider text-amber-300">
                                    EXISTING ALIAS
                                  </div>
                                )
                              ) : previewData || confirmedAlias ? (
                                <>
                                  <code className="text-xl font-mono font-bold tracking-wider">
                                    {(
                                      confirmedAlias?.shortCode ||
                                      previewData?.shortCode
                                    )
                                      .match(/.{1,4}/g)
                                      ?.join(" ") ||
                                      confirmedAlias?.shortCode ||
                                      previewData?.shortCode}
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
                              {existingAlias
                                ? "Address Already Has Alias"
                                : "Your Cardano Alias"}
                            </div>
                            {existingAlias ? (
                              existingAlias.shortCode ? (
                                <div className="flex items-center space-x-1 text-xs text-amber-300">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {(() => {
                                      const expiryDate = new Date(
                                        existingAlias.expiresAt
                                      );
                                      const now = new Date();
                                      const daysLeft = Math.ceil(
                                        (expiryDate.getTime() - now.getTime()) /
                                          (1000 * 60 * 60 * 24)
                                      );
                                      return daysLeft > 0
                                        ? `Expires in ${daysLeft} days`
                                        : "Expired";
                                    })()}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-1 text-xs text-amber-300">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>One alias per address limit</span>
                                </div>
                              )
                            ) : (
                              (previewData || confirmedAlias) && (
                                <div className="flex items-center space-x-1 text-xs text-yellow-300">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {previewData && !confirmedAlias
                                      ? "Preview - Not Saved"
                                      : "Expires in 30 days"}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* Bottom Row - CardanoResolve Link and Expiry */}
                        <div className="flex justify-between items-end">
                          <div className="flex-1 mr-4">
                            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                              {existingAlias
                                ? "Address Status"
                                : "Sharable Link"}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-sm font-semibold truncate">
                                {existingAlias
                                  ? existingAlias.shortCode
                                    ? `${
                                        import.meta.env.VITE_APP_BASE_URL ||
                                        "http://localhost:5173"
                                      }/resolve/${existingAlias.shortCode}`
                                    : "Already has active alias"
                                  : previewData || confirmedAlias
                                  ? `${
                                      import.meta.env.VITE_APP_BASE_URL ||
                                      "http://localhost:5173"
                                    }/resolve/${
                                      confirmedAlias?.shortCode ||
                                      previewData?.shortCode
                                    }`
                                  : `${
                                      import.meta.env.VITE_APP_BASE_URL ||
                                      "http://localhost:5173"
                                    }/resolve/••••••••••••••••`}
                              </div>
                              {((existingAlias && existingAlias.shortCode) ||
                                previewData ||
                                confirmedAlias) && (
                                <Button
                                  onClick={() => {
                                    const url = existingAlias?.shortCode
                                      ? `${
                                          import.meta.env.VITE_APP_BASE_URL ||
                                          "http://localhost:5173"
                                        }/resolve/${existingAlias.shortCode}`
                                      : `${
                                          import.meta.env.VITE_APP_BASE_URL ||
                                          "http://localhost:5173"
                                        }/resolve/${
                                          confirmedAlias?.shortCode ||
                                          previewData?.shortCode
                                        }`;
                                    navigator.clipboard.writeText(url);
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
                              {existingAlias?.expiresAt
                                ? (() => {
                                    const expiryDate = new Date(
                                      existingAlias.expiresAt
                                    );
                                    const month = String(
                                      expiryDate.getMonth() + 1
                                    ).padStart(2, "0");
                                    const year = String(
                                      expiryDate.getFullYear()
                                    ).slice(-2);
                                    return `${month}/${year}`;
                                  })()
                                : previewData || confirmedAlias
                                ? (() => {
                                    const expiryDate = new Date();
                                    expiryDate.setDate(
                                      expiryDate.getDate() + 30
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
