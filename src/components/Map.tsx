import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Circle, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface University {
  name: string;
  applicants: number;
  lat: number;
  lng: number;
}

const universities: University[] = [
  { name: 'Newcastle University', applicants: 1200, lat: 54.9783, lng: -1.6178 },
  { name: 'Northumbria University', applicants: 950, lat: 54.9779, lng: -1.6096 },
  { name: 'Durham University', applicants: 1500, lat: 54.7650, lng: -1.5782 },
  { name: 'University of Sunderland', applicants: 600, lat: 54.9046, lng: -1.3833 },
  { name: 'Teesside University', applicants: 450, lat: 54.5728, lng: -1.2351 },
];

export function NorthEastMap() {
  const maxApplicants = Math.max(...universities.map(u => u.applicants));

  return (
    <div className="w-full h-full rounded-xl overflow-hidden z-0 relative">
      <MapContainer center={[54.8, -1.5]} zoom={9} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        {universities.map((uni, i) => {
          const radius = (uni.applicants / maxApplicants) * 20 + 5;
          return (
            <CircleMarker
              key={i}
              center={[uni.lat, uni.lng]}
              radius={radius}
              pathOptions={{ color: '#A100FF', fillColor: '#A100FF', fillOpacity: 0.7 }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="font-semibold">{uni.name}</div>
                <div>{uni.applicants} Applicants</div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

const counties = [
  { name: 'Tyne and Wear', applicants: 2150, lat: 54.98, lng: -1.45, radius: 15000 },
  { name: 'County Durham', applicants: 1500, lat: 54.75, lng: -1.85, radius: 20000 },
  { name: 'Northumberland', applicants: 650, lat: 55.25, lng: -2.0, radius: 25000 },
  { name: 'Tees Valley', applicants: 400, lat: 54.55, lng: -1.25, radius: 12000 },
];

export function CountyHeatmap() {
  const maxApplicants = Math.max(...counties.map(c => c.applicants));

  return (
    <div className="w-full h-full rounded-xl overflow-hidden z-0 relative">
      <MapContainer center={[54.9, -1.6]} zoom={8} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {counties.map((county, i) => {
          const intensity = county.applicants / maxApplicants;
          return (
            <Circle
              key={i}
              center={[county.lat, county.lng]}
              radius={county.radius}
              pathOptions={{
                color: 'transparent',
                fillColor: intensity > 0.7 ? '#ff0055' : intensity > 0.3 ? '#ffaa00' : '#A100FF',
                fillOpacity: 0.6 * intensity + 0.2
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="font-semibold">{county.name}</div>
                <div>{county.applicants} Applicants</div>
              </Tooltip>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
}
