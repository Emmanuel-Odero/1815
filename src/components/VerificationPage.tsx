import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VerificationResult {
  success: boolean;
  message: string;
  subscriptionType?: string;
  verifiedAt?: string;
}

export function VerificationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setResult({
          success: false,
          message: "Invalid verification link. No token provided.",
        });
        setLoading(false);
        return;
      }

      try {
        console.log(
          "VerificationPage: Making request to:",
          `/api/v1/features/verify/${token}`
        );
        const response = await fetch(`/api/v1/features/verify/${token}`);
        const data = await response.json();

        console.log("VerificationPage: Response status:", response.status);
        console.log("VerificationPage: Response data:", data);

        if (response.ok) {
          setResult({
            success: true,
            message: data.data.message,
            subscriptionType: data.data.subscriptionType,
            verifiedAt: data.data.verifiedAt,
          });
        } else {
          setResult({
            success: false,
            message:
              data.error?.message || "Verification failed. Please try again.",
          });
        }
      } catch (error) {
        console.error("VerificationPage: Request error:", error);
        setResult({
          success: false,
          message: "Network error. Please check your connection and try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleGoHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Verifying...</h1>
            <p className="text-gray-600">
              Please wait while we verify your subscription.
            </p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            {result?.success ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {result?.success
              ? "Verification Successful!"
              : "Verification Failed"}
          </h1>
        </CardHeader>
        <CardContent className="text-center">
          <div
            className={`p-4 rounded-lg mb-6 ${
              result?.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <p
              className={`${
                result?.success ? "text-green-800" : "text-red-800"
              }`}
            >
              {result?.message}
            </p>
          </div>

          {result?.success && result.subscriptionType && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Subscription Type:</strong>{" "}
                {result.subscriptionType === "newsletter"
                  ? "Newsletter"
                  : "Feature Notification"}
              </p>
              {result.verifiedAt && (
                <p className="text-blue-700 text-xs mt-1">
                  Verified on {new Date(result.verifiedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleGoHome}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Return to Home
            </Button>

            {result?.success && (
              <p className="text-sm text-gray-600">
                {result.subscriptionType === "newsletter"
                  ? "You will start receiving our newsletter updates soon!"
                  : "We'll notify you as soon as the feature is available!"}
              </p>
            )}

            {!result?.success && (
              <div className="text-sm text-gray-600 space-y-2">
                <p>If you continue to have issues, please:</p>
                <ul className="text-left space-y-1">
                  <li>
                    • Check that you clicked the correct link from your email
                  </li>
                  <li>
                    • Ensure the verification link hasn't expired (24 hours)
                  </li>
                  <li>• Try subscribing again if the link is too old</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
