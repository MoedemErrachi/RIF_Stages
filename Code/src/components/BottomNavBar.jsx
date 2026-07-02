/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, ClipboardList, User, LayoutDashboard, Briefcase } from 'lucide-react';
import { Screen } from '../types.js';

export default function BottomNavBar({
  currentScreen,
  role,
  onNavigate,
  onProfileClick,
}) {
  const isCandidate = role === 'candidat';

  if (isCandidate) {
    const isExploreActive = [
      Screen.CANDIDATE_EXPLORE,
      Screen.CANDIDATE_OFFER_DETAIL,
      Screen.CANDIDATE_APPLY,
      Screen.CANDIDATE_SUCCESS,
    ].includes(currentScreen);
    
    const isAppliedActive = currentScreen === Screen.CANDIDATE_APPLICATIONS;

    return (
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center h-14 bg-[#1b1931] border-t border-[#2E2A4D] shadow-lg pb-safe">
        <button
          onClick={() => onNavigate(Screen.CANDIDATE_EXPLORE)}
          className={`flex flex-col items-center justify-center py-1 px-4 transition-all duration-200 cursor-pointer ${
            isExploreActive
              ? 'bg-[#4c3bcf] text-[#e4dfff] rounded-full scale-105 font-bold'
              : 'text-on-surface-variant'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Explore</span>
        </button>

        <button
          onClick={() => onNavigate(Screen.CANDIDATE_APPLICATIONS)}
          className={`flex flex-col items-center justify-center py-1 px-4 transition-all duration-200 cursor-pointer ${
            isAppliedActive
              ? 'bg-[#4c3bcf] text-[#e4dfff] rounded-full scale-105 font-bold'
              : 'text-on-surface-variant'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Applied</span>
        </button>

        <button
          onClick={onProfileClick}
          className="flex flex-col items-center justify-center py-1 px-4 text-on-surface-variant hover:text-on-surface transition-all duration-200 cursor-pointer"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </nav>
    );
  } else {
    // RH bottom navigation
    const isDashboardActive = currentScreen === Screen.RH_DASHBOARD;
    const isAppsActive = [Screen.RH_APPLICATIONS, Screen.RH_APPLICATION_DETAIL].includes(currentScreen);
    const isOffersActive = currentScreen === Screen.RH_OFFERS;

    return (
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center h-14 bg-[#1b1931] border-t border-[#2E2A4D] shadow-lg pb-safe">
        <button
          onClick={() => onNavigate(Screen.RH_DASHBOARD)}
          className={`flex flex-col items-center justify-center py-1 px-4 transition-all duration-200 cursor-pointer ${
            isDashboardActive
              ? 'bg-[#4c3bcf] text-[#e4dfff] rounded-full scale-105 font-bold'
              : 'text-on-surface-variant'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Dashboard</span>
        </button>

        <button
          onClick={() => onNavigate(Screen.RH_APPLICATIONS)}
          className={`flex flex-col items-center justify-center py-1 px-4 transition-all duration-200 cursor-pointer ${
            isAppsActive
              ? 'bg-[#4c3bcf] text-[#e4dfff] rounded-full scale-105 font-bold'
              : 'text-on-surface-variant'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Candidats</span>
        </button>

        <button
          onClick={() => onNavigate(Screen.RH_OFFERS)}
          className={`flex flex-col items-center justify-center py-1 px-4 transition-all duration-200 cursor-pointer ${
            isOffersActive
              ? 'bg-[#4c3bcf] text-[#e4dfff] rounded-full scale-105 font-bold'
              : 'text-on-surface-variant'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Offres</span>
        </button>
      </nav>
    );
  }
}
