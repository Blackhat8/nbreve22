import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import Map from '../components/Map';
import AddressAutocomplete from '../components/AddressAutocomplete';
import CitySelector from '../components/CitySelector';
import DeliveryDetails from '../components/DeliveryDetails';
import { useStore } from '../lib/store';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculatePrice, calculateDistance, formatCurrency } from '../lib/utils';
import { PricePredictor, deliveryPredictor } from '../lib/ai';

export default function ClientDashboard() {
  const [user, addDelivery, locationEnabled] = useStore((state) => [
    state.user,
    state.addDelivery,
    state.locationEnabled
  ]);
  const [pickup, setPickup] = useState({ address: '', lat: 0, lng: 0 });
  const [dropoff, setDropoff] = useState({ address: '', lat: 0, lng: 0 });
  const [price, setPrice] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState('Bogotá');
  const [mapCenter, setMapCenter] = useState<[number, number]>([4.6097, -74.0817]);
  const { latitude, longitude } = useGeolocation();

  useEffect(() => {
    if (locationEnabled && latitude && longitude && !pickup.address) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        .then(res => res.json())
        .then(data => {
          setPickup({
            address: data.display_name,
            lat: latitude,
            lng: longitude
          });
        })
        .catch(console.error);
    }
  }, [latitude, longitude, locationEnabled]);

  useEffect(() => {
    if (pickup.lat && pickup.lng && dropoff.lat && dropoff.lng) {
      const distance = calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
      const hour = new Date().getHours();
      const demand = Math.random() * 10;
      const basePrice = calculatePrice(distance);
      
      const predictedPrice = PricePredictor.predictPrice(distance, hour, demand, basePrice);
      setPrice(predictedPrice);

      const trafficLevel = hour >= 7 && hour <= 9 || hour >= 17 && hour <= 19 ? 8 : 5;
      deliveryPredictor.predictDeliveryTime(distance, trafficLevel, hour)
        .then(time => setEstimatedTime(time))
        .catch(console.error);
    }
  }, [pickup, dropoff]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pickup.address || !dropoff.address) {
      toast.error('Por favor ingresa ambas direcciones');
      return;
    }

    if (!locationEnabled) {
      toast.error('Necesitamos acceso a tu ubicación para continuar');
      return;
    }

    const newDelivery = {
      id: crypto.randomUUID(),
      clientId: user!.id,
      pickup,
      dropoff,
      status: 'pending',
      price,
      distance: calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng),
      estimatedTime,
      createdAt: new Date(),
    };

    addDelivery(newDelivery);
    toast.success('Solicitud enviada exitosamente');
  };

  const handleCitySelect = (coords: [number, number], cityName: string) => {
    setSelectedCity(cityName);
    setMapCenter(coords);
    setPickup({ address: '', lat: 0, lng: 0 });
    setDropoff({ address: '', lat: 0, lng: 0 });
  };

  const previewDelivery = {
    pickup,
    dropoff,
    status: 'pending',
    price,
    distance: pickup.lat && dropoff.lat ? calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng) : 0,
    estimatedTime,
    createdAt: new Date(),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Solicitar servicio</h2>
          
          <CitySelector 
            onSelect={handleCitySelect}
            selectedCity={selectedCity}
          />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección de recogida
              </label>
              <AddressAutocomplete
                value={pickup.address}
                onChange={(address, lat, lng) => setPickup({ address, lat, lng })}
                placeholder="Ingresa la dirección de recogida"
                cityName={selectedCity}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección de entrega
              </label>
              <AddressAutocomplete
                value={dropoff.address}
                onChange={(address, lat, lng) => setDropoff({ address, lat, lng })}
                placeholder="Ingresa la dirección de entrega"
                cityName={selectedCity}
              />
            </div>

            {pickup.lat && dropoff.lat && (
              <DeliveryDetails 
                delivery={previewDelivery}
                estimatedTime={estimatedTime}
              />
            )}

            <button
              type="submit"
              disabled={!locationEnabled}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5 mr-2" />
              Solicitar servicio
            </button>
          </form>
        </div>
      </div>

      <div className="md:col-span-2">
        <Map
          markers={[
            ...(pickup.lat ? [{ position: [pickup.lat, pickup.lng], popup: 'Punto de recogida' }] : []),
            ...(dropoff.lat ? [{ position: [dropoff.lat, dropoff.lng], popup: 'Punto de entrega' }] : []),
          ]}
          userLocation={latitude && longitude ? [latitude, longitude] : null}
          center={mapCenter}
          showRoute={!!(pickup.lat && dropoff.lat)}
        />
      </div>
    </div>
  );
}