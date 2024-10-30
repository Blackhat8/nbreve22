import React from 'react';
import { Settings, MapPin } from 'lucide-react';
import { useStore } from '../lib/store';

export default function LocationSettings() {
  const [permissionState, setPermissionState] = useStore(
    (state) => [state.permissionState, state.setPermissionState]
  );

  const handleOpenSettings = () => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(result => {
          if (result.state === 'denied') {
            window.open('chrome://settings/content/location', '_blank');
          }
        });
    }
  };

  if (permissionState !== 'denied') return null;

  return (
    <div className="fixed bottom-4 right-4 animate-slide-up">
      <button
        onClick={handleOpenSettings}
        className="bg-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 hover:bg-gray-50 transition-colors"
      >
        <Settings className="h-5 w-5 text-indigo-600" />
        <span className="text-sm font-medium text-gray-700">
          Configurar ubicación
        </span>
      </button>
    </div>
  );
}