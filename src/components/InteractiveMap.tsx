import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom bakery icon
const bakeryIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f59e0b" width="32" height="32">
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H9L3 7V9H21ZM21 10H3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V10Z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface InteractiveMapProps {
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  height?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  address = "123 Baker Street, Sweet City, SC 12345",
  lat = 34.0522, // Default to a central US location (Los Angeles area)
  lng = -118.2437,
  zoom = 15,
  height = "400px"
}) => {
  const position: [number, number] = [lat, lng];

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height, width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={bakeryIcon}>
          <Popup className="custom-popup">
            <div className="text-center p-2">
              <div className="flex items-center justify-center mb-2">
                <div className="bg-amber-500 p-2 rounded-full">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H9L3 7V9H21ZM21 10H3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V10Z"/>
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Elbaker our Bakery</h3>
              <p className="text-sm text-gray-600 mb-2">{address}</p>
              <div className="text-xs text-gray-500">
                <p>Mon-Fri: 7:00 AM - 8:00 PM</p>
                <p>Sat: 8:00 AM - 9:00 PM</p>
                <p>Sun: 9:00 AM - 6:00 PM</p>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;