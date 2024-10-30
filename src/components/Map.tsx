import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useStore } from '../lib/store';

interface MapMarker {
  position: [number, number];
  popup?: string;
  icon?: L.Icon;
}

interface MapProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  userLocation?: [number, number] | null;
  routePoints?: [number, number][];
  showRoute?: boolean;
}

function MapUpdater({ center, routePoints }: { center?: [number, number]; routePoints?: [number, number][] }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
    if (routePoints && routePoints.length >= 2) {
      const bounds = L.latLngBounds(routePoints);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [center, routePoints, map]);

  return null;
}

async function getRoutePoints(start: [number, number], end: [number, number]): Promise<[number, number][]> {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
    );
    const data = await response.json();
    return data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
  } catch (error) {
    console.error('Error fetching route:', error);
    return [start, end];
  }
}

export default function Map({ 
  markers = [], 
  center = [4.6097, -74.0817],
  zoom = 13,
  userLocation,
  routePoints,
  showRoute = false,
}: MapProps) {
  const mapRef = useRef<L.Map>(null);
  const [calculatedRoute, setCalculatedRoute] = React.useState<[number, number][]>([]);

  useEffect(() => {
    // Fix for marker icons not showing
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  useEffect(() => {
    if (showRoute && markers.length >= 2) {
      const start = markers[0].position;
      const end = markers[1].position;
      getRoutePoints(start, end).then(setCalculatedRoute);
    }
  }, [markers, showRoute]);

  const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const pickupIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const dropoffIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <MapContainer
      ref={mapRef}
      center={center}
      zoom={zoom}
      className="w-full h-[600px] rounded-lg shadow-md"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapUpdater center={center} routePoints={calculatedRoute} />

      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>Tu ubicación actual</Popup>
        </Marker>
      )}

      {markers.map((marker, index) => (
        <Marker 
          key={index} 
          position={marker.position}
          icon={index === 0 ? pickupIcon : dropoffIcon}
        >
          {marker.popup && <Popup>{marker.popup}</Popup>}
        </Marker>
      ))}

      {showRoute && calculatedRoute.length > 0 && (
        <Polyline
          positions={calculatedRoute}
          color="#4F46E5"
          weight={4}
          opacity={0.8}
        />
      )}
    </MapContainer>
  );
}