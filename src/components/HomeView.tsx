import React from 'react';
import { UserProfile, MainTab, UserRole } from '../types';
import {
  Activity,
  Hospital,
  Building2,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  AlertTriangle,
  Layers,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';

interface HomeViewProps {
  currentUser: UserProfile | null;
  onNavigate: (tab: MainTab, subTab?: string) => void;
  onQuickLogin: (role: UserRole) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentUser,
  onNavigate,
  onQuickLogin,
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden border border-slate-800">
        {/* Decorative ambient patterns */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-4">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            National Health Data Information &amp; Management System (HDIMS)
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Transparent, Connected &amp; Data-Driven Healthcare Monitoring
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            A centralized digital platform designed to streamline real-time performance data collection from primary healthcare facilities to Sub-District, District, and State/UT directorates.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {currentUser ? (
              <button
                onClick={() => {
                  if (currentUser.role === 'FACILITY_OPERATOR') onNavigate('Data Management', 'Enter Data');
                  else if (currentUser.role === 'DISTRICT_OFFICER') onNavigate('Dashboard', 'Overview');
                  else if (currentUser.role === 'STATE_ADMIN') onNavigate('Dashboard', 'Programme Analytics');
                  else onNavigate('Admin Panel', 'Users');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition"
                id="btn-home-open-workspace"
              >
                <span>Enter Your Authorized Module</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('Login')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition"
                  id="btn-home-login-primary"
                >
                  <span>Institutional Login Gateway</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('About', 'How It Works')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition"
                  id="btn-home-learn-workflow"
                >
                  <span>Explore 4-Tier Data Flow</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Top Indicators Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Reporting Facilities</span>
            <Hospital className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">1,420</div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>98.2% Active PHC &amp; CHC reporting</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly Compliance</span>
            <FileCheck2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">96.4%</div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-sky-600 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aug 2026 Timely Verifications</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Institutional Deliveries</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">1.62M</div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
            <Award className="w-3.5 h-3.5" />
            <span>RMNCH+A Verified Outcomes</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Monitoring Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">18</div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-600 font-medium">
            <span>Critical stock &amp; cold-chain alerts</span>
          </div>
        </div>
      </div>

      {/* Hierarchical Data Flow Architecture Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Hierarchical Healthcare Data Pipeline
            </h2>
            <p className="text-xs text-slate-500">
              Seamless data aggregation from ground-level primary clinics to the State Cabinet
            </p>
          </div>
          <span className="self-start text-[11px] font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Real-Time Synchronization
          </span>
        </div>

        {/* 4 Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Tier 1 */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Facility Level</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                PHCs, CHCs, and District Hospitals enter direct service delivery, bed occupancy, and drug inventory logs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-medium text-teal-700">
              Role: Facility Operator
            </div>
          </div>

          {/* Tier 2 */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Sub-District Level</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Block Health Units aggregate local cluster submissions and audit outlier indicators before forwarding.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-medium text-sky-700">
              Role: Block Medical Officer
            </div>
          </div>

          {/* Tier 3 */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">District Level</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Chief Medical Officer (CMO) conducts data validation, identifies facility bottlenecks, and resolves alerts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-medium text-indigo-700">
              Role: District Health Officer
            </div>
          </div>

          {/* Tier 4 */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mb-3">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm">State / UT Level</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                State Health Missionaries review programme benchmarks, allocate resources, and report to National MoHFW.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-medium text-emerald-700">
              Role: State Mission Director
            </div>
          </div>
        </div>
      </div>

      {/* Key Objectives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1.5">Real-Time Data Entry</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminate delayed manual paper registers with structured digital forms covering maternal care, vaccines, and non-communicable diseases.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1.5">Centralized Monitoring</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Allow administrators to monitor physical performance dynamically across health programmes with target achievement progress bars.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1.5">Data-Driven Interventions</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Identify maternal referral clusters, localized vaccine dropouts, and medicine stock variances for rapid administrative action.
          </p>
        </div>
      </div>
    </div>
  );
};
