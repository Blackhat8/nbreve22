import React from 'react';
import { MapPin, Settings, AlertCircle } from 'lucide-react';
import { useStore } from '../lib/store';

interface LocationPermissionProps {
  error: string | null;
  onRetry: () => void;
}

export default function LocationPermission({ error, onRetry }: LocationPermissionProps) {
  const [locationPermissionAsked, setLocationPermissionAsked] = useStore(
    (state) => [state.locationPermissionAsked, state.setLocationPermissionAsked]
  );

  if (!error || locationPermissionAsked) return null;

  const openSettings = () => {
    setLocationPermissionAsked(true);
    if (navigator.userAgent.includes('Chrome')) {
      window.open('chrome://settings/content/location');
    } else if (navigator.userAgent.includes('Firefox')) {
      window.open('about:preferences#privacy');
    } else {
      window.open('https://support.google.com/chrome/answer/142065?hl=es');
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-lg p-4 z-50 animate-slide-up">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-yellow-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">Acceso a ubicación</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-3 flex space-x-3">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Permitir ubicación
            </button>
            <button
              type="button"
              onClick={openSettings}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <Settings className="h-4 w-4 mr-1" />
              Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}