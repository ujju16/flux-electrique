import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Cpu,
  Laptop,
  Server,
  Smartphone,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services - Flux Electrique",
  description:
    "Découvrez nos services de réparation électronique, développement logiciel et infrastructure DevSecOps.",
};

const serviceDetails = [
  {
    id: "hardware",
    title: "Atelier Hardware",
    subtitle: "Réparation Électronique de Précision",
    icon: <Cpu className="w-12 h-12 text-flux-cyan" />,
    description:
      "Diagnostic et réparation au niveau composant. Nous intervenons sur tous types de cartes électroniques, équipements IoT et matériel critique.",
    features: [
      "Diagnostic précis avec équipement professionnel (oscilloscope, station de soudage)",
      "Micro-soudure et reballing BGA",
      "Réparation de cartes mères (PC, Mac, serveurs)",
      "Reverse engineering de circuits",
      "Maintenance préventive et calibration",
      "Support hardware pour projets IoT custom",
    ],
    tools: [
      "Station Hakko FR-810B",
      "Oscilloscope Rigol DS1054Z",
      "Microscope binoculaire",
      "Multimètre Fluke 87V",
    ],
    color: "border-flux-cyan",
    glow: "shadow-[0_0_30px_rgba(0,229,255,0.15)]",
  },
  {
    id: "software",
    title: "Software Factory",
    subtitle: "Développement Web & Mobile",
    icon: <Smartphone className="w-12 h-12 text-flux-green" />,
    description:
      "Applications modernes, robustes et scalables. Architecture propre, code maintenable et performances optimales.",
    features: [
      "Applications web avec Next.js 16 / React 19",
      "Applications mobiles natives (Kotlin/Android)",
      "API REST et GraphQL avec authentification JWT",
      "Intégration Bluetooth LE et protocoles IoT",
      "Base de données PostgreSQL avec Prisma ORM",
      "Tests automatisés et CI/CD",
    ],
    tools: [
      "Next.js 16 + TypeScript",
      "Kotlin Multiplatform",
      "Prisma + PostgreSQL",
      "Docker + Kubernetes",
    ],
    color: "border-flux-green",
    glow: "shadow-[0_0_30px_rgba(0,200,83,0.15)]",
  },
  {
    id: "devops",
    title: "DevSecOps & Cloud",
    subtitle: "Infrastructure Moderne & Sécurisée",
    icon: <Server className="w-12 h-12 text-purple-400" />,
    description:
      "Automatisation complète du cycle de vie applicatif. Infrastructure as Code, monitoring avancé et sécurité dès la conception.",
    features: [
      "Déploiement sur Google Cloud (GKE Autopilot)",
      "Pipeline CI/CD avec GitLab / Cloud Build",
      "Containerisation Docker multi-stage",
      "Monitoring avec Prometheus & Grafana",
      "Scan de vulnérabilités (Trivy, SonarQube)",
      "Gestion des secrets (Google Secret Manager)",
    ],
    tools: [
      "Kubernetes (GKE)",
      "Terraform / Pulumi",
      "GitLab CI/CD",
      "Prometheus + Grafana",
    ],
    color: "border-purple-500",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.15)]",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-flux-dark text-white pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-flux-panel to-flux-dark border-b border-flux-border">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-flux-dark border border-flux-border mb-6">
            <Zap className="w-4 h-4 text-flux-cyan" />
            <span className="text-xs font-mono text-flux-cyan tracking-wider">
              EXPERTISE COMPLÈTE
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-tech font-bold mb-6">
            <span className="text-white">Services </span>
            <span className="text-flux-cyan">Professionnels</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            De la micro-soudure au déploiement cloud, nous couvrons toute la
            chaîne technique. Une double expertise rare qui fait la différence.
          </p>
        </div>
      </section>

      {/* Services détaillés */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl space-y-24">
          {serviceDetails.map((service, index) => (
            <div
              key={service.id}
              id={service.id}
              className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-12 items-stretch scroll-mt-24`}
            >
              {/* Colonne Gauche - Présentation */}
              <div className="flex-1 flex flex-col space-y-6">
                <div>
                  <div
                    className={`inline-block p-6 rounded-2xl bg-flux-panel border-2 ${service.color} ${service.glow} mb-6`}
                  >
                    {service.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-tech font-bold mb-3">
                      {service.title}
                    </h2>
                    <p className="text-flux-cyan font-medium mb-4">
                      {service.subtitle}
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Outils utilisés */}
                <div className="bg-flux-panel border border-flux-border rounded-lg p-6 mt-auto">
                  <h3 className="text-sm font-mono text-slate-500 mb-4 uppercase tracking-wider">
                    Stack Technique_
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {service.tools.map((tool, i) => (
                      <span
                        key={i}
                        className="text-xs font-mono px-3 py-1.5 rounded bg-flux-dark border border-flux-border text-flux-text"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colonne Droite - Features */}
              <div className="flex-1">
                <div className="bg-flux-panel border border-flux-border rounded-xl p-8 h-full">
                  <h3 className="text-xl font-tech font-bold mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-flux-green" />
                    Points Forts
                  </h3>
                  <ul className="space-y-4">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Zap className="w-4 h-4 text-flux-cyan mt-1 flex-shrink-0" />
                        <span className="text-slate-300 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-flux-panel border-y border-flux-border">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-tech font-bold mb-6">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Contactez-nous pour un devis gratuit et sans engagement. Nous
            analyserons vos besoins et vous proposerons une solution adaptée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="group px-8 py-4 bg-flux-cyan text-flux-dark font-bold rounded-lg hover:bg-flux-cyan/90 transition-all hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] inline-flex items-center justify-center gap-2"
            >
              Demander un devis
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-flux-dark border border-flux-border text-flux-text font-medium rounded-lg hover:border-flux-cyan hover:text-white transition-colors inline-flex items-center justify-center gap-2"
            >
              <Laptop className="w-4 h-4" />
              En savoir plus
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
