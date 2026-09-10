import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const storedUser = localStorage.getItem('user');
  let userDisplay = 'Authenticated User';
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed) {
        userDisplay = parsed.name || parsed.email || 'Authenticated User';
      }
    } catch {
      // ignore
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0d1222]/90 backdrop-blur-md border-b border-slate-200 dark:border-purple-900/30 px-6 py-3 flex items-center justify-between transition-colors duration-200">
      
      {/* Brand / Logo */}
      <Link to="/dashboard" className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
        <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
          <Shield className="w-5 h-5" />
        </div>
        <span>DeepShield <span className="text-xs text-purple-600 dark:text-purple-400 font-normal px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/40">Console</span></span>
      </Link>

      {/* Right Side: Theme Toggle, Profile & Logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer bg-slate-100 dark:bg-purple-950/40 border-slate-200 dark:border-purple-900/40 text-slate-700 dark:text-purple-300 hover:bg-slate-200 dark:hover:bg-purple-900/50 hover:scale-105"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-purple-600 hover:-rotate-12 transition-transform" />
          )}
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-900/40 text-xs text-slate-700 dark:text-purple-200">
          <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="font-medium">{userDisplay}</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-xs font-semibold transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

    </nav>
  );
}