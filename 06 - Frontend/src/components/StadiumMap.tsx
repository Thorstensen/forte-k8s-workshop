import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Stadium } from '../data/stadiums';

interface StadiumMapProps {
  stadium: Stadium;
  className?: string;
}

const StadiumMap: React.FC<StadiumMapProps> = ({ stadium, className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const initMap = async () => {
      // Use a demo API key for development - in production this should be from environment variables
      const loader = new Loader({
        apiKey: "AIzaSyBgYST1Y6FwQSuUJ6B7pE8z5r3rY2oF8Y0", // Demo key - replace with actual
        version: "weekly",
        libraries: ["places"]
      });

      try {
        const google = await loader.load();
        
        if (mapRef.current && !mapInstanceRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: stadium.coordinates,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "on" }]
              }
            ],
            disableDefaultUI: true,
            zoomControl: true,
            scrollwheel: false,
            draggable: false
          });

          // Add a marker for the stadium
          new google.maps.Marker({
            position: stadium.coordinates,
            map: map,
            title: stadium.name,
            icon: {
              url: 'data:image/svg+xml;base64,' + btoa(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 32)
            }
          });

          mapInstanceRef.current = map;
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        // Fallback: show a static message if maps fails to load
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full bg-gray-100 rounded-lg">
              <div class="text-center p-4">
                <p class="text-gray-600 text-sm">Map unavailable</p>
                <p class="text-gray-500 text-xs">${stadium.address}</p>
              </div>
            </div>
          `;
        }
      }
    };

    initMap();
  }, [stadium]);

  return (
    <div 
      ref={mapRef} 
      className={`rounded-lg overflow-hidden bg-gray-100 ${className}`}
      style={{ minHeight: '200px' }}
    />
  );
};

export default StadiumMap;