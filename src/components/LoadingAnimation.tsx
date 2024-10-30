import React from 'react';
import { Package } from 'lucide-react';

export default function LoadingAnimation() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        <div className="flex justify-center mb-4">
          <Package className="h-12 w-12 text-indigo-600 animate-bounce" />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Buscando mensajero cercano
          </h3>
          <p className="text-sm text-gray-500">
            Estamos conectándote con el mensajero más cercano a tu ubicación
          </p>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}