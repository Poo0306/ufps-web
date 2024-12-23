// src/app/page.js
import { Header, MonitoringPanel, Footer } from '../components/MonitoringInterface'
import { ClientWrapper } from '../components/ClientWrapper'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <MonitoringPanel />
        <ClientWrapper />
      </div>
      <Footer />
    </main>
  )
}