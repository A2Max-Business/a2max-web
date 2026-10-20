import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { VisionSection } from "@/components/sections/VisionSection";
import { ActionSection } from "@/components/sections/ActionSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProblemSection />
        <VisionSection />
        <ActionSection />
      </main>
    </>
  );
}
