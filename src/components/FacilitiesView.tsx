import React, { useState } from 'react';
import { FacilitiesSubTab, HealthcareFacility } from '../types';
import { HEALTHCARE_FACILITIES } from '../data/mockData';
import {
  Hospital,
  Search,
  Filter,
  CheckCircle2,
  Building2,
  Phone,
  User,
  Bed,
  Award,
  AlertCircle
} from 'lucide-react';

interface FacilitiesViewProps {
  initialSubTab?: FacilitiesSubTab;
}

export const FacilitiesView: React.FC<FacilitiesViewProps> = ({
  initialSubTab = 'Facility List',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<FacilitiesSubTab>(initialSubTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [gradeFilter, setGradeFilter] = useState('ALL');

  const filteredFacilities = HEALTHCARE_FACILITIES.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.subDistrict.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.inChargeDoctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || f.type === typeFilter;
    const matchesGrade = gradeFilter === 'ALL' || f.grade === gradeFilter;
    return matchesSearch && matchesType && matchesGrade;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <Hospital className="w-6 h-6 text-teal-700" />
              <span>Healthcare Facilities Registry</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Primary Health Centres (PHC), Community Health Centres (CHC), Sub-Divisional (SDH), and District Hospitals (DH)
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            {(['Facility List', 'Facility Performance'] as FacilitiesSubTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
                  activeSubTab === tab
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id={`btn-facility-${tab.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search facility name, doctor, block..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs w-full sm:w-64"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 font-medium text-xs flex-1 sm:flex-none"
            >
              <option value="ALL">All Facility Types</option>
              <option value="PHC">PHC (Primary Health Centre)</option>
              <option value="CHC">CHC (Community Health Centre)</option>
              <option value="SDH">SDH (Sub-Divisional Hospital)</option>
              <option value="DH">DH (District Hospital)</option>
            </select>

            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 font-medium text-xs flex-1 sm:flex-none"
            >
              <option value="ALL">All Accreditation Grades</option>
              <option value="A+">Grade A+</option>
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
              <option value="C">Grade C</option>
            </select>
          </div>

          <span className="text-[11px] text-slate-500 shrink-0">
            Showing <strong>{filteredFacilities.length}</strong> facilities
          </span>
        </div>
      </div>

      {/* Sub-tab 1: Facility List Cards */}
      {activeSubTab === 'Facility List' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-sm transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    {fac.type} &bull; {fac.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      fac.grade === 'A+'
                        ? 'bg-emerald-100 text-emerald-800'
                        : fac.grade === 'A'
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Grade {fac.grade}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1 leading-snug">
                  {fac.name}
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Sub-District: <strong>{fac.subDistrict}</strong>, {fac.district}
                </p>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>In-Charge: <strong className="text-slate-800">{fac.inChargeDoctor}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="w-3.5 h-3.5 text-slate-400" />
                    <span>Operational Beds: <strong className="text-slate-800">{fac.operationalBeds}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-[11px]">{fac.contactNumber}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Last Report: {fac.lastReportedDate}</span>
                <span className="font-bold text-teal-800">Compliance: {fac.complianceScorePct}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-tab 2: Facility Performance Matrix */}
      {activeSubTab === 'Facility Performance' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Facility Operational Compliance Scorecard</h3>
          <p className="text-xs text-slate-500 mb-4">
            Physical performance ratings based on punctuality of monthly reporting, cold chain telemetry, and drug availability.
          </p>

          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-left text-xs min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Facility Name</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Block / Sub-District</th>
                  <th className="pb-3">In-Charge Officer</th>
                  <th className="pb-3">Reporting Punctuality</th>
                  <th className="pb-3">Overall Compliance</th>
                  <th className="pb-3">Accreditation</th>
                  <th className="pb-3 text-right pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredFacilities.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 pl-2 font-bold text-slate-900">{f.name}</td>
                    <td className="py-3.5 font-mono text-[11px] text-teal-800">{f.type}</td>
                    <td className="py-3.5">{f.subDistrict}</td>
                    <td className="py-3.5 text-xs text-slate-600">{f.inChargeDoctor.split(',')[0]}</td>
                    <td className="py-3.5">
                      <span className="font-mono font-bold text-slate-800">{f.reportingPunctualityPct}%</span>
                    </td>
                    <td className="py-3.5">
                      <span className="font-mono font-bold text-teal-800">{f.complianceScorePct}%</span>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          f.grade === 'A+'
                            ? 'bg-emerald-100 text-emerald-800'
                            : f.grade === 'A'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        Grade {f.grade}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          f.status === 'Operational'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
