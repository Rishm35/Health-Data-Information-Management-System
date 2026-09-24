import React from 'react';
import { SystemNotification, MainTab, UserRole } from '../types';
import { isTabAllowedForRole } from '../utils/auth';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface NotificationsViewProps {
  currentUserRole: UserRole | null;
  notifications: SystemNotification[];
  onMarkAsRead: (id: string) => void;
  onNavigate: (tab: MainTab, subTab?: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  currentUserRole,
  notifications,
  onMarkAsRead,
  onNavigate,
}) => {
  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-5 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <Bell className="w-6 h-6 text-teal-700" />
              <span>Official System Bulletins &amp; Notifications</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Regulatory alerts, data revision requests, and National Health Mission circulars
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border">
            {notifications.filter((n) => !n.read).length} Unread Notifications
          </span>
        </div>

        <div className="pt-6 space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                notif.read ? 'bg-slate-50/70 border-slate-200' : 'bg-teal-50/40 border-teal-200 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    notif.type === 'ALERT'
                      ? 'bg-amber-100 text-amber-800'
                      : notif.type === 'REVISION'
                      ? 'bg-rose-100 text-rose-800'
                      : notif.type === 'CIRCULAR'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  {notif.type === 'ALERT' && <AlertTriangle className="w-4 h-4" />}
                  {notif.type === 'REVISION' && <ShieldAlert className="w-4 h-4" />}
                  {notif.type === 'CIRCULAR' && <Info className="w-4 h-4" />}
                  {notif.type === 'INFO' && <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border text-slate-700 font-mono">
                      {notif.type}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{notif.title}</h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{notif.message}</p>

                  <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
                    <span>Sender: <strong>{notif.sender}</strong></span>
                    <span>&bull;</span>
                    <span>{notif.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                {!notif.read && (
                  <button
                    onClick={() => onMarkAsRead(notif.id)}
                    className="text-[11px] font-semibold text-teal-800 hover:underline"
                  >
                    Mark as Read
                  </button>
                )}

                {notif.actionLink && isTabAllowedForRole(notif.actionLink.tab, currentUserRole).allowed && (
                  <button
                    onClick={() => onNavigate(notif.actionLink!.tab, notif.actionLink!.subTab)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-2xs transition"
                  >
                    <span>View Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
