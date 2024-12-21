'use client'

import { useEffect } from 'react'
import L from 'leaflet'

export default function MapComponent() {
  useEffect(() => {
    // สร้างแผนที่หลังจาก component mount
    const map = L.map('map').setView([13.7563, 100.5018], 6)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    // เพิ่มหมุดที่กรุงเทพฯ
    const bangkokMarker = L.marker([13.7563, 100.5018]).addTo(map)
    bangkokMarker.bindPopup("<b>กรุงเทพมหานคร</b><br>เมืองหลวงของประเทศไทย")

    // เพิ่มกล่องข้อมูล
    const info = L.control({ position: 'topright' })
    info.onAdd = function() {
      const div = L.DomUtil.create('div', 'info-box')
      div.innerHTML = '<h4>ข้อมูลแผนที่</h4>' +
                     'คลิกที่แผนที่เพื่อดูพิกัด<br>' +
                     'ใช้ปุ่ม + - เพื่อซูมเข้า-ออก'
      return div
    }
    info.addTo(map)

    // เพิ่ม click event
    map.on('click', function(e) {
      L.popup()
        .setLatLng(e.latlng)
        .setContent("พิกัด: " + e.latlng.lat.toFixed(4) + ", " + e.latlng.lng.toFixed(4))
        .openOn(map)
    })

    // Cleanup function
    return () => {
      map.remove()
    }
  }, [])

  return <div id="map" style={{ height: '100vh', width: '100%' }} />
}