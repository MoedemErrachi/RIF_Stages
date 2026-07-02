/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, Check, X, ClipboardList } from 'lucide-react';

export default function CandidateApplications({ applications }) {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full pb-10 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
          Mes candidatures
        </h1>
      </div>

      <div className="flex flex-col gap-5">
        {applications.length > 0 ? (
          applications.map((app) => {
            const isAccepted = app.status === 'Acceptée';
            const isRejected = app.status === 'Refusée';
            const isInReview = app.status === 'En revue';
            const isSubmitted = app.status === 'Soumise';

            // Determine timeline progress tracker
            let progressPercent = '0%';
            let step1State = 'future';
            let step2State = 'future';
            let step3State = 'future';

            if (isSubmitted) {
              progressPercent = '0%';
              step1State = 'current';
            } else if (isInReview) {
              progressPercent = '33%';
              step1State = 'past';
              step2State = 'current';
            } else if (isAccepted) {
              progressPercent = '100%';
              step1State = 'past';
              step2State = 'past';
              step3State = 'past';
            } else if (isRejected) {
              progressPercent = '100%';
              step1State = 'past';
              step2State = 'past';
              step3State = 'past';
            }

            return (
              <div
                key={app.id}
                className="bg-[#1A1730] border border-[#2E2A4D] rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden group hover:bg-[#221F42] transition-colors duration-200"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
                      {app.internshipTitle}
                    </h3>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{app.submittedAt}</span>
                    </p>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      isAccepted
                        ? 'bg-accent-green/10 text-accent-green border-accent-green/20'
                        : isRejected
                        ? 'bg-accent-red/10 text-accent-red border-accent-red/20'
                        : isInReview
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                        : 'bg-surface-container-highest text-on-surface-variant border-[#2E2A4D]'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="relative mt-4 pt-2 pb-2">
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#2E2A4D] -translate-y-1/2 rounded-full z-0" />
                  
                  <div
                    className={`absolute top-1/2 left-0 h-[2px] -translate-y-1/2 rounded-full z-0 transition-all duration-500 ${
                      isAccepted ? 'bg-accent-green' : isRejected ? 'bg-accent-red' : 'bg-primary-container'
                    }`}
                    style={{ width: progressPercent }}
                  />

                  <div className="flex justify-between relative z-10 w-full">
                    <div className="flex flex-col items-center gap-1 w-1/4">
                      {step1State === 'past' || isAccepted || isRejected ? (
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                          isAccepted ? 'bg-accent-green border-accent-green text-surface' : isRejected ? 'bg-accent-red border-accent-red text-surface' : 'bg-primary-container border-primary-container text-on-primary-container'
                        }`}>
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                      ) : step1State === 'current' ? (
                        <div className="w-5 h-5 rounded-full bg-primary-container border-2 border-primary-container flex items-center justify-center shadow-[0_0_8px_rgba(76,59,207,0.5)]">
                          <div className="w-1.5 h-1.5 rounded-full bg-on-primary-container animate-pulse" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-[#2E2A4D] border-2 border-[#1A1730]" />
                      )}
                      <span className="text-[10px] font-semibold text-on-surface-variant mt-1 text-center hidden sm:block">
                        Soumis
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1 w-1/4">
                      {step2State === 'past' || isAccepted || isRejected ? (
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                          isAccepted ? 'bg-accent-green border-accent-green text-surface' : isRejected ? 'bg-accent-red border-accent-red text-surface' : 'bg-primary-container border-primary-container text-on-primary-container'
                        }`}>
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                      ) : step2State === 'current' ? (
                        <div className="w-5 h-5 rounded-full bg-[#1A1730] border-2 border-primary-container flex items-center justify-center shadow-[0_0_8px_rgba(76,59,207,0.5)]">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-[#2E2A4D] border-2 border-[#1A1730]" />
                      )}
                      <span className={`text-[10px] font-semibold mt-1 text-center hidden sm:block ${step2State === 'current' ? 'text-primary' : 'text-on-surface-variant'}`}>
                        En revue
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1 w-1/4">
                      {step3State === 'past' || isAccepted || isRejected ? (
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                          isAccepted ? 'bg-accent-green border-accent-green text-surface' : isRejected ? 'bg-accent-red border-accent-red text-surface' : 'bg-primary-container border-primary-container text-on-primary-container'
                        }`}>
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-[#2E2A4D] border-2 border-[#1A1730]" />
                      )}
                      <span className="text-[10px] font-semibold text-on-surface-variant mt-1 text-center hidden sm:block">
                        Décision
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1 w-1/4">
                      {isAccepted ? (
                        <div className="w-5 h-5 rounded-full bg-accent-green border-2 border-accent-green flex items-center justify-center text-surface shadow-[0_0_8px_rgba(73,224,149,0.5)]">
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                      ) : isRejected ? (
                        <div className="w-5 h-5 rounded-full bg-accent-red border-2 border-accent-red flex items-center justify-center text-surface shadow-[0_0_8px_rgba(255,92,124,0.5)]">
                          <X className="w-3 h-3" strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-[#2E2A4D] border-2 border-[#1A1730]" />
                      )}
                      <span className={`text-[10px] font-bold mt-1 text-center ${isAccepted ? 'text-accent-green' : isRejected ? 'text-accent-red' : 'text-on-surface-variant'}`}>
                        Résultat
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-xs text-on-surface-variant/80 bg-surface-container/30 rounded-lg p-3">
                  {isAccepted && (
                    <p className="font-medium text-accent-green">
                      Félicitations ! Votre candidature a été acceptée. Notre équipe RH vous a envoyé la convention de stage.
                    </p>
                  )}
                  {isRejected && (
                    <p className="font-medium text-accent-red">
                      Nous vous remercions pour l'intérêt que vous portez à notre entreprise, mais nous avons décidé de ne pas poursuivre sur votre profil pour ce stage.
                    </p>
                  )}
                  {isInReview && (
                    <p className="font-medium text-orange-400">
                      Votre dossier est actuellement examiné avec attention par nos recruteurs. Nous vous recontacterons sous peu.
                    </p>
                  )}
                  {isSubmitted && (
                    <p className="font-medium">
                      Votre candidature a été bien transmise à l'équipe recrutement. Elle sera traitée très prochainement.
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-[#2E2A4D] bg-[#1A1730]/30">
            <ClipboardList className="w-8 h-8 text-on-surface-variant/40 mx-auto mb-2" />
            <p className="text-sm text-on-surface-variant font-medium">
              Vous n'avez pas encore postulé à des offres de stage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
