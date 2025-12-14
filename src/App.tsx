import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { CreateAliasSection } from "./components/CreateAliasSection";
import { ExplorerSection } from "./components/ExplorerSection";
// import { ShortenSection } from "./components/ShortenSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <CreateAliasSection />
        <ExplorerSection />
        {/* <ShortenSection /> */}
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
