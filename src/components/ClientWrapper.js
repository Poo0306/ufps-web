'use client'
// src/components/ClientWrapper.js
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('./MapComponents'), {
  ssr: false,
})

export function ClientWrapper() {
  return (
    <div className="absolute inset-0">
      <MapComponent />
    </div>
  )
}