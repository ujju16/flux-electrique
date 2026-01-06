import Link from "next/link";
import { ArrowRight, Cpu, Code2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* --- BACKGROUND ELEMENTS --- */}
      {/* Grille technique */}
      <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none" />

      {/* Halo lumineux central (Cyan) */}
      <div className="absolute inset-0 glow-effect z-0 pointer-events-none" />

      {/* Dégradé noir en bas pour fondre vers la section suivante */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-flux-dark to-transparent z-10" />

      {/* --- CONTENT --- */}
      <div className="container mx-auto px-4 z-20 relative text-center max-w-5xl">
        {/* Badge "Dispo" */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-flux-panel border border-flux-border mb-8 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-flux-green opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-flux-green" />
          </span>
          <span className="text-xs font-mono text-flux-green tracking-wider">
            SYSTÈMES OPÉRATIONNELS
          </span>
        </div>

        {/* Titre Principal */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-tech mb-6 tracking-tight">
          <span className="text-white">Réparation </span>
          <span className="text-flux-cyan drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">
            Hardware
          </span>
          <br />
          <span className="text-white">& Dev </span>
          <span className="text-flux-green drop-shadow-[0_0_15px_rgba(0,200,83,0.4)]">
            Logiciel
          </span>
        </h1>

        {/* Sous-titre */}
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Flux Electrique fusionne l'électronique de précision et le
          développement moderne. De la micro-soudure au déploiement Kubernetes,
          nous maîtrisons toute la chaîne.
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Bouton Primaire (Contact) */}
          <Link
            href="/contact"
            className="group relative px-8 py-4 bg-flux-cyan/10 border border-flux-cyan text-flux-cyan font-bold rounded-md overflow-hidden transition-all hover:bg-flux-cyan hover:text-black hover:shadow-[0_0_20px_rgba(0,229,255,0.6)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Demander un devis{" "}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Bouton Secondaire (Services) */}
          <Link
            href="/services"
            className="px-8 py-4 bg-flux-panel border border-flux-border text-gray-300 rounded-md hover:border-gray-500 hover:text-white transition-colors flex items-center gap-2"
          >
            <Cpu className="w-4 h-4" /> Nos Services
          </Link>
        </div>

        {/* Tech Stack Icons (Visuel rapide) */}
        <div className="mt-16 pt-8 border-t border-flux-border/30 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5" /> Next.js 16
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5" /> Micro-Elec
          </div>
          <div className="flex items-center gap-2">GKE Kubernetes</div>
        </div>
      </div>
    </section>
  );
}
