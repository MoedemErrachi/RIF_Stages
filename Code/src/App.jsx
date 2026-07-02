/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Screen } from './types.js';
import { INITIAL_INTERNSHIPS, INITIAL_APPLICATIONS } from '../backend/data.js';

// Component Imports
import TopAppBar from './components/TopAppBar.jsx';
import NavigationDrawer from './components/NavigationDrawer.jsx';
import BottomNavBar from './components/BottomNavBar.jsx';

// Candidate View Imports
import CandidateLogin from './components/candidate/CandidateLogin.jsx';
import CandidateExplore from './components/candidate/CandidateExplore.jsx';
import CandidateOfferDetail from './components/candidate/CandidateOfferDetail.jsx';
import CandidateApply from './components/candidate/CandidateApply.jsx';
import CandidateSuccess from './components/candidate/CandidateSuccess.jsx';
import CandidateApplications from './components/candidate/CandidateApplications.jsx';

// RH View Imports
import RHLogin from './components/rh/RHLogin.jsx';
import RHDashboard from './components/rh/RHDashboard.jsx';
import RHApplicationsList from './components/rh/RHApplicationsList.jsx';
import RHApplicationDetail from './components/rh/RHApplicationDetail.jsx';
import RHOffersList from './components/rh/RHOffersList.jsx';

export default function App() {
  // 1. Core Platform State
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [currentScreen, setCurrentScreen] = useState(Screen.CANDIDATE_LOGIN);
  const [role, setRole] = useState('candidat');
  const [activeInternship, setActiveInternship] = useState(null);
  const [activeApplication, setActiveApplication] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // { id, nom, prenom, email, role }
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Status Alerts state
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    // 1. Check for stored JWT token
    const storedToken = localStorage.getItem('rif_token');
    const storedUser = localStorage.getItem('rif_user');
    const cachedScreen = localStorage.getItem('rif_current_screen');

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setRole(user.role);
        // Restore screen or set default based on role
        if (cachedScreen && Object.values(Screen).includes(cachedScreen)) {
          setCurrentScreen(cachedScreen);
        } else {
          setCurrentScreen(user.role === 'rh' ? Screen.RH_DASHBOARD : Screen.CANDIDATE_EXPLORE);
        }
      } catch (e) {
        localStorage.removeItem('rif_token');
        localStorage.removeItem('rif_user');
      }
    } else {
      // Not logged in: go to candidate login
      setCurrentScreen(Screen.CANDIDATE_LOGIN);
    }

    // 2. Fetch fresh synchronized database lists
    const fetchFreshData = async () => {
      try {
        const [internshipsRes, applicationsRes] = await Promise.all([
          fetch('/api/internships'),
          fetch('/api/applications'),
        ]);

        if (internshipsRes.ok) {
          const fetchedInternships = await internshipsRes.json();
          setInternships(fetchedInternships);
        }
        if (applicationsRes.ok) {
          const fetchedApplications = await applicationsRes.json();
          setApplications(fetchedApplications);
        }
      } catch (err) {
        console.warn('Backend not reachable, using local data.', err);
        try {
          const cachedInternships = localStorage.getItem('rif_internships');
          const cachedApplications = localStorage.getItem('rif_applications');
          if (cachedInternships) setInternships(JSON.parse(cachedInternships));
          else setInternships(INITIAL_INTERNSHIPS);
          if (cachedApplications) setApplications(JSON.parse(cachedApplications));
          else setApplications(INITIAL_APPLICATIONS);
        } catch (e) {
          setInternships(INITIAL_INTERNSHIPS);
          setApplications(INITIAL_APPLICATIONS);
        }
      }
    };

    fetchFreshData();
  }, []);

  // Save changes helper
  const saveInternships = (updated) => {
    setInternships(updated);
    localStorage.setItem('rif_internships', JSON.stringify(updated));
  };

  const saveApplications = (updated) => {
    setApplications(updated);
    localStorage.setItem('rif_applications', JSON.stringify(updated));
  };

  const showToast = (message, duration = 4000) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), duration);
  };

  // Switch role dynamically
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    localStorage.setItem('rif_user_role', newRole);
    
    if (newRole === 'rh') {
      setCurrentScreen(Screen.RH_DASHBOARD);
      localStorage.setItem('rif_current_screen', Screen.RH_DASHBOARD);
    } else {
      setCurrentScreen(Screen.CANDIDATE_EXPLORE);
      localStorage.setItem('rif_current_screen', Screen.CANDIDATE_EXPLORE);
    }
    showToast(`Passage à l'${newRole === 'rh' ? 'Espace Recruteur (RH)' : 'Espace Candidat'}`);
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
    localStorage.setItem('rif_current_screen', screen);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('rif_token');
    localStorage.removeItem('rif_user');
    localStorage.removeItem('rif_current_screen');
    setRole('candidat');
    setCurrentScreen(Screen.CANDIDATE_LOGIN);
    showToast('Déconnexion réussie');
  };

  // 2. Candidate Core Handlers
  const handleSelectOffer = (internship) => {
    setActiveInternship(internship);
    setCurrentScreen(Screen.CANDIDATE_OFFER_DETAIL);
    localStorage.setItem('rif_current_screen', Screen.CANDIDATE_OFFER_DETAIL);
  };

  const handleApplyClick = () => {
    setCurrentScreen(Screen.CANDIDATE_APPLY);
    localStorage.setItem('rif_current_screen', Screen.CANDIDATE_APPLY);
  };

  const handleApplySubmit = async (newApp) => {
    // CandidateApply now handles the fetch itself and passes back the result
    if (!newApp) return;
    const updatedApps = [newApp, ...applications];
    saveApplications(updatedApps);
    // Increment offer count in UI
    const updatedOffers = internships.map((item) =>
      item.id === activeInternship?.id
        ? { ...item, applicantsCount: (item.applicantsCount || 0) + 1 }
        : item
    );
    saveInternships(updatedOffers);
    setCurrentScreen(Screen.CANDIDATE_SUCCESS);
    localStorage.setItem('rif_current_screen', Screen.CANDIDATE_SUCCESS);
  };

  // 3. Recruiter (RH) Core Handlers
  const handleSelectApplication = (app) => {
    setActiveApplication(app);
    setCurrentScreen(Screen.RH_APPLICATION_DETAIL);
    localStorage.setItem('rif_current_screen', Screen.RH_APPLICATION_DETAIL);
  };

  const handleUpdateApplicationStatus = async (appId, newStatus, comment) => {
    try {
      const response = await fetch(`/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, comment }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      const updatedApp = await response.json();

      const updated = applications.map((app) => app.id === appId ? updatedApp : app);
      saveApplications(updated);

      if (activeApplication && activeApplication.id === appId) {
        setActiveApplication(updatedApp);
      }

      if (updatedApp.previewUrl) {
        showToast(
          <span className="flex items-center gap-2">
            Email automatique généré et envoyé ! 
            <a href={updatedApp.previewUrl} target="_blank" rel="noreferrer" className="underline text-[#3DD68C] hover:text-white pointer-events-auto">
              [Voir l'email]
            </a>
          </span>,
          10000 // 10 seconds duration
        );
      } else {
        showToast(`Candidature mise à jour avec statut: ${newStatus}`);
      }
      
      setCurrentScreen(Screen.RH_APPLICATIONS);
      localStorage.setItem('rif_current_screen', Screen.RH_APPLICATIONS);
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la mise à jour de la candidature.');
    }
  };

  const handleSaveComment = async (appId, comment) => {
    try {
      const response = await fetch(`/api/applications/${appId}/comment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment }),
      });

      if (!response.ok) throw new Error('Failed to save comment');
      const updatedApp = await response.json();

      const updated = applications.map((app) => app.id === appId ? updatedApp : app);
      saveApplications(updated);

      if (activeApplication && activeApplication.id === appId) {
        setActiveApplication(updatedApp);
      }

      showToast('Commentaire interne sauvegardé');
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la sauvegarde du commentaire.');
    }
  };

  const handleToggleOfferStatus = async (id) => {
    try {
      const response = await fetch(`/api/internships/${id}/toggle`, {
        method: 'PUT',
      });

      if (!response.ok) throw new Error('Failed to toggle offer status');
      const updatedOffer = await response.json();

      const updated = internships.map((item) => item.id === id ? updatedOffer : item);
      saveInternships(updated);
      showToast("Statut de l'offre modifié !");
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la modification du statut.");
    }
  };

  const handleAddOffer = async (newOfferData) => {
    try {
      const response = await fetch('/api/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOfferData),
      });

      if (!response.ok) throw new Error('Failed to add offer');
      const newOffer = await response.json();

      saveInternships([newOffer, ...internships]);
      showToast('Nouvelle offre de stage publiée avec succès !');
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la publication de l'offre.");
    }
  };

  const handleDeleteOffer = async (id) => {
    try {
      const response = await fetch(`/api/internships/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete offer');

      const updated = internships.filter((item) => item.id !== id);
      saveInternships(updated);
      showToast('Offre de stage supprimée.');
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la suppression de l'offre.");
    }
  };

  // Determine header title based on current screen
  const getHeaderTitle = () => {
    switch (currentScreen) {
      case Screen.CANDIDATE_EXPLORE:
        return 'RIF Stages - Explorer';
      case Screen.CANDIDATE_OFFER_DETAIL:
        return activeInternship ? activeInternship.title : "Détail de l'offre";
      case Screen.CANDIDATE_APPLY:
        return activeInternship ? `Postuler — ${activeInternship.title}` : 'Postuler';
      case Screen.CANDIDATE_SUCCESS:
        return 'Confirmation';
      case Screen.CANDIDATE_APPLICATIONS:
        return 'Mes candidatures';
      case Screen.RH_DASHBOARD:
        return 'Tableau de bord';
      case Screen.RH_APPLICATIONS:
        return 'Candidatures reçues';
      case Screen.RH_APPLICATION_DETAIL:
        return activeApplication
          ? `Candidature — ${activeApplication.candidateFirstName} ${activeApplication.candidateLastName}`
          : 'Détail candidature';
      case Screen.RH_OFFERS:
        return 'Gérer les offres';
      default:
        return 'RIF Stages';
    }
  };

  const isLoginScreen = currentScreen === Screen.CANDIDATE_LOGIN || currentScreen === Screen.RH_LOGIN;

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans antialiased selection:bg-primary-container selection:text-on-primary-container flex flex-col">
      {/* 4. Global Toast Banner */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-full bg-[#1A1730] border border-primary/50 text-[#cac5ff] text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <div className="w-1.5 h-1.5 rounded-full bg-[#3DD68C] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 5. Navigation Rails */}
      {!isLoginScreen && (
        <>
          <TopAppBar
            currentScreen={currentScreen}
            role={role}
            title={getHeaderTitle()}
            currentUser={currentUser}
            onBack={() => {
              if (currentScreen === Screen.CANDIDATE_OFFER_DETAIL) {
                setCurrentScreen(Screen.CANDIDATE_EXPLORE);
              } else if (currentScreen === Screen.CANDIDATE_APPLY) {
                setCurrentScreen(Screen.CANDIDATE_OFFER_DETAIL);
              } else if (currentScreen === Screen.RH_APPLICATION_DETAIL) {
                setCurrentScreen(Screen.RH_APPLICATIONS);
              }
            }}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onRoleChange={handleRoleChange}
            onLogout={handleLogout}
          />

          <NavigationDrawer
            currentScreen={currentScreen}
            role={role}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onRoleChange={handleRoleChange}
            isOpenOnMobile={sidebarOpen}
            onCloseMobile={() => setSidebarOpen(false)}
          />
        </>
      )}

      {/* 6. Main View Render Stack */}
      <div className={`flex-1 flex flex-col ${isLoginScreen ? '' : 'pt-14 pb-20 lg:pb-6 lg:pl-80'}`}>
        <main className="flex-grow p-4 md:p-8">
          {(() => {
            switch (currentScreen) {
              // --- Candidate Portal Screens ---
              case Screen.CANDIDATE_LOGIN:
                return (
                  <CandidateLogin
                    onLoginSuccess={async (email, password) => {
                      try {
                        const res = await fetch('/api/auth/login', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email, password }),
                        });
                        if (!res.ok) {
                          const err = await res.json();
                          throw new Error(err.error || 'Identifiants invalides.');
                        }
                        const { token, user } = await res.json();
                        localStorage.setItem('rif_token', token);
                        localStorage.setItem('rif_user', JSON.stringify(user));
                        setCurrentUser(user);
                        setRole('candidat');
                        setCurrentScreen(Screen.CANDIDATE_EXPLORE);
                        localStorage.setItem('rif_current_screen', Screen.CANDIDATE_EXPLORE);
                        showToast(`Bienvenue ${user.prenom} ${user.nom} — Espace Candidat`);
                      } catch (err) {
                        throw err; // Let CandidateLogin handle displaying the error
                      }
                    }}
                    onSwitchToRH={() => {
                      setRole('rh');
                      setCurrentScreen(Screen.RH_LOGIN);
                      localStorage.setItem('rif_current_screen', Screen.RH_LOGIN);
                    }}
                  />
                );

              case Screen.CANDIDATE_EXPLORE:
                return (
                  <CandidateExplore
                    internships={internships}
                    onSelectOffer={handleSelectOffer}
                  />
                );

              case Screen.CANDIDATE_OFFER_DETAIL:
                return activeInternship ? (
                  <CandidateOfferDetail
                    internship={activeInternship}
                    onBack={() => setCurrentScreen(Screen.CANDIDATE_EXPLORE)}
                    onApply={handleApplyClick}
                  />
                ) : null;

              case Screen.CANDIDATE_APPLY:
                return activeInternship ? (
                  <CandidateApply
                    internship={activeInternship}
                    onBack={() => setCurrentScreen(Screen.CANDIDATE_OFFER_DETAIL)}
                    onSubmitSuccess={handleApplySubmit}
                  />
                ) : null;

              case Screen.CANDIDATE_SUCCESS:
                return (
                  <CandidateSuccess
                    onGoToDashboard={() => {
                      setCurrentScreen(Screen.CANDIDATE_APPLICATIONS);
                      localStorage.setItem('rif_current_screen', Screen.CANDIDATE_APPLICATIONS);
                    }}
                    onGoToHome={() => {
                      setCurrentScreen(Screen.CANDIDATE_EXPLORE);
                      localStorage.setItem('rif_current_screen', Screen.CANDIDATE_EXPLORE);
                    }}
                  />
                );

              case Screen.CANDIDATE_APPLICATIONS:
                const myApplications = applications.filter(app => app.candidateEmail === currentUser?.email);
                return <CandidateApplications applications={myApplications} />;

              // --- Recruiter (RH) Portal Screens ---
              case Screen.RH_LOGIN:
                return (
                  <RHLogin
                    onLoginSuccess={async (email, password) => {
                      try {
                        const res = await fetch('/api/auth/login', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email, password }),
                        });
                        if (!res.ok) {
                          const err = await res.json();
                          throw new Error(err.error || 'Identifiants invalides.');
                        }
                        const { token, user } = await res.json();
                        if (user.role !== 'rh' && user.role !== 'admin') {
                          throw new Error('Accès refusé. Compte RH requis.');
                        }
                        localStorage.setItem('rif_token', token);
                        localStorage.setItem('rif_user', JSON.stringify(user));
                        setCurrentUser(user);
                        setRole('rh');
                        setCurrentScreen(Screen.RH_DASHBOARD);
                        localStorage.setItem('rif_current_screen', Screen.RH_DASHBOARD);
                        showToast(`Bienvenue ${user.prenom} ${user.nom} — Espace RH`);
                      } catch (err) {
                        throw err; // Let RHLogin handle displaying the error
                      }
                    }}
                    onSwitchToCandidate={() => {
                      setRole('candidat');
                      setCurrentScreen(Screen.CANDIDATE_LOGIN);
                      localStorage.setItem('rif_current_screen', Screen.CANDIDATE_LOGIN);
                    }}
                  />
                );

              case Screen.RH_DASHBOARD:
                return (
                  <RHDashboard
                    applications={applications}
                    onNavigateToApplications={() => {
                      setCurrentScreen(Screen.RH_APPLICATIONS);
                      localStorage.setItem('rif_current_screen', Screen.RH_APPLICATIONS);
                    }}
                    onSelectApplication={handleSelectApplication}
                  />
                );

              case Screen.RH_APPLICATIONS:
                return (
                  <RHApplicationsList
                    applications={applications}
                    onSelectApplication={handleSelectApplication}
                  />
                );

              case Screen.RH_APPLICATION_DETAIL:
                return activeApplication ? (
                  <RHApplicationDetail
                    application={activeApplication}
                    onBack={() => setCurrentScreen(Screen.RH_APPLICATIONS)}
                    onUpdateStatus={handleUpdateApplicationStatus}
                    onSaveComment={handleSaveComment}
                  />
                ) : null;

              case Screen.RH_OFFERS:
                return (
                  <RHOffersList
                    internships={internships}
                    onToggleStatus={handleToggleOfferStatus}
                    onAddOffer={handleAddOffer}
                    onDeleteOffer={handleDeleteOffer}
                  />
                );

              default:
                return (
                  <CandidateExplore
                    internships={internships}
                    onSelectOffer={handleSelectOffer}
                  />
                );
            }
          })()}
        </main>
      </div>

      {/* 7. Bottom Navigation Bar */}
      {!isLoginScreen && (
        <BottomNavBar
          currentScreen={currentScreen}
          role={role}
          onNavigate={handleNavigate}
          onProfileClick={() => {
            if (role === 'candidat') {
              setCurrentScreen(Screen.CANDIDATE_APPLICATIONS);
            } else {
              setCurrentScreen(Screen.RH_DASHBOARD);
            }
          }}
        />
      )}
    </div>
  );
}
