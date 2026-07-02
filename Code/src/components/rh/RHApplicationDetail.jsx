/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, ArrowLeft, X, Check, AlertCircle, Sparkles, Copy, RotateCw, Clock } from 'lucide-react';

export default function RHApplicationDetail({
  application,
  onBack,
  onUpdateStatus,
  onSaveComment,
}) {
  const [commentText, setCommentText] = useState(application.comments || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // AI Response states
  const [aiEmail, setAiEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleDownloadCV = () => {
    if (application.cvName) {
      window.open(application.cvName, '_blank');
    }
  };

  const handleSaveComment = () => {
    onSaveComment(application.id, commentText);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleGenerateEmail = async () => {
    setIsGenerating(true);
    setGenerationError('');
    setAiEmail('');
    try {
      const response = await fetch('/api/ai/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: `${application.candidateFirstName} ${application.candidateLastName}`,
          internshipTitle: application.internshipTitle,
          status: application.status,
          comments: commentText,
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Impossible de se connecter au serveur IA.');
      }
      const data = await response.json();
      setAiEmail(data.emailText);
    } catch (err) {
      console.error(err);
      setGenerationError(err.message || "Une erreur est survenue lors de la communication avec l'IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(aiEmail);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 pb-28 relative font-sans animate-fade-in">
      {/* Mobile-back header helper */}
      <div className="flex items-center gap-2 lg:hidden mb-1">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-white/5 text-primary active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Retour aux candidats
        </span>
      </div>

      {/* Main Content Sections */}
      <main className="flex-grow flex flex-col gap-6">
        {/* Informations */}
        <section className="bg-custom-card rounded-xl p-5 border border-outline shadow-lg">
          <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">
            Informations de contact
          </h2>
          <dl className="flex flex-col gap-1">
            <div className="flex justify-between items-center py-2.5 border-b border-outline/30">
              <dt className="text-sm text-on-surface-variant font-medium">Email</dt>
              <dd className="text-sm font-semibold text-[#F4F3FA] select-all truncate max-w-[200px] sm:max-w-xs">
                {application.candidateEmail}
              </dd>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <dt className="text-sm text-on-surface-variant font-medium">Téléphone</dt>
              <dd className="text-sm font-semibold text-[#F4F3FA] select-all">
                {application.candidatePhone}
              </dd>
            </div>
          </dl>
        </section>

        {/* CV Action */}
        <button
          type="button"
          onClick={handleDownloadCV}
          className="w-full h-12 flex items-center justify-center gap-2 bg-secondary-container/20 text-[#c8bfff] border border-secondary-container rounded-lg font-semibold hover:bg-secondary-container/30 transition-colors cursor-pointer"
        >
          <FileText className="w-5 h-5" />
          <span>{downloadSuccess ? 'CV Téléchargé !' : 'Télécharger le CV'}</span>
        </button>

        {/* Lettre de motivation */}
        <section className="bg-custom-card rounded-xl p-5 border border-outline shadow-lg">
          <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
            Lettre de motivation
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed">
            <p className={`whitespace-pre-line ${isExpanded ? '' : 'line-clamp-3'}`}>
              {application.motivation}
            </p>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary font-semibold mt-2.5 hover:underline focus:outline-none cursor-pointer text-xs"
            >
              {isExpanded ? 'Lire moins' : 'Lire la suite'}
            </button>
          </div>
        </section>

        {/* Historique */}
        <section className="bg-custom-card rounded-xl p-5 border border-outline shadow-lg">
          <h2 className="text-xs font-bold text-[#928fa0] uppercase tracking-wider mb-4">
            Historique du statut
          </h2>
          <div className="relative pl-5 border-l-2 border-[#2E2A4D] flex flex-col gap-6 ml-2">
            {application.history.map((hist, idx) => {
              const isCurrent = idx === 0;
              return (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-[27px] top-1 w-3 h-3 rounded-full ring-4 ring-[#1A1730] ${
                      isCurrent ? 'bg-[#4C3BCF]' : 'bg-[#474554]'
                    }`}
                  />
                  <p className={`text-sm font-bold ${isCurrent ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                    {hist.status}
                  </p>
                  <p className="text-[10px] text-[#928fa0] mt-0.5 font-semibold">
                    {hist.date}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Feedback Private Comments */}
        <section className="flex flex-col gap-2">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-[#928fa0] uppercase tracking-wider" htmlFor="feedback">
              Commentaire RH (Privé / Interne)
            </label>
            {saveSuccess && (
              <span className="text-[10px] text-accent-green font-semibold">Enregistré !</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <textarea
              id="feedback"
              className="w-full bg-custom-card border border-[#2E2A4D] rounded-lg p-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-[#4c3bcf] focus:ring-1 focus:ring-[#4c3bcf] transition-all resize-none leading-relaxed"
              placeholder="Ajoutez un commentaire interne pour l'équipe recrutement..."
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              type="button"
              onClick={handleSaveComment}
              className="self-end px-4 py-2 bg-surface-container hover:bg-[#221F42] text-xs font-bold rounded-lg border border-[#2E2A4D] text-primary transition-all cursor-pointer active:scale-95"
            >
              Sauvegarder le commentaire
            </button>
          </div>
        </section>

        {/* Assistant E-mail de réponse automatique IA */}
        <section className="bg-custom-card rounded-xl p-5 border border-primary/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4C3BCF] via-[#3DD68C] to-[#E54B4B]" />
          
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                Assistant Email IA
              </h2>
              <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                Rédigez instantanément une réponse personnalisée et chaleureuse selon le statut actuel de la candidature (<em>{application.status}</em>) et vos commentaires internes.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {aiEmail ? (
              <div className="flex flex-col gap-2">
                <div className="relative bg-[#121028] border border-[#2E2A4D] rounded-lg p-3 text-xs text-on-surface font-mono whitespace-pre-wrap leading-relaxed select-all max-h-[250px] overflow-y-auto">
                  {aiEmail}
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={handleGenerateEmail}
                    disabled={isGenerating}
                    className="px-3 py-1.5 bg-surface-container hover:bg-[#221F42] border border-[#2E2A4D] text-xs font-bold rounded-lg text-on-surface-variant transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    Régénérer
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-4 py-1.5 bg-primary hover:bg-[#5D4ED1] text-xs font-bold rounded-lg text-white transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copySuccess ? 'Copié !' : 'Copier l\'email'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-4 text-center">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-xs text-on-surface-variant font-medium animate-pulse">
                      Rédaction de l'email en cours par Gemini...
                    </p>
                  </div>
                ) : (
                  <>
                    {generationError && (
                      <div className="mb-3 px-3 py-2 bg-[#E54B4B]/10 border border-[#E54B4B]/30 rounded-lg flex items-center gap-2 text-xs text-[#E54B4B] max-w-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{generationError}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleGenerateEmail}
                      className="px-4 py-2.5 bg-primary/20 hover:bg-primary/35 text-primary border border-primary/40 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Générer un email de réponse ({application.status})</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Decision Actions (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0D0B1A]/95 backdrop-blur-md border-t border-[#2E2A4D] flex gap-4 z-30 justify-center">
        <div className="w-full max-w-lg flex gap-2 sm:gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => onUpdateStatus(application.id, 'Refusée', commentText)}
            className="flex-1 min-w-[100px] h-12 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer bg-accent-red text-[#121028] hover:brightness-110 shadow-lg"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
            <span>Refuser</span>
          </button>
          {application.status !== 'En revue' && application.status !== 'Acceptée' && application.status !== 'Refusée' && (
            <button
              type="button"
              onClick={() => onUpdateStatus(application.id, 'En revue', commentText)}
              className="flex-1 min-w-[100px] h-12 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer bg-orange-500 text-[#121028] hover:brightness-110 shadow-lg"
            >
              <Clock className="w-4 h-4" strokeWidth={2.5} />
              <span>En revue</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onUpdateStatus(application.id, 'Acceptée', commentText)}
            className="flex-1 min-w-[100px] h-12 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer bg-accent-green text-[#121028] hover:brightness-110 shadow-lg"
          >
            <Check className="w-4 h-4" strokeWidth={2.5} />
            <span>Accepter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
