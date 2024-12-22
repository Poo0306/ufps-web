'use client'

import { useEffect, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const MapComponent = () => {
  const [searchInput, setSearchInput] = useState('')
  const [searchResults, setSearchResults] = useState([])
  
  useEffect(() => {
    // Initialize map centered on Walailak University
    const walailakCoords = [8.6407383, 99.8985493] // Walailak University coordinates
    const map = L.map('map', {
      zoomControl: false,
    }).setView(walailakCoords, 16.5)

    // Add custom zoom control
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map)

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map)

    // Add Walailak University marker
    const marker = L.marker(walailakCoords).addTo(map)
    marker.bindPopup("<b>Walailak University</b>").openPopup()

    // Add search control
    const searchControl = L.control({ position: 'topleft' })
    
    searchControl.onAdd = function(map) {
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
    searchControl.addTo(map)

    // Handle search input
    const searchInput = document.getElementById('searchInput')
    const searchResults = document.getElementById('searchResults')

    let searchTimeout = null
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value
        clearTimeout(searchTimeout)

        if (query.length < 3) {
          searchResults.innerHTML = ''
          return
        }

        // Add loading indicator
        searchResults.innerHTML = '<div class="p-2 text-gray-500">Searching...</div>'

        searchTimeout = setTimeout(() => {
          // Use Nominatim API for geocoding
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
              if (data.length === 0) {
                searchResults.innerHTML = '<div class="p-2 text-gray-500">No results found</div>'
                return
              }

              searchResults.innerHTML = data.slice(0, 5).map(result => `
                <div class="p-2 hover:bg-gray-100 cursor-pointer" onclick="window.goToLocation(${result.lat}, ${result.lon}, '${result.display_name}')">
                  ${result.display_name}
                </div>
              `).join('')
            })
            .catch(error => {
              searchResults.innerHTML = '<div class="p-2 text-red-500">Error searching location</div>'
            })
        }, 500)
      })
    }

    // Add global function to handle location selection
    window.goToLocation = (lat, lon, name) => {
      map.setView([lat, lon], 16)
      L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${name}</b>`).openPopup()
      searchResults.innerHTML = '' // Clear results
      if (searchInput) searchInput.value = '' // Clear input
    }

    // Handle resize
    const handleResize = () => {
      map.invalidateSize()
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      delete window.goToLocation
      map.remove()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div 
      id="map" 
      className="w-full h-full fixed inset-0"
      style={{ 
        height: '100%',
        minHeight: '500px',
        position: 'absolute'
      }}
    />
  )
}

export default MapComponent