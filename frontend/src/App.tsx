import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { NotificationModal } from './components/NotificationModal';
import { OperationsDashboard } from './pages/OperationsDashboard';
import { FindFoodPage } from './pages/FindFoodPage';
import { CreateListingWizard } from './pages/CreateListingWizard';
import { MyDonationsPage } from './pages/MyDonationsPage';
import { PickupDeliveryPage } from './pages/PickupDeliveryPage';
import { MessagesPage } from './pages/MessagesPage';
import { CommunityPage } from './pages/CommunityPage';
import { AdminAnalyticsDashboard } from './pages/AdminAnalyticsDashboard';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { FullMapPage } from './pages/FullMapPage';
import { PrototypeValidationPage } from './pages/PrototypeValidationPage';
import { AuthPage } from './pages/AuthPage';
import { AiChatbot } from './components/AiChatbot';
import { SurplusPredictionPage } from './pages/SurplusPredictionPage';
import { NgoDemandCalendarPage } from './pages/NgoDemandCalendarPage';
import { FoodWasteDiaryPage } from './pages/FoodWasteDiaryPage';
import { RoutePlannerPage } from './pages/RoutePlannerPage';
import { VerifiedImpactLedgerPage } from './pages/VerifiedImpactLedgerPage';
import { RescuePriorityPage } from './pages/RescuePriorityPage';
import { PseExperimentLabPage } from './pages/PseExperimentLabPage';
import { FoodImageChecker } from './components/FoodImageChecker';
import { LandingPage } from './pages/LandingPage';
import { PageWallpaper } from './components/PageWallpaper';
import { PageHero } from './components/PageHero';
import { api } from './services/api';
import { AppNotification } from './types';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('Hyderabad');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [donationPrefill, setDonationPrefill] = useState<any>(null);

  const fetchNotifications = async () => {
    try {
      const list = await api.getNotifications();
      setNotifications(list);
    } catch {
      // Quiet fallback
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen flex bg-[#021A12] text-[#172033] font-sans antialiased selection:bg-[#8BE34B]/40 selection:text-[#032C20] relative">
      {/* High-Quality Sustainable Food Wallpaper System */}
      <PageWallpaper theme={activeTab} />

      {/* 1. Persistent Deep Forest Green Left Sidebar with 4 Master Sections */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        unreadCount={unreadCount}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Navigation Bar with Urgency Radar and Multilingual EN/TE/HI switch */}
        <TopNavbar
          onSearch={(q) => setGlobalSearch(q)}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          openNotifications={() => setIsNotifOpen(true)}
          unreadCount={unreadCount}
          openMobileMenu={() => setMobileMenuOpen(true)}
          onNavigate={setActiveTab}
        />

        {/* Workspace Content Router with smooth animated transitions */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto relative z-10 animate-fade-in-up">
          {/* Reusable PageHero Top Section (Displayed on feature pages where hero is appropriate) */}
          {activeTab !== 'landing' && activeTab !== 'dashboard' && activeTab !== 'surplus-prediction' && activeTab !== 'login' && activeTab !== 'register' && (
            <PageHero activeTab={activeTab} onNavigate={setActiveTab} />
          )}

          {/* Landing Presentation Page */}
          {activeTab === 'landing' && (
            <LandingPage onNavigate={setActiveTab} />
          )}

          {/* Operations: Main Operations Dashboard */}
          {activeTab === 'dashboard' && (
            <OperationsDashboard
              onNavigate={setActiveTab}
              searchFilter={globalSearch}
              selectedLocation={selectedLocation}
            />
          )}

          {/* Operations: Find Food Directory */}
          {activeTab === 'find-food' && (
            <FindFoodPage onNavigate={setActiveTab} initialQuery={globalSearch} />
          )}

          {/* Operations: Create Donation Wizard */}
          {activeTab === 'create-donation' && (
            <CreateListingWizard
              initialValues={donationPrefill}
              onSuccess={() => {
                setDonationPrefill(null);
                setActiveTab('my-donations');
              }}
              onCancel={() => {
                setDonationPrefill(null);
                setActiveTab('dashboard');
              }}
            />
          )}

          {/* Operations: My Donations Management */}
          {activeTab === 'my-donations' && (
            <MyDonationsPage onNavigate={setActiveTab} />
          )}

          {/* Operations: Pickup & Delivery Volunteer Operations */}
          {activeTab === 'pickup-delivery' && <PickupDeliveryPage />}

          {/* Operations: NGO Demand Calendar (Feature 6) */}
          {activeTab === 'ngo-demand' && <NgoDemandCalendarPage />}

          {/* Operations: Food Waste Diary (Feature 10) */}
          {activeTab === 'waste-diary' && <FoodWasteDiaryPage />}

          {/* Intelligence: Smart Surplus Prediction & Preparation Advisor */}
          {activeTab === 'surplus-prediction' && (
            <SurplusPredictionPage
              onNavigateToDonation={(prefill) => {
                setDonationPrefill(prefill);
                setActiveTab('create-donation');
              }}
            />
          )}

          {/* Intelligence: AI Food Image Checker (Feature 1) */}
          {activeTab === 'image-checker' && (
            <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-2">AI Food Image Inspection & Safety Checker</h2>
              <p className="text-xs text-slate-500 mb-6">
                Direct visual pre-screening for color consistency, packaging condition, and estimated category.
              </p>
              <FoodImageChecker
                onApplyToDonationForm={(confirmed) => {
                  alert(`Assessment confirmed for: ${confirmed.foodName} (${confirmed.quantity} ${confirmed.unit})`);
                  setActiveTab('create-donation');
                }}
              />
            </div>
          )}

          {/* Intelligence: Rescue Priority Score (Feature 14) */}
          {activeTab === 'rescue-priority' && <RescuePriorityPage />}

          {/* Intelligence: Smart Route Planner (Feature 5) */}
          {activeTab === 'route-planner' && <RoutePlannerPage />}

          {/* Intelligence: Impact Analytics & Transparency */}
          {activeTab === 'analytics' && <AdminAnalyticsDashboard />}

          {/* Community: Real Messages */}
          {activeTab === 'messages' && <MessagesPage />}

          {/* Community: Verified NGOs & Donors */}
          {activeTab === 'community' && <CommunityPage />}

          {/* Administration: Food Safety & Validation Tests */}
          {activeTab === 'prototype-tests' && <PrototypeValidationPage />}

          {/* Administration: Verified Impact Ledger (Feature 12) */}
          {activeTab === 'impact-ledger' && <VerifiedImpactLedgerPage />}

          {/* Administration: Experiment & Validation Lab (Feature 15) */}
          {activeTab === 'experiment-lab' && <PseExperimentLabPage />}

          {/* Profile & Settings */}
          {activeTab === 'profile' && (
            <ProfileSettingsPage onNavigate={setActiveTab} defaultTab="profile" />
          )}
          {activeTab === 'settings' && (
            <ProfileSettingsPage onNavigate={setActiveTab} defaultTab="settings" />
          )}

          {/* Dedicated Full Map View */}
          {activeTab === 'map' && <FullMapPage onNavigate={setActiveTab} />}

          {/* Preserved Validation Suite */}
          {activeTab === 'validation' && <PrototypeValidationPage />}

          {/* Authentication Screen */}
          {(activeTab === 'login' || activeTab === 'register') && (
            <AuthPage
              initialMode={activeTab === 'register' ? 'register' : 'login'}
              onSuccess={() => setActiveTab('dashboard')}
              onExploreOverview={() => setActiveTab('dashboard')}
            />
          )}
        </main>
      </div>

      {/* Global Notification Modal */}
      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
      />

      {/* Floating AI Chatbot Assistant */}
      <AiChatbot onNavigateTab={setActiveTab} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
