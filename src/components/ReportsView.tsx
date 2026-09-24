import React, { useState } from 'react';
import { ReportsSubTab, UserProfile } from '../types';
import { isSubTabAllowedForRole } from '../utils/auth';
import { INITIAL_SUBMISSIONS, HEALTHCARE_FACILITIES, HEALTH_PROGRAMMES } from '../data/mockData';
import {
  FileBarChart2,
  Download,
  FileText,
  Printer,
  Share2,
  Calendar,
  Building2,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  Mail,
} from 'lucide-react';

interface ReportsViewProps {
  currentUser: UserProfile | null;
  initialSubTab?: ReportsSubTab;
  onOpenGmailDispatch?: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  currentUser,
  initialSubTab = 'Facility Reports',
  onOpenGmailDispatch,
}) => {
  const availableSubTabs = (['Facility Reports', 'District Reports', 'State Reports', 'Download Reports'] as ReportsSubTab[]).filter(
    (tab) => isSubTabAllowedForRole('Reports', tab, currentUser ? currentUser.role : null).allowed
  );

  const [activeSubTab, setActiveSubTab] = useState<ReportsSubTab>(
    availableSubTabs.includes(initialSubTab) ? initialSubTab : availableSubTabs[0] || 'Facility Reports'
  );
  const [selectedQuarter, setSelectedQuarter] = useState('Q2 (Jul - Sep 2026)');
  const [downloadSuccess, setDownloadSuccess] = useState('');

  const triggerCSVDownload = (reportType: string) => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    if (reportType === 'facility') {
      csvContent += 'Facility Code,Facility Name,Type,District,Sub-District,Beds,Compliance %,Punctuality %,Grade\n';
      HEALTHCARE_FACILITIES.forEach((f) => {
        csvContent += `${f.code},"${f.name}",${f.type},${f.district},${f.subDistrict},${f.operationalBeds},${f.complianceScorePct}%,${f.reportingPunctualityPct}%,${f.grade}\n`;
      });
    } else if (reportType === 'submissions') {
      csvContent += 'Reference ID,Facility Name,Month,Institutional Deliveries,ANC Registrations,Full Immunizations,NCD Screened,Drugs Availability %,Status\n';
      INITIAL_SUBMISSIONS.forEach((s) => {
        csvContent += `${s.id},"${s.facilityName}",${s.reportMonth},${s.institutionalDeliveries},${s.antenatalRegistrations},${s.infantImmunizationCompleted},${s.ncdHypertensionScreened},${s.essentialMedicinesAvailablePct}%,${s.status}\n`;
      });
    } else {
      csvContent += 'Scheme Code,Scheme Name,Category,Target,Achievement,Progress %,Budget Allocated (Cr),Budget Utilized (Cr)\n';
      HEALTH_PROGRAMMES.forEach((p) => {
        const pct = Math.round((p.currentAchievement / p.annualTarget) * 100);
        csvContent += `${p.code},"${p.name}",${p.category},${p.annualTarget},${p.currentAchievement},${pct}%,${p.budgetAllocatedCr},${p.budgetUtilizedCr}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HDIMS_${reportType.toUpperCase()}_REPORT_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`Generated and downloaded HDIMS_${reportType.toUpperCase()}_REPORT_2026.csv`);
    setTimeout(() => setDownloadSuccess(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Download Alert */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-teal-500/50 flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-xs font-medium">{downloadSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <FileBarChart2 className="w-6 h-6 text-teal-700" />
              <span>Hierarchical Health Reports &amp; Analytics</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Facility scorecards, District consolidation matrices, and State Health Index summaries
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs overflow-x-auto scrollbar-none">
            {availableSubTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                  activeSubTab === tab
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id={`btn-report-${tab.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-700 shrink-0" />
            <span>Quarterly Window: <strong>{selectedQuarter}</strong></span>
          </div>
          <span className="text-[11px] text-slate-400">Validated under MoHFW HMIS/HDIMS Standard Format</span>
        </div>
      </div>

      {/* Sub-tab 1: Facility Reports */}
      {activeSubTab === 'Facility Reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Facility Scorecard &amp; Delivery Breakdown</h3>
                <p className="text-xs text-slate-500">Individual operational audits across maternal health and logistics</p>
              </div>
              <button
                onClick={() => triggerCSVDownload('facility')}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Facility CSV</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INITIAL_SUBMISSIONS.map((sub) => (
                <div key={sub.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{sub.facilityName}</h4>
                      <span className="text-[11px] text-slate-500">{sub.facilityType} &bull; {sub.district} &bull; {sub.reportMonth}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {sub.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center bg-white p-2.5 rounded-lg border text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Deliveries</span>
                      <strong className="text-slate-900">{sub.institutionalDeliveries}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Vaccinations</span>
                      <strong className="text-slate-900">{sub.infantImmunizationCompleted}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Essential Drugs</span>
                      <strong className="text-teal-800">{sub.essentialMedicinesAvailablePct}%</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: District Reports */}
      {activeSubTab === 'District Reports' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base">District-Level Consolidation Report (Varanasi District)</h3>
              <p className="text-xs text-slate-500">Aggregated physical achievements and maternal outcomes</p>
            </div>
            <button
              onClick={() => triggerCSVDownload('submissions')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Consolidated CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block font-semibold uppercase text-[10px]">Total Institutional Deliveries</span>
              <strong className="text-xl text-slate-900">774</strong>
              <span className="block text-[11px] text-emerald-600 mt-0.5">+4.2% over July 2026</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold uppercase text-[10px]">C-Section Ratio</span>
              <strong className="text-xl text-sky-800">19.7%</strong>
              <span className="block text-[11px] text-slate-500 mt-0.5">Compliant with safety ceiling</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold uppercase text-[10px]">Full Immunization Rate</span>
              <strong className="text-xl text-indigo-800">92.4%</strong>
              <span className="block text-[11px] text-indigo-600 mt-0.5">Mission Indradhanush Tier 1</span>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 3: State Reports */}
      {activeSubTab === 'State Reports' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">State Health Directorate Executive Matrix</h3>
          <p className="text-xs text-slate-500 mb-4">
            State-level monitoring summary submitted to National Health Systems Resource Centre (NHSRC) and NITI Aayog Health Index.
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-teal-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Statewide Monthly Reporting Compliance</h4>
                <p className="text-slate-600 text-xs mt-0.5">1,420 out of 1,446 accredited facilities submitted August reports within deadline.</p>
              </div>
              <span className="text-lg font-black text-teal-800 font-mono self-end sm:self-auto shrink-0">98.2%</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-sky-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Maternal Mortality Ratio (MMR Proxy Index)</h4>
                <p className="text-slate-600 text-xs mt-0.5">1 maternal death documented per 774 institutional deliveries in monitored Varanasi cluster.</p>
              </div>
              <span className="text-lg font-black text-sky-800 font-mono self-end sm:self-auto shrink-0">1.29 / 1k</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-indigo-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Ayushman Bharat Secondary Claims Cleared</h4>
                <p className="text-slate-600 text-xs mt-0.5">Pre-authorized hospitalisation claims settled within 7-day turnaround window.</p>
              </div>
              <span className="text-lg font-black text-indigo-800 font-mono self-end sm:self-auto shrink-0">94.8%</span>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 4: Download Reports */}
      {activeSubTab === 'Download Reports' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Official Export &amp; Regulatory Archives</h3>
          <p className="text-xs text-slate-500 mb-6">
            Generate and export signed CSV and PDF data packages for departmental audits and statutory archiving.
          </p>

          {/* End-of-Month Gmail Dispatch Card */}
          <div className="p-5 sm:p-6 rounded-2xl border-2 border-teal-600/30 bg-gradient-to-br from-teal-50 via-white to-sky-50 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs mb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-800 text-white tracking-wider flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Google Workspace
                </span>
                <span className="text-xs font-bold text-teal-900">Official Gmail API Dispatch</span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">
                End-of-Month Final Updated Data Return
              </h4>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                Consolidate and transmit the complete, cryptographically verified monthly health performance digest (Deliveries, Immunization, NCDs, Stocks, and Scheme Allocations) directly to authorized user emails via Gmail.
              </p>
            </div>

            {onOpenGmailDispatch && (
              <button
                type="button"
                onClick={onOpenGmailDispatch}
                className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-extrabold text-xs shadow-md transition shrink-0"
                id="btn-reports-open-gmail-dispatch"
              >
                <Mail className="w-4 h-4" />
                <span>Mail Final Return (Gmail)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <FileSpreadsheet className="w-8 h-8 text-teal-700 mb-3" />
                <h4 className="font-bold text-slate-900 text-sm">Facility Directory &amp; Compliance</h4>
                <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
                  Complete register of all 8 facilities, bed capacity, in-charge doctors, and Grade A ratings.
                </p>
              </div>
              <button
                onClick={() => triggerCSVDownload('facility')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV File</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <FileText className="w-8 h-8 text-sky-700 mb-3" />
                <h4 className="font-bold text-slate-900 text-sm">Monthly Returns Ledger</h4>
                <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
                  All submitted clinical indicators (ANC, Deliveries, Immunization, NCDs, Drug stock) for August 2026.
                </p>
              </div>
              <button
                onClick={() => triggerCSVDownload('submissions')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs transition"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV File</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <Printer className="w-8 h-8 text-indigo-700 mb-3" />
                <h4 className="font-bold text-slate-900 text-sm">National Schemes Progress</h4>
                <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
                  Consolidated target vs achievement and budget burn rate for RMNCH+A, IMI 5.0, and NTEP.
                </p>
              </div>
              <button
                onClick={() => triggerCSVDownload('programmes')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-semibold text-xs transition"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
