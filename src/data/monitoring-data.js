'use client'

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, query, orderByKey, limitToLast } from 'firebase/database';
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

// Constants
const FIREBASE_USER_ID = 'EDGk6glhF7gyCgk8BwpPlWOV26B2';
const BASE_PATH = 'PieraData';

// Helper functions
const getCurrentDatePath = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCurrentTime = () => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const formatDisplayDate = (date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// PM thresholds and color functions remain the same
export const getAirQualityColor = (status) => {
  const colors = {
    Good: '#10B981',
    Moderate: '#F59E0B',
    Unhealthy: '#EF4444',
    'Very Unhealthy': '#7C3AED',
    Hazardous: '#991B1B'
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

// Updated hook to get realtime monitoring data with time-based updates
export const useMonitoringData = () => {
  const [monitoringData, setMonitoringData] = useState({
    date: formatDisplayDate(new Date()),
    time: getCurrentTime(),
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
    const datePath = getCurrentDatePath();
    const dataPath = `/${BASE_PATH}/${FIREBASE_USER_ID}/${datePath}`;
    
    // Create a query to get the latest time entry
    const timeQuery = query(
      ref(database, dataPath),
      orderByKey(),
      limitToLast(1)
    );

    const unsubscribe = onValue(timeQuery, (snapshot) => {
      const timeData = snapshot.val();
      
      if (timeData) {
        // Get the latest time entry
        const latestTime = Object.keys(timeData)[0];
        const data = timeData[latestTime];
        
        if (data) {
          const pm01 = parseFloat(data.PM01 || 0);
          const pm25 = parseFloat(data.PM25 || 0);
          const pm10 = parseFloat(data.PM100 || 0);
          
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

          setMonitoringData({
            date: formatDisplayDate(new Date()),
            time: latestTime,
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
          });
        }
      } else {
        console.log('No data found for current date and time:', datePath);
      }
    });

    return () => unsubscribe();
  }, []);

  return monitoringData;
};