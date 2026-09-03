import React from 'react';
import { GeoJSON } from 'react-leaflet';
import jaipurGeo from '../data/jaipurGeo.json';

export default function JaipurBoundary() {
  return (
    <GeoJSON
      data={jaipurGeo as any}
      style={{
        color: '#3b82f6', // Ixigo blue
        weight: 3,
        dashArray: '5, 10',
        fillColor: 'transparent',
        fillOpacity: 0
      }}
    />
  );
}
