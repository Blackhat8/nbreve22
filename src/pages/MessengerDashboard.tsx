import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Package, Navigation } from 'lucide-react';
import Map from '../components/Map';
import { useStore } from '../lib/store';
import { useGeolocation } from '../hooks/useGeolocation';
import { formatCurrency } from '../lib/utils';

export default function MessengerDashboard() {
  const [user, deliveries, updateDelivery, locationEnabled] = useStore((state) => [
    state.user,
    state.deliveries,
    state.updateDelivery,
    state.locationEnabled
  ]);
  const { latitude, longitude } = useGeolocation();

  const availableDeliveries = deliveries.filter(
    (d) => d.status === 'pending' && !d.messengerId
  );

  const myDeliveries = deliveries.filter(
    (d) => d.messengerId === user?.id && d.status !== 'delivered'
  );

  const handleAcceptDelivery = (deliveryId: string) => {
    if (!locationEnabled) {
      toast.error('Necesitas activar tu ubicación para aceptar servicios');
      return;
    }

    updateDelivery(deliveryId, {
      messengerId: user!.id,
      status: 'accepted',
    });
    toast.success('Servicio aceptado');
  };

  const handleUpdateStatus = (deliveryId: string, status: string) => {
    if (!locationEnabled) {
      toast.error('Necesitas activar tu ubicación para actualizar el estado');
      return;
    }

    updateDelivery(deliveryId, { status });
    toast.success('Estado actualizado');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-6">
        {/* Servicios disponibles */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Servicios disponibles</h2>
          <div className="space-y-4">
            {availableDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="border rounded-lg p-4 hover:border-indigo-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <Package className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm text-gray-500">
                    {new Date(delivery.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Recogida:</strong> {delivery.pickup.address}
                  </p>
                  <p className="text-sm">
                    <strong>Entrega:</strong> {delivery.dropoff.address}
                  </p>
                  <p className="text-sm">
                    <strong>Precio:</strong> {formatCurrency(delivery.price)}
                  </p>
                  <button
                    onClick={() => handleAcceptDelivery(delivery.id)}
                    disabled={!locationEnabled}
                    className="w-full mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Aceptar servicio
                  </button>
                </div>
              </div>
            ))}
            {availableDeliveries.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No hay servicios disponibles en este momento
              </p>
            )}
          </div>
        </div>

        {/* Mis servicios activos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Mis servicios activos</h2>
          <div className="space-y-4">
            {myDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="border rounded-lg p-4 hover:border-indigo-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <Package className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm text-gray-500">
                    {new Date(delivery.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Recogida:</strong> {delivery.pickup.address}
                  </p>
                  <p className="text-sm">
                    <strong>Entrega:</strong> {delivery.dropoff.address}
                  </p>
                  <p className="text-sm">
                    <strong>Estado:</strong>{' '}
                    <span className="capitalize">{delivery.status}</span>
                  </p>
                  <div className="flex gap-2">
                    {delivery.status === 'accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(delivery.id, 'pickup')}
                        disabled={!locationEnabled}
                        className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Recoger
                      </button>
                    )}
                    {delivery.status === 'pickup' && (
                      <button
                        onClick={() => handleUpdateStatus(delivery.id, 'transit')}
                        disabled={!locationEnabled}
                        className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        En tránsito
                      </button>
                    )}
                    {delivery.status === 'transit' && (
                      <button
                        onClick={() => handleUpdateStatus(delivery.id, 'delivered')}
                        disabled={!locationEnabled}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Entregado
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {myDeliveries.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No tienes servicios activos
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <Map
          markers={[
            ...(latitude && longitude ? [{ position: [latitude, longitude], popup: 'Tu ubicación' }] : []),
            ...myDeliveries.flatMap((delivery) => [
              { position: [delivery.pickup.lat, delivery.pickup.lng], popup: 'Punto de recogida' },
              { position: [delivery.dropoff.lat, delivery.dropoff.lng], popup: 'Punto de entrega' },
            ]),
          ]}
          center={latitude && longitude ? [latitude, longitude] : undefined}
          showRoute={myDeliveries.length > 0}
        />
      </div>
    </div>
  );
}