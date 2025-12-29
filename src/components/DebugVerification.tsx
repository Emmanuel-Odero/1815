import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/api";

export function DebugVerification() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testVerification = async () => {
    if (!token) return;

    setLoading(true);
    setResult(null);

    try {
      console.log("Making request to:", `${API_BASE_URL}/features/verify/${token}`);
      const response = await fetch(`${API_BASE_URL}/features/verify/${token}`);
      const data = await response.json();

      console.log("Response status:", response.status);
      console.log("Response data:", data);

      setResult({
        status: response.status,
        success: response.ok,
        data: data,
      });
    } catch (error) {
      console.error("Request error:", error);
      setResult({
        status: "ERROR",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Debug Verification</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Verification Token (64 characters):
          </label>
          <Input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter verification token..."
            className="font-mono text-sm"
          />
        </div>

        <Button
          onClick={testVerification}
          disabled={loading || !token}
          className="w-full"
        >
          {loading ? "Testing..." : "Test Verification"}
        </Button>

        {result && (
          <div className="mt-4 p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Result:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Status:</strong> {result.status}
              </div>
              <div>
                <strong>Success:</strong> {result.success ? "✅ Yes" : "❌ No"}
              </div>
              <div>
                <strong>Response:</strong>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(result.data || result.error, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">
            How to get a fresh token:
          </h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>
              1. Go to{" "}
              <a
                href="http://localhost:8025"
                target="_blank"
                className="underline"
              >
                MailHog
              </a>
            </li>
            <li>2. Find the latest verification email</li>
            <li>3. Copy the 64-character token from the verification link</li>
            <li>4. Paste it above and test</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
