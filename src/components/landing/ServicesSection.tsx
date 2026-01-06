import { ArrowUpRight, Cpu, Server, Smartphone } from "lucide-react";
import Link from "next/link";

const services = [
  {
    id: 1,
    title: "Atelier Hardware",
    description:
      "Diagnostic précis et réparation de cartes électroniques au composant. Sauvetage de matériel critique.",
    icon: <Cpu className="w-8 h-8 text-flux-cyan" />,
    specs: ["Micro-soudure", "Reballing", "Oscilloscope", "IoT Hardware"],
    color: "group-hover:border-flux-cyan",
    glow: "group-hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]",
    href: "/services#hardware",
  },
  {
    id: 2,
    title: "Software Factory",
    description:
      "Développement d'applications web et mobiles robustes. Architecture propre et code maintenable.",
    icon: <Smartphone className="w-8 h-8 text-flux-green" />,
    specs: ["Next.js 16", "Kotlin/Android", "Prisma ORM", "Bluetooth LE"],
    color: "group-hover:border-flux-green",
    glow: "group-hover:shadow-[0_0_20px_rgba(0,200,83,0.2)]",
    href: "/services#software",
  },
  {
    id: 3,
    title: "DevSecOps & Cloud",
    description:
      "Infrastructure résiliente sur Google Cloud (GKE). Automatisation des déploiements et sécurité.",
    icon: <Server className="w-8 h-8 text-purple-400" />,
    specs: ["Kubernetes", "Docker", "CI/CD Gitlab", "Sécurité Réseau"],
    color: "group-hover:border-purple-500",
    glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]",
    href: "/services#devops",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-flux-dark relative">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* En-tête de section */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-tech font-bold mb-4">
            <span className="text-white">Nos Domaines d'</span>
            <span className="text-flux-cyan border-b-2 border-flux-cyan pb-1">
              Intervention
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Une approche hybride unique, connectant le fer à souder au cloud.
          </p>
        </div>

        {/* Grille des Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className={`group relative bg-flux-panel border border-flux-border rounded-xl p-8 transition-all duration-300 ${service.color} ${service.glow} hover:-translate-y-1 block`}
            >
              {/* Icône flottante avec background */}
              <div className="mb-6 inline-block p-4 rounded-lg bg-flux-dark border border-flux-border shadow-inner group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>

              {/* Titre */}
              <h3 className="text-xl font-tech font-bold text-white mb-3 group-hover:text-flux-cyan transition-colors">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Specs Techniques (Style Chips) */}
              <div className="pt-6 border-t border-dashed border-flux-border/50">
                <span className="text-xs font-mono text-slate-500 mb-3 block uppercase tracking-wider">
                  Specs Techniques_
                </span>
                <div className="flex flex-wrap gap-2">
                  {service.specs.map((spec) => (
                    <span
                      key={spec}
                      className="text-xs font-mono px-2 py-1 rounded bg-flux-dark border border-flux-border text-flux-text group-hover:border-opacity-50 transition-colors"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Petit détail déco "Circuit" dans le coin */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-5 h-5 text-flux-border group-hover:text-flux-cyan" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bouton Voir tout */}
        <div className="mt-16 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-flux-cyan hover:text-white font-medium transition-colors border-b border-transparent hover:border-flux-cyan pb-0.5"
          >
            Explorer l'expertise complète <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
