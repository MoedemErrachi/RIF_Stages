/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, ClipboardList, Briefcase, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { Screen } from '../types.js';

export default function NavigationDrawer({
  currentScreen,
  role,
  onNavigate,
  onLogout,
  onRoleChange,
  isOpenOnMobile,
  onCloseMobile,
}) {
  const isCandidate = role === 'candidat';

  // Helper to detect if a screen tab is active
  const isActive = (screens) => screens.includes(currentScreen);

  const candidateLinks = [
    {
      label: 'Explorer',
      icon: Home,
      screen: Screen.CANDIDATE_EXPLORE,
      active: isActive([Screen.CANDIDATE_EXPLORE, Screen.CANDIDATE_OFFER_DETAIL, Screen.CANDIDATE_APPLY, Screen.CANDIDATE_SUCCESS]),
    },
    {
      label: 'Mes candidatures',
      icon: ClipboardList,
      screen: Screen.CANDIDATE_APPLICATIONS,
      active: isActive([Screen.CANDIDATE_APPLICATIONS]),
    },
  ];

  const rhLinks = [
    {
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      screen: Screen.RH_DASHBOARD,
      active: isActive([Screen.RH_DASHBOARD]),
    },
    {
      label: 'Candidatures reçues',
      icon: ClipboardList,
      screen: Screen.RH_APPLICATIONS,
      active: isActive([Screen.RH_APPLICATIONS, Screen.RH_APPLICATION_DETAIL]),
    },
    {
      label: 'Gérer les offres',
      icon: Briefcase,
      screen: Screen.RH_OFFERS,
      active: isActive([Screen.RH_OFFERS]),
    },
  ];

  const links = isCandidate ? candidateLinks : rhLinks;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#1f1d35] border-r border-[#2E2A4D] p-5">
      <div className="mb-8 mt-2 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary tracking-tight">RIF Stages</h2>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
            {isCandidate ? 'Espace Candidat' : 'Espace RH / Recruteur'}
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.label}
              onClick={() => {
                onNavigate(link.screen);
                onCloseMobile();
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer text-left ${
                link.active
                  ? 'bg-secondary-container text-on-secondary-container shadow-md'
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </button>
          );
        })}

        {/* Dynamic role changer in the nav list */}
        <button
          onClick={() => {
            onRoleChange(isCandidate ? 'rh' : 'candidat');
            onCloseMobile();
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-[#3DD68C] hover:bg-[#3DD68C]/10 transition-all duration-200 cursor-pointer mt-4"
        >
          <Shield className="w-4 h-4 shrink-0" />
          <span>Basculer vers {isCandidate ? 'Espace RH' : 'Espace Candidat'}</span>
        </button>
      </nav>

      <div className="mt-auto border-t border-[#2E2A4D] pt-4">
        <button
          onClick={() => {
            onLogout();
            onCloseMobile();
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-on-surface-variant hover:text-error hover:bg-white/5 transition-all w-full cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4 shrink-0 text-error" />
          <span>Se déconnecter</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col w-80 pt-14 h-[calc(100vh)]">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {isOpenOnMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer container */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#1f1d35] shadow-2xl transition-transform duration-300 transform translate-x-0">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
