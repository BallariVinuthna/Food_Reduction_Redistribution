import React, { useState } from 'react';

export interface WallpaperThemeConfig {
  imageUrl: string;
  title: string;
  vignette: string;
  fallbackGradient: string;
}

export const WALLPAPER_THEMES: Record<string, WallpaperThemeConfig> = {
  // A. Home / Main Dashboard
  dashboard: {
    imageUrl: '/assets/hero_redistribution.jpg',
    title: 'Sustainable Food Redistribution',
    vignette: 'from-[#163D2B]/85 via-[#24543B]/45 to-[#163D2B]/88',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#163D2B]',
  },

  // B. Overview / Analytics / ESG Impact
  analytics: {
    imageUrl: '/assets/analytics_eco.jpg',
    title: 'ESG & Environmental Transparency',
    vignette: 'from-[#163D2B]/85 via-[#24543B]/50 to-[#163D2B]/88',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#367A50]',
  },

  // C. Food Listings / Surplus Management / Fresh Produce
  'find-food': {
    imageUrl: '/assets/market_produce.jpg',
    title: 'Fresh Surplus Produce & Harvest',
    vignette: 'from-[#163D2B]/85 via-[#24543B]/45 to-[#163D2B]/88',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#163D2B]',
  },

  // C2. Create Donation / Prepared Meal Containers
  'create-donation': {
    imageUrl: '/assets/packed_meals.jpg',
    title: 'Prepared Meal Distribution Packages',
    vignette: 'from-[#163D2B]/85 via-[#24543B]/45 to-[#163D2B]/88',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#367A50]',
  },

  // C3. My Donations / Gourmet Cooked Buffet Dishes
  'my-donations': {
    imageUrl: '/assets/veg_biryani.jpg',
    title: 'Gourmet Cooked Meals & Catering',
    vignette: 'from-[#163D2B]/85 via-[#24543B]/45 to-[#163D2B]/88',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#163D2B]',
  },

  // D. Smart Surplus Prediction / Preparation Advisor
  'surplus-prediction': {
    imageUrl: '/assets/chef_donor.jpg',
    title: 'Commercial Kitchen Demand Forecasting',
    vignette: 'from-[#163D2B]/85 via-[#24543B]/45 to-[#163D2B]/88',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#367A50]',
  },

  // E. Food Matching / NGO Demand Calendar
  'ngo-demand': {
    imageUrl: '/assets/ngo_receiver.jpg',
    title: 'Community Shelter & Intake Calendar',
    vignette: 'from-[#163D2B]/85 via-[#24543B]/45 to-[#163D2B]/88',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#163D2B]',
  },

  // F. Volunteer Pickup / Delivery
  'pickup-delivery': {
    imageUrl: '/assets/volunteer_worker.jpg',
    title: 'Volunteer Transit & Delivery',
    vignette: 'from-[#163D2B]/85 via-[#24543B]/45 to-[#163D2B]/88',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#367A50]',
  },

  // G. Food Waste Diary / Waste Tracking
  'waste-diary': {
    imageUrl: '/assets/dinner_rolls.jpg',
    title: 'Kitchen Inventory & Food Waste Prevention',
    vignette: 'from-[#163D2B]/85 via-[#24543B]/45 to-[#163D2B]/88',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#163D2B]',
  },

  // H. Food Safety / AI Visual Inspection
  'image-checker': {
    imageUrl: '/assets/fresh_salads.jpg',
    title: 'AI Freshness & Safety Verification',
    vignette: 'from-[#163D2B]/85 via-[#24543B]/45 to-[#163D2B]/88',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#367A50]',
  },

  // I. Rescue Priority Score / Perishable Dispatch
  'rescue-priority': {
    imageUrl: '/assets/chicken_curry.jpg',
    title: 'Dynamic Urgency & Swift Dispatch',
    vignette: 'from-[#163D2B]/85 via-[#24543B]/45 to-[#163D2B]/88',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#163D2B]',
  },

  // J. Smart Route Planner / Urban Logistics
  'route-planner': {
    imageUrl: '/assets/route_logistics.jpg',
    title: 'Multi-Stop Eco Transit & Route Optimization',
    vignette: 'from-[#163D2B]/85 via-[#24543B]/45 to-[#163D2B]/88',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#367A50]',
  },

  // K. Messages / Communication Hub
  messages: {
    imageUrl: '/assets/community_volunteers.jpg',
    title: 'Community Team Coordination',
    vignette: 'from-[#163D2B]/85 via-[#24543B]/45 to-[#163D2B]/88',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#163D2B]',
  },

  // L. Community Feed / Hyderabad Stories
  community: {
    imageUrl: '/assets/hero_redistribution.jpg',
    title: 'Community Movement & Food Heroes',
    vignette: 'from-[#163D2B]/85 via-[#24543B]/45 to-[#163D2B]/88',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#367A50]',
  },

  // M. Food Safety & Verification Tests
  'prototype-tests': {
    imageUrl: '/assets/safety_lab.jpg',
    title: 'Hygienic Safety Protocols & Compliance',
    vignette: 'from-[#163D2B]/85 via-[#24543B]/50 to-[#163D2B]/88',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#163D2B]',
  },

  // N. Verified Cryptographic Impact Ledger
  'impact-ledger': {
    imageUrl: '/assets/analytics_eco.jpg',
    title: 'Cryptographic Sustainability Ledger',
    vignette: 'from-[#163D2B]/85 via-[#24543B]/50 to-[#163D2B]/88',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#367A50]',
  },

  // O. Experiment & Validation Lab
  'experiment-lab': {
    imageUrl: '/assets/safety_lab.jpg',
    title: 'Sustainable Logistics Sandbox',
    vignette: 'from-[#163D2B]/85 via-[#24543B]/50 to-[#163D2B]/88',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#163D2B]',
  },

  // P. Settings & Profile
  settings: {
    imageUrl: '/assets/sidebar_botanical.jpg',
    title: 'Operations Settings & Profile',
    vignette: 'from-[#163D2B]/88 via-[#24543B]/55 to-[#163D2B]/90',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#163D2B]',
  },

  profile: {
    imageUrl: '/assets/sidebar_botanical.jpg',
    title: 'Profile Configuration',
    vignette: 'from-[#163D2B]/88 via-[#24543B]/55 to-[#163D2B]/90',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#163D2B]',
  },

  // Q. Dedicated Interactive Map View (clean minimal surroundings)
  map: {
    imageUrl: '/assets/route_logistics.jpg',
    title: 'Interactive City Transit Map',
    vignette: 'from-[#163D2B]/90 via-[#24543B]/65 to-[#163D2B]/92',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#163D2B]',
  },

  // R. Landing & Auth
  landing: {
    imageUrl: '/assets/hero_redistribution.jpg',
    title: 'Food Redistribution Movement',
    vignette: 'from-[#163D2B]/88 via-[#24543B]/60 to-[#163D2B]/92',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#367A50]',
  },

  auth: {
    imageUrl: '/assets/hero_redistribution.jpg',
    title: 'Secure Access Portal',
    vignette: 'from-[#163D2B]/90 via-[#24543B]/70 to-[#163D2B]/95',
    fallbackGradient: 'from-[#163D2B] via-[#24543B] to-[#163D2B]',
  },
};

interface PageWallpaperProps {
  theme: string;
  className?: string;
}

export const PageWallpaper: React.FC<PageWallpaperProps> = ({ theme, className = '' }) => {
  const [loadError, setLoadError] = useState(false);
  const config = WALLPAPER_THEMES[theme] || WALLPAPER_THEMES.dashboard;

  return (
    <div
      className={`fixed inset-0 pointer-events-none select-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 1. Base High-Definition Photographic Wallpaper */}
      {!loadError && config.imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-80 sm:opacity-85"
          style={{
            backgroundImage: `url(${config.imageUrl})`,
            backgroundPosition: 'center center',
          }}
        >
          {/* Hidden img tag to catch potential asset loading error */}
          <img
            src={config.imageUrl}
            alt=""
            className="hidden"
            onError={() => setLoadError(true)}
          />
        </div>
      )}

      {/* 2. Fallback Ambient Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.fallbackGradient} ${
          loadError ? 'opacity-95' : 'opacity-40'
        } transition-opacity duration-700`}
      />

      {/* 3. Deep Forest Green Monochromatic Vignette Overlay (Guarantees high contrast & readability) */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${config.vignette} transition-colors duration-700`}
      />
    </div>
  );
};
