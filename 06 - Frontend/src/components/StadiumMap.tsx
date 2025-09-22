import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Stadium } from '../data/stadiums';

// Fix for default markers in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom stadium icon
const stadiumIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#2563eb" stroke="#ffffff" stroke-width="2"/>
      <path d="M8 10h8v6H8z" fill="#ffffff"/>
      <path d="M6 8h12v2H6z" fill="#ffffff"/>
      <path d="M9 16h6v1H9z" fill="#ffffff"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface StadiumMapProps {
  stadium: Stadium;
  className?: string;
}

const StadiumMap: React.FC<StadiumMapProps> = ({ stadium, className = '' }) => {
  const position: [number, number] = [stadium.coordinates.lat, stadium.coordinates.lng];

  return (
    <div className={`rounded-lg overflow-hidden bg-gray-100 ${className}`} style={{ minHeight: '200px' }}>
      <MapContainer
        center={position}
        zoom={16}
        style={{ height: '100%', width: '100%', minHeight: '200px' }}
        zoomControl={true}
        scrollWheelZoom={false}
        dragging={true}
        doubleClickZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={stadiumIcon}>
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-lg">{stadium.name}</h3>
              <p className="text-sm text-gray-600">{stadium.city}, {stadium.country}</p>
              <p className="text-sm">Capacity: {stadium.capacity.toLocaleString()}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default StadiumMap;