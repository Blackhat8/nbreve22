import React from 'react';
import { MapPin, Settings, AlertCircle } from 'lucide-react';

interface LocationPromptProps {
  type: 'prompt' | 'denied' | 'error';
  message: string;
  onRetry: () => void;
}

export default function LocationPrompt({ type, message, onRetry }: LocationPromptProps) {
  const openSettings = () => {
    if (navigator.userAgent.includes('Chrome')) {
      window.open('chrome://settings/content/location');
    } else if (navigator.userAgent.includes('Firefox')) {
      window.open('about:preferences#privacy');
    } else {
      window.open('https://support.google.com/chrome/answer/142065?hl=es');
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'denied':
        return <Settings className="h-6 w-6 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <MapPin className="h-6 w-6 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg p-4 animate-slide-up">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {type === 'denied' ? 'Ubicación desactivada' : 
             type === 'error' ? 'Error de ubicación' : 
             'Activar ubicación'}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {message}
          </p>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={onRetry}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Permitir ubicación
            </button>
            {type === 'denied' && (
              <button
                onClick={openSettings}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Abrir configuración
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}