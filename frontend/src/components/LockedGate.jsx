import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Video, Activity, Sparkles } from 'lucide-react';

export default function LockedGate({ pageTitle = "This Section" }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#121829]/90 border border-slate-200 dark:border-purple-900/40 rounded-3xl p-8 sm:p-12 shadow-xl dark:shadow-2xl text-center space-y-6 relative overflow-hidden transition-colors duration-200">
        
        {/* Glow orb */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Lock Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/40 flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400 shadow-md dark:shadow-purple-950/80">
          <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 dark:text-purple-300 animate-pulse" />
        </div>

        {/* Title & Message */}
        <div className="space-y-2 max-w-lg mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/40 px-3 py-1 rounded-full">
            New User Access Restriction
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-2">
            {pageTitle} is Locked
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Yeh section new users ke liye locked hai. Is feature ko unlock karne ke liye pehle video upload karke detection run karein ya temporal assessment karein.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Jaise hi aapka video analyze ho jaayega, yahan forensic logs, audit report aur overview automatically unlock ho jaayenge.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Video className="w-4 h-4 text-purple-200 group-hover:scale-110 transition-transform" />
            <span>Pehle Video Upload Karo</span>
          </Link>

          <Link
            to="/dashboard/temporal"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-[#090d16] hover:bg-slate-200 dark:hover:bg-slate-800/90 border border-slate-300 dark:border-purple-900/50 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Temporal Assessment</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
