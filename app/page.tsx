import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { VisionSection } from "@/components/sections/VisionSection";
import { ActionSection } from "@/components/sections/ActionSection";
import { SolutionsSection } from "@/components/sections/SolutionsSection";

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
      </main>
    </>
  );
}
