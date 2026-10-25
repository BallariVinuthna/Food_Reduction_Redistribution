import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Clock,
  Heart,
  Truck,
  Calendar,
  BookOpen,
  Search,
  PlusCircle,
  PackageCheck,
  CheckCircle2,
  Users2,
  BarChart3,
} from 'lucide-react';

export interface HeroActionChip {
  label: string;
  sublabel?: string;
  variant?: 'lime' | 'emerald' | 'amber' | 'glass';
  actionTab?: string;
}

export interface PageHeroConfig {
  tag: string;
  title: string;
  italicSubtitle: string;
  description: string;
  chips: HeroActionChip[];
}

export const HERO_CONFIGS: Record<string, PageHeroConfig> = {
  // A. Home / Main Dashboard
  dashboard: {
    tag: 'HYDERABAD METRO FOOD NETWORK • LIVE ECOSYSTEM',
    title: 'Every meal tells a story.',
    italicSubtitle: 'Act before surplus spoils.',
    description:
      'Real-time automated redistribution connecting commercial kitchens, food providers, verified shelters, and volunteer couriers across Hyderabad.',
    chips: [
      { label: '🌱 Zero Food Landfill', sublabel: 'Target 100%', variant: 'lime' },
      { label: '🍲 2,850 Meals Saved', sublabel: 'Oct 2026', variant: 'glass', actionTab: 'analytics' },
      { label: '⚡ AI Redistribution Match', sublabel: '<4 min cycle', variant: 'glass', actionTab: 'find-food' },
      { label: '⏱ 30-Min Safe Handover', sublabel: 'Cold chain alert', variant: 'amber', actionTab: 'rescue-priority' },
      { label: '🤝 18 Verified NGOs', sublabel: 'Hyderabad Hub', variant: 'emerald', actionTab: 'ngo-demand' },
    ],
  },

  // B. Food Listings / Find Food
  'find-food': {
    tag: 'SURPLUS DISCOVERY • FRESH PRODUCE & MEALS',
    title: 'Fresh harvest & prepared meals.',
    italicSubtitle: 'Connecting kitchens with community tables.',
    description:
      'Inspect verified edible surplus donations across Hyderabad, confirm safe holding times and dietary tags, and reserve food for your shelter.',
    chips: [
      { label: '🥗 14 Active Batches', sublabel: 'Within 8 km', variant: 'lime' },
      { label: '🛡️ 100% Safety Verified', sublabel: 'FSSAI compliant', variant: 'glass', actionTab: 'prototype-tests' },
      { label: '📍 Live Distance Radius', sublabel: 'Banjara to Hitec', variant: 'glass' },
      { label: '⚡ Instant Reservation', sublabel: 'Zero paperwork', variant: 'emerald' },
    ],
  },

  // C. Create Donation Wizard
  'create-donation': {
    tag: 'DONOR DISPATCH • COMMERCIAL KITCHEN PORTAL',
    title: 'List surplus in 60 seconds.',
    italicSubtitle: 'From kitchen counter to recipient shelter.',
    description:
      'Pre-screen food items, record packaging integrity, specify pickup time windows, and dispatch automated multicriteria alerts to nearby NGOs.',
    chips: [
      { label: '⚡ AI Smart Form Fill', sublabel: 'Instant photo scan', variant: 'lime', actionTab: 'image-checker' },
      { label: '📦 Food-Grade Packaging', sublabel: 'Safety protocol', variant: 'glass' },
      { label: '⚖️ Tax Exemption 80G', sublabel: 'Automated receipt', variant: 'emerald' },
      { label: '🚚 Guaranteed Arrival', sublabel: '<45 min window', variant: 'amber' },
    ],
  },

  // D. My Donations Tracking
  'my-donations': {
    tag: 'DONOR CUSTODY • REAL-TIME DISPATCH TRACKER',
    title: 'Tracking every edible kilogram.',
    italicSubtitle: 'Transparent donation custody from door to table.',
    description:
      'Monitor live volunteer pickup transit, temperature verification, delivery confirmations, and recipient shelter drop-off receipts.',
    chips: [
      { label: '🚚 En-Route Pickups', sublabel: 'Real-time GPS', variant: 'lime', actionTab: 'pickup-delivery' },
      { label: '✅ Verified Shelter Delivery', sublabel: 'Photo proof-of-drop', variant: 'emerald' },
      { label: '📄 ESG Compliance Certificate', sublabel: 'Audit ready', variant: 'glass' },
    ],
  },

  // E. Volunteer Pickup & Delivery
  'pickup-delivery': {
    tag: 'VOLUNTEER FLEET • GREEN CORRIDOR LOGISTICS',
    title: 'Miles of kindness in motion.',
    italicSubtitle: 'Quick pickups, thermal bags, verified delivery.',
    description:
      'Crowdsourced volunteer fleet equipped with insulated containers and dynamic route guidance to preserve food temperature and safety.',
    chips: [
      { label: '🚲 32 Active Couriers', sublabel: 'EV & pedal fleet', variant: 'lime' },
      { label: '⏱ 18-Min Avg Response', sublabel: 'Record speed', variant: 'emerald' },
      { label: '🗺️ Green Transit Paths', sublabel: 'CO₂ minimized', variant: 'glass', actionTab: 'route-planner' },
      { label: '🌡️ Cold-Chain Lock', sublabel: 'Safe temp guarantee', variant: 'amber' },
    ],
  },

  // F. NGO Demand Calendar
  'ngo-demand': {
    tag: 'RECIPIENT NETWORK • CAPACITY & MEAL PLANNING',
    title: 'Nourishing communities together.',
    italicSubtitle: 'Scheduled hunger relief and demand forecasting.',
    description:
      'Registered orphanages, community kitchens, and shelters broadcast meal requirements to prevent hunger and balance regional surplus.',
    chips: [
      { label: '📅 7-Day Demand Schedule', sublabel: 'Synchronized intake', variant: 'lime' },
      { label: '🧒 4,200 Children Fed', sublabel: 'This week', variant: 'emerald' },
      { label: '🍲 Dietary Matching', sublabel: 'Veg, Jain, Halal', variant: 'glass' },
    ],
  },

  // G. Food Waste Diary
  'waste-diary': {
    tag: 'KITCHEN AUDITING • COMMERCIAL BENCHMARKS',
    title: 'Measure twice, discard zero.',
    italicSubtitle: 'Mindful commercial kitchen diary and prevention audits.',
    description:
      'Identify recurring waste hotspots, monitor prep trim losses, and adjust ordering schedules to boost kitchen margins and cut landfill waste.',
    chips: [
      { label: '📉 -34% Kitchen Waste', sublabel: 'Month-over-month', variant: 'lime' },
      { label: '💰 ₹42,000 Saved', sublabel: 'Raw ingredient cost', variant: 'emerald' },
      { label: '📊 Hotspot Detection', sublabel: 'Bakery & buffet audit', variant: 'glass' },
    ],
  },

  // H. Smart Surplus Prediction & Preparation Advisor
  'surplus-prediction': {
    tag: 'PREVENTIVE AI • DEMAND ESTIMATION ENGINE',
    title: 'Prevent waste before it cooks.',
    italicSubtitle: 'Precision demand forecasting and prep quantity advisor.',
    description:
      'AI correlates historical footfall, weather forecasts, local events, and day-of-week trends to recommend exact ingredient batch sizes.',
    chips: [
      { label: '🎯 94.8% Forecast Accuracy', sublabel: 'Dynamic model', variant: 'lime' },
      { label: '🌧️ Weather & Event Factor', sublabel: 'Rain forecast mapped', variant: 'glass' },
      { label: '⚡ 1-Click Surplus Pre-Listing', sublabel: 'Direct to NGO pipeline', variant: 'emerald' },
      { label: '📈 22% Margin Optimization', sublabel: 'For food providers', variant: 'amber' },
    ],
  },

  // I. AI Food Image Checker
  'image-checker': {
    tag: 'COMPUTER VISION • FOOD SAFETY SCREENING',
    title: 'Every grain inspected.',
    italicSubtitle: 'AI visual food safety and freshness verification.',
    description:
      'Computer vision models evaluate surface texture, packaging integrity, steam condensation, and color variance before listing approval.',
    chips: [
      { label: '🔬 Visual Freshness Score', sublabel: '98/100 threshold', variant: 'lime' },
      { label: '🛡️ Thermal Inspection', sublabel: 'Steam & temp check', variant: 'glass' },
      { label: '📸 Instant Pre-Fill', sublabel: 'Auto-fill donation', variant: 'emerald' },
    ],
  },

  // J. Rescue Priority Score
  'rescue-priority': {
    tag: 'URGENCY RADAR • TIME-DECAY SCORING',
    title: 'Time is nutrition.',
    italicSubtitle: 'Dynamic urgency decay algorithms prioritize perishable food.',
    description:
      'Perishable cooked dishes receive boosted rescue priority as expiration windows narrow, triggering automated expedited courier dispatches.',
    chips: [
      { label: '🚨 2 Critical Priority Lots', sublabel: '<45 min window', variant: 'amber' },
      { label: '⚡ Automatic Courier Dispatch', sublabel: 'Priority override', variant: 'lime' },
      { label: '⏳ Exponential Decay Model', sublabel: 'Optimal food life', variant: 'glass' },
    ],
  },

  // K. Smart Route Planner
  'route-planner': {
    tag: 'MULTI-STOP TRANSIT • CO₂ MINIMIZATION',
    title: 'Green transit pathways.',
    italicSubtitle: 'Smart multi-stop eco delivery and route clustering.',
    description:
      'Optimized pickup and drop-off clusters reduce courier mileage by 42% while guaranteeing safe food transport temperatures.',
    chips: [
      { label: '🌱 -42% Carbon Footprint', sublabel: 'Clustered transit', variant: 'lime' },
      { label: '🗺️ 5 Waypoint Optimization', sublabel: 'Live traffic sync', variant: 'glass' },
      { label: '⚡ EV Courier Preference', sublabel: 'Green fleet priority', variant: 'emerald' },
    ],
  },

  // L. Impact Analytics & Transparency
  analytics: {
    tag: 'ESG VERIFICATION • SUSTAINABILITY METRICS',
    title: 'Real environmental impact.',
    italicSubtitle: 'Verified ESG metrics, carbon savings, and community dividends.',
    description:
      'Transparent analytics dashboard tracking kilograms diverted from landfills, water footprint conserved, and meals redistributed.',
    chips: [
      { label: '🌍 14.8 Tons CO₂ Diverted', sublabel: 'Certified ESG data', variant: 'lime' },
      { label: '💧 4.2 Million Liters Water', sublabel: 'Water footprint saved', variant: 'emerald' },
      { label: '📈 24,500 Total Meals', sublabel: 'Lifetime impact', variant: 'glass' },
    ],
  },

  // M. Messages / Communication Hub
  messages: {
    tag: 'COMMUNICATION HUB • DONOR-RECEIVER COORDINATION',
    title: 'Direct human connection.',
    italicSubtitle: 'Instant messaging between donors, couriers, and shelters.',
    description:
      'Coordinate special dietary notes, precise entrance gates, container return requests, and delivery handoffs in real-time.',
    chips: [
      { label: '💬 Instant Handoff Chat', sublabel: 'Zero lag updates', variant: 'lime' },
      { label: '🔒 Secure Identity Masking', sublabel: 'Privacy protected', variant: 'glass' },
      { label: '📍 Live Location Ping', sublabel: 'At-gate coordination', variant: 'emerald' },
    ],
  },

  // N. Community Feed
  community: {
    tag: 'COMMUNITY STORIES • HYDERABAD FOOD HEROES',
    title: 'Stronger communities together.',
    italicSubtitle: 'Celebrating donors, volunteers, and hunger champions.',
    description:
      'Explore community impact feeds, hero spotlights, volunteer stories, and collective milestones achieved across Telangana.',
    chips: [
      { label: '🌟 1,240 Food Champions', sublabel: 'Active community', variant: 'lime' },
      { label: '🏆 Monthly Leadership Badges', sublabel: 'Top donors honored', variant: 'glass' },
      { label: '📢 Community Announcements', sublabel: 'Weekend drives', variant: 'emerald' },
    ],
  },

  // O. Food Safety & Tests
  'prototype-tests': {
    tag: 'SAFETY PROTOCOLS • COMPLIANCE AUDITS',
    title: 'Zero tolerance for unsafe food.',
    italicSubtitle: 'Rigorous 5-point safety checklists and lab validations.',
    description:
      'Every listing passes packaging seal inspections, temperature threshold reviews, hygiene verifications, and compliance logs.',
    chips: [
      { label: '🛡️ 5-Point Safety Standard', sublabel: 'FSSAI compliant', variant: 'lime' },
      { label: '🌡️ Temperature Threshold Lock', sublabel: 'Hot >60°C | Cold <5°C', variant: 'glass' },
      { label: '📜 Digital Safe-Food Cert', sublabel: 'Verified per batch', variant: 'emerald' },
    ],
  },

  // P. Verified Impact Ledger
  'impact-ledger': {
    tag: 'TRANSPARENCY • CRYPTOGRAPHIC PROOF OF IMPACT',
    title: 'Immutable food redistribution ledger.',
    italicSubtitle: 'Every kilogram cryptographically recorded and audited.',
    description:
      'Tamper-proof digital record of food origin, courier custody, temperature logs, and shelter receipts for audit compliance.',
    chips: [
      { label: '🔗 Cryptographic Hash Verification', sublabel: 'Tamper-proof', variant: 'lime' },
      { label: '📑 Annual CSR Report Ready', sublabel: 'One-click export', variant: 'emerald' },
      { label: '📊 100% Audit Trails', sublabel: 'Zero discrepancies', variant: 'glass' },
    ],
  },

  // Q. Experiment Lab
  'experiment-lab': {
    tag: 'R&D VALIDATION • HYPOTHESIS TESTING',
    title: 'Engineering the future of food rescue.',
    italicSubtitle: 'Testing novel algorithms, cold-chain tech, and routing.',
    description:
      'Interactive sandbox environment to validate predictive heuristics, dynamic urgency decay models, and volunteer matching strategies.',
    chips: [
      { label: '🧪 6 Active Experiments', sublabel: 'Heuristic tuning', variant: 'lime' },
      { label: '⚡ Sub-Second Simulation', sublabel: 'Real-time modeling', variant: 'glass' },
      { label: '🔬 Statistical Confidence', sublabel: 'p < 0.01 validated', variant: 'emerald' },
    ],
  },

  // R. Settings & Profile
  settings: {
    tag: 'OPERATIONS PREFERENCES • PROFILE CONFIGURATION',
    title: 'Tailored to your mission.',
    italicSubtitle: 'Manage notifications, language, roles, and kitchen specs.',
    description:
      'Configure auto-donation triggers, pickup address geofencing, notification channels, and multi-language operational interfaces.',
    chips: [
      { label: '🌐 Multilingual (EN/TE/HI)', sublabel: 'Active translation', variant: 'lime' },
      { label: '🔔 SMS & WhatsApp Alerts', sublabel: 'Instant alerts', variant: 'glass' },
      { label: '🛡️ Role-Based Access Control', sublabel: 'Enterprise grade', variant: 'emerald' },
    ],
  },
};

import { AnimatedPageHeading } from './AnimatedPageHeading';

interface PageHeroProps {
  activeTab: string;
  onNavigate?: (tab: string) => void;
  className?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  activeTab,
  onNavigate,
  className = '',
}) => {
  const config = HERO_CONFIGS[activeTab] || HERO_CONFIGS.dashboard;

  return (
    <div
      className={`relative mb-6 overflow-hidden rounded-3xl shadow-xl border border-[#79A786]/30 bg-gradient-to-r from-[#163D2B]/95 via-[#24543B]/90 to-[#163D2B]/95 backdrop-blur-xl text-[#F2F7F1] ${className}`}
    >
      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        {/* Word-by-Word Animated Heading & Italic Subtitle */}
        <AnimatedPageHeading
          tag={config.tag}
          title={config.title}
          italicSubtitle={config.italicSubtitle}
          className="max-w-3xl mb-3"
          baseDelayMs={60}
          wordStaggerMs={110}
        />

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-[#DCE9DE]/85 max-w-2xl mb-6 leading-relaxed">
          {config.description}
        </p>

        {/* Stable Interactive Action Chips (Sequential bottom-to-top rise) */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {config.chips.map((chip, idx) => {
            let styleClass = '';
            if (chip.variant === 'lime') {
              styleClass =
                'bg-[#367A50] hover:bg-[#24543B] text-[#FFFFFF] border-[#79A786]/40 font-bold shadow-md hover:brightness-105';
            } else if (chip.variant === 'amber') {
              styleClass =
                'bg-amber-500/20 border-amber-400/40 text-amber-200 backdrop-blur-md hover:bg-amber-500/30 shadow-xs';
            } else if (chip.variant === 'emerald') {
              styleClass =
                'bg-[#24543B]/80 border-[#79A786]/30 text-[#DCE9DE] backdrop-blur-md hover:bg-[#24543B] shadow-xs';
            } else {
              // Sage Glass Chip
              styleClass =
                'bg-[#163D2B]/60 border-[#79A786]/25 text-[#DCE9DE] backdrop-blur-md hover:bg-[#24543B]/60 shadow-xs';
            }

            return (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  if (chip.actionTab && onNavigate) {
                    onNavigate(chip.actionTab);
                  }
                }}
                className={`group px-3.5 py-2 rounded-2xl border text-xs transition-all duration-200 flex items-center gap-2 cursor-pointer hover:scale-102 active:scale-98 animate-box-rise ${styleClass}`}
                style={{
                  animationDelay: `${260 + idx * 70}ms`,
                }}
              >
                <span className="font-semibold">{chip.label}</span>
                {chip.sublabel && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      chip.variant === 'lime'
                        ? 'bg-[#163D2B]/30 text-[#FFFFFF]'
                        : 'bg-white/15 text-[#F2F7F1]'
                    }`}
                  >
                    {chip.sublabel}
                  </span>
                )}
                {chip.actionTab && (
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
