import React from 'react';
import { ArrowUpRight, Thermometer, Droplets, Menu } from 'lucide-react';

const Header = () => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-4 bg-green-100 border-b border-green-100">
    <div className="flex items-center gap-6">
      <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
        <img
          src="/mupcop-logo.png"
          alt="Mupcop logo"
          className="w-16 h-16 object-contain"
          style={{ minWidth: '82px', minHeight: '82px' }}
        />
      </div>
      <div className="flex-grow">
        <h1 className="text-3xl font-bold text-black mb-1">Mupcop</h1>
        <h2 className="text-base font-light text-black max-w-xl">Multi-factor ultrafine particle (PM0.1) concentration optimization prediction</h2>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-4">
      <button className="px-3 sm:px-4 py-1.5 text-2xl font-semibold text-black rounded-lg hover:bg-green-200 whitespace-nowrap">
        Air quality
      </button>
      <button className="px-3 sm:px-4 py-1.5 text-2xl font-semibold text-black rounded-lg hover:bg-green-200 whitespace-nowrap">
        History data
      </button>
    </div>
  </div>
);

// const Navigation = () => (
//   <nav className="flex gap-2 sm:gap-4 px-4 py-2 bg-green-50 border-b border-green-100 overflow-x-auto">
//     <button className="px-3 sm:px-4 py-1.5 text-sm font-medium bg-green-100 text-green-800 rounded-lg hover:bg-green-200 whitespace-nowrap">
//       Air quality
//     </button>
//     <button className="px-3 sm:px-4 py-1.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-green-100 whitespace-nowrap">
//       History data
//     </button>
//   </nav>
// );

const MonitoringPanel = ({ data }) => (
  <div className="bg-gray-50/50 p-4 w-full border-b lg:border-r border-gray-100">
    <div className="mb-4">
      <h2 className="text-3xl font-light mb-3 text-black-800">UFPs Monitoring</h2>

      {/* Main monitoring card */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-2xl font-semibold text-black">LIVE</span>
          </div>
          <span className="text-base text-black">{data.date}</span>
        </div>

        <div className="bg-blue-500 text-white p-4 rounded-xl mb-4 shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-3xl font-bold">{data.mainReading.value}</span>
              <span className="text-base ml-1">{data.mainReading.unit}</span>
            </div>
            <div className="text-center">
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
  <div className="flex flex-col-3 sm:flex-row items-start sm:items-center gap-2 p-4 bg-green-100 border-t border-green-100">
    <span className="text-base text-black">Made with by Jaejae Dream Yok ❤️</span>
    <div className="flex items-center justify-end ml-auto gap-4">
      <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
        <img
          src="/mupcop-logo.png"
          alt="Mupcop logo"
          className="w-16 h-16 object-contain"
          style={{ minWidth: '82px', minHeight: '82px' }}
        />
      </div>
      <div className="flex-col">
        <p className="text-sm text-gray-700 max-w-xl">
          <span className="text-3xl font-bold text-black mb-1">Mupcop</span> Multi factor ultrafine particle (PM0.1) concentration optimization prediction
        </p>
      </div>
    </div>
  </div>
);

export { Header, Navigation, MonitoringPanel, Footer };