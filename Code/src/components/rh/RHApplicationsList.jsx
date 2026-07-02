/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Calendar, ChevronRight, Inbox } from 'lucide-react';

export default function RHApplicationsList({
  applications,
  onSelectApplication,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Toutes');
  const [currentPage, setCurrentPage] = useState(1);

  const filterTabs = [
    'Toutes',
    'Soumise',
    'En revue',
    'Acceptée',
    'Refusée',
  ];

  // 1. Filter by active tab status
  let filtered = applications;
  if (activeTab !== 'Toutes') {
    filtered = applications.filter((app) => app.status === activeTab);
  }

  // 2. Filter by search query (name or internship title)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (app) =>
        app.candidateFirstName.toLowerCase().includes(query) ||
        app.candidateLastName.toLowerCase().includes(query) ||
        app.internshipTitle.toLowerCase().includes(query)
    );
  }

  // 3. Paginate
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset page to first on tab change
  };

  return (
    <div className="flex-grow w-full max-w-5xl mx-auto py-2 flex flex-col gap-5 animate-fade-in pb-10">
      {/* Search and Filter Bar Section */}
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative w-full">
          <label className="sr-only" htmlFor="search-candidates">
            Rechercher par nom ou offre
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-on-surface-variant" />
          </div>
          <input
            id="search-candidates"
            type="text"
            className="w-full h-12 pl-10 pr-4 bg-surface-container border border-[#2E2A4D] rounded-lg text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-[#4c3bcf] focus:ring-1 focus:ring-[#4c3bcf] text-sm transition-colors"
            placeholder="Rechercher par nom de candidat ou titre d'offre..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Filter Pills */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {filterTabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`h-8 px-4 rounded-full font-semibold text-xs border transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#4C3BCF] text-[#e4dfff] border-[#4C3BCF] shadow-sm'
                      : 'bg-surface-container hover:bg-white/5 text-on-surface-variant border-[#2E2A4D]'
                  }`}
                >
                  {tab === 'Soumise' ? 'Soumises' : tab === 'En revue' ? 'En revue' : tab === 'Acceptée' ? 'Acceptées' : tab === 'Refusée' ? 'Refusées' : 'Toutes'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="flex flex-col gap-3">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((app) => {
            const initials = `${app.candidateFirstName.charAt(0)}${app.candidateLastName.charAt(0)}`.toUpperCase();
            const isAccepted = app.status === 'Acceptée';
            const isRejected = app.status === 'Refusée';
            const isInReview = app.status === 'En revue';

            const isLucas = app.candidateFirstName === 'Lucas' && app.candidateLastName === 'Martin';

            return (
              <div
                key={app.id}
                onClick={() => onSelectApplication(app)}
                className="bg-[#1A1730] rounded-xl border border-[#2E2A4D] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#4c3bcf]/50 hover:bg-white/5 transition-all duration-200 cursor-pointer group shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {/* Round avatar */}
                  <div className="w-12 h-12 rounded-full bg-surface-container-high border border-[#2E2A4D] flex items-center justify-center shrink-0 overflow-hidden">
                    {isLucas ? (
                      <img
                        alt="Lucas Martin"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv5Eww0ykPCUToBeRfUaQG6n5temSilBFpPnOLCywJQ1PYKVepaxTnSIN1qZeSjuvOVu3IIOi2TQ0Yox0f059J3XTCPmdVb0aCTlVlxiygdmaJH4aJ1JnUbyU-lISx1Fx7l1WWlmVljLcVgUfF5RDu09Y62EC0Ba9pBx-LDEdTrvxnrZ5297ome7WzG1JVDRfui2DosHDztRQ55MxEMlRh4glocozy6QCc8Qzhdl307D6Zx-lF7SZcavxP_rZEVpGO3Vd-kjomlwfJ"
                      />
                    ) : (
                      <span className="text-sm font-bold text-primary">{initials}</span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                      {app.candidateFirstName} {app.candidateLastName}
                    </h3>
                    <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                      {app.internshipTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="w-3.5 h-3.5 text-[#928fa0]" />
                      <span className="text-[10px] font-semibold text-[#928fa0]">
                        {app.submittedAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 mt-2 sm:mt-0 border-t border-[#2E2A4D]/40 sm:border-t-0 pt-2 sm:pt-0 shrink-0">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      isAccepted
                        ? 'bg-accent-green/10 text-accent-green border-accent-green/20'
                        : isRejected
                        ? 'bg-accent-red/10 text-accent-red border-accent-red/20'
                        : isInReview
                        ? 'bg-secondary-container/10 text-primary border-secondary-container/20'
                        : 'bg-surface-container-highest text-on-surface-variant border-[#2E2A4D]'
                    }`}
                  >
                    {app.status}
                  </span>
                  <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 text-on-surface-variant/50 group-hover:text-on-surface transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-[#2E2A4D] bg-[#1A1730]/30">
            <Inbox className="w-8 h-8 text-on-surface-variant/40 mx-auto mb-2" />
            <p className="text-sm text-on-surface-variant font-medium">
              Aucune candidature reçue ne correspond à ces critères.
            </p>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isCurrent = currentPage === pageNum;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-primary-container text-on-primary-container border-primary-container shadow-md scale-105'
                    : 'bg-surface-container text-on-surface-variant hover:bg-white/5 border-[#2E2A4D]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
            className="w-10 h-10 rounded-lg flex items-center justify-center bg-surface-container text-on-surface-variant hover:bg-white/5 border border-[#2E2A4D] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
