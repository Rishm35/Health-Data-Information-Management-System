import React, { useState, useEffect } from 'react';
import { MainTab, UserRole, UserProfile, HealthDataSubmission, SystemNotification } from './types';
import { isTabAllowedForRole, ROLE_DEFAULT_TABS } from './utils/auth';
import { DEMO_USERS, INITIAL_SUBMISSIONS, SYSTEM_NOTIFICATIONS } from './data/mockData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { LoginView } from './components/LoginView';
import { RestrictedAccessView } from './components/RestrictedAccessView';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { DashboardView } from './components/DashboardView';
import { DataManagementView } from './components/DataManagementView';
import { ProgrammesView } from './components/ProgrammesView';
import { FacilitiesView } from './components/FacilitiesView';
import { ReportsView } from './components/ReportsView';
import { NotificationsView } from './components/NotificationsView';
import { AdminPanelView } from './components/AdminPanelView';
import { HelpSupportView } from './components/HelpSupportView';
import { GmailDispatchModal } from './components/GmailDispatchModal';
import {
  testFirestoreConnection,
  seedInitialFirestoreData,
  subscribeToSubmissions,
  persistSubmission,
  updateSubmissionReview,
} from './services/firestore';
import { Shield, Activity } from 'lucide-react';

export default function App() {
  // Requirement: "start with proper login page"
  // Default unauthenticated user starting on the Login tab
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentTab, setCurrentTab] = useState<MainTab>('Login');
  const [currentSubTab, setCurrentSubTab] = useState<string | undefined>(undefined);
  const [isGmailModalOpen, setIsGmailModalOpen] = useState<boolean>(false);

  // Live application data state
  const [submissions, setSubmissions] = useState<HealthDataSubmission[]>(INITIAL_SUBMISSIONS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(SYSTEM_NOTIFICATIONS);

  // Initialize and validate Firestore connection on boot
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function initFirestore() {
      await testFirestoreConnection();
      await seedInitialFirestoreData();
      unsubscribe = subscribeToSubmissions((remoteSubmissions) => {
        if (remoteSubmissions && remoteSubmissions.length > 0) {
          setSubmissions(remoteSubmissions);
        }
      });
    }

    initFirestore();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Handle successful login and automatic redirection to user's authorized module
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    const destination = ROLE_DEFAULT_TABS[user.role];
    setCurrentTab(destination.tab);
    setCurrentSubTab(destination.subTab);
  };

  // Quick switch role (for instant testing of any profile)
  const handleQuickLogin = (role: UserRole) => {
    const user = DEMO_USERS[role];
    handleLoginSuccess(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab('Login');
    setCurrentSubTab(undefined);
  };

  const handleNavigate = (tab: MainTab, subTab?: string) => {
    setCurrentTab(tab);
    setCurrentSubTab(subTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddSubmission = (newSub: HealthDataSubmission) => {
    setSubmissions([newSub, ...submissions]);
    // Persist to cloud database
    persistSubmission(newSub).catch((err) => {
      console.warn('Notice: Offline caching active for submission:', err);
    });
    
    // Add an automated notification
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title: `Data Submission Received: ${newSub.facilityName}`,
      message: `${newSub.reportMonth} physical performance indicators submitted by ${newSub.submittedBy} (Ref: ${newSub.id}).`,
      timestamp: 'Just now',
      type: 'INFO',
      read: false,
      sender: 'HDIMS Automated Ingestion Gateway',
      actionLink: { tab: 'Data Management', subTab: 'Submitted Data' },
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleUpdateSubmissionStatus = (id: string, status: HealthDataSubmission['status'], notes?: string) => {
    const reviewerName = currentUser?.name || 'Authorized Supervisor';
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            status,
            revisionNotes: notes || s.revisionNotes,
            reviewedBy: reviewerName,
            reviewedAt: '2026-09-17 10:15 AM',
          };
        }
        return s;
      })
    );
    // Persist review to cloud database
    updateSubmissionReview(id, status, reviewerName).catch((err) => {
      console.warn('Notice: Offline review update logged:', err);
    });
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Check tab accessibility
  const accessCheck = isTabAllowedForRole(currentTab, currentUser ? currentUser.role : null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Official Top Bar & Header */}
      <Header
        currentUser={currentUser}
        unreadCount={unreadCount}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onQuickLogin={handleQuickLogin}
        onOpenGmailDispatch={() => setIsGmailModalOpen(true)}
      />

      {/* Primary Navigation Hierarchy */}
      <Navigation
        currentTab={currentTab}
        currentRole={currentUser ? currentUser.role : null}
        unreadNotificationsCount={unreadCount}
        onSelectTab={(tab) => handleNavigate(tab)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Guard check: If tab is locked for unauthenticated or under-cleared users */}
        {!accessCheck.allowed ? (
          <RestrictedAccessView
            requestedTab={currentTab}
            currentRole={currentUser ? currentUser.role : null}
            reason={accessCheck.reason}
            onNavigateToLogin={() => handleNavigate('Login')}
            onQuickLogin={handleQuickLogin}
          />
        ) : (
          <>
            {currentTab === 'Login' && (
              <LoginView
                currentUser={currentUser}
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
                onNavigateToUserTab={() => {
                  if (currentUser) {
                    const destination = ROLE_DEFAULT_TABS[currentUser.role];
                    handleNavigate(destination.tab, destination.subTab);
                  }
                }}
              />
            )}

            {currentTab === 'Home' && (
              <HomeView
                currentUser={currentUser}
                onNavigate={handleNavigate}
                onQuickLogin={handleQuickLogin}
              />
            )}

            {currentTab === 'About' && (
              <AboutView initialSubTab={currentSubTab as any} />
            )}

            {currentTab === 'Dashboard' && (
              <DashboardView
                currentUser={currentUser}
                initialSubTab={currentSubTab as any}
                onOpenGmailDispatch={() => setIsGmailModalOpen(true)}
              />
            )}

            {currentTab === 'Data Management' && (
              <DataManagementView
                currentUser={currentUser}
                submissions={submissions}
                initialSubTab={currentSubTab as any}
                onAddSubmission={handleAddSubmission}
                onUpdateSubmissionStatus={handleUpdateSubmissionStatus}
              />
            )}

            {currentTab === 'Programmes' && (
              <ProgrammesView initialSubTab={currentSubTab as any} />
            )}

            {currentTab === 'Facilities' && (
              <FacilitiesView initialSubTab={currentSubTab as any} />
            )}

            {currentTab === 'Reports' && (
              <ReportsView
                currentUser={currentUser}
                initialSubTab={currentSubTab as any}
                onOpenGmailDispatch={() => setIsGmailModalOpen(true)}
              />
            )}

            {currentTab === 'Notifications' && (
              <NotificationsView
                currentUserRole={currentUser ? currentUser.role : null}
                notifications={notifications}
                onMarkAsRead={handleMarkNotificationAsRead}
                onNavigate={handleNavigate}
              />
            )}

            {currentTab === 'Admin Panel' && (
              <AdminPanelView
                currentUser={currentUser}
                initialSubTab={currentSubTab as any}
              />
            )}

            {currentTab === 'Help & Support' && (
              <HelpSupportView initialSubTab={currentSubTab as any} />
            )}
          </>
        )}
      </main>

      {/* Institutional Official Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-800/80 flex items-center justify-center text-teal-200">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-slate-200 text-sm">HDIMS Healthcare Informatics Gateway</div>
                <div className="text-[11px] text-slate-500">
                  National Health Mission &bull; Ministry of Health and Family Welfare, Government of India
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <button onClick={() => handleNavigate('About', 'About HDIMS')} className="hover:text-white transition">
                About HDIMS
              </button>
              <span>&bull;</span>
              <button onClick={() => handleNavigate('About', 'How It Works')} className="hover:text-white transition">
                Data Architecture
              </button>
              <span>&bull;</span>
              <button onClick={() => handleNavigate('Help & Support', 'FAQs')} className="hover:text-white transition">
                FAQs
              </button>
              <span>&bull;</span>
              <button onClick={() => handleNavigate('Help & Support', 'Contact Support')} className="hover:text-white transition">
                24x7 Helpdesk
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-500">
            <div>
              &copy; 2026 Health Data Information &amp; Management System (HDIMS). Designed for National Public Healthcare Facilities.
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              <span>Hierarchical Data Flow: Facility &rarr; Sub-District &rarr; District &rarr; State/UT</span>
            </div>
          </div>
        </div>
      </footer>

      {/* End-of-Month Gmail Dispatch Modal */}
      <GmailDispatchModal
        isOpen={isGmailModalOpen}
        onClose={() => setIsGmailModalOpen(false)}
        currentUser={currentUser}
        defaultMonth="August 2026"
      />
    </div>
  );
}
