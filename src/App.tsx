import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { CreateAliasSection } from "./components/CreateAliasSection";
import { ExplorerSection } from "./components/ExplorerSection";
// import { ShortenSection } from "./components/ShortenSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { Footer } from "./components/Footer";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <HeroSection />
          <ErrorBoundary>
            <CreateAliasSection />
          </ErrorBoundary>
          <ErrorBoundary>
            <ExplorerSection />
          </ErrorBoundary>
          {/* <ShortenSection /> */}
          <FeaturesSection />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
