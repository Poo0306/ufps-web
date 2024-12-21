'use client'

import dynamic from 'next/dynamic'
import { Card, CardContent, Typography } from '@mui/material'

// ป้องกัน SSR error โดยใช้ dynamic import
const MapComponent = dynamic(() => import('@/components/MapComponents'), {
  ssr: false,
})

export default function Home() {
  return (
    <main style={{ padding: '20px' }}>
      {/* การ์ดสำหรับแผนที่ */}
      <Card sx={{ width: '100%', height: '100%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            แผนที่
          </Typography>
          <div style={{ height: '400px', width: '100%' }}>
            <MapComponent />
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
