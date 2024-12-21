'use client'

import dynamic from 'next/dynamic'
import { Card, CardContent, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'

// ป้องกัน SSR error โดยใช้ dynamic import
const MapComponent = dynamic(() => import('@/components/MapComponents'), {
  ssr: false,
})

function Header() {
  return (
    <header style={{ padding: '10px', backgroundColor: '#1976d2', color: 'white' }}>
      <Typography variant="h6">Mupcop</Typography>
      <nav>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '10px', margin: 0, padding: 0 }}>
          <li>Air quality</li>
          <li>History data</li>
        </ul>
      </nav>
    </header>
  )
}

function AirQualitySummary() {
  return (
    <Card sx={{ marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          UFPs Monitoring
        </Typography>
        <Typography variant="body1">LIVE 11/26/2024</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
          <Box>
            <Typography variant="h4">0.18</Typography>
            <Typography variant="body1">Good</Typography>
            <Typography variant="body2">(Long-term/Short-term)</Typography>
          </Box>
          <Box>
            <Typography variant="body1">26°C</Typography>
            <Typography variant="body1">0.15 m/s</Typography>
            <Typography variant="body1">76 %</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

function PollutantMeters() {
  return (
    <Box sx={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
      <Card>
        <CardContent>
          <Typography variant="h6">PM0.1</Typography>
          <Typography variant="body2">ฅุณสมบัติทางเคมีกายภาพที่มาจาก 0.1 ไมครอน</Typography>
          <Typography variant="body1">0.18 (μg/m³)</Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6">PM2.5</Typography>
          <Typography variant="body2">ฅุณสมบัติทางเคมีกายภาพที่มาจาก 2.5 ไมครอน</Typography>
          <Typography variant="body1">6.89 (μg/m³)</Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6">PM10</Typography>
          <Typography variant="body2">ฅุณสมบัติทางเคมีกายภาพที่มาจาก 10 ไมครอน</Typography>
          <Typography variant="body1">13.67 (μg/m³)</Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

function StationInfo() {
  return (
    <Box>
      <Typography variant="h6">สถานีเฝ้าระวัง</Typography>
      <ul>
        <li>สถานีมหาวิทยาลัยเกษตรศาสตร์</li>
        <li>สถานีปทุมธานี</li>
        <li>สถานีบางบัวทองบางพลี</li>
      </ul>
    </Box>
  )
}

function Footer() {
  return (
    <footer style={{ padding: '10px', backgroundColor: '#f5f5f5', marginTop: 'auto' }}>
      <Typography variant="body2" align="center">
        Made by Jitpisit Dream Yok
      </Typography>
    </footer>
  )
}

export default function Home() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <Container maxWidth="lg" sx={{ paddingTop: '20px', paddingBottom: '20px', flex: 1 }}>
        <AirQualitySummary />
        <PollutantMeters />

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', gap: '20px' }}>
              <Box sx={{ flex: 1, height: '400px' }}>
                <MapComponent />
              </Box>
              <StationInfo />
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </main>
  )
}