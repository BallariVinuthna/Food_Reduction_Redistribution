import React from 'react';
import {
  LayoutDashboard,
  Search,
  PlusCircle,
  PackageCheck,
  Truck,
  Calendar,
  BookOpen,
  TrendingUp,
  Sparkles,
  Award,
  Navigation,
  BarChart3,
  MessageSquare,
  Users2,
  ShieldCheck,
  FileText,
  Beaker,
  Settings,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  unreadCount = 0,
}) => {
  const { t } = useLanguage();

  const sections = [
    {
      title: t('nav_operations', 'Operations'),
      items: [
        { id: 'dashboard', label: t('nav_dashboard', 'Dashboard'), icon: LayoutDashboard },
        { id: 'find-food', label: t('nav_find_food', 'Find Food'), icon: Search },
        { id: 'create-donation', label: t('nav_create_donation', 'Create Donation'), icon: PlusCircle },
        { id: 'my-donations', label: t('nav_my_donations', 'My Donations'), icon: PackageCheck },
        { id: 'pickup-delivery', label: t('nav_pickup_delivery', 'Pickup & Delivery'), icon: Truck },
        { id: 'ngo-demand', label: t('nav_ngo_demand', 'NGO Demand Calendar'), icon: Calendar },
        { id: 'waste-diary', label: t('nav_waste_diary', 'Food Waste Diary'), icon: BookOpen },
      ],
    },
    {
      title: t('nav_intelligence', 'Intelligence'),
      items: [
        { id: 'surplus-prediction', label: t('nav_surplus_prediction', 'Surplus Prediction'), icon: TrendingUp },
        { id: 'image-checker', label: t('nav_image_checker', 'AI Food Image Checker'), icon: Sparkles },
        { id: 'rescue-priority', label: t('nav_rescue_priority', 'Rescue Priority Score'), icon: Award },
        { id: 'route-planner', label: t('nav_route_planner', 'Smart Route Planner'), icon: Navigation },
        { id: 'analytics', label: t('nav_impact_analytics', 'Impact Analytics'), icon: BarChart3 },
      ],
    },
    {
      title: t('nav_community', 'Community'),
      items: [
        { id: 'messages', label: t('nav_messages', 'Messages'), icon: MessageSquare, badge: unreadCount > 0 ? unreadCount : undefined },
        { id: 'community', label: t('nav_community_feed', 'Community Feed'), icon: Users2 },
      ],
    },
    {
      title: t('nav_administration', 'Administration'),
      items: [
        { id: 'prototype-tests', label: t('nav_food_safety', 'Food Safety & Tests'), icon: ShieldCheck },
        { id: 'impact-ledger', label: t('nav_impact_ledger', 'Verified Impact Ledger'), icon: FileText },
        { id: 'experiment-lab', label: t('nav_experiment_lab', 'Experiment & Validation Lab'), icon: Beaker },
        { id: 'settings', label: t('nav_settings', 'Settings'), icon: Settings },
      ],
    },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (mobileOpen) setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between overflow-y-auto select-none">
      {/* Top Header Logo */}
      <div>
        <div className="p-5 pb-4 flex items-center justify-between border-b border-emerald-950/60">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-lime-500 flex items-center justify-center text-white shadow-md shadow-emerald-950/40 group-hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-emerald-950"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="#8BE34B" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 12" stroke="#032C20" strokeWidth="2.5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white">SurplusFlow</span>
              </div>
              <p className="text-[10px] text-emerald-400/80 font-medium tracking-wide">
                Food Today, Brighter Tomorrows.
              </p>
            </div>
          </button>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Structured Sections */}
        <div className="p-3 space-y-4">
          {sections.map((sec, secIdx) => (
            <div key={secIdx}>
              <div className="px-3 pb-1.5">
                <p className="text-[10px] font-bold tracking-wider text-emerald-400/60 uppercase">
                  {sec.title}
                </p>
              </div>

              <nav className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all relative group ${
                        isActive
                          ? 'bg-[#087B46] text-white shadow-sm shadow-emerald-950/30'
                          : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/35'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-[#8BE34B] rounded-r-full" />
                      )}
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? 'text-[#8BE34B]' : 'text-emerald-300/60 group-hover:text-emerald-300'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#8BE34B] text-[#032C20]">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Botanical Banner */}
      <div className="p-3 mx-3 mb-3 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-emerald-950/90 border border-emerald-800/40 overflow-hidden relative group">
        <div className="relative z-10 flex flex-col items-center text-center">
          <h4 className="text-xs font-bold text-emerald-100 leading-snug">
            Good Food
          </h4>
          <h4 className="text-xs font-bold text-[#8BE34B] leading-snug">
            Stronger Communities
          </h4>
          <p className="text-[10px] text-emerald-300/80 font-medium mt-0.5">
            Hyderabad Metro Operations
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block w-64 bg-[#032C20] text-white shrink-0 h-screen sticky top-0 border-r border-emerald-950 z-30 shadow-2xl">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 w-72 bg-[#032C20] text-white z-50 md:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
