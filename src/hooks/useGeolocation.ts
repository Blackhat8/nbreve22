import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../lib/store';

export function useGeolocation() {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [
    updateUserLocation,
    setLocationEnabled,
    setLocationDenied,
    addNotification
  ] = useStore((state) => [
    state.updateUserLocation,
    state.setLocationEnabled,
    state.setLocationDenied,
    state.addNotification
  ]);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setCoords({ latitude, longitude });
    updateUserLocation({ lat: latitude, lng: longitude });
    setLocationEnabled(true);
    setLocationDenied(false);
    setError(null);
  }, [updateUserLocation, setLocationEnabled, setLocationDenied]);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let message = 'Error al obtener la ubicación.';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = 'Necesitamos acceso a tu ubicación para brindarte un mejor servicio.';
        setLocationDenied(true);
        setLocationEnabled(false);
        addNotification({
          type: 'warning',
          title: 'Ubicación desactivada',
          message: 'Por favor activa tu ubicación para una mejor experiencia.',
          userId: 'system'
        });
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'No se pudo determinar tu ubicación actual.';
        break;
      case error.TIMEOUT:
        message = 'Se agotó el tiempo para obtener tu ubicación.';
        break;
    }

    setError(message);
    setCoords(null);
  }, [setLocationDenied, setLocationEnabled, addNotification]);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización.');
      return;
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  }, [handleSuccess, handleError]);

  useEffect(() => {
    requestLocation();

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [handleSuccess, handleError, requestLocation]);

  return {
    latitude: coords?.latitude ?? null,
    longitude: coords?.longitude ?? null,
    error,
    requestLocation
  };
}