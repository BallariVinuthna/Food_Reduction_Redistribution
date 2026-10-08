import React, { useState, useEffect } from 'react';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import { Role, AppNotification } from '../types';
import { api } from '../services/api';
import {
  Leaf,
  Bell,
  UserCheck,
  BarChart3,
  CheckCircle2,
  Package,
  Truck,
  HeartHandshake,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openNotifications: () => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openNotifications,
  unreadCount,
}) => {
  const { user, switchDemoRole, logout } = useAuth();
  const [roleDropdown, setRoleDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-nav shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Super System Header */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-teal-600 flex items-center justify-center text-white shadow-md">
              <Leaf className="w-6 h-6 text-lime-300" />
            </div>
            <div>
              <span className="font-bold text-lg text-emerald-950 tracking-tight flex items-center gap-1.5">
                SurplusFlow <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-300">PSE Hyderabad</span>
              </span>
              <p className="text-[11px] text-slate-500 font-medium">Smart Food Waste Reduction & Redistribution</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'landing'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab('provider')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'provider'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
              }`}
            >
              <Package className="w-4 h-4" />
              Donor / Provider
            </button>

            <button
              onClick={() => setActiveTab('receiver')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'receiver'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              NGO Receiver
            </button>

            <button
              onClick={() => setActiveTab('volunteer')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'volunteer'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
              }`}
            >
              <Truck className="w-4 h-4" />
              Volunteer Pickup
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'analytics'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Impact Analytics
            </button>

            <button
              onClick={() => setActiveTab('validation')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'validation'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Validation & Tests
            </button>
          </nav>

          {/* Right Action: Notifications & 1-Click Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              onClick={openNotifications}
              className="relative p-2 rounded-xl text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* 1-Click Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdown(!roleDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 transition-all shadow-2xs text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs">
                  {user?.role ? user.role[0] : 'U'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-slate-900 leading-tight">
                    {user?.organizationName || user?.fullName || 'Demo User'}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-medium leading-tight">
                    Role: {user?.role || 'Guest'}
                  </p>
                </div>
              </button>

              {roleDropdown && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Instant Demo Role Switcher
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Switch personas instantly for PSE viva evaluation
                    </p>
                  </div>

                  <div className="p-1 space-y-1">
                    {(['FOOD_PROVIDER', 'NGO_RECEIVER', 'VOLUNTEER', 'ADMIN'] as Role[]).map((r) => {
                      const item = DEMO_CREDENTIALS[r];
                      const isActive = user?.role === r;
                      return (
                        <button
                          key={r}
                          onClick={() => {
                            switchDemoRole(r);
                            setRoleDropdown(false);
                            if (r === 'FOOD_PROVIDER') setActiveTab('provider');
                            if (r === 'NGO_RECEIVER') setActiveTab('receiver');
                            if (r === 'VOLUNTEER') setActiveTab('volunteer');
                            if (r === 'ADMIN') setActiveTab('analytics');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-900 font-semibold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-slate-900">{item.title}</div>
                            <div className="text-[10px] text-slate-500">{item.email}</div>
                          </div>
                          {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
