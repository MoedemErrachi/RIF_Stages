/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Key, Eye, EyeOff, Lock, User } from 'lucide-react';

export default function RHLogin({ onLoginSuccess, onSwitchToCandidate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Veuillez saisir votre email professionnel.');
      return;
    }
    if (!password) {
      setError('Veuillez saisir votre mot de passe.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await onLoginSuccess(email, password);
    } catch (err) {
      setError(err.message || 'Identifiants incorrects ou accès refusé.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 font-sans relative">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 flex justify-center items-center">
        <div className="absolute w-[600px] h-[600px] bg-primary-container opacity-10 rounded-full blur-[100px] translate-y-[-20%]" />
        <div className="absolute w-[400px] h-[400px] bg-secondary-container opacity-10 rounded-full blur-[80px] translate-y-[30%] translate-x-[20%]" />
      </div>

      <main className="w-full max-w-[440px] z-10 relative">
        {/* Header Section */}
        <header className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface mb-2 tracking-tight">
            Espace RH
          </h1>
          <p className="text-sm text-on-surface-variant font-medium">
            Connexion réservée à l'équipe recrutement
          </p>
        </header>

        {/* Login Card */}
        <div className="bg-[#1A1730] border border-[#2E2A4D] rounded-xl p-6 sm:p-8 w-full shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="p-3 rounded-lg bg-accent-red/10 border border-accent-red/20 text-accent-red text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Email Input Group */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="rh-email">
                Email professionnel
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                <input
                  id="rh-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full pl-10 pr-4 rounded-lg bg-[#0D0B1A] border border-[#2E2A4D] text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-[#4c3bcf] focus:ring-1 focus:ring-[#4c3bcf] outline-none transition-all"
                  placeholder="prenom.nom@entreprise.com"
                  required
                />
              </div>
            </div>

            {/* Password Input Group */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="rh-password">
                  Mot de passe
                </label>
                <a href="#" className="text-xs text-primary hover:text-primary/80 font-semibold transition-colors">
                  Oublié ?
                </a>
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                <input
                  id="rh-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full pl-10 pr-12 rounded-lg bg-[#0D0B1A] border border-[#2E2A4D] text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-[#4c3bcf] focus:ring-1 focus:ring-[#4c3bcf] outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  aria-label="Afficher le mot de passe"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="h-12 bg-[#4c3bcf] text-white rounded-lg flex items-center justify-center w-full font-bold text-sm hover:bg-[#5546d8] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#4c3bcf]/10 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connexion...' : 'Connexion RH'}
            </button>
          </form>
        </div>

        {/* Footer Badge & Quick Swap */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2E2A4D] bg-[#1A1730]/50 backdrop-blur-sm shadow-md">
            <Lock className="w-3.5 h-3.5 text-accent-green" />
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Accès sécurisé
            </span>
          </div>
          <p className="text-xs text-on-surface-variant/60 text-center">
            <span className="block mb-2 font-semibold">Comptes de démo RH :</span>
            <span className="font-mono text-primary">rh@example.com</span><br/>
            <span className="font-mono text-primary">rh2@example.com</span><br/>
            <span className="block mt-2">Mot de passe : <span className="font-mono text-primary">admin123</span></span>
          </p>
          <button
            onClick={onSwitchToCandidate}
            className="mt-2 flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-dashed border-[#2E2A4D] hover:border-primary text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-all cursor-pointer hover:bg-white/5 active:scale-95"
          >
            <User className="w-3.5 h-3.5 text-primary" />
            <span>Se connecter en tant que Candidat</span>
          </button>
        </div>
      </main>
    </div>
  );
}
