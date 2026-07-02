/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, EyeOff, Briefcase, Mail, Key, Shield } from 'lucide-react';

export default function CandidateLogin({ onLoginSuccess, onSwitchToRH }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Veuillez saisir votre adresse email.');
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
      setError(err.message || 'Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-primary-container/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-secondary-container/10 blur-[120px] pointer-events-none z-0" />

      <main className="w-full max-w-[420px] bg-surface-container-low border border-outline-variant/30 rounded-xl p-8 z-10 relative shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col gap-2 text-center items-center">
          <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-outline-variant">
            <Briefcase className="w-7 h-7 text-primary-container" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            Connexion candidat
          </h1>
          <p className="text-sm text-on-surface-variant font-medium">
            Accédez à votre espace pour suivre vos candidatures
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-lg bg-accent-red/10 border border-accent-red/20 text-accent-red text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Email input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="email">
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full pl-10 pr-4 rounded-lg bg-surface border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 focus:border-[#4c3bcf] focus:ring-1 focus:ring-[#4c3bcf] outline-none transition-all"
                placeholder="nom@exemple.com"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="password">
                Mot de passe
              </label>
            </div>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full pl-10 pr-12 rounded-lg bg-surface border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 focus:border-[#4c3bcf] focus:ring-1 focus:ring-[#4c3bcf] outline-none transition-all"
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

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-2 rounded-lg bg-primary-container text-white font-semibold text-sm tracking-wide flex items-center justify-center hover:bg-[#5546d8] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary-container/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-px bg-outline-variant/30 flex-1"></div>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">ou</span>
          <div className="h-px bg-outline-variant/30 flex-1"></div>
        </div>

        {/* Secondary Links */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs text-on-surface-variant/60 text-center">
              <span className="block mb-2 font-semibold">Comptes de démo candidats :</span>
              <span className="font-mono text-primary">candidat.demo@example.com</span><br/>
              <span className="font-mono text-primary">jean.dupont@example.com</span><br/>
              <span className="font-mono text-primary">marie.leroy@example.com</span><br/>
              <span className="block mt-2">Mot de passe : <span className="font-mono text-primary">candidat123</span></span>
            </p>
            <button
              onClick={onSwitchToRH}
              className="mt-2 flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-[#2E2A4D] bg-[#1A1730]/50 text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-all cursor-pointer hover:bg-white/5 active:scale-95"
            >
              <Shield className="w-3.5 h-3.5 text-accent-green" />
              <span>Accès Recruteur / RH</span>
            </button>
          </div>
      </main>
    </div>
  );
}
