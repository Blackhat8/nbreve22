import React from 'react';
import { MapPin } from 'lucide-react';

const CITIES = [
  { name: 'Bogotá', coords: [4.6097, -74.0817] },
  { name: 'Medellín', coords: [6.2442, -75.5812] },
  { name: 'Cali', coords: [3.4516, -76.5320] },
  { name: 'Barranquilla', coords: [10.9639, -74.7964] },
  { name: 'Cartagena', coords: [10.3910, -75.4794] },
  { name: 'Bucaramanga', coords: [7.1254, -73.1198] },
];

interface CitySelectorProps {
  onSelect: (coords: [number, number], cityName: string) => void;
  selectedCity: string;
}

export default function CitySelector({ onSelect, selectedCity }: CitySelectorProps) {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <MapPin className="h-5 w-5 text-gray-400" />
      <select
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        value={selectedCity}
        onChange={(e) => {
          const city = CITIES.find(c => c.name === e.target.value);
          if (city) onSelect(city.coords as [number, number], city.name);
        }}
      >
        {CITIES.map((city) => (
          <option key={city.name} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
}