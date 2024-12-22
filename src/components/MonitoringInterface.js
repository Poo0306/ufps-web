import React from 'react';
import { ArrowUpRight, Thermometer, Droplets, Menu } from 'lucide-react';

const Header = () => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-4 bg-green-100/50">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 flex items-center justify-center">
        <img src="/mupcop-logo.png" alt="Mupcop logo" className="w-8 h-8 object-contain" />
      </div>
      <h1 className="text-xl font-semibold text-gray-800">Mupcop</h1>
    </div>
    <p className="text-sm text-gray-600 max-w-xl">Multi-factor ultrafine particle (PM0.1) concentration optimization prediction</p>
  </div>
);

const Navigation = () => (
  <nav className="flex gap-2 sm:gap-4 px-4 py-2 bg-green-50 border-b border-green-100 overflow-x-auto">
    <button className="px-3 sm:px-4 py-1.5 text-sm font-medium bg-green-100 text-green-800 rounded-lg hover:bg-green-200 whitespace-nowrap">
      Air quality
    </button>
    <button className="px-3 sm:px-4 py-1.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-green-100 whitespace-nowrap">
      History data
    </button>
  </nav>
);

const MonitoringPanel = ({ data }) => (
  <div className="bg-gray-50/50 p-4 w-full border-b lg:border-r border-gray-100">
    <div className="mb-4">
      <h2 className="text-lg font-medium mb-3 text-gray-800">UFPs Monitoring</h2>
      
      {/* Main monitoring card */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-600">LIVE</span>
          </div>
          <span className="text-sm text-gray-400">{data.date}</span>
        </div>
        
        <div className="bg-blue-500 text-white p-4 rounded-xl mb-4 shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-4xl font-bold">{data.mainReading.value}</span>
              <span className="text-sm ml-1">{data.mainReading.unit}</span>
            </div>
            <div className="text-right">
              <div className="font-medium">{data.mainReading.status}</div>
              <div className="text-xs opacity-90">{data.mainReading.note}</div>
            </div>
          </div>
        </div>

        {/* Weather conditions */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="text-center flex flex-col items-center gap-1">
            <Thermometer className="w-4 h-4 text-gray-400" />
            <div>{data.conditions.temperature}</div>
          </div>
          <div className="text-center flex flex-col items-center gap-1">
            <Droplets className="w-4 h-4 text-gray-400" />
            <div>{data.conditions.humidity}</div>
          </div>
        </div>
      </div>

      {/* PM readings */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {data.pmReadings.map((reading, index) => (
          <div key={index} className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">{reading.type}</span>
              </div>
              <span className="text-blue-500 font-medium">{reading.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Recommendations */}
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-medium mb-3 text-gray-800">คำแนะนำวันนี้</h3>
      <div className="space-y-2.5 text-sm">
        {data.recommendations.map((recommendation, index) => (
          <div key={index} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <ArrowUpRight className="w-4 h-4 text-green-500" />
            <span>{recommendation}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Footer = () => (
  <div className="p-2 bg-white border-t border-gray-100 text-center text-sm text-gray-500">
    Made by Jaejae Dream Yok
  </div>
);

export { Header, Navigation, MonitoringPanel, Footer };