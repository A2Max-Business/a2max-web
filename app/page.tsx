import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { VisionSection } from "@/components/sections/VisionSection";
import { ActionSection } from "@/components/sections/ActionSection";
import { SolutionsSection } from "@/components/sections/SolutionsSection";
import { PeopleSection } from "@/components/sections/PeopleSection";
import { ResultsSection } from "@/components/sections/ResultsSection";
import { EcosystemSection } from "@/components/sections/EcosystemSection";
import { BlogShowcaseSection } from "@/components/sections/BlogShowcaseSection";
import { DiagnosisSection } from "@/components/sections/DiagnosisSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProblemSection />
        <VisionSection />
        <ActionSection />
        <SolutionsSection />
        <PeopleSection />
        <ResultsSection />
        <EcosystemSection />
        <BlogShowcaseSection />
        <DiagnosisSection />
      </main>
      <Footer />
    </>
  );
}

