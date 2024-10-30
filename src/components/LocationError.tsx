import React from 'react';
import { MapPin, RefreshCw } from 'lucide-react';

interface LocationErrorProps {
  error: string;
  onRetry: () => void;
}

export default function LocationError({ error, onRetry }: LocationErrorProps) {
  return (
    <div className="fixed bottom-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg p-4 animate-slide-up">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <MapPin className="h-6 w-6 text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            Error de ubicación
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {error}
          </p>
          <button
            onClick={onRetry}
            className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Reintentar
          </button>
        </div>
      </div>
    </div>
  );
}