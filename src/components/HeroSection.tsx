import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  User,
  X,
} from "lucide-react";

type FeatureType = "secure" | "instant" | "simple" | null;

interface FeatureContent {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  primaryButton: string;
  secondaryButton: string;
}

const featureContents: Record<Exclude<FeatureType, null>, FeatureContent> = {
  secure: {
    badge: "🔒 Your Data, Your Control",
    title: "Complete Privacy & Security",
    subtitle: "You own your data. We never see your private keys.",
    description:
      "CardanoResolve operates with zero-knowledge architecture. Your wallet remains completely private and secure.",
    features: [
      "🔐 Zero-knowledge architecture - we never access your private keys",
      "👤 You maintain full control of your wallet at all times",
      "🛡️ Bank-grade encryption protects all alias data",
      "🔒 Sign-in only creates aliases - never compromises security",
      "📱 Non-custodial service - your funds stay in your wallet",
    ],
    primaryButton: "Learn About Security",
    secondaryButton: "View Privacy Policy",
  },
  instant: {
    badge: "⚡ Lightning Fast Resolution",
    title: "Instant Alias Resolution",
    subtitle: "Sub-second response times for all transactions.",
    description:
      "Our optimized infrastructure ensures your aliases resolve instantly, making transactions seamless.",
    features: [
      "⚡ <100ms average resolution time",
      "🌐 Global CDN for worldwide speed",
      "🔄 Real-time synchronization across networks",
      "📊 99.99% uptime guarantee",
      "🚀 Optimized for high-frequency trading",
    ],
    primaryButton: "Test Speed Now",
    secondaryButton: "View Performance Stats",
  },
  simple: {
    badge: "✨ Effortlessly Simple",
    title: "16 Numbers. That's It.",
    subtitle: "Transform complexity into simplicity.",
    description:
      "Replace impossible-to-remember 103-character addresses with just 16 memorable numbers.",
    features: [
      "🔢 Just 16 digits instead of 103 characters",
      "🧠 Easy to remember and share",
      "📝 No more copy-paste errors",
      "💬 Perfect for verbal communication",
      "🎯 Human-friendly transaction experience",
    ],
    primaryButton: "Create Simple Alias",
    secondaryButton: "See Examples",
  },
};

export function HeroSection() {
  const [selectedFeature, setSelectedFeature] = useState<FeatureType>(null);

  const handleFeatureClick = (feature: FeatureType) => {
    setSelectedFeature(feature);
  };

  const handleClose = () => {
    setSelectedFeature(null);
  };

  const renderDefaultContent = () => (
    <>
      {/* Premium Badge */}
      <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-semibold mb-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <Sparkles className="w-4 h-4 mr-2" />
        Simplify Your Cardano Experience
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight">
        <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
          Turn Complex Wallet Addresses Into
        </span>
        <br />
        <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Simple
        </span>{" "}
        <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
          Aliases
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
        Transform your{" "}
        <span className="text-blue-600 font-semibold">
          103-character wallet address
        </span>{" "}
        into just{" "}
        <span className="text-amber-600 font-semibold">
          16 memorable numbers
        </span>
        . Make Cardano transactions effortless.
      </p>

      {/* Search Card */}
      <div className="bg-red-550px backdrop-blur-lg rounded-2xl shadow-xl p-6 max-w-2xl mx-auto border border-white/20 hover:shadow-2xl transition-all duration-500 w-[600px]">
        <div className="flex flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-3 mb-3">
          <div className="flex-1 relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-blue-400" />
            </div>
            <Input
              type="text"
              placeholder="Enter alias or wallet address..."
              className="pl-4 pr-4 py-4 w-full border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base font-medium bg-white/90 backdrop-blur-sm transition-all duration-300"
            />
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-base flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full lg:w-auto">
            <Search className="h-5 w-5" />
            <span>Resolve</span>
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-gray-600 font-medium flex items-center">
            <Sparkles className="w-3 h-3 mr-1 text-yellow-500" />
            Try:
          </span>
          <div className="flex flex-wrap gap-2">
            <a
              href="#"
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 font-mono text-xs font-semibold transition-colors"
            >
              1234567890123456
            </a>
            <a
              href="#"
              className="bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 font-mono text-xs font-semibold transition-colors"
            >
              9876543210987654
            </a>
          </div>
        </div>
      </div>
    </>
  );

  const renderFeatureContent = (feature: Exclude<FeatureType, null>) => {
    const content = featureContents[feature];

    // Theme colors for each feature
    const themeColors = {
      secure: {
        badge: "from-blue-500 to-indigo-600",
        primary:
          "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
        accent: "blue-500",
        bg: "from-blue-50/80 to-indigo-50/80",
      },
      instant: {
        badge: "from-yellow-500 to-orange-500",
        primary:
          "from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600",
        accent: "yellow-500",
        bg: "from-yellow-50/80 to-orange-50/80",
      },
      simple: {
        badge: "from-purple-500 to-pink-600",
        primary:
          "from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700",
        accent: "purple-500",
        bg: "from-purple-50/80 to-pink-50/80",
      },
    };

    // Additional compelling content for each feature
    const additionalContent = {
      secure: {
        stats: [
          {
            label: "Zero Breaches",
            value: "100%",
            desc: "Perfect security record",
          },
          {
            label: "Encrypted Data",
            value: "256-bit",
            desc: "Military-grade protection",
          },
          { label: "User Control", value: "Full", desc: "You own your keys" },
        ],
        testimonial:
          '"Finally, a service that respects my privacy while making Cardano simple."',
        author: "Sarah K., DeFi Trader",
      },
      instant: {
        stats: [
          { label: "Resolution Time", value: "<100ms", desc: "Lightning fast" },
          { label: "Uptime", value: "99.99%", desc: "Always available" },
          { label: "Global CDN", value: "50+", desc: "Worldwide coverage" },
        ],
        testimonial:
          '"Transactions that used to take minutes now happen instantly."',
        author: "Marcus R., Crypto Enthusiast",
      },
      simple: {
        stats: [
          {
            label: "Character Reduction",
            value: "84%",
            desc: "From 103 to 16 digits",
          },
          { label: "Error Reduction", value: "95%", desc: "No more typos" },
          {
            label: "User Satisfaction",
            value: "98%",
            desc: "Love the simplicity",
          },
        ],
        testimonial: '"I can finally share my wallet address over the phone!"',
        author: "David L., Business Owner",
      },
    };

    const extra = additionalContent[feature];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column - Main Content */}
        <div className="space-y-4">
          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-gray-200"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Feature Badge */}
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${themeColors[feature].badge} text-white text-sm font-semibold shadow-lg`}
          >
            {content.badge}
          </div>

          {/* Feature Title & Subtitle */}
          <div>
            <h1 className="text-2xl md:text-3xl font-black mb-2 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                {content.title}
              </span>
            </h1>
            <p className="text-lg text-blue-600 font-semibold mb-3">
              {content.subtitle}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* Feature Benefits */}
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-white/30">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">
              Key Benefits:
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {content.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-sm">{feature.split(" ")[0]}</span>
                  <span className="text-gray-700 text-xs font-medium">
                    {feature.substring(feature.indexOf(" ") + 1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className={`bg-gradient-to-r ${themeColors[feature].primary} text-white font-bold px-6 py-2 text-sm rounded-lg inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            >
              <span>{content.primaryButton}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 border border-gray-200 hover:border-gray-300 font-bold px-6 py-2 text-sm rounded-lg inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <span>{content.secondaryButton}</span>
            </Button>
          </div>
        </div>

        {/* Right Column - Stats & Social Proof */}
        <div className="space-y-4">
          {/* Performance Stats */}
          <div
            className={`bg-gradient-to-br ${themeColors[feature].bg} backdrop-blur-lg rounded-xl shadow-lg p-4 border border-white/30`}
          >
            <h3 className="font-bold text-gray-900 mb-3 text-sm">
              Performance Metrics
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {extra.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-black text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-gray-700">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-600">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Testimonial */}
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-white/30">
            <div className="flex items-start space-x-2 mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-sm">
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-600">5.0/5</span>
            </div>
            <blockquote className="text-sm text-gray-700 italic mb-2">
              {extra.testimonial}
            </blockquote>
            <cite className="text-xs text-gray-600 font-medium">
              — {extra.author}
            </cite>
          </div>

          {/* Trust Indicators */}
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-white/30">
            <h4 className="font-bold text-gray-900 mb-2 text-sm">Trusted By</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>10,000+ Users</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>50+ Countries</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>1M+ Transactions</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-8 text-center">
        {/* Fixed Height Content Area */}
        <div className="mb-8 min-h-[400px] flex flex-col justify-center">
          {selectedFeature
            ? renderFeatureContent(selectedFeature)
            : renderDefaultContent()}
        </div>

        {/* Feature Highlights - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-6">
          <button
            onClick={() => handleFeatureClick("secure")}
            className={`group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 cursor-pointer border border-white/40 overflow-hidden ${
              selectedFeature === "secure"
                ? "ring-4 ring-blue-400/50 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 shadow-blue-200/50"
                : "hover:bg-gradient-to-br hover:from-blue-50/80 hover:to-indigo-50/80"
            }`}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-indigo-600/20 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                Secure
              </h3>
              <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
                Your data stays private and secure
              </p>
              {/* Click indicator */}
              <div className="mt-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs font-semibold">
                  Click to explore →
                </span>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleFeatureClick("instant")}
            className={`group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 cursor-pointer border border-white/40 overflow-hidden ${
              selectedFeature === "instant"
                ? "ring-4 ring-yellow-400/50 bg-gradient-to-br from-yellow-50/90 to-orange-50/90 shadow-yellow-200/50"
                : "hover:bg-gradient-to-br hover:from-yellow-50/80 hover:to-orange-50/80"
            }`}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-700 transition-colors">
                Instant
              </h3>
              <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
                Lightning-fast resolution in milliseconds
              </p>
              {/* Click indicator */}
              <div className="mt-3 text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs font-semibold">
                  Click to explore →
                </span>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleFeatureClick("simple")}
            className={`group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 cursor-pointer border border-white/40 overflow-hidden ${
              selectedFeature === "simple"
                ? "ring-4 ring-purple-400/50 bg-gradient-to-br from-purple-50/90 to-pink-50/90 shadow-purple-200/50"
                : "hover:bg-gradient-to-br hover:from-purple-50/80 hover:to-pink-50/80"
            }`}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                Simple
              </h3>
              <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
                Just 16 numbers instead of 103 characters
              </p>
              {/* Click indicator */}
              <div className="mt-3 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs font-semibold">
                  Click to explore →
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* CTA Buttons - Now Below Feature Cards */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-3 text-lg rounded-xl inline-flex items-center space-x-2 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <span>Create Your Alias</span>
            <ArrowRight className="w-5 h-5" />
          </Button>

          <Button className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 border-2 border-gray-200 hover:border-gray-300 font-bold px-8 py-3 text-lg rounded-xl inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <User className="w-5 h-5" />
            <span>Manage Aliases</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
