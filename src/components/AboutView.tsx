import React, { useState } from 'react';
import { AboutSubTab } from '../types';
import {
  Info,
  Target,
  Workflow,
  CheckCircle2,
  Building2,
  Hospital,
  Shield,
  Layers,
  ArrowRight,
  Database,
  Eye,
  FileSpreadsheet
} from 'lucide-react';

interface AboutViewProps {
  initialSubTab?: AboutSubTab;
}

export const AboutView: React.FC<AboutViewProps> = ({ initialSubTab = 'About HDIMS' }) => {
  const [activeSubTab, setActiveSubTab] = useState<AboutSubTab>(initialSubTab);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Sub-tab Navigation */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <Info className="w-6 h-6 text-teal-700" />
              <span>About HDIMS</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              National Health Data Information &amp; Management System Architecture &amp; Governance
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs overflow-x-auto scrollbar-none">
            {(['About HDIMS', 'Vision & Mission', 'How It Works'] as AboutSubTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                  activeSubTab === tab
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id={`btn-about-${tab.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: About HDIMS */}
        {activeSubTab === 'About HDIMS' && (
          <div className="pt-6 space-y-6">
            <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4">
              <p>
                The <strong>Health Data Information &amp; Management System (HDIMS)</strong> is a unified, state-of-the-art digital infrastructure conceptualized to revolutionize how clinical, logistical, and physical performance data are captured and mobilized across India's public healthcare ecosystem.
              </p>
              <p>
                Operating across the continuum from Primary Health Centres (PHCs) and Community Health Centres (CHCs) to Sub-Divisional Hospitals (SDHs) and District Hospitals (DHs), HDIMS replaces legacy paper registers with a certified, tamper-resistant digital ledger. Real-time entries enable district and state authorities to immediately identify regional health trends, vaccine stock variances, maternal referral bottlenecks, and epidemic vectors.
              </p>
            </div>

            {/* Core Modules Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold mb-2">
                  <Database className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Centralized Health Registry</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Master registry of 1,400+ accredited facilities, each with distinct geo-codes, bed capacities, and service classifications.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold mb-2">
                  <Eye className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Dynamic Validation Engine</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Multi-tier review workflow ensuring physical reports are cross-verified by District Program Officers before entering state archives.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold mb-2">
                  <Shield className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Role-Based Access (RBAC)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Strict cryptographic session controls preventing cross-facility contamination or unauthorized data alterations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Vision & Mission */}
        {activeSubTab === 'Vision & Mission' && (
          <div className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vision Card */}
              <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-4">
                  <Target className="w-4 h-4" />
                  <span>The Strategic Vision</span>
                </div>
                <h3 className="text-xl font-bold mb-3">A Data-Driven, Transparent Healthcare Ecosystem</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  To establish an interconnected digital health backbone that ensures every citizen's health service delivery—from remote tribal PHCs to urban multi-speciality hospitals—is accurately recorded, visible to decision makers, and transformed into timely, life-saving policy interventions.
                </p>
              </div>

              {/* Mission Card */}
              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-2xs">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 mb-4">
                  <Layers className="w-4 h-4 text-sky-600" />
                  <span>The Core Mission</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Measurable Objectives</h3>
                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Empower Ground Workers:</strong> Equip facility data operators with clean, intuitive digital tools for swift daily/monthly reporting.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Eliminate Reporting Lags:</strong> Compress data transfer timelines from weeks to seconds across administrative boundaries.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Actionable Intelligence:</strong> Generate automated indicators for maternal mortality, immunization gaps, and cold chain failures.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: How It Works */}
        {activeSubTab === 'How It Works' && (
          <div className="pt-6 space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                <Workflow className="w-5 h-5 text-teal-700" />
                <span>End-to-End Hierarchical Data Processing Workflow</span>
              </h3>
              <p className="text-xs text-slate-600 mb-6">
                HDIMS enforces a 4-stage validation chain where no high-level policy is formulated on unverified primary metrics.
              </p>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-extrabold flex items-center justify-center shrink-0">
                    01
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Step 1: Primary Data Entry at Facility Level</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Hospital or Primary Health Centre (PHC) operators log in using facility credentials. They fill in standardized indicator categories: Antenatal care registrations, institutional deliveries, infant immunizations, NCD screenings, bed occupancy, and drug availability. The system calculates compliance scores in real time.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 font-extrabold flex items-center justify-center shrink-0">
                    02
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Step 2: Sub-District / Block Level Consolidation</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Sub-district health officers monitor submission punctuality. If data entry is delayed or an obvious mathematical variance occurs (such as maternal deaths exceeding total deliveries), automated system flags prevent submission until reconciled.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 font-extrabold flex items-center justify-center shrink-0">
                    03
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Step 3: District Review &amp; Official Validation</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      The Chief Medical Officer (CMO) and District Programme Officers access the Data Validation console. They can approve verified returns or return them with specific revision notes (e.g., drug warehouse reconciliation). Once approved, data is cryptographically locked.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center shrink-0">
                    04
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Step 4: State / UT Aggregation &amp; Policy Deployment</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      State Health Mission Directors view district comparisons, budget burn rates, disease heatmaps, and programme performance against national targets (NHM / Ayushman Bharat), allocating funding and deploying specialist doctors where deficiencies exist.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
