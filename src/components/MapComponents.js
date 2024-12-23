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

    searchResults.innerHTML = '<div class="p-2 text-gray-500 text-sm">กำลังค้นหา...</div>'

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      )
      const data = await response.json()

      if (data.length === 0) {
        searchResults.innerHTML = '<div class="p-2 text-gray-500 text-sm">ไม่พบผลการค้นหา</div>'
        return
      }

      searchResults.innerHTML = data
        .slice(0, 5)
        .map(result => `
          <div 
            class="p-2 hover:bg-gray-100 cursor-pointer text-sm" 
            onclick="window.goToLocation(${result.lat}, ${result.lon}, '${result.display_name.replace(/'/g, "\\'")}')"
          >
            ${result.display_name}
          </div>
        `)
        .join('')
    } catch (error) {
      console.error('Search error:', error)
      searchResults.innerHTML = '<div class="p-2 text-red-500 text-sm">เกิดข้อผิดพลาดในการค้นหา</div>'
    }
  }, [])

  useEffect(() => {
    // Initialize map if not already initialized
    if (!mapRef.current) {
      const mapInstance = L.map('map', {
        zoomControl: false,
        attributionControl: false // Hide attribution initially
      }).setView(WALAILAK_COORDS, DEFAULT_ZOOM)
      
      mapRef.current = mapInstance

      // Add zoom control
      L.control.zoom({
        position: 'bottomright'
      }).addTo(mapInstance)

      // Add attribution control (bottom-left, more compact)
      L.control.attribution({
        position: 'bottomleft',
        prefix: 'Leaflet | © OpenStreetMap'
      }).addTo(mapInstance)

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(mapInstance)

      // Add initial Walailak marker
      const initialMarker = L.marker(WALAILAK_COORDS)
        .addTo(mapInstance)
        .bindPopup("<b>มหาวิทยาลัยวลัยลักษณ์</b>")
        .openPopup()
      
      markersRef.current = [initialMarker]

      // Add search control
      const searchControl = L.control({ position: 'topright' })
      searchControl.onAdd = function() {
        const div = L.DomUtil.create('div', 'leaflet-control leaflet-bar')
        div.innerHTML = `
          <div class="p-2 bg-white rounded-lg shadow-lg" style="min-width: 200px;">
            <input 
              type="text" 
              id="searchInput" 
              placeholder="ค้นหาสถานที่..." 
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div id="searchResults" class="mt-1 max-h-40 overflow-y-auto bg-white rounded-lg"></div>
          </div>
        `
        return div
      }
      searchControl.addTo(mapInstance)

      // Prevent map zoom when scrolling over search results
      const searchContainer = document.querySelector('.leaflet-control-container')
      if (searchContainer) {
        searchContainer.addEventListener('wheel', (e) => {
          if (e.target.closest('#searchResults')) {
            e.stopPropagation()
          }
        })
      }

      // Set up search input handler
      const searchInput = document.getElementById('searchInput')
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
          }
          searchTimeoutRef.current = setTimeout(() => handleSearch(e.target.value), SEARCH_DELAY)
        })

        // Prevent map movement when interacting with search
        L.DomEvent.disableClickPropagation(searchInput)
        L.DomEvent.disableScrollPropagation(searchInput)
      }

      // Add global location handler
      window.goToLocation = goToLocation

      // Handle resize
      const handleResize = () => {
        mapInstance.invalidateSize()
        // Adjust heights of search results based on window size
        const searchResults = document.getElementById('searchResults')
        if (searchResults) {
          const windowHeight = window.innerHeight
          searchResults.style.maxHeight = `${Math.min(windowHeight * 0.3, 160)}px`
        }
      }
      window.addEventListener('resize', handleResize)
      handleResize() // Initial call

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
  }, [goToLocation, handleSearch])

  return (
    <div 
      id="map" 
      className="w-full h-full"
      style={{
        position: 'relative',
        zIndex: 0
      }}
    />
  )
}

export default MapComponent