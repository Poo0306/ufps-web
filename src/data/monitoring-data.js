export const monitoringData = {
    date: "11/26/2024",
    mainReading: {
      value: 0.18,
      unit: "μg/m³",
      status: "Good",
      note: "(Long-term/Short-term)"
    },
    conditions: {
      temperature: "26°C",
      humidity: "76%"
    },
    pmReadings: [
      { type: "PM0.1", value: "0.18 μg/m³" },
      { type: "PM2.5", value: "54.67 μg/m³" },
      { type: "PM10", value: "13.67 μg/m³" }
    ],
    recommendations: [
      "ไม่มีมลพิษทางอากาศ",
      "สามารถใช้ชีวิตได้ตามปกติ",
      "สามารถเปิดหน้าต่างระบายอากาศได้"
    ]
  };