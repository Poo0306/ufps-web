'use client'

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useState, useEffect } from 'react';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDd1Dfg1W35UA1U0Boqdny2pjLgFRHl_s",
  authDomain: "ufps-39155.firebaseapp.com",
  databaseURL: "https://ufps-39155-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ufps-39155",
  storageBucket: "ufps-39155.firebasestorage.app",
  messagingSenderId: "45161507872",
  appId: "1:45161507872:web:5f129c23eb9c2f933c2045",
  measurementId: "G-LRZYMDDQV7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Helper functions
export const getAirQualityColor = (status) => {
  const colors = {
    Good: '#10B981',        // Green
    Moderate: '#F59E0B',    // Yellow
    Unhealthy: '#EF4444',   // Red
    'Very Unhealthy': '#7C3AED',  // Purple
    Hazardous: '#991B1B'    // Dark Red
  };
  return colors[status] || colors.Moderate;
};

export const formatPMValue = (value) => {
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) return value;
  return `${numericValue.toFixed(2)} μg/m³`;
};

export const getRecommendationIcon = (index) => {
  const icons = ['🌿', '👥', '🪟'];
  return icons[index] || '•';
};

// Constants for thresholds
export const PM_THRESHOLDS = {
  PM01: {
    good: 0.5,
    moderate: 1.0,
    unhealthy: 2.0
  },
  PM25: {
    good: 12.0,
    moderate: 35.4,
    unhealthy: 55.4
  },
  PM100: {
    good: 54,
    moderate: 154,
    unhealthy: 254
  }
};

// Function to format date consistently
const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Function to determine air quality status based on PM values
const determineAirQuality = (pm01, pm25, pm100) => {
  if (pm01 <= PM_THRESHOLDS.PM01.good && 
      pm25 <= PM_THRESHOLDS.PM25.good && 
      pm100 <= PM_THRESHOLDS.PM100.good) {
    return "Good";
  } else if (pm01 <= PM_THRESHOLDS.PM01.moderate && 
             pm25 <= PM_THRESHOLDS.PM25.moderate && 
             pm100 <= PM_THRESHOLDS.PM100.moderate) {
    return "Moderate";
  } else {
    return "Unhealthy";
  }
};

// Custom hook to get realtime monitoring data
export const useMonitoringData = () => {
  const [monitoringData, setMonitoringData] = useState({
    date: formatDate(new Date()),
    mainReading: {
      value: 0,
      unit: "μg/m³",
      status: "Good",
      note: "(Long-term/Short-term)"
    },
    conditions: {
      temperature: "Loading...",
      humidity: "Loading..."
    },
    pmReadings: [
      { type: "PM0.1", value: "Loading..." },
      { type: "PM2.5", value: "Loading..." },
      { type: "PM10", value: "Loading..." }
    ],
    recommendations: [
      "กำลังโหลดข้อมูล...",
      "กำลังวิเคราะห์คุณภาพอากาศ...",
      "กำลังประมวลผลคำแนะนำ..."
    ]
  });

  useEffect(() => {
    // Reference to your PM data in Firebase
    const pmDataRef = ref(database, '/PieraData/EDGk6glhF7gyCgk8BwpPlWOV26B2');

    const unsubscribe = onValue(pmDataRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const pm01 = parseFloat(data.pm01 || 0);
        const pm25 = parseFloat(data.pm25 || 0);
        const pm10 = parseFloat(data.pm100 || 0);
        
        const airQualityStatus = determineAirQuality(pm01, pm25, pm10);
        
        const recommendations = (() => {
          switch (airQualityStatus) {
            case 'Good':
              return [
                "ไม่มีมลพิษทางอากาศ",
                "สามารถใช้ชีวิตได้ตามปกติ",
                "สามารถเปิดหน้าต่างระบายอากาศได้"
              ];
            case 'Moderate':
              return [
                "ควรลดกิจกรรมกลางแจ้ง",
                "ปิดหน้าต่างเมื่ออยู่ในอาคาร",
                "สวมหน้ากากอนามัยเมื่อออกนอกอาคาร"
              ];
            case 'Unhealthy':
              return [
                "หลีกเลี่ยงกิจกรรมกลางแจ้ง",
                "ปิดประตูหน้าต่างให้สนิท",
                "สวมหน้ากากป้องกันฝุ่นเมื่อจำเป็นต้องออกนอกอาคาร"
              ];
            default:
              return [
                "กำลังประมวลผลคำแนะนำ...",
                "โปรดติดตามสถานการณ์อย่างใกล้ชิด",
                "ปฏิบัติตามคำแนะนำของเจ้าหน้าที่"
              ];
          }
        })();

        setMonitoringData(prev => ({
          ...prev,
          date: formatDate(new Date()),
          mainReading: {
            value: pm01,
            unit: "μg/m³",
            status: airQualityStatus,
            note: "(Long-term/Short-term)"
          },
          conditions: {
            temperature: `${data.temperature || "N/A"}°C`,
            humidity: `${data.humidity || "N/A"}%`
          },
          pmReadings: [
            { type: "PM0.1", value: `${pm01} μg/m³` },
            { type: "PM2.5", value: `${pm25} μg/m³` },
            { type: "PM10", value: `${pm10} μg/m³` }
          ],
          recommendations
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  return monitoringData;
};