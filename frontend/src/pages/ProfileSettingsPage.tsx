import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AnimatedPageHeading } from '../components/AnimatedPageHeading';
import {
  User,
  Settings,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Bell,
  LogOut,
  Sparkles,
  Save,
  CheckCircle2,
} from 'lucide-react';

interface ProfileSettingsPageProps {
  onNavigate: (tab: string) => void;
  defaultTab?: 'profile' | 'settings';
}

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({
  onNavigate,
  defaultTab = 'profile',
}) => {
  const { user, logout, switchDemoRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>(defaultTab);

  const [fullName, setFullName] = useState(user?.fullName || 'System Admin');
  const [phone, setPhone] = useState(user?.phone || '+91 9876543210');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE9DE] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="/assets/admin_avatar.jpg"
            alt="Profile Avatar"
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#367A50]/20 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <AnimatedPageHeading text={fullName} className="text-2xl font-extrabold text-[#20352A]" />
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F2F7F1] text-[#24543B] border border-[#DCE9DE]">
                {user?.role || 'ADMINISTRATOR'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {user?.email || 'admin@demo.local'} • Central Operations Manager
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            onNavigate('login');
          }}
          className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1.5 self-start md:self-center"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-[#F2F7F1] border border-[#79A786] text-[#163D2B] text-xs flex items-center gap-2 font-bold animate-box-rise">
          <CheckCircle2 className="w-5 h-5 text-[#367A50] shrink-0" />
          <span>Preferences updated successfully!</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 animate-box-rise" style={{ animationDelay: '200ms' }}>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-[#367A50] text-white shadow-xs'
              : 'bg-white text-[#20352A] hover:bg-[#F2F7F1] border border-[#DCE9DE]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Details</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-[#367A50] text-white shadow-xs'
              : 'bg-white text-[#20352A] hover:bg-[#F2F7F1] border border-[#DCE9DE]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Platform Settings & Notifications</span>
        </button>
      </div>

      {/* Profile Form */}
      {activeTab === 'profile' && (
        <div
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE9DE] shadow-sm max-w-2xl animate-box-rise"
          style={{ animationDelay: '280ms' }}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#087B46]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || 'admin@demo.local'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-xs text-slate-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#087B46]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#087B46] hover:bg-[#066538] text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Settings Form */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm max-w-2xl space-y-6">
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-900 text-base">Integrated Notification Channels</h3>
            <p className="text-xs text-slate-500">
              Manage automatic alerts dispatched via Resend Email and Twilio SMS.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 text-xs block">Resend Email Notifications</span>
                  <span className="text-[11px] text-slate-500">Receive instant dispatch summaries & match alerts</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#087B46] focus:ring-[#087B46]"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 text-xs block">Twilio SMS Verification Codes</span>
                  <span className="text-[11px] text-slate-500">Deliver 6-digit handover OTPs to provider and recipient phones</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#087B46] focus:ring-[#087B46]"
              />
            </label>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Active Operational Region: <strong>Hyderabad, Telangana</strong></span>
            <button
              onClick={() => onNavigate('validation')}
              className="text-xs font-bold text-[#087B46] hover:underline"
            >
              Run Benchmark Suite →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
