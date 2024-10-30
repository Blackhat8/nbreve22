import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { searchAddress } from '../services/geocoding';
import { GeocodingResult } from '../types/maps';
import { cn } from '../lib/utils';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, lat: number, lng: number) => void;
  placeholder?: string;
  className?: string;
  cityName?: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = 'Buscar dirección',
  className,
  cityName = 'Bogotá'
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query: string) => {
    if (query.length < 3) return;

    setLoading(true);
    setError(null);

    try {
      const results = await searchAddress(query, cityName);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar la dirección');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    setError(null);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.length >= 3) {
      timeoutRef.current = setTimeout(() => {
        handleSearch(query);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: GeocodingResult) => {
    setInputValue(suggestion.address);
    onChange(suggestion.address, suggestion.coordinates[1], suggestion.coordinates[0]);
    setShowSuggestions(false);
    setError(null);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className={cn(
            "h-5 w-5",
            loading ? "text-indigo-500 animate-pulse" : "text-gray-400"
          )} />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className={cn(
            "focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md",
            error ? "border-red-300" : "",
            className
          )}
          placeholder={`${placeholder} en ${cityName}`}
          autoComplete="off"
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              <p className="text-sm text-gray-900">{suggestion.address}</p>
              <p className="text-xs text-gray-500">{cityName}, Colombia</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}