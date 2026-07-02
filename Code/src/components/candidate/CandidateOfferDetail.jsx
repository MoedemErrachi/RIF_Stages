/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Terminal, MapPin, Clock, Code, Check, Send, ArrowLeft } from 'lucide-react';

export default function CandidateOfferDetail({
  internship,
  onBack,
  onApply,
}) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 flex flex-col pb-28 relative">
      {/* Mobile-back inline header context */}
      <div className="flex items-center gap-2 lg:hidden mb-1">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-white/5 text-primary active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Retour aux offres
        </span>
      </div>

      {/* Hero Context */}
      <div className="flex flex-col gap-3">
        {/* Simulated Tech Banner */}
        <div
          className="w-full h-32 rounded-xl bg-surface-container-high border border-[#2E2A4D] bg-cover bg-center shadow-inner relative overflow-hidden"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDbxyPW-OZ0053_tvhzInxC0T30jihW3p3z5yw41pI3u_izTspp_ZSdLLBsYhsd3Duq8jaWzvTU1sGTmVeMEjBbLmoxCXbU_eTJFiIZTX5xcwLEgxHbuEA7kgjAwKLpiokeZqCY3ZZRaYZgcQZlVEwbPVJ9upvihJb7hxmv4nXVaZUeY53dhkCRrPxZndJs2A5TsF10kkeKSlrTz-sOBrzhVumHrOFI8KTVk1fDA7h60zEBR-6TGO7fYRrh6UpKFqMZVVf-3DtENFys')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center border border-[#2E2A4D] shadow-md">
              <Terminal className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-bold text-on-surface-variant bg-background/80 backdrop-blur px-2.5 py-1 rounded">
              {internship.company}
            </span>
          </div>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-2 mt-1">
          <div className="inline-flex items-center gap-1.5 bg-[#4c3bcf]/10 text-[#c8bfff] px-3.5 py-1.5 rounded-full text-xs font-medium border border-[#4c3bcf]/20">
            <Code className="w-3.5 h-3.5 text-primary" />
            <span>Spécialité : {internship.specialty}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-[#49e095]/10 text-[#49e095] px-3.5 py-1.5 rounded-full text-xs font-medium border border-[#49e095]/20">
            <Clock className="w-3.5 h-3.5 text-accent-green" />
            <span>Durée : {internship.duration}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-surface-container-highest text-on-surface-variant px-3.5 py-1.5 rounded-full text-xs font-medium border border-outline-variant/30">
            <MapPin className="w-3.5 h-3.5 text-[#928fa0]" />
            <span>{internship.location}</span>
          </div>
        </div>
      </div>

      {/* Section: Description du poste */}
      <section className="bg-[#1A1730] border border-[#2E2A4D] rounded-xl p-5 relative overflow-hidden group hover:border-[#4C3BCF]/30 transition-colors duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <h2 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary shrink-0" />
          <span>Description du poste</span>
        </h2>
        <p className="text-sm text-on-surface-variant leading-relaxed font-sans whitespace-pre-line">
          {internship.description}
        </p>

        {/* Skills Tag block */}
        <div className="flex gap-2 mt-5 flex-wrap">
          {internship.skills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 bg-surface-container-low rounded font-semibold text-xs text-primary border border-primary/20"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Section: Profil recherché */}
      <section className="bg-[#1A1730] border border-[#2E2A4D] rounded-xl p-5">
        <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-accent-green shrink-0" />
          <span>Profil recherché</span>
        </h2>
        <ul className="space-y-3">
          {internship.requirements.map((req, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low/50 border border-transparent hover:border-[#2E2A4D] transition-colors"
            >
              <div className="mt-0.5 w-6 h-6 rounded bg-primary-container/20 flex items-center justify-center shrink-0 border border-primary/30">
                <Check className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-sm text-on-surface-variant leading-relaxed">
                {req}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Fixed bottom CTA bar */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-background/85 backdrop-blur-md border-t border-[#2E2A4D] z-30 flex justify-center pb-safe">
        <button
          onClick={onApply}
          className="h-12 w-full max-w-md bg-[#4C3BCF] text-[#e4dfff] rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(76,59,207,0.25)] hover:bg-[#5546d8] hover:shadow-[0_0_32px_rgba(76,59,207,0.4)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <span>Postuler maintenant</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
