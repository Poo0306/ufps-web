'use client'

import dynamic from 'next/dynamic'

// ป้องกัน SSR error โดยใช้ dynamic import
const MapComponent = dynamic(() => import('@/components/MapComponents'), {
  ssr: false,
})

export default function Home() {
  return (
    <main>
      <MapComponent />
    </main>
  )
}