import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Search, Filter, Globe, BookOpen, GraduationCap, DollarSign, Download, ChevronDown } from 'lucide-react';

// Mock Data representative of World Bank EdStats
const trendData = [
  { year: '2015', "Sub-Saharan Africa": 64, "South Asia": 71, "Global Average": 82 },
  { year: '2016', "Sub-Saharan Africa": 65, "South Asia": 72, "Global Average": 83 },
  { year: '2017', "Sub-Saharan Africa": 65.5, "South Asia": 73, "Global Average": 84 },
  { year: '2018', "Sub-Saharan Africa": 66, "South Asia": 74.5, "Global Average": 85 },
  { year: '2019', "Sub-Saharan Africa": 67, "South Asia": 75, "Global Average": 86 },
  { year: '2020', "Sub-Saharan Africa": 67.5, "South Asia": 76, "Global Average": 86.5 },
];

const comparisonData = [
  { country: 'Norway', expenditure: 7.9 },
  { country: 'Costa Rica', expenditure: 7.4 },
  { country: 'South Africa', expenditure: 6.2 },
  { country: 'United States', expenditure: 4.9 },
  { country: 'India', expenditure: 3.5 },
];

export default function EducationDashboard() {
  const [selectedIndicator, setSelectedIndicator] = useState('Literacy Rate');

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      
      {/* Sidebar / Filters */}
      <aside className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col h-screen sticky top-0">
        <div className="flex items-center gap-3 mb-8">
          <Globe className="text-blue-600 w-8 h-8" />
          <h1 className="text-xl font-bold text-gray-900 leading-tight">Global EdStats<br/><span className="text-sm font-normal text-gray-500">World Bank Data</span></h1>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto pr-2">
          {/* Search */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Search Countries</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="e.g., Brazil, Japan..." 
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Indicator Categories */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Indicators</label>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-2 bg-blue-50 text-blue-700 rounded-md text-sm font-medium">
                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Literacy & Reading</div>
              </button>
              <button className="w-full flex items-center justify-between p-2 hover:bg-gray-50 text-gray-700 rounded-md text-sm transition">
                <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Enrollment Rates</div>
              </button>
              <button className="w-full flex items-center justify-between p-2 hover:bg-gray-50 text-gray-700 rounded-md text-sm transition">
                <div className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Gov. Expenditure</div>
              </button>
            </div>
          </div>

          {/* Time Range */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Time Range</label>
            <input type="range" min="1970" max="2020" className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1970</span>
              <span>2020</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Youth Literacy Rate (% of people ages 15-24)</h2>
            <p className="text-gray-500 text-sm mt-1">Comparing progression across major regions over the last 5 years.</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 font-medium mb-1">Global Youth Literacy (2020)</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-bold text-gray-900">86.5%</h3>
              <span className="text-sm font-medium text-green-600 mb-1">+0.5% vs 2019</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 font-medium mb-1">Highest Regional Growth</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-bold text-gray-900">South Asia</h3>
              <span className="text-sm font-medium text-green-600 mb-1">+5.0% since 2015</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 font-medium mb-1">Data Availability</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-bold text-gray-900">142</h3>
              <span className="text-sm font-medium text-gray-400 mb-1">Countries reported</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Main Trend Line Chart */}
          <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">Historical Trends</h3>
              <Filter className="w-4 h-4 text-gray-400 cursor-pointer" />
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} domain={[50, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="Global Average" stroke="#10B981" strokeWidth={3} dot={{r: 4}} />
                  <Line type="monotone" dataKey="South Asia" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Sub-Saharan Africa" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Bar Chart */}
          <div className="col-span-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">Gov. Expenditure (% of GDP)</h3>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="country" type="category" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '8px' }} />
                  <Bar dataKey="expenditure" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}