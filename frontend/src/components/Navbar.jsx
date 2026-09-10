import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0B0D17]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 px-6 py-4 flex items-center justify-between transition-colors duration-200">
      <Link to="/" className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
        <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
          <Shield className="w-5 h-5" />
        </div>
        <span>DeepShield</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
        <Link to="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Home</Link>
        <Link to="/awareness" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Awareness</Link>
      </div>

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

        <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 transition-colors">
          Login
        </Link>
        <Link to="/register" className="text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500 transition-all">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}