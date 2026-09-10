import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Video, Activity, History, FileText, ShieldAlert, Lock, GraduationCap } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const [hasAnalysis, setHasAnalysis] = useState(false);

  useEffect(() => {
    const checkReport = () => {
      try {
        const stored = localStorage.getItem('latestReport');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.verdict || parsed.overall_confidence)) {
            setHasAnalysis(true);
            return;
          }
        }
      } catch {
        // ignore
      }
      setHasAnalysis(false);
    };

    checkReport();
  }, [location.pathname]);

  const navItems = [
    { name: 'Overview', path: '/dashboard/overview', icon: LayoutDashboard, requiresAnalysis: true },
    { name: 'Video Analysis & Result', path: '/dashboard', icon: Video, exact: true, requiresAnalysis: false },
    { name: 'Temporal Analysis', path: '/dashboard/temporal', icon: Activity, requiresAnalysis: false },
    { name: 'Analysis History', path: '/dashboard/history', icon: History, requiresAnalysis: true },
    { name: 'Report', path: '/dashboard/report', icon: FileText, requiresAnalysis: true },
    { name: 'Awareness & Learn', path: '/dashboard/awareness', icon: GraduationCap, requiresAnalysis: false },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0d1222] border-r border-slate-200 dark:border-purple-900/30 flex flex-col justify-between p-4 shrink-0 min-h-[calc(100vh-65px)] select-none transition-colors duration-200">
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase px-3 mb-3">Navigation</p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isLocked = item.requiresAnalysis && !hasAnalysis;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-purple-50 dark:bg-purple-600/20 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-white shadow-sm dark:shadow-inner dark:shadow-purple-900/40'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-purple-950/20'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>{item.name}</span>
                  </div>
                  {isLocked && (
                    <Lock className="w-3 h-3 text-slate-400 dark:text-slate-500" title="Locked until first video analysis" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-900 dark:text-white">DeepShield v1.0</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Lip-Sync & Mesh Model</p>
        </div>
      </div>
    </aside>
  );
}