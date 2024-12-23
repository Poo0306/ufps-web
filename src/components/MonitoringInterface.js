'use client'

import React from 'react';
import { ArrowUpRight, Thermometer, Droplets } from 'lucide-react';
import {
  getAirQualityColor,
  formatPMValue,
  getRecommendationIcon,
  useMonitoringData
} from '../data/monitoring-data';
import { ClientWrapper } from './ClientWrapper';

const Header = () => (
  <header className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-4 bg-green-100 border-b border-green-100">
    <div className="flex items-center gap-6">
      <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
        <img
          src="/mupcop-logo.png"
          alt="Mupcop logo"
          className="w-16 h-16 object-contain"
          width={82}
          height={82}
        />
      </div>
      <div className="flex-grow">
        <h1 className="text-3xl font-bold text-black mb-1">Mupcop</h1>
        <h2 className="text-base font-light text-black max-w-xl">
          Multi-factor ultrafine particle (PM0.1) concentration optimization prediction
        </h2>
      </div>
    </div>
    <nav className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-4">
      <button className="px-3 sm:px-4 py-1.5 text-2xl font-semibold text-black rounded-lg hover:bg-green-200 transition-colors">
        Air quality
      </button>
      <button className="px-3 sm:px-4 py-1.5 text-2xl font-semibold text-black rounded-lg hover:bg-green-200 transition-colors">
        History data
      </button>
    </nav>
  </header>
);

const LiveIndicator = () => (
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
    <span className="text-2xl font-semibold text-black">LIVE</span>
  </div>
);

const WeatherCondition = ({ icon: Icon, value }) => (
  <div className="text-center flex flex-col items-center gap-1">
    <Icon className="w-4 h-4 text-black" />
    <div className="text-black">{value}</div>
  </div>
);

const PMReading = ({ type, value }) => (
  <div className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full" />
        <span className="text-lg">{type}</span>
      </div>
      <span className="text-blue-500 font-medium">{formatPMValue(value)}</span>
    </div>
  </div>
);

const Recommendation = ({ text, index }) => (
  <div className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
    <ArrowUpRight className="w-4 h-4 text-green-500" />
    <span>{`${getRecommendationIcon(index)} ${text}`}</span>
  </div>
);

const LoadingState = () => (
  <div className="font-2xl text-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
    <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
  </div>
);

const MonitoringPanel = () => {
  const data = useMonitoringData();
  const statusColor = getAirQualityColor(data.mainReading.status);

  if (!data) return <LoadingState />;

  return (
    <div className="bg-gray-50/50 p-4 w-1/3 border-b lg:border-r border-gray-100">
      <div className="mb-4">
        <h2 className="text-3xl font-light mb-3 text-black-800">UFPs Monitoring</h2>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-3">
            <LiveIndicator />
            <span className="text-md text-black">{data.date}</span>
          </div>

          <div
            className="p-4 rounded-xl mb-4 shadow-md text-white"
            style={{ backgroundColor: statusColor }}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-3xl font-bold">{data.mainReading.value}</span>
                <span className="text-md ml-1">{data.mainReading.unit}</span>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{data.mainReading.status}</div>
                <div className="text-md opacity-90">{data.mainReading.note}</div>
              </div>
            </div>
          </div>

          <div className="text-md grid grid-cols-2 gap-4 text-base">
            <WeatherCondition
              icon={Thermometer}
              value={data.conditions.temperature}
            />
            <WeatherCondition
              icon={Droplets}
              value={data.conditions.humidity}
            />
          </div>
        </div>

        <div className="text-lg grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {data.pmReadings.map((reading, index) => (
            <PMReading
              key={`pm-${index}`}
              type={reading.type}
              value={reading.value}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg text-black mb-3">คำแนะนำวันนี้</h3>
        <div className="text-lg space-y-2.5 text-sm">
          {data.recommendations.map((recommendation, index) => (
            <Recommendation
              key={`rec-${index}`}
              text={recommendation}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-4 bg-green-100 border-t border-green-100">
    <span className="text-base text-black">Made with by Jaejae Dream Yok ❤️</span>
    <div className="flex items-center justify-end ml-auto gap-4">
      <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
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
          <span className="text-3xl font-bold text-black mb-1">Mupcop</span>
        </p>
      </div>
    </div>
  </footer>
);

export { Header, MonitoringPanel, Footer };