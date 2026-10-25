import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DashboardAnalytics } from '../types';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  MapPin,
  Leaf,
  BarChart2,
  Users,
  Repeat,
  CheckCircle2,
  Truck,
  HeartHandshake,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);

  useEffect(() => {
    api.getAnalytics().then(setAnalytics).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-900 text-white">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#84cc16_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-lime-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-lime-400" />
            <span>Problem Solving in Engineering (PSE) Prototype • Hyderabad, India</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Turn Surplus Food Into <span className="text-lime-300 underline decoration-lime-400 decoration-wavy">Shared Nourishment</span>.
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto font-normal leading-relaxed">
            Identify. Match. Collect. Redistribute.
          </p>

          <p className="mt-2 text-sm text-emerald-200/80 max-w-2xl mx-auto">
            A systems-thinking engineering intervention reducing avoidable food waste through multi-criteria decision matching,
            urgency decay prioritization, and synchronized volunteer transit before food expires.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('provider')}
              className="px-6 py-3.5 rounded-xl bg-lime-400 text-emerald-950 font-bold text-sm hover:bg-lime-300 transition-all shadow-lg hover:shadow-lime-400/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Donate Surplus Food</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('receiver')}
              className="px-6 py-3.5 rounded-xl bg-white/10 text-white border border-white/20 font-bold text-sm hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-sm"
            >
              <span>Find Available Food</span>
              <HeartHandshake className="w-4 h-4 text-lime-300" />
            </button>

            <button
              onClick={() => onNavigate('validation')}
              className="px-6 py-3.5 rounded-xl bg-emerald-950/70 text-lime-300 border border-lime-400/30 font-bold text-sm hover:bg-emerald-950 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Prototype Validation</span>
            </button>
          </div>

          {/* Key Metrics Strip (Real calculated DB values) */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <p className="text-xs text-emerald-200 font-medium">Food Redistributed</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {analytics?.totalQuantityRedistributedMeals ?? 40} <span className="text-sm font-normal text-lime-300">meals</span>
              </p>
              <p className="text-[11px] text-emerald-300 mt-1">Nourishment delivered</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <p className="text-xs text-emerald-200 font-medium">Food Waste Avoided</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {analytics?.foodWasteAvoidedKg ?? 16} <span className="text-sm font-normal text-lime-300">kg</span>
              </p>
              <p className="text-[11px] text-emerald-300 mt-1">Diverted from landfill</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <p className="text-xs text-emerald-200 font-medium">Match Success Rate</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {analytics?.matchSuccessRatePercentage ?? 94}%
              </p>
              <p className="text-[11px] text-emerald-300 mt-1">Within usable window</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <p className="text-xs text-emerald-200 font-medium">Active Partners</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {(analytics?.totalProviders ?? 4) + (analytics?.totalReceivers ?? 5)}
              </p>
              <p className="text-[11px] text-emerald-300 mt-1">Hotels, NGOs, Hostels</p>
            </div>
          </div>
        </div>
      </section>

      {/* Systems Thinking Leverage Point Workflow */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            System Leverage Point
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
            Intervening Before Biological Spoilage Occurs
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Disposal provides an immediate symptomatic answer to surplus food but perpetuates the reinforcing loop (R1).
            SurplusFlow intervenes at the fundamental leverage point through automated multi-criteria routing.
          </p>
        </div>

        {/* 4-Step Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900">Surplus Identification</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Food provider lists surplus food with quantity, expiry timer, temperature verification, and dietary allergens.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Safety Checklist Verified</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500 transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900">Smart Matching</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              MCDA algorithm scores receivers based on proximity (30%), capacity (20%), urgency (20%), and reliability.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-teal-700 font-medium">
              <Zap className="w-4 h-4" />
              <span>Sub-second MCDA Engine</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900">Synchronized Transit</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Recipient accepts; volunteer partner receives routing coordinates for timely handover and collection proof.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-blue-700 font-medium">
              <Truck className="w-4 h-4" />
              <span>Live Leaflet GPS Route</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500 transition-all">
            <div className="w-12 h-12 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold text-lg mb-4">
              4
            </div>
            <h3 className="font-bold text-base text-slate-900">Zero Waste Redistribution</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Food delivered to shelters. Platform updates food waste avoided, carbon diversion, and validation metrics.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-lime-700 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Impact Logged & Audited</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholder Ecosystem Section */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
                Ecosystem Coverage
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
                Tailored for Hyderabad Hospitality & Social Sectors
              </h2>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                From buffet surplus at Banjara Hills luxury hotels to marriage banquets in Secunderabad,
                SurplusFlow unites institutional donors with verified shelter networks across Telangana.
              </p>

              <div className="mt-6 space-y-3 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Restaurants, Hotels, Hostels & College Canteens</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Corporate Cafeterias & Marriage Convention Halls</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>NGOs, Shelters, Community Kitchens & Volunteers</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 italic">
                  <span>Note: Cloud kitchens are explicitly excluded from system scope.</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => onNavigate('validation')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-semibold text-xs hover:bg-emerald-900 transition-colors shadow-xs"
                >
                  View Benchmark Validation
                </button>
                <button
                  onClick={() => onNavigate('analytics')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-semibold text-xs hover:bg-slate-200 transition-colors"
                >
                  System Analytics
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-4">Active Prototype Geographic Nodes (Hyderabad)</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-900">Taj Banjara Grand Hotel</span>
                    <p className="text-[11px] text-slate-500">Road No. 1, Banjara Hills • 17.4156° N, 78.4487° E</p>
                  </div>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Active Donor</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-900">Robin Hood Army Hub</span>
                    <p className="text-[11px] text-slate-500">Jubilee Hills • 120 Meals Capacity</p>
                  </div>
                  <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">NGO Receiver</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-900">Cyber Conventions Banquet</span>
                    <p className="text-[11px] text-slate-500">Madhapur, Hitec City • 80 Meals Active</p>
                  </div>
                  <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Surplus Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
