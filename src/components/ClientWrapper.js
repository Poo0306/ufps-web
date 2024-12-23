'use client'
// src/components/ClientWrapper.js
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('./MapComponents'), {
  ssr: false,
})

export function ClientWrapper() {
  return (
    <div className="flex-1 h-[calc(100vh-80px)]">
      <MapComponent />
    </div>
  )
}