import React, { useState } from 'react';
import { AdminSubTab, UserProfile, UserRole } from '../types';
import { DEMO_USERS, HEALTHCARE_FACILITIES, DEPARTMENTS, HEALTH_PROGRAMMES, AUDIT_LOGS } from '../data/mockData';
import {
  ShieldCheck,
  Users,
  Hospital,
  Building2,
  Layers,
  FileCheck,
  Search,
  Plus,
  Shield,
  Key,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal
} from 'lucide-react';

interface AdminPanelViewProps {
  currentUser: UserProfile | null;
  initialSubTab?: AdminSubTab;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  currentUser,
  initialSubTab = 'Users',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>(initialSubTab);
  const [userList, setUserList] = useState<UserProfile[]>(Object.values(DEMO_USERS));
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('FACILITY_OPERATOR');
  const [newUserFacility, setNewUserFacility] = useState('CHC Shivpur');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: UserProfile = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      username: newUserEmail.split('@')[0],
      name: newUserName,
      role: newUserRole,
      designation: newUserRole === 'FACILITY_OPERATOR' ? 'Health Data Entry Operator' : 'Programme Monitoring Officer',
      email: newUserEmail,
      facilityName: newUserFacility,
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      lastLogin: 'Never (Pending Activation)',
    };

    setUserList([newUser, ...userList]);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800 tracking-wider">
                Restricted Administration Area
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-teal-700" />
              <span>National System Administrator Console</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage authorized personnel, facility credentials, ministerial departments, and cryptographic audit logs
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs overflow-x-auto scrollbar-none">
            {(['Users', 'Facilities', 'Departments', 'Programmes', 'Audit Logs'] as AdminSubTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                  activeSubTab === tab
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id={`btn-admin-${tab.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Authenticated as <strong>{currentUser?.name}</strong> (Super Administrator)</span>
          </div>
          <span className="font-mono text-[11px]">Security Level: Level 4 Central IT Directorate</span>
        </div>
      </div>

      {/* Sub-tab 1: Users */}
      {activeSubTab === 'Users' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Authorized Personnel &amp; Role Assignments</h3>
              <p className="text-xs text-slate-500">Manage user clearance levels across the 4-tier healthcare hierarchy</p>
            </div>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition"
              id="btn-admin-add-user"
            >
              <Plus className="w-4 h-4" />
              <span>Provision Officer</span>
            </button>
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Officer Name</th>
                  <th className="pb-3">Role / Clearance</th>
                  <th className="pb-3">Designation</th>
                  <th className="pb-3">Facility / Jurisdiction</th>
                  <th className="pb-3">Official Email</th>
                  <th className="pb-3 text-right pr-2">Last Authenticated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {userList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 pl-2">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <span className="text-[11px] text-slate-400 font-mono">{u.username}</span>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-600">{u.designation}</td>
                    <td className="py-3.5 text-slate-800">{u.facilityName || u.district}</td>
                    <td className="py-3.5 font-mono text-slate-500 text-[11px]">{u.email}</td>
                    <td className="py-3.5 text-right pr-2 font-mono text-[11px] text-slate-500">{u.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Facilities */}
      {activeSubTab === 'Facilities' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Registered Health Facilities Registry</h3>
          <p className="text-xs text-slate-500 mb-4">Official list of public medical centres authorized to report into HDIMS</p>

          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Facility Code</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Classification</th>
                  <th className="pb-3">District</th>
                  <th className="pb-3">In-Charge Doctor</th>
                  <th className="pb-3 text-right pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {HEALTHCARE_FACILITIES.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 pl-2 font-mono font-bold text-teal-800">{f.code}</td>
                    <td className="py-3.5 font-bold text-slate-900">{f.name}</td>
                    <td className="py-3.5 font-semibold text-slate-600">{f.type}</td>
                    <td className="py-3.5">{f.district}</td>
                    <td className="py-3.5 text-slate-600">{f.inChargeDoctor.split(',')[0]}</td>
                    <td className="py-3.5 text-right pr-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
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

      {/* Sub-tab 3: Departments */}
      {activeSubTab === 'Departments' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Ministry &amp; Directorate Health Departments</h3>
          <p className="text-xs text-slate-500 mb-4">Nodal wings overseeing specific public health interventions</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEPARTMENTS.map((d) => (
              <div key={d.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    {d.code}
                  </span>
                  <span className="text-xs text-slate-500">{d.officerCount} Officers Assigned</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{d.name}</h4>
                <p className="text-xs text-slate-600">Director: <strong>{d.director}</strong></p>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-500">
                  <span>Active Schemes: {d.activeSchemesCount}</span>
                  <span className="font-mono">{d.contactEmail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 4: Programmes */}
      {activeSubTab === 'Programmes' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Active National Health Schemes Registry</h3>
          <p className="text-xs text-slate-500 mb-4">Programme parameters, budget sanctions, and statutory targets</p>

          <div className="space-y-3">
            {HEALTH_PROGRAMMES.map((p) => (
              <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{p.name} ({p.code})</span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-teal-50 text-teal-800 border border-teal-200 font-semibold">{p.category}</span>
                  </div>
                  <span className="text-slate-500 mt-0.5 block">Nodal Dept: {p.nodalDepartment}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-slate-900 block">Sanctioned: ₹{p.budgetAllocatedCr} Cr</span>
                  <span className="text-[11px] text-teal-700">Target: {p.annualTarget.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 5: Audit Logs */}
      {activeSubTab === 'Audit Logs' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Terminal className="w-5 h-5 text-slate-700" />
                <span>Immutable System Security &amp; Activity Audit Logs</span>
              </h3>
              <p className="text-xs text-slate-500">Certified SHA-256 transactional trail recording every data update, login, and validation</p>
            </div>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-mono">
              Audit Stream Active
            </span>
          </div>

          <div className="space-y-3">
            {AUDIT_LOGS.map((log) => (
              <div key={log.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500 border-b pb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-teal-800">{log.id}</span>
                    <span>&bull;</span>
                    <span className="font-semibold text-slate-800">{log.action}</span>
                    <span>&bull;</span>
                    <span>IP: {log.ipAddress}</span>
                  </div>
                  <span>{log.timestamp}</span>
                </div>
                <p className="text-slate-800 font-sans text-xs pt-1">{log.details}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>Actor: {log.user} ({log.role})</span>
                  <span className="text-emerald-600 font-bold">STATUS: {log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add User */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-300 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Provision New Health Officer</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Dr. Amit Trivedi"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Email (.gov.in)</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. amit.trivedi@health.up.gov.in"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role / Clearance</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                >
                  <option value="FACILITY_OPERATOR">Facility Data Entry Operator</option>
                  <option value="DISTRICT_OFFICER">District Monitoring Officer</option>
                  <option value="STATE_ADMIN">State Health Administrator</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Facility / Hospital</label>
                <input
                  type="text"
                  value={newUserFacility}
                  onChange={(e) => setNewUserFacility(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold"
                >
                  Save &amp; Issue Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
