import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { DEMO_USERS } from '../data/mockData';
import {
  Lock,
  User,
  Shield,
  Hospital,
  Building2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

interface LoginViewProps {
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  onNavigateToUserTab: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  currentUser,
  onLoginSuccess,
  onLogout,
  onNavigateToUserTab,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('FACILITY_OPERATOR');
  const [username, setUsername] = useState('facility.rampur');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [facilityCode, setFacilityCode] = useState('UP-VAR-PHC-01');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('7H49K');
  const [rememberFacility, setRememberFacility] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate simple random alphanumeric captcha
  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let res = '';
    for (let i = 0; i < 5; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(res);
    setCaptchaInput('');
    setErrorMsg('');
  };

  const handleRoleCardClick = (role: UserRole) => {
    setSelectedRole(role);
    const demo = DEMO_USERS[role];
    setUsername(demo.username);
    setFacilityCode(demo.facilityId || 'HQ-DEPT-01');
    setErrorMsg('');
  };

  const handleQuickLogin = (role: UserRole) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const user = DEMO_USERS[role];
      onLoginSuccess(user);
      setIsSubmitting(false);
    }, 250);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Optional light captcha check for realism
    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMsg('Invalid Security Captcha code. Please verify the characters and try again.');
      return;
    }

    if (!username.trim()) {
      setErrorMsg('Please enter your assigned Facility ID or Username.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      // Find matching demo or generate from selected role
      const user = DEMO_USERS[selectedRole];
      onLoginSuccess(user);
      setIsSubmitting(false);
    }, 400);
  };

  // If already logged in, show session state with option to go to their tab or switch account
  if (currentUser) {
    return (
      <div className="max-w-3xl mx-auto my-10 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-800 to-slate-900 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs uppercase font-bold tracking-wider text-teal-300">Active HDIMS Session</span>
            </div>
            <h2 className="text-2xl font-extrabold">You Are Currently Authenticated</h2>
            <p className="text-sm text-slate-300 mt-1">
              Signed in as <span className="font-semibold text-white">{currentUser.name}</span> ({currentUser.designation})
            </p>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-200 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs text-slate-500 font-medium">Assigned Role & Level</span>
                <p className="text-sm font-bold text-slate-900">{currentUser.role.replace('_', ' ')}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">Jurisdiction / Facility</span>
                <p className="text-sm font-bold text-slate-900">{currentUser.facilityName || currentUser.district}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">Official Email</span>
                <p className="text-xs font-mono text-slate-700">{currentUser.email}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">Session IP / Protocol</span>
                <p className="text-xs font-mono text-slate-700">10.14.220.88 (TLS 1.3 Strict)</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onNavigateToUserTab}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition"
                id="btn-goto-assigned-tab"
              >
                <span>Continue to Authorized Module</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onLogout}
                className="px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm transition"
                id="btn-switch-account-logout"
              >
                Switch Account / Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-6 sm:my-10 px-4 sm:px-6">
      {/* Banner Notice */}
      <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-3 text-xs text-teal-900 shadow-2xs">
        <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-sm mb-0.5">Role-Based Automated Routing System</span>
          Upon successful authentication, HDIMS dynamically opens the exact operational tab assigned to your role (Facility Operator &rarr; Data Management, District Officer &rarr; District Performance, State Admin &rarr; State Analytics, Super Admin &rarr; Admin Panel). Other user tabs remain strictly locked.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Quick Role Profiles (1-Click Login) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Select User Profile to Test</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any profile below to instantly log in and open their authorized tab:
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Facility Operator Card */}
              <div
                onClick={() => handleQuickLogin('FACILITY_OPERATOR')}
                className={`p-3.5 rounded-xl border cursor-pointer transition text-left group ${
                  selectedRole === 'FACILITY_OPERATOR'
                    ? 'border-teal-600 bg-teal-50/70 shadow-xs ring-1 ring-teal-600'
                    : 'border-slate-200 hover:border-teal-400 hover:bg-slate-50'
                }`}
                id="login-role-facility"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
                      <Hospital className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">Facility Data Entry Operator</div>
                      <div className="text-[11px] text-slate-600">Priya Sharma &bull; PHC Rampur</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    Data Entry
                  </span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-teal-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium text-teal-800">&rarr; Opens: Data Management</span>
                  <span className="font-semibold text-teal-700 group-hover:underline">Instant Login &rarr;</span>
                </div>
              </div>

              {/* District Officer Card */}
              <div
                onClick={() => handleQuickLogin('DISTRICT_OFFICER')}
                className={`p-3.5 rounded-xl border cursor-pointer transition text-left group ${
                  selectedRole === 'DISTRICT_OFFICER'
                    ? 'border-teal-600 bg-teal-50/70 shadow-xs ring-1 ring-teal-600'
                    : 'border-slate-200 hover:border-teal-400 hover:bg-slate-50'
                }`}
                id="login-role-district"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">District Monitoring Officer (CMO)</div>
                      <div className="text-[11px] text-slate-600">Dr. Rajesh Varma &bull; Varanasi District</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                    District
                  </span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-sky-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium text-sky-800">&rarr; Opens: Dashboard &amp; Validation</span>
                  <span className="font-semibold text-sky-700 group-hover:underline">Instant Login &rarr;</span>
                </div>
              </div>

              {/* State Admin Card */}
              <div
                onClick={() => handleQuickLogin('STATE_ADMIN')}
                className={`p-3.5 rounded-xl border cursor-pointer transition text-left group ${
                  selectedRole === 'STATE_ADMIN'
                    ? 'border-teal-600 bg-teal-50/70 shadow-xs ring-1 ring-teal-600'
                    : 'border-slate-200 hover:border-teal-400 hover:bg-slate-50'
                }`}
                id="login-role-state"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-sm">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">State / UT Health Administrator</div>
                      <div className="text-[11px] text-slate-600">Sunita Menon, IAS &bull; NHM Directorate</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    State
                  </span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-indigo-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium text-indigo-800">&rarr; Opens: Programme Analytics</span>
                  <span className="font-semibold text-indigo-700 group-hover:underline">Instant Login &rarr;</span>
                </div>
              </div>

              {/* Super Admin Card */}
              <div
                onClick={() => handleQuickLogin('SUPER_ADMIN')}
                className={`p-3.5 rounded-xl border cursor-pointer transition text-left group ${
                  selectedRole === 'SUPER_ADMIN'
                    ? 'border-teal-600 bg-teal-50/70 shadow-xs ring-1 ring-teal-600'
                    : 'border-slate-200 hover:border-teal-400 hover:bg-slate-50'
                }`}
                id="login-role-superadmin"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">System Super Administrator</div>
                      <div className="text-[11px] text-slate-600">Vikramaditya Rao &bull; National IT Cell</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Admin
                  </span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium text-emerald-800">&rarr; Opens: Admin Panel (Full Access)</span>
                  <span className="font-semibold text-emerald-700 group-hover:underline">Instant Login &rarr;</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Compliance Card */}
          <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl text-xs space-y-2 border border-slate-800">
            <div className="flex items-center gap-2 text-white font-bold">
              <Shield className="w-4 h-4 text-teal-400" />
              <span>Hierarchical Data Integrity Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              All health facilities must authenticate prior to recording monthly physical performance data. Sessions are monitored under National Health Informatics compliance rules.
            </p>
          </div>
        </div>

        {/* Right Column: Standard Institutional Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 sm:p-7 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-teal-300" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">Institutional Sign-In Gateway</h2>
                  <p className="text-xs text-slate-300">Access Health Facility &amp; Programme Records</p>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Administrative Tier / Role <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => handleRoleCardClick(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                  id="select-login-role"
                >
                  <option value="FACILITY_OPERATOR">Facility Data Entry Operator (PHC / CHC / Hospital)</option>
                  <option value="DISTRICT_OFFICER">District Health Officer (DHO / CMO / Monitoring)</option>
                  <option value="STATE_ADMIN">State / UT Health Mission Director (NHM Directorate)</option>
                  <option value="SUPER_ADMIN">System Super Administrator (Central IT Directorate)</option>
                </select>
              </div>

              {/* Username / Facility ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Facility Code / Officer Username <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. facility.rampur or UP-VAR-PHC-01"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                    id="input-login-username"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter institutional password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                    id="input-login-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Captcha Security Check */}
              <div className="pt-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Security Captcha Verification <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-10 px-3 sm:px-4 rounded-xl bg-slate-900 text-teal-300 font-mono font-bold tracking-widest text-sm sm:text-base flex items-center justify-center select-none border border-slate-700 shadow-inner shrink-0">
                    {captchaCode}
                  </div>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="p-2 sm:p-2.5 min-h-[40px] min-w-[40px] rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 transition flex items-center justify-center shrink-0"
                    title="Generate new Captcha"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="5 characters"
                    maxLength={5}
                    className="flex-1 min-w-0 px-3 py-2 sm:py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold tracking-wider uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                    id="input-login-captcha"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Type <span className="font-mono font-bold text-teal-700">{captchaCode}</span> or click refresh if unclear.
                </p>
              </div>

              {/* Remember Me & Help */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberFacility}
                    onChange={(e) => setRememberFacility(e.target.checked)}
                    className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                  />
                  <span>Remember Facility Code</span>
                </label>
                <a href="#help" className="text-xs text-teal-700 hover:underline font-medium">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold text-sm shadow-md transition disabled:opacity-75"
                id="btn-login-submit"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials &amp; Permissions...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate &amp; Open Assigned Tab</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2 text-[11px] text-slate-500">
                Authorized government personnel only. Unauthorized access is punishable under IT Act 2000.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
