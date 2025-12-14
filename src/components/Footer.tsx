import CardanoResolveLogoWhite from "@/assets/cardano-resolve-logo-white.svg";

export function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img
              src={CardanoResolveLogoWhite}
              alt="CardanoResolve"
              className="h-10 w-auto"
            />
          </div>

          <p className="text-blue-200 mb-4 text-base">
            Simplifying Cardano wallet addresses, one alias at a time.
          </p>

          <div className="text-sm text-blue-300">
            © 2024 CardanoResolve. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
