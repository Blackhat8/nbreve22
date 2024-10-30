import { GeocodingResult } from '../types/maps';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoia2lldjk5IiwiYSI6ImNqNmJrYTZ3bzFnYTYzM3JwcG1mdXlvbTEifQ.p2qnpIhHV-mjXv9bLYT-Cw';

export async function searchAddress(query: string, cityName: string): Promise<GeocodingResult[]> {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
      `access_token=${MAPBOX_ACCESS_TOKEN}&` +
      `country=co&` +
      `types=address,poi&` +
      `proximity=${getCityCoordinates(cityName).join(',')}&` +
      `language=es`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.features
      .filter((feature: any) => isInCity(feature, cityName))
      .map((feature: any) => ({
        id: feature.id,
        placeName: feature.place_name,
        coordinates: feature.center,
        address: feature.place_name.split(',')[0],
        context: feature.context
      }));
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('No se pudo buscar la dirección. Por favor, intente nuevamente.');
  }
}

function getCityCoordinates(cityName: string): [number, number] {
  const cities: Record<string, [number, number]> = {
    'Bogotá': [-74.0817, 4.6097],
    'Medellín': [-75.5812, 6.2442],
    'Cali': [-76.5320, 3.4516],
    'Barranquilla': [-74.7964, 10.9639],
    'Cartagena': [-75.4794, 10.3910],
    'Bucaramanga': [-73.1198, 7.1254]
  };
  
  return cities[cityName] || cities['Bogotá'];
}

function isInCity(feature: any, cityName: string): boolean {
  return feature.context?.some((ctx: any) => 
    ctx.text.toLowerCase() === cityName.toLowerCase()
  );
}