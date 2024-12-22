'use client'

import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const MapComponent = () => {
  useEffect(() => {
    // Initialize map
    const map = L.map('map', {
      zoomControl: false, // Disable default zoom control to customize position
    }).setView([13.7563, 100.5018], 13)

    // Add custom zoom control to bottom right for better mobile access
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map)

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map)

    // Add a marker
    const marker = L.marker([13.7563, 100.5018]).addTo(map)
    marker.bindPopup("<b>Your Location</b>").openPopup()

    // Handle resize
    const handleResize = () => {
      map.invalidateSize()
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      map.remove()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div 
      id="map" 
      className="w-full h-[calc(100vh-64px)] lg:h-full absolute inset-0"
      style={{ minHeight: '400px' }}
    />
  )
}

export default MapComponent