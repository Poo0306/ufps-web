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
      <Navigation />
      {/* On mobile: stack vertically, on tablet/desktop: side by side */}
      <div className="flex flex-col lg:flex-row flex-1 relative">
        {/* Panel collapses to full width on mobile */}
        <div className="w-full lg:w-auto">
          <MonitoringPanel data={monitoringData} />
        </div>
        {/* Map takes remaining space */}
        <div className="flex-1 relative min-h-[400px] lg:min-h-0">
          <MapComponent />
        </div>
      </div>
      <Footer />
    </div>
  )
}