import React, { useEffect } from 'react';
import { useStore } from '../lib/store';
import { useGeolocation } from '../hooks/useGeolocation';
import LocationPrompt from './LocationPrompt';

export default function LocationHandler() {
  const [locationEnabled, locationDenied] = useStore(
    (state) => [state.locationEnabled, state.locationDenied]
  );
  const { error, requestLocation } = useGeolocation();

  if (locationDenied) {
    return (
      <LocationPrompt
        type="denied"
        message="Para usar la aplicación necesitamos acceso a tu ubicación."
        onRetry={requestLocation}
      />
    );
  }

  if (!locationEnabled && error) {
    return (
      <LocationPrompt
        type="error"
        message={error}
        onRetry={requestLocation}
      />
    );
  }

  if (!locationEnabled) {
    return (
      <LocationPrompt
        type="prompt"
        message="Activa tu ubicación para una mejor experiencia."
        onRetry={requestLocation}
      />
    );
  }

  return null;
}