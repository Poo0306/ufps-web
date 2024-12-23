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
            <span className="text-xs text-black">{data.date}</span>
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
            <div className="text-center flex flex-col items-center gap-1">
              <Thermometer className="w-4 h-4 text-gray-400" />
              <div className="text-gray-600">{data.conditions.temperature}</div>
            </div>
            <div className="text-center flex flex-col items-center gap-1">
              <Droplets className="w-4 h-4 text-gray-400" />
              <div className="text-gray-600">{data.conditions.humidity}</div>
            </div>
          </div>
        </div>

        {/* PM Readings */}
        <div className="grid gap-2 grid-cols-1 mb-3">
          {data.pmReadings.map((reading, index) => (
            <div
              key={`pm-${index}`}
              className="bg-white p-2.5 rounded-lg shadow-sm border border-gray-100"
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
                className="flex items-center gap-2 text-gray-600"
              >
                <ArrowUpRight className="w-3 h-3 text-green-500" />
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
  <footer className="h-12 bg-green-100 border-t border-green-100 flex-shrink-0">
    <div className="h-full flex items-center justify-between px-4">
      <span className="text-xs text-black">Made with by Jaejae Dream Yok ❤️</span>
      <div className="flex items-center gap-2">
        <img
          src="/mupcop-logo.png"
          alt="Mupcop logo"
          className="w-8 h-8 object-contain"
        />
        <span className="text-sm font-bold text-black">Mupcop</span>
      </div>
    </div>
  </footer>
);

export { Header, MonitoringPanel, Footer };