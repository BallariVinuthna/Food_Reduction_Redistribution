import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SmartUrgencyAlertsPanel } from './SmartUrgencyAlertsPanel';
import {
  Search,
  MapPin,
  Bell,
  ChevronDown,
  User as UserIcon,
  Settings,
  LogOut,
  ShieldCheck,
  Check,
  Menu,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';

interface TopNavbarProps {
  onSearch?: (query: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  openNotifications: () => void;
  unreadCount: number;
  openMobileMenu: () => void;
  onNavigate: (tab: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onSearch,
  selectedLocation,
  setSelectedLocation,
  openNotifications,
  unreadCount,
  openMobileMenu,
  onNavigate,
}) => {
  const { user, logout, switchDemoRole } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const locations = [
    'Hyderabad',
    'Banjara Hills, Hyd',
    'HITEC City, Hyd',
    'Jubilee Hills, Hyd',
    'Madhapur, Hyd',
    'Secunderabad',
    'Gachibowli, Hyd',
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLocationDropdownOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) onSearch(val);
  };

  const displayName = user ? (user.fullName || 'System Admin') : 'Sign In / Select Role';
  const displayRole = !user
    ? 'Guest (Click to Login)'
    : user.role === 'ADMIN'
    ? 'Administrator'
    : user.role === 'FOOD_PROVIDER'
    ? 'Food Donor'
    : user.role === 'NGO_RECEIVER'
    ? 'NGO Receiver'
    : user.role === 'VOLUNTEER'
    ? 'Volunteer'
    : 'Administrator';

  return (
    <header className="sticky top-0 z-20 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#DCE9DE] shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button + Search Field */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <button
            onClick={openMobileMenu}
            className="md:hidden p-2 rounded-xl text-[#24543B] hover:text-[#163D2B] hover:bg-[#DCE9DE]/50 transition-colors"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Wide Search Bar matching prompt */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#79A786] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for food, locations, NGOs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F2F7F1] hover:bg-[#DCE9DE]/40 focus:bg-[#FFFFFF] border border-[#DCE9DE] text-xs sm:text-sm text-[#20352A] placeholder-[#79A786] transition-all focus:outline-none focus:ring-2 focus:ring-[#367A50]/20 focus:border-[#367A50]"
            />
          </div>
        </div>

        {/* Right Side: Location Selector + Notification Bell + User Avatar Profile */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Location Dropdown */}
          <div className="relative" ref={locationDropdownRef}>
            <button
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#DCE9DE] bg-[#F2F7F1] hover:bg-[#DCE9DE]/50 text-xs font-semibold text-[#20352A] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#367A50]" />
              <span>{selectedLocation}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#79A786]" />
            </button>

            {isLocationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Location
                </div>
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsLocationDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between transition-colors"
                  >
                    <span>{loc}</span>
                    {selectedLocation === loc && (
                      <Check className="w-3.5 h-3.5 text-[#087B46]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Smart Urgency Alert Radar */}
          <SmartUrgencyAlertsPanel />

          {/* Quick Live Demo Data Sync Button */}
          <button
            onClick={async () => {
              try {
                setIsSyncing(true);
                await api.refreshLiveDemo();
                window.location.reload();
              } catch (e) {
                console.error('Failed to sync live demo data', e);
              } finally {
                setIsSyncing(false);
              }
            }}
            disabled={isSyncing}
            title="Refresh Live Demo Data (Generates fresh active listings, urgent timers, and NGO demands)"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#032C20] hover:bg-emerald-900 text-white shadow-xs border border-emerald-700/40 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-lime-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Live Sync'}</span>
          </button>

          {/* Multilingual Selector (Feature 9) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-[11px] font-bold text-slate-600">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-lg transition ${
                language === 'en' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-2 py-1 rounded-lg transition ${
                language === 'te' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              తెలుగు
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded-lg transition ${
                language === 'hi' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Notification Bell */}
          <button
            onClick={openNotifications}
            className="relative p-2.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User Avatar & Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-3 p-1.5 sm:px-2 sm:py-1.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors"
            >
              <img
                src="/assets/admin_avatar.jpg"
                alt="System Admin Avatar"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#087B46]/30 shadow-xs"
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {displayName}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {displayRole}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{displayName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user ? user.email : 'No active session — select a role below'}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${user ? 'bg-[#E8F7EE] text-[#087B46]' : 'bg-amber-100 text-amber-800'}`}>
                    {displayRole}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Account Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('validation');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-emerald-800 hover:bg-emerald-50 flex items-center gap-2.5 font-semibold"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#087B46]" />
                    <span>Validation Simulator</span>
                  </button>
                </div>

                {/* Role Switcher for Pairing & Real-World Validation */}
                <div className="border-t border-slate-100 px-4 py-2 bg-slate-50/60">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Switch Active Persona
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <button
                      onClick={() => {
                        switchDemoRole('ADMIN');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="px-2 py-1 rounded-md text-left hover:bg-white text-slate-700 font-medium"
                    >
                      👑 Admin
                    </button>
                    <button
                      onClick={() => {
                        switchDemoRole('FOOD_PROVIDER');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="px-2 py-1 rounded-md text-left hover:bg-white text-slate-700 font-medium"
                    >
                      🍽 Food Donor
                    </button>
                    <button
                      onClick={() => {
                        switchDemoRole('NGO_RECEIVER');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="px-2 py-1 rounded-md text-left hover:bg-white text-slate-700 font-medium"
                    >
                      🏢 NGO Hub
                    </button>
                    <button
                      onClick={() => {
                        switchDemoRole('VOLUNTEER');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="px-2 py-1 rounded-md text-left hover:bg-white text-slate-700 font-medium"
                    >
                      🚴 Volunteer
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileDropdownOpen(false);
                      onNavigate('login');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-semibold"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
