export interface GeocodingResult {
  id: string;
  placeName: string;
  coordinates: [number, number];
  address: string;
  context: any[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}