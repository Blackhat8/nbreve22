import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { useStore } from '../lib/store';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface NotificationProps {
  notification: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    read: boolean;
  };
}

export default function Notification({ notification }: NotificationProps) {
  const markNotificationAsRead = useStore((state) => state.markNotificationAsRead);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-sm border-l-4 ${
        notification.read ? 'bg-gray-50' : 'bg-white'
      } ${
        notification.type === 'success'
          ? 'border-green-500'
          : notification.type === 'error'
          ? 'border-red-500'
          : notification.type === 'warning'
          ? 'border-yellow-500'
          : 'border-blue-500'
      }`}
      onClick={() => markNotificationAsRead(notification.id)}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
          <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
        </div>
      </div>
    </div>
  );
}