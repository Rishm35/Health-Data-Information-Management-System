import React, { useState } from 'react';
import { ProgrammesSubTab, HealthProgramme } from '../types';
import { HEALTH_PROGRAMMES } from '../data/mockData';
import {
  Layers,
  Search,
  Filter,
  TrendingUp,
  Award,
  DollarSign,
  Calendar,
  CheckCircle2,
  Building2,
  Target
} from 'lucide-react';

interface ProgrammesViewProps {
  initialSubTab?: ProgrammesSubTab;
}

export const ProgrammesView: React.FC<ProgrammesViewProps> = ({
  initialSubTab = 'All Programmes',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ProgrammesSubTab>(initialSubTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredProgrammes = HEALTH_PROGRAMMES.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nodalDepartment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-teal-700" />
              <span>National Healthcare Programmes</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Centrally Sponsored Health Schemes, Flagship Missions, and Physical Target Tracking
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            {(['All Programmes', 'Programme Performance'] as ProgrammesSubTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
                  activeSubTab === tab
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id={`btn-prog-${tab.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search scheme name or code..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs w-full sm:w-64"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 font-medium text-xs flex-1 sm:flex-none"
            >
              <option value="ALL">All Scheme Categories</option>
              <option value="Maternal & Child">Maternal &amp; Child</option>
              <option value="Communicable">Communicable Diseases</option>
              <option value="Non-Communicable">Non-Communicable</option>
              <option value="Universal Health">Universal Health</option>
            </select>
          </div>

          <span className="text-[11px] text-slate-500 shrink-0">
            Showing <strong>{filteredProgrammes.length}</strong> active schemes
          </span>
        </div>
      </div>

      {/* Sub-tab 1: All Programmes */}
      {activeSubTab === 'All Programmes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProgrammes.map((prog) => {
            const pct = Math.round((prog.currentAchievement / prog.annualTarget) * 100);
            return (
              <div
                key={prog.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                      {prog.code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 font-mono">
                      Est. {prog.launchYear}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1">
                    {prog.name}
                  </h3>
                  <p className="text-[11px] text-teal-800 font-medium mb-3">
                    {prog.nodalDepartment}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {prog.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                      <span>Annual Target Progress</span>
                      <strong className="font-mono text-teal-800">{pct}%</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${pct >= 90 ? 'bg-emerald-600' : 'bg-teal-600'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                    <span>Budget: ₹{prog.budgetAllocatedCr} Cr</span>
                    <span>State Rank: #{prog.nationalRank || 1}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sub-tab 2: Programme Performance */}
      {activeSubTab === 'Programme Performance' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Key Indicator Achievement Ledger</h3>
          <p className="text-xs text-slate-500 mb-4">
            Comprehensive audit comparison of targeted healthcare deliveries versus on-ground physical returns.
          </p>

          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-left text-xs min-w-[680px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Programme</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Deliverable Unit</th>
                  <th className="pb-3">Achievement</th>
                  <th className="pb-3">Target</th>
                  <th className="pb-3">Progress</th>
                  <th className="pb-3 text-right pr-2">Burn Rate (Cr)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredProgrammes.map((p) => {
                  const pct = Math.round((p.currentAchievement / p.annualTarget) * 100);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 pl-2">
                        <span className="font-bold text-slate-900 block">{p.code}</span>
                        <span className="text-[11px] text-slate-500">{p.name}</span>
                      </td>
                      <td className="py-3.5 text-xs text-slate-600">{p.nodalDepartment}</td>
                      <td className="py-3.5 text-[11px] text-teal-800">{p.unit}</td>
                      <td className="py-3.5 font-mono font-bold text-slate-900">{p.currentAchievement.toLocaleString()}</td>
                      <td className="py-3.5 font-mono text-slate-500">{p.annualTarget.toLocaleString()}</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-teal-800 font-mono">{pct}%</span>
                          <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-right pr-2 font-mono">
                        ₹{p.budgetUtilizedCr} / ₹{p.budgetAllocatedCr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
