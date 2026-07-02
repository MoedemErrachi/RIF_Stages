/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function RHDashboard({
  applications,
  onNavigateToApplications,
  onSelectApplication,
}) {
  // Compute metrics from local applications array
  const totalCount = applications.length;
  const pendingCount = applications.filter((app) => app.status === 'Soumise' || app.status === 'En revue').length;
  const acceptedCount = applications.filter((app) => app.status === 'Acceptée').length;
  const rejectedCount = applications.filter((app) => app.status === 'Refusée').length;

  // Take the 3 most recent applications
  const recentApps = [...applications].slice(0, 3);

  return (
    <div className="flex-grow w-full max-w-5xl mx-auto py-2 flex flex-col gap-6 animate-fade-in pb-10">
      <header className="mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-1">
          Tableau de bord
        </h2>
        <p className="text-sm text-on-surface-variant font-medium">
          Aperçu général des candidatures.
        </p>
      </header>

      {/* Bento Grid Metrics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric Card 1 */}
        <div className="bg-[#1A1730] border border-[#2E2A4D] rounded-xl p-4 flex flex-col justify-between hover:bg-[#221F42] transition-all relative overflow-hidden group shadow-md">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary-container/10 rounded-full blur-2xl group-hover:bg-primary-container/20 transition-all duration-500" />
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Total candidatures
            </span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <span className="text-3xl font-bold text-primary">
            {totalCount}
          </span>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-[#1A1730] border border-[#2E2A4D] rounded-xl p-4 flex flex-col justify-between hover:bg-[#221F42] transition-all relative overflow-hidden group shadow-md">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all duration-500" />
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              En attente
            </span>
            <Clock className="w-4 h-4 text-orange-400" />
          </div>
          <span className="text-3xl font-bold text-orange-400">
            {pendingCount}
          </span>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-[#1A1730] border border-[#2E2A4D] rounded-xl p-4 flex flex-col justify-between hover:bg-[#221F42] transition-all relative overflow-hidden group shadow-md">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-accent-green/10 rounded-full blur-2xl group-hover:bg-accent-green/20 transition-all duration-500" />
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Acceptées
            </span>
            <CheckCircle className="w-4 h-4 text-accent-green" />
          </div>
          <span className="text-3xl font-bold text-accent-green">
            {acceptedCount}
          </span>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-[#1A1730] border border-[#2E2A4D] rounded-xl p-4 flex flex-col justify-between hover:bg-[#221F42] transition-all relative overflow-hidden group shadow-md">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-accent-red/10 rounded-full blur-2xl group-hover:bg-accent-red/20 transition-all duration-500" />
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Refusées
            </span>
            <XCircle className="w-4 h-4 text-accent-red" />
          </div>
          <span className="text-3xl font-bold text-accent-red">
            {rejectedCount}
          </span>
        </div>
      </section>

      {/* List Section: Dernières candidatures reçues */}
      <section className="bg-[#1A1730] border border-[#2E2A4D] rounded-xl overflow-hidden shadow-lg mt-2">
        <div className="p-4 border-b border-[#2E2A4D] bg-[#221F42]/50">
          <h3 className="text-base font-bold text-on-surface">
            Dernières candidatures reçues
          </h3>
        </div>

        <div className="divide-y divide-[#2E2A4D]">
          {recentApps.map((app) => {
            const initials = `${app.candidateFirstName.charAt(0)}${app.candidateLastName.charAt(0)}`.toUpperCase();
            const isAccepted = app.status === 'Acceptée';
            const isRejected = app.status === 'Refusée';

            return (
              <div
                key={app.id}
                onClick={() => onSelectApplication(app)}
                className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  {/* Round initials avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#1b1931] border border-[#2E2A4D] flex items-center justify-center text-primary font-bold text-xs">
                    <span>{initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                      {app.candidateFirstName} {app.candidateLastName}
                    </p>
                    <p className="text-xs text-on-surface-variant font-medium">
                      {app.internshipTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      isAccepted
                        ? 'bg-accent-green/10 text-accent-green border-accent-green/20'
                        : isRejected
                        ? 'bg-accent-red/10 text-accent-red border-accent-red/20'
                        : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}
                  >
                    {app.status === 'Soumise' ? 'En attente' : app.status}
                  </span>
                  <ArrowRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-on-surface group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t border-[#2E2A4D] bg-[#221F42]/30 text-center">
          <button
            onClick={onNavigateToApplications}
            className="text-xs font-bold text-primary hover:text-[#cac5ff] transition-colors py-2 px-4 rounded-lg hover:bg-white/5 cursor-pointer inline-flex items-center gap-1"
          >
            <span>Voir toutes les candidatures</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
