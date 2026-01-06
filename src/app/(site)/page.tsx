import Hero from "@/components/landing/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-flux-dark text-white selection:bg-flux-cyan selection:text-black">
      <Hero />

      {/* Placeholder pour la suite */}
      <section className="py-20 text-center">
        <h2 className="text-2xl font-tech text-flux-green">
          Initialisation des modules...
        </h2>
      </section>
    </main>
  );
}
