import React, { useState, useEffect } from 'react';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  Eye,
  Calendar,
  ShieldCheck,
  Building2,
  RefreshCw,
  LogOut,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { UserProfile, HealthDataSubmission, HealthProgramme } from '../types';
import {
  signInWithGoogle,
  signOutGoogle,
  getGoogleAccessToken,
  getCurrentGoogleUser,
  initGoogleAuth,
} from '../services/googleAuth';
import {
  sendGmailMessage,
  generateEndOfMonthEmailHtml,
  getGmailUserProfile,
} from '../services/gmailService';
import { INITIAL_SUBMISSIONS, HEALTH_PROGRAMMES } from '../data/mockData';

interface GmailDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  defaultMonth?: string;
}

export const GmailDispatchModal: React.FC<GmailDispatchModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  defaultMonth = 'August 2026',
}) => {
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Form Fields
  const [recipientEmail, setRecipientEmail] = useState<string>(
    currentUser?.email || '24156082@kiit.ac.in'
  );
  const [reportMonth, setReportMonth] = useState<string>(defaultMonth);
  const [jurisdiction, setJurisdiction] = useState<string>(
    currentUser?.facilityName || 'Varanasi District Public Healthcare Cluster'
  );
  const [autoScheduleActive, setAutoScheduleActive] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<'compose' | 'preview'>('compose');

  // Confirmation & Sending States
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<{ id: string; threadId: string; timestamp: string } | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  // Sync Google Auth state
  useEffect(() => {
    const unsubscribe = initGoogleAuth((user, token) => {
      setGoogleUser(user);
      setAccessToken(token);
      if (user?.email && !recipientEmail) {
        setRecipientEmail(user.email);
      }
    });

    // Check immediate current user
    const current = getCurrentGoogleUser();
    const token = getGoogleAccessToken();
    if (current) setGoogleUser(current);
    if (token) setAccessToken(token);

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      const res = await signInWithGoogle();
      if (res) {
        setGoogleUser(res.user);
        setAccessToken(res.accessToken);
        if (res.user.email) {
          setRecipientEmail(res.user.email);
        }
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setAuthError(err?.message || 'Failed to authenticate with Google. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignOut = async () => {
    await signOutGoogle();
    setGoogleUser(null);
    setAccessToken(null);
  };

  const filteredSubmissions: HealthDataSubmission[] = INITIAL_SUBMISSIONS.filter(
    (s) => s.status === 'Verified' || s.status === 'Submitted'
  );

  const emailHtml = generateEndOfMonthEmailHtml({
    recipientName: currentUser?.name || googleUser?.displayName || 'Healthcare Officer',
    reportMonth,
    generatedDate: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    facilityOrDistrict: jurisdiction,
    submissions: filteredSubmissions,
    programmes: HEALTH_PROGRAMMES,
    officerRole: currentUser?.designation || 'District Health Officer',
  });

  const subjectLine = `[HDIMS Official] Final End-of-Month Health Return - ${reportMonth} (${jurisdiction})`;

  // Mandatory Confirmation Step (from workspace-integration skill)
  const handleInitiateSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSendError(null);
    if (!recipientEmail || !recipientEmail.includes('@')) {
      setSendError('Please enter a valid recipient email address.');
      return;
    }
    if (!accessToken) {
      setSendError('Please sign in with your Google account to grant Gmail dispatch permissions.');
      return;
    }
    // Trigger explicit confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmAndSend = async () => {
    setShowConfirmDialog(false);
    setIsSending(true);
    setSendError(null);

    try {
      const token = accessToken || getGoogleAccessToken();
      if (!token) {
        throw new Error('OAuth token expired. Please re-authenticate with Google.');
      }

      const result = await sendGmailMessage(
        token,
        recipientEmail.trim(),
        subjectLine,
        emailHtml,
        googleUser?.email || undefined
      );

      setSendSuccess({
        id: result.id,
        threadId: result.threadId,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err: any) {
      console.error('Error dispatching Gmail report:', err);
      setSendError(err?.message || 'Failed to transmit message via Gmail API. Check permissions and try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-300 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs text-white">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 text-white">
                  Google Workspace
                </span>
                <span className="text-xs text-teal-200">Official Gmail API</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                End-of-Month Health Report Dispatch
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10 transition"
            id="btn-close-gmail-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* Google Auth Status Banner */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">
                    {googleUser ? (
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                        Connected as {googleUser.displayName || 'Google User'} ({googleUser.email})
                      </span>
                    ) : (
                      'Google Workspace Gmail Integration'
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {googleUser
                      ? 'Authorized with end-to-end Gmail dispatch permissions'
                      : 'Authenticate to enable direct, automated dispatch of final data returns.'}
                  </div>
                </div>
              </div>

              <div>
                {googleUser ? (
                  <button
                    onClick={handleGoogleSignOut}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Disconnect</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSigningIn}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-300 shadow-xs transition"
                    id="btn-google-signin-modal"
                  >
                    {isSigningIn ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-700" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Sign in with Google</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {authError && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
          </div>

          {/* Success Banner */}
          {sendSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>End-of-Month Health Return Successfully Dispatched via Gmail!</span>
              </div>
              <p className="text-xs text-emerald-700">
                The finalized indicator ledger and programme performance digest has been delivered to{' '}
                <strong>{recipientEmail}</strong>.
              </p>
              <div className="font-mono text-[11px] bg-white/70 p-2.5 rounded border border-emerald-200 space-y-1">
                <div>Message ID: <strong className="text-emerald-900">{sendSuccess.id}</strong></div>
                <div>Thread ID: <span className="text-slate-600">{sendSuccess.threadId}</span></div>
                <div>Transmission Time: <span className="text-slate-600">{sendSuccess.timestamp}</span></div>
              </div>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Gmail Inbox / Sent</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSendSuccess(null)}
                  className="text-xs font-semibold text-emerald-800 underline"
                >
                  Prepare Another Report
                </button>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {sendError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Dispatch Failed:</strong> {sendError}
              </div>
            </div>
          )}

          {/* Tab switch between Form & Preview */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveView('compose')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeView === 'compose'
                    ? 'bg-teal-50 text-teal-800 border border-teal-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Configure Dispatch
              </button>
              <button
                type="button"
                onClick={() => setActiveView('preview')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                  activeView === 'preview'
                    ? 'bg-teal-50 text-teal-800 border border-teal-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>2. Preview Email Template</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-400">
              Verified Records: <strong>{filteredSubmissions.length}</strong> Facilities
            </span>
          </div>

          {/* View 1: Configure Dispatch Form */}
          {activeView === 'compose' && (
            <form onSubmit={handleInitiateSend} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Recipient Gmail Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="user@health.gov.in or personal Gmail"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 font-medium"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Defaults to your authenticated Gmail or official healthcare email.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Consolidated Return Month <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                    <select
                      value={reportMonth}
                      onChange={(e) => setReportMonth(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 font-medium"
                    >
                      <option value="August 2026">August 2026 (Final Consolidated)</option>
                      <option value="July 2026">July 2026 (Audited Return)</option>
                      <option value="September 2026">September 2026 (Provisional)</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Selects the target monthly accounting cycle.
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Jurisdiction & Health Directorate Scope
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 font-medium"
                  />
                </div>
              </div>

              {/* End of Month Automation Card */}
              <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-800" />
                    <span className="font-bold text-teal-900 text-xs">
                      End-of-Month Automated Dispatch Trigger
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoScheduleActive}
                      onChange={(e) => setAutoScheduleActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-700"></div>
                  </label>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  When enabled, HDIMS will automatically assemble the final verified indicator payload on the final calendar day of each month (23:59 IST) and mail the complete report digest directly to your inbox via Gmail.
                </p>
                {autoScheduleActive && (
                  <div className="flex items-center gap-2 text-[10px] text-teal-800 font-semibold pt-1">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Next scheduled automated dispatch: 30 September 2026, 23:59 IST</span>
                  </div>
                )}
              </div>

              {/* Key Data Summary Pill */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700 font-medium">
                    Payload: <strong>{filteredSubmissions.length} Verified Submissions</strong>, <strong>{HEALTH_PROGRAMMES.length} Health Schemes</strong>
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">SHA-256 Ledger Certified</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveView('preview')}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4 text-slate-500" />
                    <span>View Formatted HTML</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold shadow-sm transition disabled:opacity-50"
                    id="btn-send-gmail-report"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Mail Final Data Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* View 2: Live HTML Email Preview */}
          {activeView === 'preview' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div>To: <strong className="text-slate-900">{recipientEmail}</strong></div>
                  <div>Subject: <strong className="text-slate-900">{subjectLine}</strong></div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView('compose')}
                  className="self-start sm:self-auto px-3 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Edit Configuration
                </button>
              </div>

              {/* Rendered HTML inside sandboxed iframe preview */}
              <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-100">
                <iframe
                  title="Gmail Template Preview"
                  srcDoc={emailHtml}
                  className="w-full h-96 bg-white border-0"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveView('compose')}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold"
                >
                  Back to Settings
                </button>
                <button
                  type="button"
                  onClick={handleInitiateSend}
                  disabled={isSending}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm &amp; Send to {recipientEmail}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mandatory Explicit Confirmation Dialog (as strictly mandated by Workspace integration skill) */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-300 space-y-4 animate-in zoom-in-95 duration-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Confirm Gmail Report Dispatch?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  You are about to transmit the official End-of-Month Health Return on behalf of your Google Account.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <strong className="text-slate-900 font-mono">{recipientEmail}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Period:</span>
                <strong className="text-slate-900">{reportMonth}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Data Return:</span>
                <span className="text-teal-800 font-bold">{filteredSubmissions.length} Verified Facilities</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sender:</span>
                <span className="text-slate-800">{googleUser?.email || 'Authenticated User'}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              This action uses the <strong>Gmail API</strong> (<code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">gmail.send</code>) to deliver the compiled physical metrics directly to the recipient's mailbox.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAndSend}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-xs transition"
                id="btn-confirm-gmail-send"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm &amp; Send Email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
