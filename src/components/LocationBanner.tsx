import React from 'react';
import { MapPin, X } from 'lucide-react';
import { useStore } from '../lib/store';

export default function LocationBanner() {
  const [permissionState, setLocationPermissionAsked] = useStore(
    (state) => [state.permissionState, state.setLocationPermissionAsked]
  );

  if (permissionState !== 'prompt') return null;

  return (
    <div className="fixed top-0 inset-x-0 bg-indigo-600 text-white py-3 px-4 flex items-center justify-between animate-slide-up">
      <div className="flex items-center space-x-2">
        <MapPin className="h-5 w-5" />
        <span className="text-sm">
          Activa tu ubicación para una mejor experiencia
        </span>
      </div>
      <button
        onClick={() => setLocationPermissionAsked(true)}
        className="p-1 hover:bg-indigo-700 rounded-full transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}