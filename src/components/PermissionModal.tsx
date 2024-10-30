import React from 'react';
import { MapPin, X } from 'lucide-react';
import { useStore } from '../lib/store';

interface PermissionModalProps {
  onRequestPermission: () => void;
}

export default function PermissionModal({ onRequestPermission }: PermissionModalProps) {
  const setLocationPermissionAsked = useStore((state) => state.setLocationPermissionAsked);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={() => setLocationPermissionAsked(true)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="bg-indigo-100 p-3 rounded-full">
            <MapPin className="h-6 w-6 text-indigo-600" />
          </div>
          
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Permitir acceso a la ubicación
          </h3>
          
          <p className="mt-2 text-sm text-gray-500">
            Para brindarte un mejor servicio, necesitamos acceder a tu ubicación. 
            Esto nos ayudará a encontrar mensajeros cercanos y calcular rutas más precisas.
          </p>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={onRequestPermission}
              className="flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Permitir ubicación
            </button>
            
            <button
              onClick={() => setLocationPermissionAsked(true)}
              className="flex-1 justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}