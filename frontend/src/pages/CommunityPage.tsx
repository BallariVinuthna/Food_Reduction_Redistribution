import React, { useState } from 'react';
import {
  Users2,
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
  Heart,
  CheckCircle2,
  ExternalLink,
  Award,
} from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'RECEIVERS' | 'DONORS' | 'VOLUNTEERS'>('RECEIVERS');

  const verifiedReceivers = [
    {
      id: 1,
      name: 'Robin Hood Army - Hyderabad Chapter',
      category: 'Youth Volunteer Food Distribution Network',
      locality: 'Jubilee Hills & Central Hyderabad',
      capacity: '300 meals/day',
      verified: true,
      phone: '+91 9876543212',
      badge: 'Platinum Partner',
    },
    {
      id: 2,
      name: 'Amrapali Care & Shelter Home',
      category: 'Elderly & Destitute Residential Care',
      locality: 'Mehdipatnam, Hyderabad',
      capacity: '120 meals/day',
      verified: true,
      phone: '+91 9876543219',
      badge: 'Community Anchor',
    },
    {
      id: 3,
      name: 'Feed The Need Community Foundation',
      category: 'Public Refrigerator Network & Slum Outreach',
      locality: 'Begumpet & Secunderabad',
      capacity: '250 meals/day',
      verified: true,
      phone: '+91 9876543220',
      badge: 'Verified NGO',
    },
    {
      id: 4,
      name: 'Akshaya Patra Food Shelter',
      category: 'Nutritional Meal Support Program',
      locality: 'Kothapet, Dilsukhnagar, Hyderabad',
      capacity: '500 meals/day',
      verified: true,
      phone: '+91 9876543217',
      badge: 'High Capacity Hub',
    },
    {
      id: 5,
      name: 'Sphoorti Foundation Shelter',
      category: 'Child Welfare & Orphanage Support',
      locality: 'Cherlapally, Hyderabad',
      capacity: '150 meals/day',
      verified: true,
      phone: '+91 9876543218',
      badge: 'Verified Care Center',
    },
  ];

  const verifiedDonors = [
    {
      id: 1,
      name: 'Taj Banjara Grand Hotel',
      category: 'Luxury Hospitality & Banquet Kitchen',
      locality: 'Road No. 1, Banjara Hills, Hyderabad',
      type: 'Hotel / Restaurant',
      fssai: 'FSSAI Verified',
      donated: '1,840 meals',
    },
    {
      id: 2,
      name: 'Cyber Conventions & Marriage Hall',
      category: 'Large Scale Convention Banquet Facility',
      locality: 'HITEC City, Madhapur, Hyderabad',
      type: 'Event Hall',
      fssai: 'FSSAI Verified',
      donated: '2,650 meals',
    },
    {
      id: 3,
      name: 'Paradise Biryani Hub',
      category: 'Iconic Authentic Restaurant & Catering',
      locality: 'MG Road, Secunderabad',
      type: 'Restaurant Chain',
      fssai: 'FSSAI Verified',
      donated: '1,420 meals',
    },
    {
      id: 4,
      name: 'CBIT Engineering College Canteen',
      category: 'Institutional Campus Dining',
      locality: 'Gandipet, Hyderabad',
      type: 'University Canteen',
      fssai: 'FSSAI Certified',
      donated: '980 meals',
    },
  ];

  const volunteerChampions = [
    {
      id: 1,
      name: 'Rahul Verma',
      vehicle: 'Motorcycle with Insulated Carrier Box',
      trips: '48 Missions Completed',
      rating: '4.95 ★',
      area: 'Banjara Hills & Jubilee Hills',
    },
    {
      id: 2,
      name: 'Sneha Patel',
      vehicle: 'Eco-Friendly Electric Hatchback',
      trips: '64 Missions Completed',
      rating: '5.0 ★',
      area: 'HITEC City, Madhapur & Gachibowli',
    },
    {
      id: 3,
      name: 'Vikram Sharma',
      vehicle: 'Two-Wheeler Quick Response Carrier',
      trips: '35 Missions Completed',
      rating: '4.9 ★',
      area: 'Secunderabad & Begumpet',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#087B46] uppercase tracking-wider">
            Hyderabad Food Network
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Community Ecosystem & Partners
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover verified NGOs, generous food donors, and dedicated volunteers driving zero food waste across Hyderabad.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('RECEIVERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'RECEIVERS'
              ? 'bg-[#087B46] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>NGO Receivers & Shelters ({verifiedReceivers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('DONORS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'DONORS'
              ? 'bg-[#087B46] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Food Providers ({verifiedDonors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('VOLUNTEERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'VOLUNTEERS'
              ? 'bg-[#087B46] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Users2 className="w-4 h-4" />
          <span>Volunteer Champions ({volunteerChampions.length})</span>
        </button>
      </div>

      {/* Receivers Tab */}
      {activeTab === 'RECEIVERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {verifiedReceivers.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                    {rec.badge}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#087B46]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  {rec.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{rec.category}</p>

                <div className="pt-2 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{rec.locality}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Beneficiary Capacity: <strong>{rec.capacity}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{rec.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-medium">Multicriteria Profile Active</span>
                <span className="font-bold text-[#087B46]">Ready for Matching</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Donors Tab */}
      {activeTab === 'DONORS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {verifiedDonors.map((don) => (
            <div
              key={don.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#087B46]">
                    {don.fssai}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{don.type}</span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  {don.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{don.category}</p>

                <div className="pt-2 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{don.locality}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>Community Contribution: <strong className="text-emerald-700">{don.donated}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-medium">Safe Food Hygiene Pledge</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Compliant</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Volunteers Tab */}
      {activeTab === 'VOLUNTEERS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {volunteerChampions.map((vol) => (
            <div
              key={vol.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-lg">
                {vol.name.charAt(0)}
              </div>
              <h3 className="text-base font-extrabold text-slate-900">{vol.name}</h3>
              <p className="text-xs text-slate-500 font-medium">{vol.vehicle}</p>

              <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div>Primary Zone: <strong>{vol.area}</strong></div>
                <div>Completed Trips: <strong className="text-emerald-700">{vol.trips}</strong></div>
                <div>Reliability: <strong className="text-amber-600">{vol.rating}</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
