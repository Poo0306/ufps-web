'use client'

import dynamic from 'next/dynamic'
import { Header, Navigation, MonitoringPanel, Footer } from '../components/MonitoringInterface'
import { monitoringData } from '../data/monitoring-data'

// Dynamically import Map with no SSR
const MapComponent = dynamic(
  () => import('../components/MapComponents'),
  { ssr: false }
)

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* <Navigation /> */}
      {/* Use flex with responsive width on monitoring panel */}
      <div className="flex flex-col lg:flex-row flex-1 relative">
        {/* Panel takes 1/3 width on desktop */}
        <div className="w-full lg:w-1/3">
          <MonitoringPanel data={monitoringData} />
        </div>
        {/* Map takes 2/3 width on desktop */}
        <div className="flex-1 relative min-h-[400px] lg:min-h-0 lg:w-2/3">
          <MapComponent />
        </div>
      </div>
      <Footer />
    </div>
  )
}