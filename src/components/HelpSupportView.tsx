import React, { useState } from 'react';
import { HelpSubTab } from '../types';
import {
  HelpCircle,
  BookOpen,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  Mail,
  Clock,
  Shield,
  Send,
  CheckCircle2,
  FileQuestion,
  Download
} from 'lucide-react';

interface HelpSupportViewProps {
  initialSubTab?: HelpSubTab;
}

export const HelpSupportView: React.FC<HelpSupportViewProps> = ({
  initialSubTab = 'FAQs',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<HelpSubTab>(initialSubTab);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Data Entry Issue');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const faqs = [
    {
      q: 'What is the standard monthly deadline for health facilities to submit performance returns?',
      a: 'In accordance with National Health Mission (NHM) guidelines, all Primary Health Centres (PHCs) and Community Health Centres (CHCs) must finalize and submit monthly consolidated data by the 20th of the following calendar month to maintain institutional Grade A compliance.',
    },
    {
      q: 'Can a facility edit data once it has been submitted to the District Health Society?',
      a: 'Once submitted, records are locked into "Under Review" status to preserve audit integrity. If an amendment or reconciliation is required, the District Programme Officer can reject or return the file with specific revision instructions into your "Update Data" queue.',
    },
    {
      q: 'How does HDIMS handle intermittent or low internet connectivity at remote PHCs?',
      a: 'The HDIMS interface supports client-side session caching with local drafts. Operators can compile indicators offline and safely submit them once cellular or broadband connectivity is restored.',
    },
    {
      q: 'What criteria trigger an automated system threshold alert?',
      a: 'Threshold alerts are automatically raised if essential medicine availability falls below 80%, cold-chain ice-lined refrigerator (ILR) temperatures breach 2°C–8°C bounds, or a maternal mortality event is documented at an accredited facility.',
    },
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) return;
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketSubject('');
      setTicketDesc('');
      alert('Support Ticket Logged: Reference HDIMS-TKT-8921. A systems engineer will respond within 4 business hours.');
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <HelpCircle className="w-6 h-6 text-teal-700" />
              <span>Help, Documentation &amp; Technical Support</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Standard Operating Procedures (SOPs), role-specific user manuals, and 24x7 helpdesk assistance
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs overflow-x-auto scrollbar-none">
            {(['FAQs', 'User Manual', 'Contact Support'] as HelpSubTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                  activeSubTab === tab
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id={`btn-help-${tab.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-teal-700 shrink-0" />
            <span>National HDIMS Helpline: <strong className="font-mono text-slate-900">1800-11-4346</strong> (Toll-Free, 24/7)</span>
          </div>
          <span className="text-[11px] text-slate-400">Response SLA: &le; 4 Business Hours</span>
        </div>
      </div>

      {/* Sub-tab 1: FAQs */}
      {activeSubTab === 'FAQs' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base mb-2">Frequently Asked Operational Questions</h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>

                  {isOpen && (
                    <div className="p-4 text-xs text-slate-700 bg-white border-t border-slate-200 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-tab 2: User Manual */}
      {activeSubTab === 'User Manual' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Role-Specific User Guides &amp; Protocol Handbooks</h3>
            <p className="text-xs text-slate-500">Step-by-step instructions for data collection, validation, and analytics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <BookOpen className="w-7 h-7 text-teal-700 mb-3" />
                <h4 className="font-bold text-slate-900 text-sm">Facility Operator Handbook</h4>
                <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
                  How to input monthly indicator tallies, resolve mathematical validation flags, and archive digital receipts.
                </p>
              </div>
              <button
                onClick={() => alert('Downloading HDIMS_Facility_Operator_Manual_v4.pdf')}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF (4.2 MB)</span>
              </button>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <BookOpen className="w-7 h-7 text-sky-700 mb-3" />
                <h4 className="font-bold text-slate-900 text-sm">District Monitoring SOP</h4>
                <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
                  Verification protocols for Chief Medical Officers, requesting facility revisions, and approving returns.
                </p>
              </div>
              <button
                onClick={() => alert('Downloading HDIMS_District_Officer_SOP_v4.pdf')}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF (3.8 MB)</span>
              </button>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <BookOpen className="w-7 h-7 text-indigo-700 mb-3" />
                <h4 className="font-bold text-slate-900 text-sm">State Analytics &amp; Policy Guide</h4>
                <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
                  Utilizing the dynamic dashboard, interpreting NITI Aayog health indices, and generating cabinet briefs.
                </p>
              </div>
              <button
                onClick={() => alert('Downloading HDIMS_State_Directorate_Guide_v4.pdf')}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF (5.1 MB)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Contact Support */}
      {activeSubTab === 'Contact Support' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Submit Technical Support Ticket</h3>
            <p className="text-xs text-slate-500">Report system bugs, credentials lockouts, or facility data discrepancy</p>
          </div>

          <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issue Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                >
                  <option value="Data Entry Issue">Data Entry Calculation Error</option>
                  <option value="Credentials Issue">Credentials / Password Reset</option>
                  <option value="Verification Issue">Verification Workflow Dispute</option>
                  <option value="Infrastructure Telemetry">Cold-Chain Sensor Sync Failure</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ticket Subject</label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Inability to submit August ANC report"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Detailed Description of Incident</label>
              <textarea
                value={ticketDesc}
                onChange={(e) => setTicketDesc(e.target.value)}
                rows={4}
                placeholder="Include facility code, indicator name, and exact error text observed..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                required
              />
            </div>

            <button
              type="submit"
              disabled={ticketSubmitted}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{ticketSubmitted ? 'Submitting...' : 'Transmit Ticket to Support Desk'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
