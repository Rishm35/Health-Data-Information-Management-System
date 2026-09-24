import React, { useState } from 'react';
import { DashboardSubTab, UserProfile } from '../types';
import { INITIAL_SUBMISSIONS, HEALTH_PROGRAMMES, HEALTHCARE_FACILITIES } from '../data/mockData';
import {
  LayoutDashboard,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Building2,
  Activity,
  Award,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  BarChart3,
  Flame,
  Mail,
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: UserProfile | null;
  initialSubTab?: DashboardSubTab;
  onOpenGmailDispatch?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  initialSubTab = 'Overview',
  onOpenGmailDispatch,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<DashboardSubTab>(initialSubTab);
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [resolvedAlertIds, setResolvedAlertIds] = useState<string[]>([]);

  // Simulated metrics
  const totalFacilities = HEALTHCARE_FACILITIES.length;
  const gradeACount = HEALTHCARE_FACILITIES.filter((f) => f.grade === 'A+' || f.grade === 'A').length;
  const averageCompliance = Math.round(
    HEALTHCARE_FACILITIES.reduce((acc, curr) => acc + curr.complianceScorePct, 0) / totalFacilities
  );

  const activeAlerts = [
    {
      id: 'alt-01',
      facility: 'Sub-Divisional Hospital Pindra',
      type: 'INVENTORY_STOCKOUT',
      severity: 'HIGH',
      message: 'Essential medicine availability dropped to 74%. ORS and Pediatric Amoxicillin registers require immediate warehouse dispatch.',
      time: 'Today, 08:30 AM',
      category: 'Supply Chain',
    },
    {
      id: 'alt-02',
      facility: 'Primary Health Centre Kashi Vidyapeeth',
      type: 'INFRASTRUCTURE',
      severity: 'MEDIUM',
      message: 'Auxiliary generator backup non-functional. Solar ILR battery running at 68% capacity.',
      time: 'Yesterday, 04:15 PM',
      category: 'Cold Chain Logistics',
    },
    {
      id: 'alt-03',
      facility: 'Community Health Centre Shivpur',
      type: 'CLINICAL_AUDIT',
      severity: 'HIGH',
      message: 'Single neonatal death flagged in CHC labour room. District mortality audit scheduled.',
      time: '3 days ago',
      category: 'Maternal & Child',
    },
  ];

  const handleResolveAlert = (id: string) => {
    setResolvedAlertIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-100 text-teal-800 tracking-wider">
                {currentUser?.role === 'STATE_ADMIN'
                  ? 'State Level Directorate Overview'
                  : currentUser?.role === 'DISTRICT_OFFICER'
                  ? 'District Health Society Console'
                  : 'Central Healthcare Dashboard'}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-2.5">
              <LayoutDashboard className="w-6 h-6 text-teal-700" />
              <span>Monitoring &amp; Analytics Dashboard</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Physical performance indicators, facility benchmarks, and real-time operational alerts
            </p>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs overflow-x-auto scrollbar-none">
            {(['Overview', 'Performance', 'Programme Analytics', 'Alerts'] as DashboardSubTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                  activeSubTab === tab
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id={`btn-dashboard-${tab.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {tab}
                {tab === 'Alerts' && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
                    {activeAlerts.length - resolvedAlertIds.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Global Filters */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <span className="text-slate-500 font-medium flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Filters:
            </span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:ring-1 focus:ring-teal-600 text-xs"
            >
              <option value="August 2026">August 2026 (Consolidated)</option>
              <option value="July 2026">July 2026</option>
              <option value="June 2026">June 2026</option>
            </select>

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:ring-1 focus:ring-teal-600 text-xs"
            >
              <option value="All Districts">All Districts (Statewide)</option>
              <option value="Varanasi">Varanasi</option>
              <option value="Prayagraj">Prayagraj</option>
              <option value="Gorakhpur">Gorakhpur</option>
              <option value="Lucknow">Lucknow</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onOpenGmailDispatch && (
              <button
                type="button"
                onClick={onOpenGmailDispatch}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-2xs transition"
                id="btn-dashboard-mail-return"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Mail Monthly Return (Gmail)</span>
              </button>
            )}
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>Synced 8 mins ago &bull; Validated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab 1: Overview */}
      {activeSubTab === 'Overview' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Monitored Facilities
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalFacilities}</div>
              <div className="mt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{gradeACount} rated Grade A/A+</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Average Compliance Score
              </span>
              <div className="text-2xl sm:text-3xl font-black text-teal-700">{averageCompliance}%</div>
              <div className="mt-2 text-[11px] text-teal-700 font-medium">
                Target: &ge;90% under NHM guidelines
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Institutional Deliveries
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">774</div>
              <div className="mt-2 text-[11px] text-indigo-600 font-medium">
                Varanasi District &bull; August 2026
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Verified Return Rate
              </span>
              <div className="text-2xl sm:text-3xl font-black text-sky-700">80.0%</div>
              <div className="mt-2 text-[11px] text-sky-700 font-medium">
                4 of 5 monthly returns signed off
              </div>
            </div>
          </div>

          {/* District Ranking & Facility Compliance Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-teal-700" />
                  <span>Facility Submissions &amp; Verification Status</span>
                </h3>
                <span className="text-[11px] text-slate-500">August 2026</span>
              </div>

              <div className="space-y-3">
                {INITIAL_SUBMISSIONS.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 bg-slate-50/50 transition flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 text-xs sm:text-sm">{sub.facilityName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono">{sub.id}</span>
                        <span>&bull;</span>
                        <span>{sub.facilityType}</span>
                        <span>&bull;</span>
                        <span>Deliveries: {sub.institutionalDeliveries}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          sub.status === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {sub.status === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                        {sub.status === 'Under Review' && <Clock className="w-3 h-3" />}
                        {sub.status === 'Needs Revision' && <AlertTriangle className="w-3 h-3" />}
                        <span>{sub.status}</span>
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-1">{sub.submissionDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Clinical Ratios */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-700" />
                <span>Critical Quality &amp; Clinical Indicators</span>
              </h3>

              <div className="space-y-4 pt-1">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Full Immunization Coverage (0-2 Yrs)</span>
                    <span className="text-teal-800">92.4%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: '92.4%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>C-Section to Total Deliveries Ratio</span>
                    <span className="text-sky-800">19.7%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-sky-600 h-2 rounded-full" style={{ width: '19.7%' }} />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">WHO Benchmark: 10% - 20%</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Essential Drug Availability in PHCs</span>
                    <span className="text-emerald-800">89.6%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '89.6%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Reporting Punctuality Index</span>
                    <span className="text-indigo-800">94.2%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '94.2%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Performance */}
      {activeSubTab === 'Performance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Facility Performance Rankings &amp; Turnaround Times</h3>
            <p className="text-xs text-slate-500 mb-6">
              Facilities assessed across reporting punctuality, clinical indicator completeness, and data audit accuracy.
            </p>

            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full text-left text-xs min-w-[620px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="pb-3 pl-2">Facility Name</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Sub-District</th>
                    <th className="pb-3">Beds</th>
                    <th className="pb-3">Reporting Punctuality</th>
                    <th className="pb-3">Compliance</th>
                    <th className="pb-3">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {HEALTHCARE_FACILITIES.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 pl-2 font-semibold text-slate-900">{f.name}</td>
                      <td className="py-3 font-mono text-[11px] text-teal-800">{f.type}</td>
                      <td className="py-3">{f.subDistrict}</td>
                      <td className="py-3 font-mono">{f.operationalBeds}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{f.reportingPunctualityPct}%</span>
                          <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${f.reportingPunctualityPct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-bold text-slate-900">{f.complianceScorePct}%</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            f.grade === 'A+'
                              ? 'bg-emerald-100 text-emerald-800'
                              : f.grade === 'A'
                              ? 'bg-teal-100 text-teal-800'
                              : f.grade === 'B'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          Grade {f.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Programme Analytics */}
      {activeSubTab === 'Programme Analytics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Flagship Healthcare Programmes &amp; Target Tracking</h3>
            <p className="text-xs text-slate-500 mb-6">
              Evaluation of physical targets versus on-ground achievement across active National Health Missions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {HEALTH_PROGRAMMES.map((prog) => {
                const pct = Math.round((prog.currentAchievement / prog.annualTarget) * 100);
                return (
                  <div key={prog.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                          {prog.code} &bull; {prog.category}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{prog.name}</h4>
                        <span className="text-[11px] text-slate-500">{prog.nodalDepartment}</span>
                      </div>
                      <span className="text-sm font-extrabold text-teal-800 font-mono">{pct}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full ${
                            pct >= 90 ? 'bg-emerald-600' : pct >= 75 ? 'bg-teal-600' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                        <span>Achieved: {prog.currentAchievement.toLocaleString()}</span>
                        <span>Annual Target: {prog.annualTarget.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-600">
                      <span>Budget Utilized: ₹{prog.budgetUtilizedCr} Cr</span>
                      <span>Total Allocated: ₹{prog.budgetAllocatedCr} Cr</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 4: Alerts */}
      {activeSubTab === 'Alerts' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Real-Time Clinical &amp; Operational Threshold Alerts</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated notifications triggered by cold-chain telemetry, stock dropouts, or anomalous health trends
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {activeAlerts.map((alt) => {
                const isResolved = resolvedAlertIds.includes(alt.id);
                return (
                  <div
                    key={alt.id}
                    className={`p-5 rounded-xl border transition ${
                      isResolved
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : alt.severity === 'HIGH'
                        ? 'bg-rose-50/50 border-rose-200 shadow-xs'
                        : 'bg-amber-50/50 border-amber-200 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            alt.severity === 'HIGH' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                          }`}
                        >
                          {alt.severity} Alert
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{alt.facility}</span>
                        <span className="text-[11px] text-slate-500 font-mono">({alt.category})</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{alt.time}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed mb-4">{alt.message}</p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-200/70 text-xs">
                      <span className="text-[11px] text-slate-500 font-mono">Alert ID: {alt.id}</span>
                      <button
                        onClick={() => handleResolveAlert(alt.id)}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-lg text-xs font-semibold transition ${
                          isResolved
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-teal-700 hover:bg-teal-800 text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isResolved ? 'Marked as Handled' : 'Acknowledge & Deploy Intervention'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
