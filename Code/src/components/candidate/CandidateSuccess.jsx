/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, LayoutDashboard, Check } from 'lucide-react';

export default function CandidateSuccess({
  onGoToDashboard,
  onGoToHome,
}) {
  return (
    <div className="max-w-md mx-auto flex flex-col items-center justify-center text-center py-8 relative overflow-hidden">
      {/* Background glow blur */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center opacity-30">
        <div className="absolute w-[800px] h-[800px] bg-tertiary-container/20 rounded-full blur-[120px]" />
      </div>

      <div className="z-10 flex flex-col items-center">
        {/* Success Checkmark Circle with pulse anim */}
        <div className="w-32 h-32 mb-8 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-tertiary/15 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <div className="w-24 h-24 rounded-full bg-tertiary/10 border-4 border-tertiary flex items-center justify-center relative shadow-[0_0_30px_rgba(73,224,149,0.2)]">
            <Check className="w-12 h-12 text-tertiary animate-bounce" strokeWidth={3} />
          </div>
        </div>

        {/* Text */}
        <div className="mb-8 space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight leading-tight">
            Candidature envoyée avec succès!
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-sm mx-auto leading-relaxed">
            Vous recevrez un email de confirmation contenant les détails de votre candidature prochainement.
          </p>
        </div>

        {/* CTA Actions */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onGoToDashboard}
            className="w-full h-12 bg-primary-container text-[#e4dfff] font-semibold text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-[#5546D8] hover:shadow-lg transition-all border border-[#2E2A4D] cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Voir mon espace (Mes candidatures)</span>
          </button>

          <button
            onClick={onGoToHome}
            className="w-full h-12 bg-surface-container text-primary font-semibold text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-white/5 transition-all border border-[#2E2A4D] cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
