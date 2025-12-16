import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { CreateAliasSection } from "./components/CreateAliasSection";
import { ExplorerSection } from "./components/ExplorerSection";
// import { ShortenSection } from "./components/ShortenSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { Footer } from "./components/Footer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { VerificationPage } from "./components/VerificationPage";
import { DebugVerification } from "./components/DebugVerification";

function HomePage() {
  return (
    <>
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
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/verify-subscription/:token"
              element={<VerificationPage />}
            />
            <Route path="/debug-verification" element={<DebugVerification />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
