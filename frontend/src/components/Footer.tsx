import React from 'react';
import { Leaf, ShieldCheck, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-10 mt-auto border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span>SurplusFlow Hyderabad</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Problem Solving in Engineering (PSE) Prototype. Designed to reduce avoidable surplus food waste through
              algorithmic multidimensional matching, urgency prioritization, and synchronized volunteer transit in Hyderabad, Telangana.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2 uppercase text-[11px] tracking-wider">Redistribution Architecture</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Surplus Geocoding & Time Windows</li>
              <li>MCDA Multi-Factor Matching Engine</li>
              <li>Urgency Time-Decay Prioritization</li>
              <li>Volunteer 5-Stage Transit Workflow</li>
              <li>Real-Time Waste Reduction Analytics</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2 uppercase text-[11px] tracking-wider">System Stakeholders</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Hotels, Restaurants, College Canteens</li>
              <li>Corporate Cafeterias & Marriage Halls</li>
              <li>NGOs, Orphanages, Shelters & Community Hubs</li>
              <li>Registered Volunteer Transit Network</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 text-amber-300 font-semibold mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Regulatory Food Safety</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              "Food redistribution must follow applicable food-safety and local regulatory requirements. All surplus listings require temperature verification and allergen disclosure."
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Scope: Hyderabad Metropolitan Area</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px]">
          <p>© 2026 PSE Engineering Prototype. All baseline values explicitly noted as illustrative demo or verified field data.</p>
          <p className="mt-2 sm:mt-0 font-mono text-emerald-400">Spring Boot 3.3.4 + React 19 + PostgreSQL + Leaflet</p>
        </div>
      </div>
    </footer>
  );
};
