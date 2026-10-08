import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NotificationModal } from './components/NotificationModal';
import { LandingPage } from './pages/LandingPage';
import { ProviderDashboard } from './pages/ProviderDashboard';
import { ReceiverDashboard } from './pages/ReceiverDashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { AdminAnalyticsDashboard } from './pages/AdminAnalyticsDashboard';
import { PrototypeValidationPage } from './pages/PrototypeValidationPage';
import { api } from './services/api';
import { AppNotification } from './types';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);

  const fetchNotifications = async () => {
    try {
      const list = await api.getNotifications();
      setNotifications(list);
    } catch {
      // Quiet fail if not logged in
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-lime-300 selection:text-emerald-950">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openNotifications={() => setIsNotifOpen(true)}
        unreadCount={unreadCount}
      />

      <main className="flex-1">
        {activeTab === 'landing' && <LandingPage onNavigate={setActiveTab} />}
        {activeTab === 'provider' && <ProviderDashboard />}
        {activeTab === 'receiver' && <ReceiverDashboard />}
        {activeTab === 'volunteer' && <VolunteerDashboard />}
        {activeTab === 'analytics' && <AdminAnalyticsDashboard />}
        {activeTab === 'validation' && <PrototypeValidationPage />}
      </main>

      <Footer />

      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
