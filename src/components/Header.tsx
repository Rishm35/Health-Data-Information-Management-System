import React from 'react';
import { UserProfile, MainTab, UserRole } from '../types';
import { Shield, Bell, User, LogOut, Activity, Building2, ChevronDown, CheckCircle2, Lock, ArrowRight, Mail } from 'lucide-react';
import { DEMO_USERS } from '../data/mockData';

interface HeaderProps {
  currentUser: UserProfile | null;
  unreadCount: number;
  onNavigate: (tab: MainTab, subTab?: string) => void;
  onLogout: () => void;
  onQuickLogin: (role: UserRole) => void;
  onOpenGmailDispatch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  unreadCount,
  onNavigate,
  onLogout,
  onQuickLogin,
  onOpenGmailDispatch,
}) => {
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
      {/* Official Government of Health Top Strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs px-3 sm:px-6 lg:px-8 py-1.5 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2 sm:gap-3 truncate pr-2">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="hidden xs:inline">MoHFW &bull;</span> Ministry of Health
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline">National Health Mission (NHM)</span>
          <span className="text-slate-600 hidden lg:inline">|</span>
          <span className="text-slate-400 hidden lg:inline">Hierarchical Data Gateway (v4.8)</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 text-[11px] sm:text-xs">
          <div className="hidden sm:flex items-center gap-1 text-slate-300 font-mono text-[11px]">
            <Shield className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="hidden md:inline">256-Bit Encrypted Pipeline</span>
            <span className="md:hidden">TLS 1.3</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 text-teal-300 text-[10px] font-mono border border-teal-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            <span>DB: asia-southeast1</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <div className="flex items-center gap-1 text-slate-400 whitespace-nowrap">
            <span className="hidden sm:inline">Support:</span>
            <span className="font-semibold text-white font-mono">1800-11-4346</span>
          </div>
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo & Title */}
        <div 
          onClick={() => onNavigate(currentUser ? 'Home' : 'Login')} 
          className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group shrink-0"
          id="hdims-logo-brand"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 flex items-center justify-center text-white shadow-md shadow-teal-900/10 ring-2 ring-teal-600/20 group-hover:ring-teal-600/40 transition">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-teal-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">HDIMS</span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                Official
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium hidden md:block">
              Health Data Information &amp; Management System
            </p>
          </div>
        </div>

        {/* Current Administrative Context & User Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {currentUser ? (
            <>
              {/* Hierarchy Context Badge - visible on Tablet and PC */}
              <div className="hidden md:flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700">
                <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
                <div className="truncate max-w-[140px] lg:max-w-xs">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block leading-tight">Tier</span>
                  <span className="font-bold text-slate-800 truncate block">
                    {currentUser.role === 'FACILITY_OPERATOR' && `Facility: ${currentUser.facilityName || 'PHC'}`}
                    {currentUser.role === 'DISTRICT_OFFICER' && `District: ${currentUser.district}`}
                    {currentUser.role === 'STATE_ADMIN' && `State: ${currentUser.state}`}
                    {currentUser.role === 'SUPER_ADMIN' && 'National Central Admin'}
                  </span>
                </div>
              </div>

              {/* Quick Role Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 min-h-[40px] rounded-lg text-xs font-semibold border border-teal-300 bg-teal-50/80 text-teal-900 hover:bg-teal-100 active:bg-teal-200 transition shadow-2xs"
                  title="Switch demonstration role"
                  id="btn-switch-role-menu"
                >
                  <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0"></span>
                  <span className="hidden sm:inline">Role:</span>
                  <span className="font-bold">
                    {currentUser.role === 'FACILITY_OPERATOR' ? 'Facility' :
                     currentUser.role === 'DISTRICT_OFFICER' ? 'District' :
                     currentUser.role === 'STATE_ADMIN' ? 'State' : 'Admin'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                </button>

                {showRoleMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowRoleMenu(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[80vh] overflow-y-auto">
                      <div className="px-3.5 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Switch Demo Role (Auto-Redirects)
                      </div>
                      {(['FACILITY_OPERATOR', 'DISTRICT_OFFICER', 'STATE_ADMIN', 'SUPER_ADMIN'] as UserRole[]).map((r) => {
                        const userObj = DEMO_USERS[r];
                        const isCurrent = currentUser.role === r;
                        return (
                          <button
                            key={r}
                            onClick={() => {
                              onQuickLogin(r);
                              setShowRoleMenu(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition min-h-[44px] ${
                              isCurrent ? 'bg-teal-50 font-semibold text-teal-900' : 'text-slate-700'
                            }`}
                          >
                            <div className="pr-2">
                              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                                {userObj.name}
                                {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 inline shrink-0" />}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">{userObj.role}</div>
                            </div>
                            <span className="text-[10px] font-semibold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded whitespace-nowrap">
                              {r === 'FACILITY_OPERATOR' && 'Data Entry'}
                              {r === 'DISTRICT_OFFICER' && 'District'}
                              {r === 'STATE_ADMIN' && 'State'}
                              {r === 'SUPER_ADMIN' && 'Admin'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Gmail End-of-Month Dispatch Button */}
              {onOpenGmailDispatch && (
                <button
                  onClick={onOpenGmailDispatch}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 min-h-[40px] rounded-lg text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition shadow-2xs"
                  title="Mail End-of-Month Health Report via Gmail"
                  id="btn-header-mail-report"
                >
                  <Mail className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span className="hidden sm:inline">Mail Report</span>
                </button>
              )}

              {/* Notification Icon */}
              <button
                onClick={() => onNavigate('Notifications')}
                className="relative p-2 sm:p-2.5 min-h-[40px] min-w-[40px] rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 transition flex items-center justify-center"
                title="System Notifications"
                id="btn-nav-notifications"
              >
                <Bell className="w-4 h-4 sm:w-4 sm:h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 pl-1 sm:pl-2 border-l border-slate-200">
                <div className="text-right hidden lg:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</div>
                  <div className="text-[11px] text-teal-700 font-medium truncate max-w-[150px]">{currentUser.designation.split(',')[0]}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-teal-100 border border-teal-300 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 sm:p-2.5 min-h-[40px] min-w-[40px] rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 active:bg-rose-100 transition flex items-center justify-center"
                  title="Secure Logout"
                  id="btn-header-logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
                <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Public Portal View (Authentication Required)</span>
              </div>
              <button
                onClick={() => onNavigate('Login')}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 min-h-[40px] rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition"
                id="btn-header-login-cta"
              >
                <User className="w-3.5 h-3.5" />
                <span>Portal Login</span>
                <ArrowRight className="w-3 h-3 hidden sm:inline" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
