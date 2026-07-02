/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, ArrowRight, MapPin, Clock, Star } from 'lucide-react';
import { timeAgo } from '../../utils/timeAgo.js';

export default function CandidateExplore({ internships, onSelectOffer }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Only show open internships for the exploration feed
  const availableInternships = internships.filter(
    (item) => item.status === 'Ouverte'
  );

  const filteredInternships = availableInternships.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.title?.toLowerCase().includes(query) ||
      item.specialty?.toLowerCase().includes(query) ||
      (item.skills || []).some((skill) => skill.toLowerCase().includes(query)) ||
      item.description?.toLowerCase().includes(query) ||
      item.location?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full pb-10">
      {/* Header section */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
          Offres de stage disponibles
        </h1>

        {/* Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-on-surface-variant" />
          </div>
          <input
            type="text"
            className="w-full h-12 pl-10 pr-4 bg-surface-container rounded-lg border border-[#2E2A4D] text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-[#4C3BCF] focus:ring-1 focus:ring-[#4C3BCF] transition-colors text-sm shadow-sm"
            placeholder="Rechercher une offre, compétence (React, AWS, SEO...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Internship List */}
      <div className="flex flex-col gap-4">
        {filteredInternships.length > 0 ? (
          filteredInternships.map((item) => (
            <article
              key={item.id}
              className="bg-[#1A1730] rounded-xl border border-[#2E2A4D] p-5 hover:border-[#4C3BCF]/50 transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-bold text-primary group-hover:text-[#cac5ff] transition-colors">
                    {item.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                    <span>{item.company}</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant/50" />
                    <span>Spécialité: {item.specialty}</span>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent-green/10 text-accent-green border border-accent-green/20 shrink-0">
                  Ouverte
                </span>
              </div>

              <p className="text-sm text-on-surface-variant/90 mb-5 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              {/* Badges footer row */}
              <div className="flex flex-wrap gap-2 mb-5">
                <div className="inline-flex items-center gap-1 bg-[#121028] text-on-surface-variant/80 px-2 py-1 rounded text-xs border border-[#2E2A4D]">
                  <MapPin className="w-3.5 h-3.5 text-secondary" />
                  <span>{item.location}</span>
                </div>
                <div className="inline-flex items-center gap-1 bg-[#121028] text-on-surface-variant/80 px-2 py-1 rounded text-xs border border-[#2E2A4D]">
                  <Clock className="w-3.5 h-3.5 text-accent-green" />
                  <span>{item.duration}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#2E2A4D]/50">
                <span className="text-xs text-on-surface-variant/60 font-medium">
                  {timeAgo(item.publishedAt)}
                </span>

                <button
                  onClick={() => onSelectOffer(item)}
                  className="w-full sm:w-auto h-10 bg-[#4C3BCF] text-white px-5 rounded-lg text-xs font-semibold hover:bg-[#5546D8] transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer"
                >
                  <span>Voir l'offre</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-[#2E2A4D] bg-[#1A1730]/30">
            <Star className="w-8 h-8 text-on-surface-variant/40 mx-auto mb-2" />
            <p className="text-sm text-on-surface-variant font-medium">
              Aucune offre de stage ne correspond à votre recherche.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-primary font-bold mt-2 hover:underline cursor-pointer"
            >
              Réinitialiser la recherche
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
