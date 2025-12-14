import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

export function ShortenSection() {
  return (
    <section className="w-full bg-gradient-to-br from-blue-600 to-blue-700 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-blue-700/50 backdrop-blur-sm rounded-2xl p-6 text-white">
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-3 py-1 bg-blue-800/50 rounded-full text-sm mb-3">
              🔗 Create Alias
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Shorten Your Wallet Address
            </h2>
          </div>

          <div className="bg-blue-800/30 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <Lock className="w-4 h-4 text-blue-300" />
              <span className="text-sm text-blue-300 font-medium">
                SIGN IS REQUIRED
              </span>
            </div>
            <p className="text-sm text-blue-200 mb-4">
              You need to create an account to shorten wallet addresses.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-blue-200 mb-1">
                  Your Cardano wallet address:
                </label>
                <Input
                  placeholder="addr1qx9pl9ey4qtwlq4wlrwl9cywe0cxtp9cy7x9pl9ey4qtwlq4wlrwl9cywe0cxtp9cy..."
                  className="bg-blue-900/50 border-blue-600 text-white placeholder-blue-300 rounded-lg"
                />
              </div>

              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2.5 rounded-lg">
                🔗 Sign in to shorten
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-blue-200">
              🔒 <strong>Secure & Private:</strong> Your wallet address is
              encrypted and stored securely. We take privacy seriously in your
              CardanoResolve account.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
