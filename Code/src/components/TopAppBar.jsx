/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, ArrowLeft, LogOut, ShieldAlert } from 'lucide-react';
import { Screen } from '../types.js';

export default function TopAppBar({
  currentScreen,
  role,
  title,
  onBack,
  onToggleSidebar,
  onRoleChange,
  onLogout,
}) {
  const isDetailView =
    currentScreen === Screen.CANDIDATE_OFFER_DETAIL ||
    currentScreen === Screen.CANDIDATE_APPLY ||
    currentScreen === Screen.RH_APPLICATION_DETAIL;

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 bg-[#1b1931] border-b border-[#2E2A4D] h-14 transition-colors duration-200">
      <div className="flex items-center gap-3">
        {isDetailView && onBack ? (
          <button
            onClick={onBack}
            aria-label="Retour"
            className="text-on-surface hover:bg-white/5 p-2 rounded-full flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
        ) : (
          <button
            onClick={onToggleSidebar}
            aria-label="Menu"
            className="text-primary hover:bg-white/5 p-2 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="font-sans text-lg md:text-xl font-bold text-on-surface tracking-tight truncate max-w-[150px] sm:max-w-xs md:max-w-md">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Role Switcher Badge */}
        <button
          onClick={() => onRoleChange(role === 'candidat' ? 'rh' : 'candidat')}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-full border bg-primary-container/20 border-primary/30 text-primary hover:bg-primary-container/30 transition-all cursor-pointer flex items-center gap-1 shadow-inner active:scale-95"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{role === 'candidat' ? 'Espace RH' : 'Espace Candidat'}</span>
        </button>

        {/* Logout (if not on logins) */}
        {currentScreen !== Screen.CANDIDATE_LOGIN && currentScreen !== Screen.RH_LOGIN && (
          <button
            onClick={onLogout}
            title="Se déconnecter"
            className="p-2 rounded-full hover:bg-white/5 text-on-surface-variant hover:text-error transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
