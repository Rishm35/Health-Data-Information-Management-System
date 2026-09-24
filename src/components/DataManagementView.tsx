import React, { useState } from 'react';
import { DataManagementSubTab, UserProfile, HealthDataSubmission } from '../types';
import { isSubTabAllowedForRole } from '../utils/auth';
import {
  FileSpreadsheet,
  PlusCircle,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Save,
  FileCheck,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
  QrCode,
  X,
  Printer
} from 'lucide-react';

interface DataManagementViewProps {
  currentUser: UserProfile | null;
  submissions: HealthDataSubmission[];
  initialSubTab?: DataManagementSubTab;
  onAddSubmission: (submission: HealthDataSubmission) => void;
  onUpdateSubmissionStatus: (id: string, status: HealthDataSubmission['status'], notes?: string) => void;
}

export const DataManagementView: React.FC<DataManagementViewProps> = ({
  currentUser,
  submissions,
  initialSubTab = 'Enter Data',
  onAddSubmission,
  onUpdateSubmissionStatus,
}) => {
  // Check role permission for subtabs (e.g. Data Validation requires District+)
  const isValidationAllowed = currentUser?.role && currentUser.role !== 'FACILITY_OPERATOR';

  const availableSubTabs = (['Enter Data', 'Update Data', 'Submitted Data', 'Data Validation'] as DataManagementSubTab[]).filter(
    (tab) => tab !== 'Data Validation' || isValidationAllowed
  );

  const [activeSubTab, setActiveSubTab] = useState<DataManagementSubTab>(
    initialSubTab === 'Data Validation' && !isValidationAllowed ? 'Enter Data' : initialSubTab
  );
  const [selectedSubmissionForReceipt, setSelectedSubmissionForReceipt] = useState<HealthDataSubmission | null>(null);
  const [revisionNotesInput, setRevisionNotesInput] = useState('');
  const [activeRevisionId, setActiveRevisionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [successToast, setSuccessToast] = useState('');

  // Form State for Enter Data
  const [reportMonth, setReportMonth] = useState('September 2026');
  const [facilityName, setFacilityName] = useState(currentUser?.facilityName || 'Primary Health Centre Rampur');
  const [facilityType, setFacilityType] = useState<'PHC' | 'CHC' | 'SDH' | 'DH'>(currentUser?.facilityType && currentUser.facilityType !== 'DIRECTORATE' ? currentUser.facilityType : 'PHC');
  const [district, setDistrict] = useState(currentUser?.district || 'Varanasi');
  
  // Indicators
  const [antenatalRegistrations, setAntenatalRegistrations] = useState<number>(135);
  const [highRiskPregnancies, setHighRiskPregnancies] = useState<number>(18);
  const [institutionalDeliveries, setInstitutionalDeliveries] = useState<number>(44);
  const [cSectionDeliveries, setCSectionDeliveries] = useState<number>(0);
  const [maternalDeaths, setMaternalDeaths] = useState<number>(0);

  const [infantImmunizationCompleted, setInfantImmunizationCompleted] = useState<number>(82);
  const [pentavalentDoses, setPentavalentDoses] = useState<number>(108);
  const [measlesRubella, setMeaslesRubella] = useState<number>(76);
  const [neonatalDeaths, setNeonatalDeaths] = useState<number>(0);

  const [ncdHypertension, setNcdHypertension] = useState<number>(310);
  const [ncdDiabetes, setNcdDiabetes] = useState<number>(270);
  const [tbPresumptive, setTbPresumptive] = useState<number>(32);
  const [malariaTests, setMalariaTests] = useState<number>(78);

  const [sanctionedBeds, setSanctionedBeds] = useState<number>(12);
  const [occupiedBeds, setOccupiedBeds] = useState<number>(7);
  const [essentialMedsPct, setEssentialMedsPct] = useState<number>(92);
  const [coldChainOk, setColdChainOk] = useState<boolean>(true);
  const [powerBackupOk, setPowerBackupOk] = useState<boolean>(true);
  const [remarks, setRemarks] = useState<string>('Monthly routine immunization drive conducted at all 4 sub-centre outreach sessions.');

  const handleSubTabChange = (tab: DataManagementSubTab) => {
    setActiveSubTab(tab);
  };

  const handleFormSubmit = (isDraft: boolean) => {
    // Validation check
    if (cSectionDeliveries > institutionalDeliveries) {
      alert('Validation Error: C-Section deliveries cannot exceed total institutional deliveries.');
      return;
    }

    const newSub: HealthDataSubmission = {
      id: `SUB-2026-09-${Math.floor(100 + Math.random() * 900)}`,
      reportMonth,
      submissionDate: '2026-09-17',
      facilityId: currentUser?.facilityId || 'FAC-UP-VAR-001',
      facilityName,
      facilityType,
      district,
      state: currentUser?.state || 'Uttar Pradesh',
      submittedBy: `${currentUser?.name || 'Operator'} (${currentUser?.username || 'user'})`,
      status: isDraft ? 'Draft' : 'Submitted',
      antenatalRegistrations,
      highRiskPregnanciesIdentified: highRiskPregnancies,
      institutionalDeliveries,
      cSectionDeliveries,
      maternalDeaths,
      infantImmunizationCompleted,
      pentavalentDosesAdministered: pentavalentDoses,
      measlesRubellaVaccines: measlesRubella,
      neonatalDeaths,
      ncdHypertensionScreened: ncdHypertension,
      ncdDiabetesScreened: ncdDiabetes,
      tbPresumptiveCasesScreened: tbPresumptive,
      malariaTestsConducted: malariaTests,
      totalSanctionedBeds: sanctionedBeds,
      occupiedBedsAverage: occupiedBeds,
      essentialMedicinesAvailablePct: essentialMedsPct,
      functionalColdChainEquipment: coldChainOk,
      powerBackupFunctional: powerBackupOk,
      remarks,
    };

    onAddSubmission(newSub);
    setSuccessToast(
      isDraft
        ? 'Draft saved successfully. You may update and submit later.'
        : `Report for ${reportMonth} successfully submitted to District Health Society (Ref: ${newSub.id})!`
    );
    setActiveSubTab('Submitted Data');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      s.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.reportMonth.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-teal-500/50 flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-xs font-medium">{successToast}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-100 text-teal-800 tracking-wider">
                Facility &amp; District Operations
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-2.5">
              <FileSpreadsheet className="w-6 h-6 text-teal-700" />
              <span>Health Data Management Portal</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Record physical performance data, manage historical submissions, and execute multi-tier verification
            </p>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs overflow-x-auto scrollbar-none">
            {availableSubTabs.map((tab) => {
              return (
                <button
                  key={tab}
                  onClick={() => handleSubTabChange(tab)}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                    activeSubTab === tab
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  id={`btn-data-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                  title={tab}
                >
                  {tab}
                  {tab === 'Data Validation' && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 text-sky-800 font-bold">
                      {submissions.filter((s) => s.status === 'Submitted' || s.status === 'Under Review').length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Operational Context Banner */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Building2 className="w-4 h-4 text-teal-700" />
            <span>Active Reporting Unit: <strong>{facilityName}</strong></span>
            <span className="text-slate-400">|</span>
            <span className="font-mono text-slate-500">District: {district}</span>
          </div>
          <div className="text-[11px] text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            Current Reporting Cycle: <strong>August - September 2026</strong>
          </div>
        </div>
      </div>

      {/* Sub-tab 1: Enter Data Form */}
      {activeSubTab === 'Enter Data' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-teal-700" />
                  <span>Real-Time Health Performance Data Entry</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete all key indicator modules for monthly consolidation and submission to the District Health Officer.
                </p>
              </div>

              {/* Cycle selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Reporting Month:</span>
                <select
                  value={reportMonth}
                  onChange={(e) => setReportMonth(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-800 focus:ring-1 focus:ring-teal-600"
                >
                  <option value="September 2026">September 2026 (Active)</option>
                  <option value="August 2026">August 2026 (Retroactive)</option>
                </select>
              </div>
            </div>

            {/* Section 1: Maternal Health */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm text-teal-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">1</span>
                  <span>Maternal &amp; Reproductive Health Indicators (RMNCH+A)</span>
                </h3>
                <span className="text-[11px] text-slate-500">Monthly Headcount</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Antenatal Care Registrations (ANC)
                  </label>
                  <input
                    type="number"
                    value={antenatalRegistrations}
                    onChange={(e) => setAntenatalRegistrations(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    High Risk Pregnancies (HRP) Identified
                  </label>
                  <input
                    type="number"
                    value={highRiskPregnancies}
                    onChange={(e) => setHighRiskPregnancies(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Institutional Deliveries
                  </label>
                  <input
                    type="number"
                    value={institutionalDeliveries}
                    onChange={(e) => setInstitutionalDeliveries(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Caesarean Section (C-Section) Deliveries
                  </label>
                  <input
                    type="number"
                    value={cSectionDeliveries}
                    onChange={(e) => setCSectionDeliveries(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Maternal Deaths in Facility
                  </label>
                  <input
                    type="number"
                    value={maternalDeaths}
                    onChange={(e) => setMaternalDeaths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Child Health & Universal Immunization */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm text-teal-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-sky-100 text-sky-800 flex items-center justify-center text-xs font-bold">2</span>
                  <span>Child Health &amp; Mission Indradhanush Immunization</span>
                </h3>
                <span className="text-[11px] text-slate-500">Universal Coverage</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fully Immunized Infants (0-11 Mo)
                  </label>
                  <input
                    type="number"
                    value={infantImmunizationCompleted}
                    onChange={(e) => setInfantImmunizationCompleted(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pentavalent 1/2/3 Doses Given
                  </label>
                  <input
                    type="number"
                    value={pentavalentDoses}
                    onChange={(e) => setPentavalentDoses(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Measles-Rubella (MR) Doses
                  </label>
                  <input
                    type="number"
                    value={measlesRubella}
                    onChange={(e) => setMeaslesRubella(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Neonatal Deaths Reported
                  </label>
                  <input
                    type="number"
                    value={neonatalDeaths}
                    onChange={(e) => setNeonatalDeaths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Non-Communicable Diseases & Communicable Surveillance */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm text-teal-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-bold">3</span>
                  <span>Disease Surveillance &amp; NCD Screenings (30+ Yrs)</span>
                </h3>
                <span className="text-[11px] text-slate-500">Preventive Care</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hypertension Screened
                  </label>
                  <input
                    type="number"
                    value={ncdHypertension}
                    onChange={(e) => setNcdHypertension(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Diabetes Mellitus Screened
                  </label>
                  <input
                    type="number"
                    value={ncdDiabetes}
                    onChange={(e) => setNcdDiabetes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    TB Presumptive Tested (NTEP)
                  </label>
                  <input
                    type="number"
                    value={tbPresumptive}
                    onChange={(e) => setTbPresumptive(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Malaria / Dengue RDT Tests
                  </label>
                  <input
                    type="number"
                    value={malariaTests}
                    onChange={(e) => setMalariaTests(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Logistics, Beds & Pharmacy */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm text-teal-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">4</span>
                  <span>Facility Infrastructure, Inpatient Beds &amp; Drug Logistics</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sanctioned Beds / Avg Occupancy
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={sanctionedBeds}
                      onChange={(e) => setSanctionedBeds(Number(e.target.value))}
                      placeholder="Total"
                      className="w-1/2 px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium"
                    />
                    <input
                      type="number"
                      value={occupiedBeds}
                      onChange={(e) => setOccupiedBeds(Number(e.target.value))}
                      placeholder="Occupied"
                      className="w-1/2 px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Essential Drugs Availability (% against EDL)
                  </label>
                  <input
                    type="number"
                    value={essentialMedsPct}
                    onChange={(e) => setEssentialMedsPct(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cold Chain &amp; Power Telemetry
                  </label>
                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={coldChainOk}
                        onChange={(e) => setColdChainOk(e.target.checked)}
                        className="rounded text-teal-600"
                      />
                      <span>ILR Active</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={powerBackupOk}
                        onChange={(e) => setPowerBackupOk(e.target.checked)}
                        className="rounded text-teal-600"
                      />
                      <span>Generator OK</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Facility Officer Observations / Operational Remarks
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                  placeholder="Note down any maternal transfer reasons, supply delay notes, or outreach remarks"
                />
              </div>
            </div>

            {/* Submission Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => handleFormSubmit(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                id="btn-save-draft"
              >
                <Save className="w-4 h-4" />
                <span>Save Interim Draft</span>
              </button>

              <button
                type="button"
                onClick={() => handleFormSubmit(false)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-xs font-bold shadow-md transition"
                id="btn-submit-data-to-district"
              >
                <Send className="w-4 h-4" />
                <span>Submit to District Health Society</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Update Data */}
      {activeSubTab === 'Update Data' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Revision Queue &amp; Saved Drafts</h3>
            <p className="text-xs text-slate-500 mb-4">
              Entries requiring field amendments due to supervisor remarks, drug store reconciliation, or draft status.
            </p>

            <div className="space-y-4">
              {submissions
                .filter((s) => s.status === 'Needs Revision' || s.status === 'Draft')
                .map((sub) => (
                  <div key={sub.id} className="p-5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          {sub.status}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{sub.facilityName} - {sub.reportMonth}</h4>
                        <span className="text-[11px] text-slate-500 font-mono">Reference: {sub.id}</span>
                      </div>
                      <span className="text-xs text-slate-500">{sub.submissionDate}</span>
                    </div>

                    {sub.revisionNotes && (
                      <div className="p-3 rounded-lg bg-white border border-amber-200 text-xs text-amber-900">
                        <span className="font-bold block mb-0.5">District Officer Revision Instruction:</span>
                        {sub.revisionNotes}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-amber-200 text-xs">
                      <span className="text-slate-600">Deliveries: {sub.institutionalDeliveries} | Meds: {sub.essentialMedicinesAvailablePct}%</span>
                      <button
                        onClick={() => {
                          setReportMonth(sub.reportMonth);
                          setAntenatalRegistrations(sub.antenatalRegistrations);
                          setInstitutionalDeliveries(sub.institutionalDeliveries);
                          setEssentialMedsPct(90); // Amended
                          setActiveSubTab('Enter Data');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Load into Editor &amp; Re-submit</span>
                      </button>
                    </div>
                  </div>
                ))}

              {submissions.filter((s) => s.status === 'Needs Revision' || s.status === 'Draft').length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No active revision requests or uncommitted drafts found. All submissions are in order!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Submitted Data */}
      {activeSubTab === 'Submitted Data' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Consolidated Facility Submission Ledger</h3>
                <p className="text-xs text-slate-500">Search historical physical reports and inspect cryptographic receipts</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search facility or ID..."
                    className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs w-full sm:w-48"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 font-medium text-xs flex-1 sm:flex-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Verified">Verified</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Needs Revision">Needs Revision</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="pb-3 pl-2">Submission Ref</th>
                    <th className="pb-3">Facility Name</th>
                    <th className="pb-3">Cycle</th>
                    <th className="pb-3">Deliveries</th>
                    <th className="pb-3">Immunizations</th>
                    <th className="pb-3">Submitted By</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 pl-2 font-mono text-[11px] font-bold text-teal-800">{sub.id}</td>
                      <td className="py-3.5 font-semibold text-slate-900">{sub.facilityName}</td>
                      <td className="py-3.5">{sub.reportMonth}</td>
                      <td className="py-3.5 font-mono">{sub.institutionalDeliveries}</td>
                      <td className="py-3.5 font-mono">{sub.infantImmunizationCompleted}</td>
                      <td className="py-3.5 text-slate-500 text-[11px]">{sub.submittedBy.split('(')[0]}</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            sub.status === 'Verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sub.status === 'Under Review'
                              ? 'bg-amber-100 text-amber-800'
                              : sub.status === 'Needs Revision'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        <button
                          onClick={() => setSelectedSubmissionForReceipt(sub)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 4: Data Validation (District & State Officer Console) */}
      {activeSubTab === 'Data Validation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-700" />
                  <span>District / State Supervisory Validation Console</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify primary returns from facilities, inspect indicator variances, and sign off monthly certificates
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200">
                Supervisor: {currentUser?.name} ({currentUser?.designation.split(',')[0]})
              </span>
            </div>

            <div className="space-y-4">
              {submissions.map((sub) => {
                const isPending = sub.status === 'Submitted' || sub.status === 'Under Review';
                return (
                  <div
                    key={sub.id}
                    className={`p-5 rounded-xl border transition ${
                      isPending ? 'bg-sky-50/40 border-sky-200 shadow-2xs' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{sub.facilityName}</span>
                          <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border">
                            {sub.id}
                          </span>
                          <span className="text-xs font-semibold text-teal-800">[{sub.reportMonth}]</span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Submitted by {sub.submittedBy} on {sub.submissionDate}
                        </span>
                      </div>

                      <span
                        className={`self-start sm:self-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          sub.status === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.status === 'Needs Revision'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>

                    {/* Metrics snapshot grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-lg border border-slate-200/80 text-xs mb-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Deliveries</span>
                        <span className="font-bold text-slate-900">{sub.institutionalDeliveries} (C-Sec: {sub.cSectionDeliveries})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Immunizations</span>
                        <span className="font-bold text-slate-900">{sub.infantImmunizationCompleted} infants</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">NCD Screened</span>
                        <span className="font-bold text-slate-900">{sub.ncdHypertensionScreened}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Drug Availability</span>
                        <span className="font-bold text-slate-900">{sub.essentialMedicinesAvailablePct}%</span>
                      </div>
                    </div>

                    {sub.remarks && (
                      <p className="text-xs text-slate-600 mb-3 italic">
                        &ldquo;{sub.remarks}&rdquo;
                      </p>
                    )}

                    {sub.revisionNotes && (
                      <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 mb-3">
                        <strong>Existing Revision Note:</strong> {sub.revisionNotes}
                      </div>
                    )}

                    {/* Review actions */}
                    {isPending && (
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80">
                        {activeRevisionId === sub.id ? (
                          <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <input
                              type="text"
                              value={revisionNotesInput}
                              onChange={(e) => setRevisionNotesInput(e.target.value)}
                              placeholder="Enter specific discrepancies or reconciliation request..."
                              className="flex-1 px-3 py-1.5 rounded-lg border border-rose-300 text-xs min-h-[38px]"
                            />
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <button
                                onClick={() => {
                                  if (!revisionNotesInput.trim()) {
                                    alert('Please enter reason for requesting revision.');
                                    return;
                                  }
                                  onUpdateSubmissionStatus(sub.id, 'Needs Revision', revisionNotesInput);
                                  setActiveRevisionId(null);
                                  setRevisionNotesInput('');
                                }}
                                className="px-3 py-1.5 min-h-[38px] rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition"
                              >
                                Confirm Revision Request
                              </button>
                              <button
                                onClick={() => setActiveRevisionId(null)}
                                className="px-2.5 py-1.5 min-h-[38px] text-xs text-slate-600 hover:text-slate-900 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className="text-[11px] text-slate-500">
                              Verification locks record into State Statistical Database.
                            </span>
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                              <button
                                onClick={() => setActiveRevisionId(sub.id)}
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Request Revision</span>
                              </button>
                              <button
                                onClick={() => onUpdateSubmissionStatus(sub.id, 'Verified')}
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-1.5 min-h-[38px] rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Verify &amp; Sign Off</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {sub.status === 'Verified' && sub.reviewedBy && (
                      <div className="text-[11px] text-emerald-700 flex items-center gap-1.5 pt-2 border-t border-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Signed off by {sub.reviewedBy} at {sub.reviewedAt}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Digital Receipt / Certificate Modal */}
      {selectedSubmissionForReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-300 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-teal-700 font-bold">
                  GOVERNMENT OF INDIA &bull; NATIONAL HEALTH MISSION
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  Official Health Performance Certificate
                </h3>
                <span className="text-xs text-slate-500 font-mono">Reference: {selectedSubmissionForReceipt.id}</span>
              </div>
              <button
                onClick={() => setSelectedSubmissionForReceipt(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border">
                <div>
                  <span className="text-slate-400 font-medium">Facility Name:</span>
                  <p className="font-bold text-slate-900">{selectedSubmissionForReceipt.facilityName}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Administrative Jurisdiction:</span>
                  <p className="font-bold text-slate-900">{selectedSubmissionForReceipt.district}, {selectedSubmissionForReceipt.state}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Reporting Cycle:</span>
                  <p className="font-bold text-slate-900">{selectedSubmissionForReceipt.reportMonth}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Validation Status:</span>
                  <p className="font-bold text-teal-800">{selectedSubmissionForReceipt.status}</p>
                </div>
              </div>

              <div className="border rounded-xl p-4 space-y-2">
                <div className="font-bold text-slate-900 text-xs pb-1 border-b">Certified Service Counts:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div>Institutional Deliveries: <strong className="font-mono">{selectedSubmissionForReceipt.institutionalDeliveries}</strong></div>
                  <div>Antenatal Care Registrations: <strong className="font-mono">{selectedSubmissionForReceipt.antenatalRegistrations}</strong></div>
                  <div>Fully Immunized Infants: <strong className="font-mono">{selectedSubmissionForReceipt.infantImmunizationCompleted}</strong></div>
                  <div>NCD Screenings Completed: <strong className="font-mono">{selectedSubmissionForReceipt.ncdHypertensionScreened}</strong></div>
                  <div>TB Presumptive Cases: <strong className="font-mono">{selectedSubmissionForReceipt.tbPresumptiveCasesScreened}</strong></div>
                  <div>Essential Drugs On-Hand: <strong className="font-mono">{selectedSubmissionForReceipt.essentialMedicinesAvailablePct}%</strong></div>
                </div>
              </div>

              {/* Cryptographic Footprint & QR */}
              <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl">
                <div className="space-y-1">
                  <div className="text-[10px] text-teal-400 font-mono">SHA-256 Block Digest:</div>
                  <div className="text-[9px] font-mono text-slate-400 break-all max-w-sm">
                    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </div>
                  <div className="text-[10px] text-slate-300">
                    Timestamp: {selectedSubmissionForReceipt.submissionDate} &bull; Signee: {selectedSubmissionForReceipt.submittedBy}
                  </div>
                </div>
                <div className="w-16 h-16 bg-white rounded-lg p-1.5 flex items-center justify-center shrink-0">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setSelectedSubmissionForReceipt(null)}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
