'use client'

import React, { useState } from 'react';
import { ArrowUpRight, Thermometer, Droplets, Menu, X, ChevronUp } from 'lucide-react';
import {
  getAirQualityColor,
  formatPMValue,
  getRecommendationIcon,
  useMonitoringData
} from '../data/monitoring-data';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-green-100 border-b border-green-100 flex-shrink-0">
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
            <img
              src="/mupcop-logo.png"
              alt="Mupcop logo"
              className="w-10 h-10 object-contain"
              width={82}
              height={82}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-black">Mupcop</h1>
            <h2 className="text-xs font-light text-black max-w-xl">
              Multi-factor ultrafine particle optimization prediction
            </h2>
          </div>
        </div>
        
        <nav className="hidden sm:flex items-center gap-4">
          <button className="px-3 py-1 text-base font-semibold text-black rounded-lg hover:bg-green-200 transition-colors">
            Air quality
          </button>
          <button className="px-3 py-1 text-base font-semibold text-black rounded-lg hover:bg-green-200 transition-colors">
            History data
          </button>
        </nav>
        
        <button 
          className="sm:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
};

const MonitoringPanel = () => {
  const data = useMonitoringData();
  const statusColor = getAirQualityColor(data.mainReading.status);

  // แสดง loading state ถ้ายังไม่มีข้อมูล
  if (!data) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mb-2"></div>
        <p className="text-sm text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
    </div>
  );

  return (
    <div className="h-full lg:w-1/3 bg-gray-50/50 border-r border-gray-100 overflow-auto">
      <div className="p-3">
        <h2 className="text-xl font-light mb-2 text-black-800">UFPs Monitoring</h2>

        {/* Main reading card */}
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-base font-semibold text-black">LIVE</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-black">{data.date}</span>
              <span className="text-xs text-gray-500 ml-2">{data.time}</span>
            </div>
          </div>

          <div
            className="p-3 rounded-lg mb-3 shadow-sm text-white"
            style={{ backgroundColor: statusColor }}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xl font-bold">{data.mainReading.value}</span>
                <span className="text-sm ml-1">{data.mainReading.unit}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{data.mainReading.status}</div>
                <div className="text-xs opacity-90">{data.mainReading.note}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center flex flex-col items-center gap-1 bg-blue-50 p-2 rounded-lg">
              <Thermometer className="w-4 h-4 text-blue-400" />
              <div className="text-blue-700 font-medium">{data.conditions.temperature}</div>
              <div className="text-blue-500 text-xs">Temperature</div>
            </div>
            <div className="text-center flex flex-col items-center gap-1 bg-blue-50 p-2 rounded-lg">
              <Droplets className="w-4 h-4 text-blue-400" />
              <div className="text-blue-700 font-medium">{data.conditions.humidity}</div>
              <div className="text-blue-500 text-xs">Humidity</div>
            </div>
          </div>
        </div>

        {/* PM Readings */}
        <div className="grid gap-2 grid-cols-1 mb-3">
          {data.pmReadings.map((reading, index) => (
            <div
              key={`pm-${index}`}
              className="bg-white p-2.5 rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium">{reading.type}</span>
                </div>
                <span className="text-sm text-blue-500 font-medium">
                  {formatPMValue(reading.value)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-800 mb-2">คำแนะนำวันนี้</h3>
          <div className="space-y-2 text-xs">
            {data.recommendations.map((recommendation, index) => (
              <div 
                key={`rec-${index}`} 
                className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <ArrowUpRight className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span>{`${getRecommendationIcon(index)} ${recommendation}`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-4 bg-green-100 border-t border-green-100">
    <span className="text-base text-black">Made with by Jaejae Dream Yok ❤️</span>
    <div className="flex items-center justify-end ml-auto gap-4">
      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
        <img
          src="/mupcop-logo.png"
          alt="Mupcop logo"
          className="w-16 h-16 object-contain"
          width={82}
          height={82}
        />
      </div>
      <div className="flex-col">
        <p className="text-sm text-gray-700">
          <span className="text-xl font-bold text-black mb-1">Mupcop</span>
        </p>
      </div>
    </div>
  </footer>
);

export { Header, MonitoringPanel, Footer };