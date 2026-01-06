"use client";

import { CheckCircle2, Loader2, Send, Zap } from "lucide-react";
import { useActionState } from "react";
import { type ContactState, submitContact } from "@/server/actions/contact";

const initialState: ContactState = {
  success: false,
  message: "",
};

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialState,
  );

  return (
    <main
      className="min-h-screen bg-flux-dark pt-24 pb-12 px-4"
      aria-labelledby="contact-heading"
    >
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            id="contact-heading"
            className="text-4xl md:text-5xl font-tech font-bold text-white mb-4"
          >
            Parlez-nous de votre <span className="text-flux-cyan">Projet</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Réparation complexe ou développement sur-mesure ? <br />
            Remplissez ce formulaire technique pour un chiffrage précis.
          </p>
        </div>

        {/* Card Formulaire */}
        <div className="bg-flux-panel border border-flux-border rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Effet décoratif (Glow) */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-flux-cyan/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          {state.success ? (
            /* --- SUCCESS STATE --- */
            <div
              className="text-center py-12 animate-fade-in-up"
              role="status"
              aria-live="polite"
              aria-label="Formulaire soumis avec succès"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-flux-green/10 border border-flux-green mb-6">
                <CheckCircle2 className="w-10 h-10 text-flux-green" />
              </div>
              <h2 className="text-2xl font-tech font-bold text-white mb-2">
                Transmission Réussie
              </h2>
              <p className="text-slate-400 mb-8">{state.message}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-flux-cyan hover:text-white underline underline-offset-4"
                aria-label="Envoyer une nouvelle demande de contact"
              >
                Envoyer une nouvelle demande
              </button>
            </div>
          ) : (
            /* --- FORM STATE --- */
            <form
              action={formAction}
              className="space-y-8 relative z-10"
              aria-label="Formulaire de demande de devis"
            >
              {/* Section 1: Le Besoin */}
              <fieldset className="space-y-4">
                <legend className="text-flux-cyan font-mono text-sm uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4" /> 01. Définition du besoin
                </legend>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Service Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 block">
                      Type de Service
                      <select
                        name="type"
                        className="w-full bg-flux-dark border border-flux-border rounded-lg px-4 py-3 text-white focus:border-flux-cyan focus:ring-1 focus:ring-flux-cyan outline-none transition-all appearance-none mt-2"
                      >
                      <option value="HARDWARE_REPAIR">
                        🛠️ Réparation Électronique
                      </option>
                      <option value="SOFTWARE_DEV">
                        💻 Développement Logiciel
                      </option>
                      <option value="DEVSECOPS_CONSULTING">
                        🛡️ Audit & DevOps
                      </option>
                      <option value="OTHER">Autre demande</option>
                      </select>
                    </label>
                  </div>

                  {/* Designation (Désignation technique) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 block">
                      Désignation / Sujet
                      <input
                        type="text"
                        name="designation"
                        placeholder="Ex: Carte Mère A1278 ou App Mobile..."
                        className="w-full bg-flux-dark border border-flux-border rounded-lg px-4 py-3 text-white focus:border-flux-cyan focus:ring-1 focus:ring-flux-cyan outline-none transition-all placeholder:text-slate-600 mt-2"
                      />
                    </label>
                    {state.errors?.designation && (
                      <p
                        id="designation-error"
                        className="text-red-400 text-xs"
                        role="alert"
                      >
                        {state.errors.designation}
                      </p>
                    )}
                  </div>
                </div>

                {/* Budget & Urgency */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-300">
                    Budget Estimatif
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Radio buttons stylisés comme des badges */}
                    {[
                      { val: "LESS_THAN_500", label: "< 500€" },
                      { val: "FROM_500_TO_2K", label: "500-2k€" },
                      { val: "FROM_2K_TO_10K", label: "2k-10k€" },
                      { val: "MORE_THAN_10K", label: "> 10k€" },
                    ].map((b) => (
                      <label key={b.val} className="cursor-pointer">
                        <input
                          type="radio"
                          name="budget"
                          value={b.val}
                          className="peer sr-only"
                        />
                        <div className="text-center text-sm py-2 rounded border border-flux-border bg-flux-dark text-slate-400 peer-checked:border-flux-green peer-checked:text-flux-green peer-checked:bg-flux-green/10 transition-all hover:border-slate-500">
                          {b.label}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </fieldset>

              <hr className="border-flux-border/50" />

              {/* Section 2: Identité */}
              <fieldset className="space-y-4">
                <legend className="text-flux-cyan font-mono text-sm uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4" /> 02. Vos Coordonnées
                </legend>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 block">
                      Nom complet
                      <input
                        required
                        name="name"
                        type="text"
                        className="w-full bg-flux-dark border border-flux-border rounded-lg px-4 py-3 text-white focus:border-flux-cyan focus:ring-1 focus:ring-flux-cyan outline-none transition-all placeholder:text-slate-600 mt-2"
                        placeholder="John Doe"
                      />
                    </label>
                    {state.errors?.name && (
                      <p className="text-red-400 text-xs">
                        {state.errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Email pro
                    </label>
                    <input
                      required
                      name="email"
                      type="email"
                      className="w-full bg-flux-dark border border-flux-border rounded-lg px-4 py-3 text-white focus:border-flux-cyan focus:ring-1 focus:ring-flux-cyan outline-none transition-all placeholder:text-slate-600"
                      placeholder="john@company.com"
                    />
                    {state.errors?.email && (
                      <p className="text-red-400 text-xs">
                        {state.errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 block">
                      Téléphone (Optionnel)
                      <input
                        name="phone"
                        type="tel"
                        className="w-full bg-flux-dark border border-flux-border rounded-lg px-4 py-3 text-white focus:border-flux-cyan focus:ring-1 focus:ring-flux-cyan outline-none transition-all placeholder:text-slate-600 mt-2"
                        placeholder="06..."
                      />
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 block">
                      Société (Optionnel)
                      <input
                        name="company"
                        type="text"
                        className="w-full bg-flux-dark border border-flux-border rounded-lg px-4 py-3 text-white focus:border-flux-cyan focus:ring-1 focus:ring-flux-cyan outline-none transition-all placeholder:text-slate-600 mt-2"
                        placeholder="Flux Corp"
                      />
                    </label>
                  </div>
                </div>
              </fieldset>

              {/* Section 3: Message */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 block">
                  Détails techniques du projet / panne
                  <textarea
                    name="message"
                    rows={5}
                    className="w-full bg-flux-dark border border-flux-border rounded-lg px-4 py-3 text-white focus:border-flux-cyan focus:ring-1 focus:ring-flux-cyan outline-none transition-all placeholder:text-slate-600 resize-none mt-2"
                    placeholder="Décrivez les symptômes, les contraintes techniques ou les fonctionnalités attendues..."
                  />
                </label>
                {state.errors?.message && (
                  <p className="text-red-400 text-xs">{state.errors.message}</p>
                )}
              </div>

              {/* Error Global */}
              {!state.success && state.message && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-200 text-sm text-center">
                  {state.message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-gradient-to-r from-flux-cyan to-blue-600 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                aria-label={isPending ? "Envoi en cours" : "États"}
                aria-busy={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Transmission en
                    cours...
                  </>
                ) : (
                  <>
                    Envoyer la demande <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
