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
const PIERA_PATH = 'PieraData';
const RAW_PATH = 'RAWdata/Cafe';

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
    Excellent: '#1E88E5',
    Good: '#2DC653',
    Moderate: '#FECF3E',
    Unhealthy: '#FF9500',
    Hazardous: '#D02224'
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
    Excellent: 0.0,
    good: 0.5,
    moderate: 1.0,
    unhealthy: 2.0,
    Hazardous: Number.MAX_VALUE
  },
  PM25: {
    Excellent: 15.0,
    good: 25.0,
    moderate: 37.5,
    unhealthy: 75.0,
    Hazardous: Number.MAX_VALUE
  },
  PM100: {
    Excellent: 50.0,
    good: 80.0,
    moderate: 120.0,
    unhealthy: 180.0,
    Hazardous: Number.MAX_VALUE
  }
};

const determineAirQuality = (pm01, pm25, pm100) => {
  // Check Excellent
  if (pm01 <= PM_THRESHOLDS.PM01.Excellent &&
    pm25 <= PM_THRESHOLDS.PM25.Excellent &&
    pm100 <= PM_THRESHOLDS.PM100.Excellent) {
    return "Excellent";
  }
  // Check Good
  else if (pm01 <= PM_THRESHOLDS.PM01.good &&
    pm25 <= PM_THRESHOLDS.PM25.good &&
    pm100 <= PM_THRESHOLDS.PM100.good) {
    return "Good";
  }
  // Check Moderate
  else if (pm01 <= PM_THRESHOLDS.PM01.moderate &&
    pm25 <= PM_THRESHOLDS.PM25.moderate &&
    pm100 <= PM_THRESHOLDS.PM100.moderate) {
    return "Moderate";
  }
  // Check Unhealthy
  else if (pm01 <= PM_THRESHOLDS.PM01.unhealthy &&
    pm25 <= PM_THRESHOLDS.PM25.unhealthy &&
    pm100 <= PM_THRESHOLDS.PM100.unhealthy) {
    return "Unhealthy";
  }
  // If above all thresholds, return Hazardous
  else {
    return "Hazardous";
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
    
    // Set up paths for both data sources
    const pieraDataPath = `/${PIERA_PATH}/${FIREBASE_USER_ID}/${datePath}`;
    const rawDataPath = `/${RAW_PATH}/${datePath}`;

    // Create queries for both paths to get latest entries
    const pieraQuery = query(
      ref(database, pieraDataPath),
      orderByKey(),
      limitToLast(1)
    );

    const rawQuery = query(
      ref(database, rawDataPath),
      orderByKey(),
      limitToLast(1)
    );

    // Subscribe to Piera data updates
    const pieraUnsubscribe = onValue(pieraQuery, (snapshot) => {
      const timeData = snapshot.val();

      if (timeData) {
        const latestTime = Object.keys(timeData)[0];
        const data = timeData[latestTime];

        if (data) {
          const pm01 = parseFloat(data.PM01 || 0);
          const pm25 = parseFloat(data.PM25 || 0);
          const pm10 = parseFloat(data.PM100 || 0);
          
          const airQualityStatus = determineAirQuality(pm01, pm25, pm10);
          const recommendations = getRecommendations(airQualityStatus);

          setMonitoringData(prevData => ({
            ...prevData,
            date: formatDisplayDate(new Date()),
            time: latestTime,
            mainReading: {
              value: pm01,
              unit: "μg/m³",
              status: airQualityStatus,
              note: "(Long-term/Short-term)"
            },
            pmReadings: [
              { type: "PM0.1", value: `${pm01} μg/m³` },
              { type: "PM2.5", value: `${pm25} μg/m³` },
              { type: "PM10", value: `${pm10} μg/m³` }
            ],
            recommendations
          }));
        }
      }
    });

    // Subscribe to RAW data updates
    const rawUnsubscribe = onValue(rawQuery, (snapshot) => {
      const timeData = snapshot.val();

      if (timeData) {
        const latestTime = Object.keys(timeData)[0];
        const data = timeData[latestTime];

        if (data) {
          setMonitoringData(prevData => ({
            ...prevData,
            conditions: {
              temperature: `${data.IndoorTemperature || "N/A"}°C`,
              humidity: `${data.IndoorHumidity || "N/A"}%`
            }
          }));
        }
      }
    });

    // Cleanup function to unsubscribe from both listeners
    return () => {
      pieraUnsubscribe();
      rawUnsubscribe();
    };
  }, []);

  return monitoringData;
};

const getRecommendations = (airQualityStatus) => {
  switch (airQualityStatus) {
    case 'Excellent':
      return [
        "ไม่มีผลต่อสุขภาพ",
        "สามารถใช้ชีวิตได้ตามปกติ",
        "สามารถเปิดหน้าต่างระบายอากาศได้"
      ];
    case 'Good':
      return [
        "ไม่มีผลต่อสุขภาพ",
        "สามารถใช้ชีวิตได้ตามปกติ",
        "สามารถเปิดหน้าต่างระบายอากาศได้",
        "กลุ่มเปราะบางอาจะมีความเสี่ยงและสังเกตอาการของตนเอง"
      ];
    case 'Moderate':
      return [
        "ควรปิดหน้าต่างเมื่ออยู่ในอาคาร",
        "หลีกเลี่ยงการทำกิจกรรมที่ก่อให้เกิดฝุ่น",
        "กลุ่มคนทั่วไปและกลุ่มเปราะบางมีความเสี่ยงและสังเกตอาการของตนเอง"
      ];
    case 'Unhealthy':
      return [
        "กลุ่มคนทั่วไปและกลุ่มเปราะบางมีความเสี่ยงและสังเกตอาการของตนเอง",
        "หลีกเลี่ยงการทำกิจกรรมที่ก่อให้เกิดฝุ่น",
        "เตรียมยาหรืออุปกรณ์ตามคำสั่งแพทย์",
        "ติดตั้งเครื่องฟอกอากาศ"
      ];
    case 'Hazardous':
      return [
        "ทั้งกลุ่มคนทั่วไปและกลุ่มเปราะบางมีความเสี่ยงสูง",
        "งดการทำกิจกรรมหรือเข้าใกล้พื้นที่ที่มีฝุ่น",
        "สังเกตอาการของตนเอง หากมีอาการให้ไปพบแพทย์"
      ];
    default:
      return [
        "กำลังโหลดข้อมูล...",
        "กำลังวิเคราะห์คุณภาพอากาศ...",
        "กำลังประมวลผลคำแนะนำ..."
      ];
  }
};