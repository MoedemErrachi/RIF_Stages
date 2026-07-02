/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { ArrowLeft, UploadCloud, FileText, Trash2 } from 'lucide-react';

export default function CandidateApply({
  internship,
  onBack,
  onSubmitSuccess,
}) {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [motivation, setMotivation] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [cvSimulatedName, setCvSimulatedName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);
  const maxLength = 2000;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setCvFile(file);
        setCvSimulatedName(file.name);
        setError('');
      } else {
        setError('Veuillez sélectionner un fichier au format PDF uniquement.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setCvFile(file);
        setCvSimulatedName(file.name);
        setError('');
      } else {
        setError('Veuillez sélectionner un fichier au format PDF uniquement.');
      }
    }
  };

  const simulateCVUpload = () => {
    const randomCVNames = ['Curriculum_Vitae_Ingenieur.pdf', 'CV_Developpeur_Web_2026.pdf', 'Ahmed_CV_Fullstack.pdf'];
    const randomCVName = randomCVNames[Math.floor(Math.random() * randomCVNames.length)];
    setCvSimulatedName(randomCVName);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!lastName.trim() || !firstName.trim() || !phone.trim() || !motivation.trim()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (!cvSimulatedName) {
      setError('Veuillez uploader ou choisir votre Curriculum Vitae (CV).');
      return;
    }

    onSubmitSuccess({
      lastName,
      firstName,
      phone: `+216 ${phone}`,
      cvName: cvSimulatedName,
      motivation,
    });
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col pb-28 relative">
      <div className="flex items-center gap-2 lg:hidden mb-2">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-white/5 text-primary active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Retour au détail
        </span>
      </div>

      <main className="flex-1 w-full pt-1">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="p-3 rounded-lg bg-accent-red/10 border border-accent-red/20 text-accent-red text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="nom">
                Nom
              </label>
              <input
                id="nom"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-12 w-full rounded-lg bg-surface-container border border-[#2E2A4D] px-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-[#4c3bcf] focus:ring-1 focus:ring-[#4c3bcf] outline-none transition-all"
                placeholder="Saisissez votre nom"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="prenom">
                Prénom
              </label>
              <input
                id="prenom"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-12 w-full rounded-lg bg-surface-container border border-[#2E2A4D] px-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-[#4c3bcf] focus:ring-1 focus:ring-[#4c3bcf] outline-none transition-all"
                placeholder="Saisissez votre prénom"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="telephone">
              Téléphone
            </label>
            <div className="flex h-12 w-full rounded-lg bg-surface-container border border-[#2E2A4D] overflow-hidden focus-within:border-[#4c3bcf] focus-within:ring-1 focus-within:ring-[#4c3bcf] transition-all">
              <div className="flex items-center justify-center px-4 bg-surface-container-high border-r border-[#2E2A4D] text-sm text-on-surface-variant font-semibold">
                <span>+216</span>
              </div>
              <input
                id="telephone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 bg-transparent px-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none"
                placeholder="XX XXX XXX"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Curriculum Vitae (CV)
            </label>

            {cvSimulatedName ? (
              <div className="flex items-center justify-between p-4 bg-surface-container border border-accent-green/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-green/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent-green" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface max-w-xs truncate">
                      {cvSimulatedName}
                    </p>
                    <p className="text-[11px] text-accent-green font-semibold">Fichier chargé avec succès</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCvFile(null);
                    setCvSimulatedName('');
                  }}
                  className="p-2 text-on-surface-variant hover:text-accent-red hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  title="Supprimer le fichier"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative w-full rounded-xl border-2 border-dashed hover:border-[#4c3bcf] bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer flex flex-col items-center justify-center py-8 px-6 text-center ${
                  dragActive ? 'border-[#4c3bcf] bg-surface-container' : 'border-[#474554]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  aria-label="Upload CV"
                />
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-3 group-hover:bg-[#4c3bcf]/10 transition-colors">
                  <UploadCloud className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-on-surface mb-1">
                  Glissez votre CV ici ou <span className="text-primary font-semibold">cliquez pour parcourir</span>
                </p>
                <p className="text-xs text-on-surface-variant/60">Format PDF, max 5 Mo</p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    simulateCVUpload();
                  }}
                  className="mt-3 text-xs bg-[#4c3bcf]/20 text-[#c5c0ff] hover:bg-[#4c3bcf]/40 border border-[#4c3bcf]/30 px-3 py-1.5 rounded-md font-semibold transition-all relative z-20 cursor-pointer"
                >
                  Simuler un CV rapide
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="motivation">
                Lettre de motivation
              </label>
              <span className={`text-xs ${motivation.length >= maxLength ? 'text-accent-red font-bold' : 'text-on-surface-variant/60 font-semibold'}`}>
                {motivation.length} / {maxLength}
              </span>
            </div>
            <textarea
              id="motivation"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value.slice(0, maxLength))}
              className="w-full h-32 rounded-lg bg-surface-container border border-[#2E2A4D] p-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-[#4c3bcf] focus:ring-1 focus:ring-[#4c3bcf] outline-none transition-all resize-none leading-relaxed"
              placeholder="Décrivez vos motivations et ce que vous pouvez apporter à l'équipe..."
              required
            />
          </div>

          <div className="fixed bottom-0 left-0 w-full bg-background/85 backdrop-blur-md border-t border-[#2E2A4D] p-4 z-30 flex justify-center pb-safe">
            <div className="w-full max-w-md">
              <button
                type="submit"
                className="w-full h-12 rounded-lg bg-[#4c3bcf] text-[#e4dfff] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all relative overflow-hidden group cursor-pointer"
              >
                <span className="relative z-10">Soumettre ma candidature</span>
                <div className="absolute inset-0 bg-white/0 group-active:bg-white/10 transition-colors z-0" />
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
