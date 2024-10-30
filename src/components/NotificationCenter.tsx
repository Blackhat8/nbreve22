import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useStore } from '../lib/store';
import Notification from './Notification';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useStore((state) => 
    state.notifications.filter((n) => n.userId === state.user?.id)
  );
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-indigo-600 text-xs text-white text-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Notificaciones</h3>
            </div>
            <div className="p-2 space-y-2">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <Notification
                    key={notification.id}
                    notification={notification}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No hay notificaciones
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}