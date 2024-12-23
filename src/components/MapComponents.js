'use client'

import { useEffect, useCallback, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const WALAILAK_COORDS = [8.6407383, 99.8985493]
const DEFAULT_ZOOM = 16.5
const SEARCH_DELAY = 500
const MIN_SEARCH_LENGTH = 3

const MapComponent = () => {
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const searchTimeoutRef = useRef(null)

  // Handle location selection
  const goToLocation = useCallback((lat, lon, name) => {
    if (!mapRef.current) return

    mapRef.current.setView([lat, lon], DEFAULT_ZOOM)
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []
    
    // Add new marker
    const newMarker = L.marker([lat, lon])
      .addTo(mapRef.current)
      .bindPopup(`<b>${name}</b>`)
      .openPopup()
    
    markersRef.current.push(newMarker)
    
    // Clear search
    const searchInput = document.getElementById('searchInput')
    const searchResults = document.getElementById('searchResults')
    if (searchResults) searchResults.innerHTML = ''
    if (searchInput) searchInput.value = ''
  }, [])

  // Handle search input
  const handleSearch = useCallback(async (query) => {
    const searchResults = document.getElementById('searchResults')
    if (!searchResults) return

    if (query.length < MIN_SEARCH_LENGTH) {
      searchResults.innerHTML = ''
      return
    }

    searchResults.innerHTML = '<div class="p-2 text-gray-500">Searching...</div>'

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      )
      const data = await response.json()

      if (data.length === 0) {
        searchResults.innerHTML = '<div class="p-2 text-gray-500">No results found</div>'
        return
      }

      searchResults.innerHTML = data
        .slice(0, 5)
        .map(result => `
          <div 
            class="p-2 hover:bg-gray-100 cursor-pointer" 
            onclick="window.goToLocation(${result.lat}, ${result.lon}, '${result.display_name.replace(/'/g, "\\'")}')"
          >
            ${result.display_name}
          </div>
        `)
        .join('')
    } catch (error) {
      console.error('Search error:', error)
      searchResults.innerHTML = '<div class="p-2 text-red-500">Error searching location</div>'
    }
  }, [])

  useEffect(() => {
    // Initialize map if not already initialized
    if (!mapRef.current) {
      const mapInstance = L.map('map', {
        zoomControl: false,
      }).setView(WALAILAK_COORDS, DEFAULT_ZOOM)
      
      mapRef.current = mapInstance

      // Add zoom control
      L.control.zoom({
        position: 'bottomright'
      }).addTo(mapInstance)

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstance)

      // Add initial Walailak marker
      const initialMarker = L.marker(WALAILAK_COORDS)
        .addTo(mapInstance)
        .bindPopup("<b>Walailak University</b>")
        .openPopup()
      
      markersRef.current = [initialMarker]

      // Add search control
      const searchControl = L.control({ position: 'topright' })
      searchControl.onAdd = function() {
        const div = L.DomUtil.create('div', 'leaflet-control leaflet-bar')
        div.innerHTML = `
          <div class="p-2 bg-white rounded-lg shadow-lg" style="min-width: 250px;">
            <input 
              type="text" 
              id="searchInput" 
              placeholder="Search location..." 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div id="searchResults" class="mt-2 max-h-48 overflow-y-auto"></div>
          </div>
        `
        return div
      }
      searchControl.addTo(mapInstance)

      // Set up search input handler
      const searchInput = document.getElementById('searchInput')
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
          }
          searchTimeoutRef.current = setTimeout(() => handleSearch(e.target.value), SEARCH_DELAY)
        })
      }

      // Add global location handler
      window.goToLocation = goToLocation

      // Handle resize
      const handleResize = () => mapInstance.invalidateSize()
      window.addEventListener('resize', handleResize)

      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize)
        delete window.goToLocation
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current)
        }
        if (mapRef.current) {
          mapRef.current.remove()
          mapRef.current = null
        }
        markersRef.current = []
      }
    }
  }, [goToLocation, handleSearch]) // Include callbacks in dependencies

  return (
    <div 
      id="map" 
      className="w-full h-full inset-0"
      style={{ 
        height: '100%',
        minHeight: '500px',
      }}
    />
  )
}

export default MapComponent