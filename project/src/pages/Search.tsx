import React, { useState, useEffect, useRef } from 'react';
import { centerService, RecyclingCenter } from '../services/centerService';
import { MapPin, Phone, Globe, Clock, Star, Navigation, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { Loader } from '@googlemaps/js-api-loader';

export default function Search() {
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<RecyclingCenter | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [searchRadius, setSearchRadius] = useState(10);
  const [filterType, setFilterType] = useState<string>('all');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    getCurrentLocation();
    loadGoogleMapsScript();
  }, []);

  useEffect(() => {
    if (userLocation) {
      searchCenters();
    }
  }, [userLocation, searchRadius]);

  useEffect(() => {
    if (mapInstanceRef.current && centers.length > 0) {
      updateMapMarkers();
    }
  }, [centers, selectedCenter]);

  const loadGoogleMapsScript = async () => {
    if (!mapRef.current || mapInstanceRef.current) return;
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.warn('VITE_GOOGLE_MAPS_API_KEY is not set. Map will be disabled.');
        return;
      }
      const loader = new Loader({ apiKey, version: 'weekly' });
      await loader.load();

      const initialCenter = userLocation || { lat: 37.7749, lng: -122.4194 };
      const map = new google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: 12,
        mapId: 'DEMO_MAP_ID'
      });
      mapInstanceRef.current = map;
      updateMapMarkers();
    } catch (e) {
      console.error('Failed to load Google Maps:', e);
      toast.error('Failed to load map.');
    }
  };

  const updateMapMarkers = () => {
    if (!mapInstanceRef.current) return;
    // Clear existing markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    centers.forEach(center => {
      const marker = new google.maps.Marker({
        position: { lat: center.lat, lng: center.lng },
        map: mapInstanceRef.current!,
        title: center.name
      });
      marker.addListener('click', () => setSelectedCenter(center));
      markersRef.current.push(marker);
    });

    // Fit bounds to markers
    if (centers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      centers.forEach(c => bounds.extend({ lat: c.lat, lng: c.lng }));
      if (userLocation) bounds.extend(userLocation);
      mapInstanceRef.current.fitBounds(bounds);
    } else if (userLocation) {
      mapInstanceRef.current.setCenter(userLocation);
      mapInstanceRef.current.setZoom(12);
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to San Francisco coordinates
          setUserLocation({
            lat: 37.7749,
            lng: -122.4194
          });
          setLoading(false);
          toast.error('Could not get your location. Showing default area.');
        }
      );
    } else {
      // Default to San Francisco coordinates
      setUserLocation({
        lat: 37.7749,
        lng: -122.4194
      });
      setLoading(false);
      toast.error('Geolocation not supported. Showing default area.');
    }
  };

  const searchCenters = async () => {
    if (!userLocation) return;

    setLoading(true);
    try {
      let results = await centerService.searchNearby(
        userLocation.lat, 
        userLocation.lng, 
        searchRadius
      );

      // Apply filter
      if (filterType !== 'all') {
        results = results.filter(center => 
          center.acceptedTypes.includes(filterType) || 
          center.acceptedTypes.includes('All Types')
        );
      }

      setCenters(results);
      if (results.length === 0) {
        toast.error('No recycling centers found in your area.');
      }
    } catch (error) {
      console.error('Error searching centers:', error);
      toast.error('Failed to search for centers.');
    } finally {
      setLoading(false);
    }
  };

  const wasteTypes = [
    'Smartphones', 'Laptops', 'Tablets', 'Batteries', 
    'Cables', 'Printers', 'Monitors', 'TVs', 'Others'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Find Recycling Centers
        </h1>
        <p className="text-gray-600">
          Locate certified e-waste recycling centers near you
        </p>
      </div>

      {/* Search Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Radius
            </label>
            <select
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={20}>20 km</option>
              <option value={50}>50 km</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="inline h-4 w-4 mr-1" />
              Waste Type Filter
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Types</option>
              {wasteTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Navigation className="h-4 w-4 mr-2" />
              {loading ? 'Locating...' : 'Use My Location'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Map */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="font-semibold text-gray-800">Map View</h3>
          </div>
          <div ref={mapRef} className="h-96"></div>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Found {centers.length} centers
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : centers.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {centers.map((center) => (
                <div
                  key={center.id}
                  className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg border-2 ${
                    selectedCenter?.id === center.id ? 'border-green-500' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedCenter(center)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-lg">
                        {center.name}
                      </h4>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600">{center.rating}</span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          center.isOpen 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {center.isOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                      <span>{center.address}</span>
                    </div>
                    
                    {center.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{center.phone}</span>
                      </div>
                    )}

                    {center.hours && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{center.hours}</span>
                      </div>
                    )}

                    {center.website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-gray-400" />
                        <a 
                          href={center.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Accepted Items:</p>
                    <div className="flex flex-wrap gap-1">
                      {center.acceptedTypes.slice(0, 4).map((type) => (
                        <span
                          key={type}
                          className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                      {center.acceptedTypes.length > 4 && (
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{center.acceptedTypes.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {center.description && (
                    <p className="text-sm text-gray-600 mt-3">{center.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No recycling centers found in your area.</p>
              <p className="text-sm">Try expanding your search radius.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}