import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  bgColor: string;
  iconBg: string;
  status: "available" | "upcoming";
  version: string;
  actionText?: string;
  actionLink?: string;
  category: string;
}

interface FeaturesData {
  currentVersion: string;
  features: Feature[];
  categories: Record<string, string>;
}

export function FeaturesSection() {
  const [featuresData, setFeaturesData] = useState<FeaturesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [featureUpdates, setFeatureUpdates] = useState(true);
  const [generalNews, setGeneralNews] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [notificationEmails, setNotificationEmails] = useState<{
    [key: string]: string;
  }>({});
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    [key: string]: "idle" | "loading" | "success" | "error";
  }>({});
  const [statusMessages, setStatusMessages] = useState<{
    [key: string]: string;
  }>({});
  const [subscribedFeatures, setSubscribedFeatures] = useState<Set<string>>(
    new Set()
  );

  // Load features data from API
  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const response = await fetch("/api/v1/features");
        if (response.ok) {
          const data = await response.json();
          setFeaturesData(data.data);
        } else {
          console.error("Failed to load features data");
        }
      } catch (error) {
        console.error("Error loading features:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeatures();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubscriptionStatus((prev) => ({ ...prev, newsletter: "loading" }));

    try {
      const response = await fetch("/api/v1/features/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newsletterEmail,
          featureUpdates,
          generalNews,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptionStatus((prev) => ({ ...prev, newsletter: "success" }));
        setStatusMessages((prev) => ({
          ...prev,
          newsletter:
            data.data?.message ||
            "Verification email sent! Please check your inbox.",
        }));
        setNewsletterEmail("");

        // Clear success message after 10 seconds
        setTimeout(() => {
          setSubscriptionStatus((prev) => ({ ...prev, newsletter: "idle" }));
          setStatusMessages((prev) => ({ ...prev, newsletter: "" }));
        }, 10000);
      } else {
        setSubscriptionStatus((prev) => ({ ...prev, newsletter: "error" }));
        setStatusMessages((prev) => ({
          ...prev,
          newsletter:
            data.error?.message ||
            data.message ||
            "Failed to subscribe. Please try again.",
        }));

        // Clear error message after 8 seconds
        setTimeout(() => {
          setSubscriptionStatus((prev) => ({ ...prev, newsletter: "idle" }));
          setStatusMessages((prev) => ({ ...prev, newsletter: "" }));
        }, 8000);
      }
    } catch (error) {
      setSubscriptionStatus((prev) => ({ ...prev, newsletter: "error" }));
      setStatusMessages((prev) => ({
        ...prev,
        newsletter: "Network error. Please try again.",
      }));
    }
  };

  const handleNotificationSubmit = async (
    featureId: string,
    email: string,
    featureName: string
  ) => {
    setSubscriptionStatus((prev) => ({ ...prev, [featureId]: "loading" }));

    try {
      const response = await fetch("/api/v1/features/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          featureId,
          featureName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptionStatus((prev) => ({ ...prev, [featureId]: "success" }));
        setStatusMessages((prev) => ({
          ...prev,
          [featureId]:
            data.data?.message ||
            "Verification email sent! Please check your inbox.",
        }));
        setNotificationEmails((prev) => ({ ...prev, [featureId]: "" }));

        // Keep the form open for 5 seconds to show the success message
        setTimeout(() => {
          setExpandedFeature(null);
          setSubscriptionStatus((prev) => ({ ...prev, [featureId]: "idle" }));
        }, 5000);
      } else {
        setSubscriptionStatus((prev) => ({ ...prev, [featureId]: "error" }));
        setStatusMessages((prev) => ({
          ...prev,
          [featureId]:
            data.error?.message ||
            data.message ||
            "Failed to subscribe. Please try again.",
        }));

        // If already subscribed, mark as subscribed and close form
        if (
          data.error?.message?.includes("already subscribed") ||
          data.message?.includes("already subscribed")
        ) {
          setSubscribedFeatures((prev) => new Set([...prev, featureId]));
          setTimeout(() => {
            setExpandedFeature(null);
            setSubscriptionStatus((prev) => ({ ...prev, [featureId]: "idle" }));
          }, 3000);
        }
      }
    } catch (error) {
      setSubscriptionStatus((prev) => ({ ...prev, [featureId]: "error" }));
      setStatusMessages((prev) => ({
        ...prev,
        [featureId]: "Network error. Please try again.",
      }));
    }
  };

  if (loading) {
    return (
      <section className="relative w-full py-10 bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!featuresData) {
    return (
      <section className="relative w-full py-10 bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-600">Failed to load features data.</p>
          </div>
        </div>
      </section>
    );
  }

  const { features, currentVersion } = featuresData;
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
                disabled={subscriptionStatus.newsletter === "loading"}
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={subscriptionStatus.newsletter === "loading"}
              >
                {subscriptionStatus.newsletter === "loading"
                  ? "Subscribing..."
                  : "Subscribe"}
              </Button>
            </div>

            {/* Status message */}
            {statusMessages.newsletter && (
              <div
                className={`text-sm p-3 rounded-md mb-4 ${
                  subscriptionStatus.newsletter === "success"
                    ? "bg-green-100 text-green-800"
                    : subscriptionStatus.newsletter === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {statusMessages.newsletter}
              </div>
            )}

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
          {displayedFeatures.map((feature) => (
            <Card
              key={feature.id}
              className={`${
                feature.bgColor
              } border-none shadow-sm hover:shadow-md transition-all duration-200 ${
                expandedFeature === feature.id ? "ring-2 ring-blue-400" : ""
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
                    {subscribedFeatures.has(feature.id) ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled
                        className="border-green-400 text-green-700 bg-green-50"
                      >
                        ✓ Subscribed
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setExpandedFeature(
                            expandedFeature === feature.id ? null : feature.id
                          )
                        }
                        className="border-gray-400 text-gray-700 hover:bg-gray-100"
                        disabled={subscriptionStatus[feature.id] === "loading"}
                      >
                        🔔 Get Notified
                      </Button>
                    )}

                    {expandedFeature === feature.id &&
                      !subscribedFeatures.has(feature.id) && (
                        <div className="mt-3 p-3 bg-white rounded-lg border">
                          <p className="text-xs text-gray-600 mb-2">
                            Enter your email to be notified when "
                            {feature.title}" is available:
                          </p>
                          <div className="flex gap-2 mb-2">
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              value={notificationEmails[feature.id] || ""}
                              onChange={(e) =>
                                setNotificationEmails((prev) => ({
                                  ...prev,
                                  [feature.id]: e.target.value,
                                }))
                              }
                              className="text-xs h-8"
                              required
                              disabled={
                                subscriptionStatus[feature.id] === "loading"
                              }
                            />
                            <Button
                              size="sm"
                              onClick={() =>
                                handleNotificationSubmit(
                                  feature.id,
                                  notificationEmails[feature.id] || "",
                                  feature.title
                                )
                              }
                              className="bg-blue-600 hover:bg-blue-700 h-8 px-3 text-xs"
                              disabled={
                                subscriptionStatus[feature.id] === "loading" ||
                                !notificationEmails[feature.id]?.trim()
                              }
                            >
                              {subscriptionStatus[feature.id] === "loading"
                                ? "Sending..."
                                : "Notify Me"}
                            </Button>
                          </div>

                          {/* Status message for this feature */}
                          {statusMessages[feature.id] && (
                            <div
                              className={`text-xs p-2 rounded mb-2 ${
                                subscriptionStatus[feature.id] === "success"
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : subscriptionStatus[feature.id] === "error"
                                  ? "bg-red-100 text-red-800 border border-red-200"
                                  : "bg-blue-100 text-blue-800 border border-blue-200"
                              }`}
                            >
                              {statusMessages[feature.id]}
                            </div>
                          )}

                          <div className="text-xs text-gray-500 mt-2">
                            <p>• You'll receive a verification email first</p>
                            <p>
                              • We'll notify you as soon as this feature
                              launches
                            </p>
                            <p>• You can only subscribe once per feature</p>
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
