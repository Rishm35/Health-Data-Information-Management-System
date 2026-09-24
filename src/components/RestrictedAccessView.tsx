import React from 'react';
import { MainTab, UserRole } from '../types';
import { ShieldAlert, Lock, ArrowRight, UserCheck, KeyRound, AlertCircle } from 'lucide-react';
import { DEMO_USERS } from '../data/mockData';

interface RestrictedAccessViewProps {
  requestedTab: MainTab;
  currentRole: UserRole | null;
  reason?: string;
  onNavigateToLogin: () => void;
  onQuickLogin: (role: UserRole) => void;
}

export const RestrictedAccessView: React.FC<RestrictedAccessViewProps> = ({
  requestedTab,
  currentRole,
  reason,
  onNavigateToLogin,
  onQuickLogin,
}) => {
  const isUnauthenticated = !currentRole;

  // Determine which demo role is recommended for this tab
  const getRecommendedRole = (): { role: UserRole; title: string; note: string } => {
    if (requestedTab === 'Admin Panel') {
      return {
        role: 'SUPER_ADMIN',
        title: 'System Super Administrator',
        note: 'The Admin Panel requires Super Admin clearance (Central IT Directorate).',
      };
    }
    if (requestedTab === 'Data Management') {
      return {
        role: 'FACILITY_OPERATOR',
        title: 'Facility Data Entry Operator',
        note: 'Facility Operators directly record and submit health indicator entries.',
      };
    }
    if (requestedTab === 'Dashboard' || requestedTab === 'Programmes' || requestedTab === 'Facilities') {
      return {
        role: 'DISTRICT_OFFICER',
        title: 'District Programme Officer (CMO)',
        note: 'District & State administrators monitor cross-facility performance & analytics.',
      };
    }
    return {
      role: 'STATE_ADMIN',
      title: 'State Health Mission Director',
      note: 'State level access includes high-level dashboards and policy analytics.',
    };
  };

  const rec = getRecommendedRole();

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 sm:p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-2">
                <Lock className="w-3 h-3" />
                {isUnauthenticated ? 'Protected Health Information Gateway' : 'Role Permission Insufficient'}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Access Restricted: {requestedTab}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {reason ||
                  `Access to the ${requestedTab} module is restricted in compliance with National Health Data Governance Protocols. Unauthorized access to real-time clinical and institutional records is strictly prohibited.`}
              </p>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Action: Go to Login */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-teal-800 font-bold text-base mb-2">
                  <KeyRound className="w-5 h-5 text-teal-600" />
                  <span>Official Institutional Sign-In</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {isUnauthenticated
                    ? 'Log in using your registered Facility ID, District Health Society credentials, or State Directorate authorization token.'
                    : 'You are currently logged in with a restricted role. Please switch to an account with higher clearance.'}
                </p>
              </div>

              <button
                onClick={onNavigateToLogin}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition"
                id="btn-restricted-go-to-login"
              >
                <span>Go to HDIMS Login Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Demo Unlock Action */}
            <div className="bg-teal-50/70 p-6 rounded-xl border border-teal-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-teal-900 font-bold text-base">
                    <UserCheck className="w-5 h-5 text-teal-700" />
                    <span>Quick Demo Unlock</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-200/80 text-teal-800">
                    Recommended Role
                  </span>
                </div>
                <p className="text-xs text-teal-900/80 leading-relaxed mb-2">
                  {rec.note}
                </p>
                <div className="p-2.5 rounded-lg bg-white/80 border border-teal-200 text-xs mb-4">
                  <span className="font-semibold text-slate-900 block">{DEMO_USERS[rec.role].name}</span>
                  <span className="text-slate-500 text-[11px] font-mono">{DEMO_USERS[rec.role].designation}</span>
                </div>
              </div>

              <button
                onClick={() => onQuickLogin(rec.role)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition"
                id="btn-restricted-quick-unlock"
              >
                <span>Log in as {rec.title.split(' ')[0]} {rec.title.split(' ')[1] || ''}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Governance Notice */}
          <div className="mt-6 flex items-start gap-2.5 text-xs text-slate-500 bg-white p-3.5 rounded-xl border border-slate-200">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              Under the HDIMS Digital Data Security Framework, every data request and attempted access is recorded in immutable audit trails. For technical assistance or privilege adjustments, contact your District Systems Officer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
