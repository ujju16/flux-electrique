import Hero from "@/components/landing/Hero";
import ServicesSection from "@/components/landing/ServicesSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-flux-dark text-white selection:bg-flux-cyan selection:text-black">
      <Hero />
      <ServicesSection />
    </main>
  );
}
