// src/app/page.js
import { Header, MonitoringPanel, Footer } from '../components/MonitoringInterface'
import { ClientWrapper } from '../components/ClientWrapper'

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
        <MonitoringPanel />
        <div className="flex-1 relative">
          <ClientWrapper />
        </div>
      </main>
      <Footer />
    </div>
  )
}