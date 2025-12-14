import { Button } from "@/components/ui/button";
import CardanoResolveLogo from "@/assets/cardano-resolve-logo-horizontal.svg";

export function Header() {
  return (
    <header className="w-full bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={CardanoResolveLogo}
            alt="CardanoResolve"
            className="h-12 w-auto"
          />
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium">
          Sign In
        </Button>
      </div>
    </header>
  );
}
