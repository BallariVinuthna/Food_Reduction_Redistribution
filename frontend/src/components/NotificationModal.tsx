import React from 'react';
import { AppNotification } from '../types';
import { Bell, Check, CheckCheck, Clock, X, AlertTriangle, Package, HeartHandshake, Truck } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onSelectAction?: (refId: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUITABLE_RECEIVER_FOUND':
      case 'FOOD_ACCEPTED':
        return <HeartHandshake className="w-5 h-5 text-emerald-600" />;
      case 'PICKUP_ASSIGNED':
      case 'VOLUNTEER_APPROACHING':
      case 'FOOD_COLLECTED':
      case 'FOOD_DELIVERED':
        return <Truck className="w-5 h-5 text-teal-600" />;
      case 'FOOD_EXPIRED':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-emerald-700" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-800" />
            <h3 className="font-bold text-slate-900 text-sm">Notifications Center</h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              {notifications.filter((n) => !n.isRead).length} new
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-xs text-slate-500 hover:text-emerald-800 flex items-center gap-1 p-1 hover:bg-slate-200 rounded-md transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No notifications yet</p>
              <p className="text-[11px] text-slate-400 mt-1">Real-time alerts will appear when surplus food is matched or collected</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl border transition-all ${
                  n.isRead
                    ? 'bg-slate-50/60 border-slate-200 text-slate-600'
                    : 'bg-emerald-50/40 border-emerald-200 text-slate-900 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-2xs mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-xs text-slate-900 truncate">{n.title}</p>
                      {!n.isRead && (
                        <button
                          onClick={() => onMarkRead(n.id)}
                          className="text-[10px] text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-0.5 ml-2"
                        >
                          <Check className="w-3 h-3" /> Mark read
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
