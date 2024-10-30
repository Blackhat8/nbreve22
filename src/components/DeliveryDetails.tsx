import React from 'react';
import { Package, MapPin, Clock, CreditCard, Truck, Star } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface DeliveryDetailsProps {
  delivery: {
    pickup: {
      address: string;
      lat: number;
      lng: number;
    };
    dropoff: {
      address: string;
      lat: number;
      lng: number;
    };
    status: string;
    price: number;
    distance: number;
    createdAt: Date;
    clientRating?: {
      rating: number;
      comment: string;
    };
    messengerRating?: {
      rating: number;
      comment: string;
    };
  };
  estimatedTime?: number | null;
  showRatings?: boolean;
  onRate?: () => void;
}

export default function DeliveryDetails({ 
  delivery, 
  estimatedTime,
  showRatings,
  onRate 
}: DeliveryDetailsProps) {
  const isCompleted = delivery.status === 'delivered' || delivery.status === 'completed';
  const canRate = isCompleted && !delivery.messengerRating && onRate;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Detalles del servicio</h3>
        <span className="px-3 py-1 rounded-full text-xs font-medium capitalize" 
          style={{
            backgroundColor: 
              delivery.status === 'pending' ? '#FEF3C7' :
              delivery.status === 'accepted' ? '#DBEAFE' :
              delivery.status === 'pickup' ? '#FEE2E2' :
              delivery.status === 'transit' ? '#E0E7FF' :
              '#DEF7EC',
            color:
              delivery.status === 'pending' ? '#92400E' :
              delivery.status === 'accepted' ? '#1E40AF' :
              delivery.status === 'pickup' ? '#991B1B' :
              delivery.status === 'transit' ? '#3730A3' :
              '#03543F'
          }}
        >
          {delivery.status === 'pending' ? 'Pendiente' :
           delivery.status === 'accepted' ? 'Aceptado' :
           delivery.status === 'pickup' ? 'En recogida' :
           delivery.status === 'transit' ? 'En tránsito' :
           'Entregado'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Dirección de recogida</p>
            <p className="text-sm text-gray-500">{delivery.pickup.address}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Dirección de entrega</p>
            <p className="text-sm text-gray-500">{delivery.dropoff.address}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Truck className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Distancia</p>
            <p className="text-sm text-gray-500">{delivery.distance.toFixed(1)} km</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <CreditCard className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Precio</p>
            <p className="text-sm text-gray-500">{formatCurrency(delivery.price)}</p>
          </div>
        </div>

        {estimatedTime && (
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Tiempo estimado</p>
              <p className="text-sm text-gray-500">{estimatedTime} minutos</p>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Fecha de solicitud</p>
            <p className="text-sm text-gray-500">
              {new Date(delivery.createdAt).toLocaleString('es-CO', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </p>
          </div>
        </div>

        {showRatings && (delivery.messengerRating || canRate) && (
          <div className="flex items-center space-x-3">
            <Star className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Calificación</p>
              {delivery.messengerRating ? (
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < delivery.messengerRating!.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  {delivery.messengerRating.comment && (
                    <p className="text-sm text-gray-500 ml-2">
                      {delivery.messengerRating.comment}
                    </p>
                  )}
                </div>
              ) : (
                <button
                  onClick={onRate}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Calificar servicio
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}