/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, Unlock, Users, Plus, X, ListFilter, Trash2 } from 'lucide-react';

export default function RHOffersList({
  internships,
  onToggleStatus,
  onAddOffer,
  onDeleteOffer,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [specialty, setSpecialty] = useState('Développement Web');
  const [duration, setDuration] = useState('3 mois');
  const [location, setLocation] = useState('Paris / Hybride');
  const [description, setDescription] = useState('');
  const [skillsStr, setSkillsStr] = useState('React, Node.js');
  const [reqsStr, setReqsStr] = useState(
    "Étudiant(e) en master informatique (Bac+4/5)\nPremière expérience concrète avec React"
  );
  const [error, setError] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Veuillez remplir le titre et la description.');
      return;
    }

    const skills = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const requirements = reqsStr
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    onAddOffer({
      title,
      company: 'TechCorp Solutions',
      specialty,
      duration,
      location,
      description,
      status: 'Ouverte',
      skills,
      requirements,
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setSkillsStr('React, Node.js');
    setReqsStr('');
    setError('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex-grow w-full max-w-5xl mx-auto py-2 flex flex-col gap-6 animate-fade-in pb-10 relative">
      {/* List Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-1">
            Offres de stage
          </h2>
          <p className="text-sm text-on-surface-variant font-medium">
            Gestion et publication des offres.
          </p>
        </div>

        {/* Filter button */}
        <div className="hidden sm:flex gap-2">
          <button className="h-10 px-4 bg-surface-container border border-outline rounded-lg flex items-center gap-2 hover:bg-white/5 transition-colors text-xs font-semibold text-on-surface cursor-pointer">
            <ListFilter className="w-4 h-4 text-on-surface" />
            <span>Filtrer</span>
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {internships.map((item) => {
          const isOpen = item.status === 'Ouverte';
          return (
            <article
              key={item.id}
              className={`bg-[#1A1730] border rounded-xl p-5 flex flex-col gap-5 relative group transition-all duration-300 ${
                isOpen
                  ? 'border-[#2E2A4D] hover:border-[#928fa0]'
                  : 'border-[#2E2A4D]/40 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col gap-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-on-surface truncate">
                    {item.title}
                  </h3>
                  <div className="flex gap-2 items-center flex-wrap mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-secondary-container/20 text-on-secondary-container border border-secondary-container/30">
                      {item.specialty}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        isOpen
                          ? 'bg-accent-green/10 text-accent-green border-accent-green/20'
                          : 'bg-surface-container-highest text-on-surface-variant border-[#2E2A4D]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Card Top Right Quick Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onToggleStatus(item.id)}
                    className="p-1.5 rounded hover:bg-white/5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    title={isOpen ? 'Fermer les candidatures (Verrouiller)' : 'Ouvrir les candidatures'}
                  >
                    {isOpen ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4 text-[#3DD68C]" />}
                  </button>
                  <button
                    onClick={() => onDeleteOffer(item.id)}
                    className="p-1.5 rounded hover:bg-white/5 text-on-surface-variant hover:text-accent-red transition-colors cursor-pointer"
                    title="Supprimer l'offre"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Specs row */}
              <div className="text-xs text-[#928fa0] flex flex-wrap gap-x-4 gap-y-1 font-semibold border-t border-[#2E2A4D]/40 pt-3">
                <span className="flex items-center gap-1">📍 {item.location}</span>
                <span className="flex items-center gap-1">⏱️ {item.duration}</span>
              </div>

              {/* Card Footer Metrics */}
              <div className="mt-auto pt-4 border-t border-[#2E2A4D] flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 text-on-surface-variant font-semibold">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span>{item.applicantsCount} candidatures</span>
                </div>
                <span className="text-on-surface-variant/60 font-semibold">
                  {isOpen ? `Il y a ${item.publishedAt.replace('Il y a ', '')}` : item.publishedAt}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 lg:bottom-8 right-6 lg:right-8 w-14 h-14 bg-primary-container hover:bg-[#5546D8] text-on-primary-container rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all z-40 cursor-pointer border border-[#2E2A4D]"
        title="Ajouter une offre"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Add Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="bg-[#1A1730] border border-[#2E2A4D] rounded-xl w-full max-w-lg p-6 relative z-10 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              <span>Créer une nouvelle offre de stage</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              {error && (
                <div className="p-3 bg-accent-red/10 border border-accent-red/20 rounded-lg text-accent-red text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="offer-title">
                  Intitulé du poste
                </label>
                <input
                  id="offer-title"
                  type="text"
                  required
                  placeholder="Ex: Développeur React Junior"
                  className="h-10 px-3 bg-[#0D0B1A] border border-[#2E2A4D] rounded-lg text-sm text-on-surface focus:outline-none focus:border-[#4C3BCF] transition-colors"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Specialty & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="offer-spec">
                    Spécialité
                  </label>
                  <select
                    id="offer-spec"
                    className="h-10 px-3 bg-[#0D0B1A] border border-[#2E2A4D] rounded-lg text-sm text-on-surface focus:outline-none focus:border-[#4C3BCF] transition-colors"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                  >
                    <option value="Développement Web">Développement Web</option>
                    <option value="Infrastructure">Infrastructure / Cloud</option>
                    <option value="Marketing">Marketing / SEO</option>
                    <option value="Design">UX/UI Design</option>
                    <option value="Data">Data Science</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="offer-loc">
                    Localisation
                  </label>
                  <input
                    id="offer-loc"
                    type="text"
                    required
                    placeholder="Ex: Tunis / Hybride"
                    className="h-10 px-3 bg-[#0D0B1A] border border-[#2E2A4D] rounded-lg text-sm text-on-surface focus:outline-none focus:border-[#4C3BCF] transition-colors"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="offer-dur">
                  Durée
                </label>
                <input
                  id="offer-dur"
                  type="text"
                  required
                  placeholder="Ex: 3 mois, 6 mois..."
                  className="h-10 px-3 bg-[#0D0B1A] border border-[#2E2A4D] rounded-lg text-sm text-on-surface focus:outline-none focus:border-[#4C3BCF] transition-colors"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="offer-desc">
                  Description de la mission
                </label>
                <textarea
                  id="offer-desc"
                  rows={3}
                  required
                  placeholder="Décrivez les missions principales..."
                  className="p-3 bg-[#0D0B1A] border border-[#2E2A4D] rounded-lg text-sm text-on-surface focus:outline-none focus:border-[#4C3BCF] transition-colors resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Skills */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="offer-skills">
                  Compétences (séparées par des virgules)
                </label>
                <input
                  id="offer-skills"
                  type="text"
                  placeholder="React, Node.js, Tailwind, Git"
                  className="h-10 px-3 bg-[#0D0B1A] border border-[#2E2A4D] rounded-lg text-sm text-on-surface focus:outline-none focus:border-[#4C3BCF] transition-colors"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                />
              </div>

              {/* Requirements */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="offer-reqs">
                  Exigences du profil (une par ligne)
                </label>
                <textarea
                  id="offer-reqs"
                  rows={2}
                  placeholder="Ex: Étudiant(e) en école d'ingénieur&#10;Bon esprit d'équipe"
                  className="p-3 bg-[#0D0B1A] border border-[#2E2A4D] rounded-lg text-sm text-on-surface focus:outline-none focus:border-[#4C3BCF] transition-colors resize-none"
                  value={reqsStr}
                  onChange={(e) => setReqsStr(e.target.value)}
                />
              </div>

              {/* Create Button */}
              <button
                type="submit"
                className="h-11 w-full bg-[#4C3BCF] hover:bg-[#5546D8] text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Publier l'offre de stage
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
