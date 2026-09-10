import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNavbar from './DashboardNavbar';
import Sidebar from './Sidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <DashboardNavbar />
      
      <div className="flex pt-[65px] flex-1 relative">
        {/* Fixed Sticky Sidebar */}
        <div 
          className={`transition-all duration-300 shrink-0 sticky top-[65px] h-[calc(100vh-65px)] z-30 ${
            sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
          }`}
        >
          <Sidebar />
        </div>

        {/* Floating Circular Toggle Button matching the screenshot */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-1/2 -translate-y-1/2 z-40 w-7 h-7 rounded-full bg-white dark:bg-[#151f32] border border-slate-300 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 shadow-md flex items-center justify-center transition-all cursor-pointer"
          style={{ left: sidebarOpen ? '242px' : '10px' }}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto min-w-0 transition-all">
          <Outlet />
        </main>
      </div>
    </div>
  );
}