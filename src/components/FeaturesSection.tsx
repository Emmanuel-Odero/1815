import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FeaturesSection() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [featureUpdates, setFeatureUpdates] = useState(true);
  const [generalNews, setGeneralNews] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
  const [notificationEmails, setNotificationEmails] = useState<{
    [key: number]: string;
  }>({});
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", {
      email: newsletterEmail,
      featureUpdates,
      generalNews,
    });
    setNewsletterEmail("");
  };

  const handleNotificationSubmit = (featureIndex: number, email: string) => {
    // Handle feature notification signup
    console.log("Feature notification signup:", { featureIndex, email });
    setNotificationEmails((prev) => ({ ...prev, [featureIndex]: "" }));
    setExpandedFeature(null);
  };

  const features = [
    // Available Features
    {
      icon: "🔧",
      title: "Instant Resolution",
      description: "Resolve aliases to full wallet addresses in milliseconds",
      bgColor: "bg-yellow-100",
      iconBg: "bg-yellow-500",
      status: "available",
      version: "1.0.0",
      actionText: "Try Explorer",
      actionLink: "#explorer",
    },
    {
      icon: "🔍",
      title: "Alias Explorer",
      description: "Search and explore existing aliases on the network",
      bgColor: "bg-blue-100",
      iconBg: "bg-blue-500",
      status: "available",
      version: "1.0.0",
      actionText: "Try Explorer",
      actionLink: "#explorer",
    },
    {
      icon: "➕",
      title: "Create Alias",
      description: "Generate your own memorable 16-digit alias",
      bgColor: "bg-yellow-100",
      iconBg: "bg-yellow-500",
      status: "available",
      version: "1.0.0",
      actionText: "Create Now",
      actionLink: "#create",
    },

    // Upcoming Features
    {
      icon: "👤",
      title: "User Signup & Accounts",
      description:
        "Create personal accounts to manage your aliases and preferences",
      bgColor: "bg-blue-100",
      iconBg: "bg-blue-500",
      status: "upcoming",
      version: "1.1.0",
    },
    {
      icon: "📧",
      title: "Email Alias Integration",
      description: "Link your email address as an alias for easy sharing",
      bgColor: "bg-yellow-100",
      iconBg: "bg-yellow-500",
      status: "upcoming",
      version: "1.2.0",
    },
    {
      icon: "📱",
      title: "Phone Number Aliases",
      description: "Use your phone number as a wallet alias",
      bgColor: "bg-blue-100",
      iconBg: "bg-blue-500",
      status: "upcoming",
      version: "1.3.0",
    },
    {
      icon: "🌐",
      title: "Custom Domain Aliases",
      description: "Create aliases using your own domain name",
      bgColor: "bg-yellow-100",
      iconBg: "bg-yellow-500",
      status: "upcoming",
      version: "1.4.0",
    },
    {
      icon: "✏️",
      title: "Custom Alias Names",
      description: "Choose your own memorable alias names instead of numbers",
      bgColor: "bg-blue-100",
      iconBg: "bg-blue-500",
      status: "upcoming",
      version: "1.5.0",
    },
    {
      icon: "🔗",
      title: "Wallet Integration",
      description: "Direct integration with popular Cardano wallets",
      bgColor: "bg-yellow-100",
      iconBg: "bg-yellow-500",
      status: "upcoming",
      version: "1.6.0",
    },
    {
      icon: "📊",
      title: "Wallet & Alias Management",
      description:
        "Comprehensive dashboard to manage all your wallets and aliases",
      bgColor: "bg-blue-100",
      iconBg: "bg-blue-500",
      status: "upcoming",
      version: "1.7.0",
    },
    {
      icon: "🔄",
      title: "Hybrid On/Off-Chain",
      description:
        "Transition from off-chain to hybrid architecture for enhanced security and decentralization",
      bgColor: "bg-purple-100",
      iconBg: "bg-purple-500",
      status: "upcoming",
      version: "2.0.0",
    },
    {
      icon: "🌙",
      title: "Cardano Midnight Integration",
      description:
        "Privacy-focused features using Cardano Midnight for confidential alias operations",
      bgColor: "bg-indigo-100",
      iconBg: "bg-indigo-500",
      status: "upcoming",
      version: "3.0.0",
    },
  ];

  const currentVersion = "1.0.0";
  const displayedFeatures = showAllFeatures ? features : features.slice(0, 6);

  return (
    <section className="relative w-full py-10 bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>
        <div className="absolute top-60 left-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-6000"></div>
      </div>
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-gray-700 text-sm font-semibold mb-4 shadow-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Current Version: {currentVersion}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Features & Roadmap
          </h2>
          <p className="text-base text-gray-600">
            Current features and what's coming next to CardanoResolve
          </p>
        </div>

        {/* Newsletter Subscription Section */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-xl border border-white/40">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Stay Updated
            </h3>
            <p className="text-gray-600">
              Subscribe to our newsletter and be the first to know about new
              features
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex gap-2 mb-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Subscribe
              </Button>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featureUpdates}
                  onChange={(e) => setFeatureUpdates(e.target.checked)}
                  className="rounded"
                />
                <span>Feature releases and updates</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={generalNews}
                  onChange={(e) => setGeneralNews(e.target.checked)}
                  className="rounded"
                />
                <span>General ecosystem news and updates</span>
              </label>
            </div>
          </form>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedFeatures.map((feature, index) => (
            <Card
              key={index}
              className={`${
                feature.bgColor
              } border-none shadow-sm hover:shadow-md transition-all duration-200 ${
                expandedFeature === index ? "ring-2 ring-blue-400" : ""
              }`}
            >
              <CardHeader className="text-center pb-2">
                <div
                  className={`w-10 h-10 ${feature.iconBg} rounded-lg flex items-center justify-center mx-auto mb-3`}
                >
                  <span className="text-white text-lg">{feature.icon}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {feature.status === "available" && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Available Now
                    </span>
                  )}
                  {feature.status === "upcoming" && (
                    <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                    v{feature.version}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-gray-600 text-sm mb-4">
                  {feature.description}
                </p>

                {feature.status === "available" && (
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      const element = document.querySelector(
                        feature.actionLink!
                      );
                      element?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {feature.actionText}
                  </Button>
                )}

                {feature.status === "upcoming" && (
                  <div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setExpandedFeature(
                          expandedFeature === index ? null : index
                        )
                      }
                      className="border-gray-400 text-gray-700 hover:bg-gray-100"
                    >
                      🔔 Get Notified
                    </Button>

                    {expandedFeature === index && (
                      <div className="mt-3 p-3 bg-white rounded-lg border">
                        <p className="text-xs text-gray-600 mb-2">
                          Enter your email to be notified when this feature is
                          available:
                        </p>
                        <div className="flex gap-2">
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            value={notificationEmails[index] || ""}
                            onChange={(e) =>
                              setNotificationEmails((prev) => ({
                                ...prev,
                                [index]: e.target.value,
                              }))
                            }
                            className="text-xs h-8"
                            required
                          />
                          <Button
                            size="sm"
                            onClick={() =>
                              handleNotificationSubmit(
                                index,
                                notificationEmails[index] || ""
                              )
                            }
                            className="bg-blue-600 hover:bg-blue-700 h-8 px-3 text-xs"
                          >
                            Notify Me
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        {!showAllFeatures && features.length > 6 && (
          <div className="text-center mt-8">
            <Button
              onClick={() => setShowAllFeatures(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Load More Features ({features.length - 6} more)
            </Button>
          </div>
        )}

        {showAllFeatures && (
          <div className="text-center mt-8">
            <Button
              onClick={() => setShowAllFeatures(false)}
              variant="outline"
              className="border-gray-400 text-gray-700 hover:bg-gray-100 font-semibold py-3 px-6 rounded-xl"
            >
              Show Less
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
