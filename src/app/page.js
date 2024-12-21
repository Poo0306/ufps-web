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
      <Typography variant="h6">แผนที่และข้อมูล</Typography>
    </header>
  )
}

function Sidebar() {
  return (
    <aside style={{ width: '200px', backgroundColor: '#f4f4f4', padding: '10px' }}>
      <Typography variant="h6">เมนู</Typography>
      <ul>
        <li>หน้าหลัก</li>
        <li>แผนที่</li>
        <li>ข้อมูลเพิ่มเติม</li>
      </ul>
    </aside>
  )
}

function Footer() {
  return (
    <footer style={{ padding: '10px', backgroundColor: '#1976d2', color: 'white', marginTop: 'auto' }}>
      <Typography variant="body2" align="center">© 2024 แผนที่และข้อมูล</Typography>
    </footer>
  )
}

export default function Home() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <Box style={{ display: 'flex', flex: 1 }}>
        <Sidebar />

        <Container style={{ flex: 1, padding: '20px' }}>
          {/* การ์ดสำหรับแผนที่ */}
          <Card sx={{ width: '100%', height: '100%' }}>
            <CardContent>
              <div style={{ height: '400px', width: '100%' }}>
                <MapComponent />
              </div>
            </CardContent>
          </Card>
        </Container>
      </Box>

      <Footer />
    </main>
  )
}