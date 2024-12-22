// src/app/layout.js
import './globals.css'
import 'leaflet/dist/leaflet.css'

export const metadata = {
  title: 'Interactive Map',
  description: 'Interactive map with Leaflet',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}