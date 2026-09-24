import React from 'react';
import { MainTab, UserRole } from '../types';
import { isTabAllowedForRole } from '../utils/auth';
import {
  Home,
  Info,
  LayoutDashboard,
  FileSpreadsheet,
  Layers,
  Hospital,
  FileBarChart2,
  Bell,
  ShieldCheck,
  HelpCircle,
  LogIn,
  Lock,
  Menu,
  X
} from 'lucide-react';

interface NavigationProps {
  currentTab: MainTab;
  currentRole: UserRole | null;
  unreadNotificationsCount: number;
  onSelectTab: (tab: MainTab) => void;
}

interface TabItem {
  id: MainTab;
  label: string;
  icon: React.ReactNode;
  requiresAuth: boolean;
  minRoleNotice?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  currentRole,
  unreadNotificationsCount,
  onSelectTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const tabs: TabItem[] = [
    { id: 'Home', label: 'Home', icon: <Home className="w-4 h-4" />, requiresAuth: false },
    { id: 'About', label: 'About', icon: <Info className="w-4 h-4" />, requiresAuth: false },
    { id: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, requiresAuth: true },
    { id: 'Data Management', label: 'Data Management', icon: <FileSpreadsheet className="w-4 h-4" />, requiresAuth: true },
    { id: 'Programmes', label: 'Programmes', icon: <Layers className="w-4 h-4" />, requiresAuth: true },
    { id: 'Facilities', label: 'Facilities', icon: <Hospital className="w-4 h-4" />, requiresAuth: true },
    { id: 'Reports', label: 'Reports', icon: <FileBarChart2 className="w-4 h-4" />, requiresAuth: true },
    { id: 'Notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, requiresAuth: true },
    { id: 'Admin Panel', label: 'Admin Panel', icon: <ShieldCheck className="w-4 h-4" />, requiresAuth: true, minRoleNotice: 'Super Admin Only' },
    { id: 'Help & Support', label: 'Help & Support', icon: <HelpCircle className="w-4 h-4" />, requiresAuth: false },
    { id: 'Login', label: currentRole ? 'User Session' : 'Login', icon: <LogIn className="w-4 h-4" />, requiresAuth: false },
  ];

  return (
    <nav className="bg-slate-800 text-slate-200 border-b border-slate-700 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between md:justify-start">
          {/* Mobile menu button and current tab indicator */}
          <div className="flex md:hidden items-center justify-between w-full py-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 min-h-[42px] rounded-lg text-slate-200 hover:text-white hover:bg-slate-700 active:bg-slate-600 focus:outline-none transition border border-slate-700"
              aria-label="Toggle navigation menu"
              id="btn-mobile-nav-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-teal-300" /> : <Menu className="w-5 h-5 text-slate-300" />}
              <span className="text-xs font-semibold">Menu</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Current:</span>
              <span className="text-xs font-bold text-teal-300 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-700/80">
                {currentTab}
              </span>
            </div>
          </div>

          {/* Tablet & PC Navigation Bar */}
          <div className="hidden md:flex items-center space-x-1 overflow-x-auto py-1.5 scrollbar-none w-full">
            {tabs
              .filter((tab) => isTabAllowedForRole(tab.id, currentRole).allowed)
              .map((tab) => {
                const isActive = currentTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    id={`nav-tab-${tab.id.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => onSelectTab(tab.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap group shrink-0 ${
                      isActive
                        ? 'bg-teal-700 text-white shadow-xs font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700 active:bg-slate-600'
                    }`}
                    title={tab.label}
                  >
                    <span className={isActive ? 'text-teal-200' : 'text-slate-400 group-hover:text-white'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>

                    {/* Unread badge on Notifications */}
                    {tab.id === 'Notifications' && unreadNotificationsCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-2xs">
                        {unreadNotificationsCount}
                      </span>
                    )}

                    {/* Active highlight pill */}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-300 rounded-full" />
                    )}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-700 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
            {tabs
              .filter((tab) => isTabAllowedForRole(tab.id, currentRole).allowed)
              .map((tab) => {
                const isActive = currentTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    id={`nav-mobile-${tab.id.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => {
                      onSelectTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 min-h-[46px] rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-teal-700 text-white font-bold shadow-xs'
                        : 'text-slate-200 hover:bg-slate-700 active:bg-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-teal-200' : 'text-slate-400'}>{tab.icon}</span>
                      <span className="text-[13px]">{tab.label}</span>
                      {tab.id === 'Notifications' && unreadNotificationsCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                          {unreadNotificationsCount}
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <span className="text-[10px] text-teal-200 uppercase font-extrabold tracking-wider bg-teal-800/80 px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        )}
      </div>
    </nav>
  );
};
