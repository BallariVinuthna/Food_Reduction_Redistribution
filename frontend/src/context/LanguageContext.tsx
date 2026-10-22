import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'te' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    te: string;
    hi: string;
  };
}

export const translations: Translations = {
  // Navigation Sections
  nav_operations: { en: 'Operations', te: 'కార్యకలాపాలు', hi: 'संचालन' },
  nav_intelligence: { en: 'Intelligence', te: 'ఇంటెలిజెన్స్', hi: 'इंटेलिजेंस' },
  nav_community: { en: 'Community', te: 'సంఘం', hi: 'समुदाय' },
  nav_administration: { en: 'Administration', te: 'పరిపాలన', hi: 'प्रशासन' },

  // Navigation Items
  nav_dashboard: { en: 'Dashboard', te: 'డాష్‌బోర్డు', hi: 'डैशबोर्ड' },
  nav_find_food: { en: 'Find Food', te: 'ఆహారం కనుగొనండి', hi: 'भोजन खोजें' },
  nav_create_donation: { en: 'Create Donation', te: 'విరాళం ఇవ్వండి', hi: 'दान बनाएं' },
  nav_my_donations: { en: 'My Donations', te: 'నా విరాళాలు', hi: 'मेरे दान' },
  nav_pickup_delivery: { en: 'Pickup & Delivery', te: 'పికప్ & డెలివరీ', hi: 'पिकअप और डिलीवरी' },
  nav_ngo_demand: { en: 'NGO Demand Calendar', te: 'ఎన్జీఓ డిమాండ్ క్యాలెండర్', hi: 'एनजीओ मांग कैलेंडर' },
  nav_waste_diary: { en: 'Food Waste Diary', te: 'ఆహార వ్యర్థాల డైరీ', hi: 'खाद्य अपशिष्ट डायरी' },
  nav_surplus_prediction: { en: 'Surplus Prediction', te: 'మిగులు అంచనా', hi: 'अधिशेष भविष्यवाणी' },
  nav_image_checker: { en: 'AI Food Image Checker', te: 'ఏఐ ఆహార చిత్ర పరీక్ష', hi: 'एआई खाद्य छवि परीक्षक' },
  nav_rescue_priority: { en: 'Rescue Priority Score', te: 'రెస్క్యూ ప్రాధాన్యత స్కోరు', hi: 'बचाव प्राथमिकता स्कोर' },
  nav_route_planner: { en: 'Smart Route Planner', te: 'రూట్ ప్లానర్', hi: 'स्मार्ट रूट प्लानर' },
  nav_impact_analytics: { en: 'Impact Analytics', te: 'ప్రభావ విశ్లేషణ', hi: 'प्रभाव विश्लेषण' },
  nav_ngos_receivers: { en: 'NGOs & Receivers', te: 'ఎన్జీఓలు & స్వీకర్తలు', hi: 'एनजीओ और प्राप्तकर्ता' },
  nav_volunteers: { en: 'Volunteers', te: 'వాలంటీర్లు', hi: 'स्वयंसेवक' },
  nav_messages: { en: 'Messages', te: 'సందేశాలు', hi: 'संदेश' },
  nav_community_feed: { en: 'Community Feed', te: 'కమ్యూనిటీ ఫీడ్', hi: 'समुदाय फ़ीड' },
  nav_food_safety: { en: 'Food Safety Review', te: 'ఆహార భద్రత సమీక్ష', hi: 'खाद्य सुरक्षा समीक्षा' },
  nav_impact_ledger: { en: 'Verified Impact Ledger', te: 'ధృవీకరించబడిన ప్రభావ లెడ్జర్', hi: 'सत्यापित प्रभाव लेज़र' },
  nav_experiment_lab: { en: 'Experiment & Validation Lab', te: 'ప్రయోగ & ధ్రువీకరణ ల్యాబ్', hi: 'प्रयोग व सत्यापन लैब' },
  nav_settings: { en: 'Settings', te: 'సెట్టింగ్‌లు', hi: 'सेटिंग्स' },

  // Common terms
  app_tagline: { en: 'Smart Food Waste Reduction & Redistribution System', te: 'స్మార్ట్ ఆహార వ్యర్థాల తగ్గింపు & పునఃపంపిణీ వ్యవస్థ', hi: 'स्मार्ट खाद्य अपशिष्ट निवारण एवं पुनर्वितरण प्रणाली' },
  verified_safe: { en: 'Verified Safe', te: 'సురక్షితంగా ధృవీకరించబడింది', hi: 'सत्यापित सुरक्षित' },
  meals_saved: { en: 'Meals Saved', te: 'ఆదా చేసిన భోజనాలు', hi: 'बचाया गया भोजन' },
  co2_avoided: { en: 'CO2e Avoided', te: 'నివారించిన CO2e', hi: 'रोकी गई CO2e' },
  active_urgency: { en: 'Active Urgency Alerts', te: 'అత్యవసర హెచ్చరికలు', hi: 'सक्रिय आपात चेतावनी' },
  critical: { en: 'Critical', te: 'అత్యవసరం', hi: 'गंभीर' },
  high_priority: { en: 'High Priority', te: 'అధిక ప్రాధాన్యత', hi: 'उच्च प्राथमिकता' },
  standard: { en: 'Standard', te: 'సాధారణం', hi: 'मानक' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('sf_language') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sf_language', lang);
  };

  const t = (key: string, fallback?: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return fallback || (translations[key] ? translations[key]['en'] : key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
