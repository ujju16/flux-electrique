"use client";

import { Menu, X, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Accueil", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Blog", href: "/blog" },
  { name: "À Propos", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-flux-border bg-flux-dark/80 backdrop-blur-md supports-[backdrop-filter]:bg-flux-dark/60"
      aria-label="Navigation principale"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          {/* --- LOGO --- */}
          <Link
            href="/"
            className="flex items-center gap-2 font-tech text-xl font-bold text-white hover:opacity-80 transition-opacity"
            aria-label="Flux Electrique - Retour à l'accueil"
          >
            <Zap className="h-6 w-6 text-flux-cyan" fill="currentColor" />
            <span>
              FLUX<span className="text-flux-cyan">ELECTRIQUE</span>
            </span>
          </Link>

          {/* --- DESKTOP NAV --- */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-flux-text hover:text-flux-cyan transition-colors"
                aria-label={`Naviguer vers ${link.name}`}
              >
                {link.name}
              </Link>
            ))}

            {/* CTA Button */}
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-bold text-flux-dark bg-flux-cyan rounded hover:bg-flux-cyan/80 transition-colors shadow-[0_0_10px_rgba(0,229,255,0.3)]"
              aria-label="Obtenir un devis gratuit"
            >
              Devis Gratuit
            </Link>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <button
            className="md:hidden text-flux-text hover:text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU (Drawer) --- */}
      <div
        id="mobile-menu"
        className={cn(
          "md:hidden absolute top-16 left-0 w-full bg-flux-panel border-b border-flux-border overflow-hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex flex-col p-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-medium text-flux-text hover:text-flux-cyan pl-2 border-l-2 border-transparent hover:border-flux-cyan transition-all"
              aria-label={`Naviguer vers ${link.name}`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 block w-full text-center py-3 bg-flux-cyan/10 border border-flux-cyan text-flux-cyan font-bold rounded hover:bg-flux-cyan hover:text-black transition-colors"
            aria-label="Demander un devis gratuit"
          >
            Demander un Devis
          </Link>
        </div>
      </div>
    </nav>
  );
}
