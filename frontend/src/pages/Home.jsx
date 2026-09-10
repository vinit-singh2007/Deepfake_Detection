import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Sparkles, CheckCircle2, Shield, Activity, Cpu, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#0B0D17] text-slate-900 dark:text-white flex flex-col justify-between overflow-hidden font-sans pt-24 pb-12 transition-colors duration-200">

      {/* Background Grid Pattern & Glowing Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#1e2642_1px,transparent_1px)] [background-size:32px_32px] opacity-25 dark:opacity-30"></div>

        {/* Animated Glow Blobs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-1/3 right-1/4 translate-x-1/3 w-[450px] h-[450px] bg-pink-500/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[160px]"></div>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">

        {/* Left Column: Hero Copy */}
        <div className="lg:col-span-6 space-y-8 text-left">

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
            Unmasking Fake Content with <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-300 bg-clip-text text-transparent">
              DeepShield XAI.
            </span>
          </h1>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
            Protect media integrity using our explainable AI pipeline. DeepShield detects frame inconsistencies, spatial landmark mismatches, and temporal lip-sync anomalies in real time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/login"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] active:scale-[0.98] border border-white/10 cursor-pointer"
            >
              <span>Start Analysis</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-white/10 backdrop-blur-md transition-all duration-300 hover:border-purple-500/40 shadow-sm cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 dark:text-pink-400 mr-2.5">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>
              Watch Interactive Demo
            </Link>
          </div>
        </div>

        {/* Right Column: Custom Interactive AI Shield Emblem Logo */}
        <div className="lg:col-span-6 relative flex justify-center items-center py-6">

          {/* Radial Ambient Glow */}
          <div className="absolute w-[380px] h-[380px] bg-gradient-to-tr from-purple-600/20 via-pink-600/15 to-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>

          {/* Center Logo Canvas */}
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">

            {/* Outer Orbit Ring 1 */}
            <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-[spin_20s_linear_infinite]">
              <div className="w-3 h-3 bg-pink-500 rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_12px_#ec4899]"></div>
            </div>

            {/* Outer Orbit Ring 2 (Counter rotating) */}
            <div className="absolute inset-4 rounded-full border border-dashed border-indigo-500/30 animate-[spin_15s_linear_infinite_reverse]"></div>

            {/* Main Vector Shield Logo */}
            <svg viewBox="0 0 200 220" className="w-64 h-64 sm:w-72 sm:h-72 drop-shadow-[0_0_35px_rgba(168,85,247,0.35)] transition-transform duration-500 hover:scale-105">
              <defs>
                {/* Shield Gradient */}
                <linearGradient id="shieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#0f172a" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#020617" stopOpacity="1" />
                </linearGradient>

                {/* Border Glow Gradient */}
                <linearGradient id="shieldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="50%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>

                {/* Core Neural Glow */}
                <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Shield Outer Shell */}
              <path
                d="M100 10 L170 40 V100 C170 150 100 190 100 190 C100 190 30 150 30 100 V40 Z"
                fill="url(#shieldBg)"
                stroke="url(#shieldBorder)"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* Inner Tech Mesh Lines */}
              <path
                d="M100 25 L155 48 V95 C155 135 100 170 100 170 C100 170 45 135 45 95 V48 Z"
                fill="none"
                stroke="#a855f7"
                strokeWidth="1"
                strokeOpacity="0.25"
                strokeDasharray="4,4"
              />

              {/* Core Glow Overlay */}
              <circle cx="100" cy="95" r="45" fill="url(#coreGlow)" />

              {/* Biometric Face Landmark Nodes (Vector Representation) */}
              <g stroke="#f472b6" strokeWidth="1.5" fill="none" opacity="0.85">
                {/* Eyebrows & Eyes */}
                <circle cx="82" cy="80" r="3" fill="#c084fc" />
                <circle cx="118" cy="80" r="3" fill="#c084fc" />

                {/* Nose Line */}
                <path d="M100 82 V98 L104 100" strokeLinecap="round" />

                {/* Lip Sync Nodes */}
                <path d="M85 115 Q100 125 115 115 Q100 110 85 115 Z" fill="none" stroke="#ec4899" strokeWidth="1.5" />

                {/* Mesh Connecting Lines */}
                <line x1="82" y1="80" x2="100" y2="82" strokeOpacity="0.4" />
                <line x1="118" y1="80" x2="100" y2="82" strokeOpacity="0.4" />
                <line x1="100" y1="100" x2="85" y2="115" strokeOpacity="0.4" />
                <line x1="100" y1="100" x2="115" y2="115" strokeOpacity="0.4" />
              </g>

              {/* Central Lock Icon Symbol */}
              <circle cx="100" cy="95" r="28" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.3" />
            </svg>

            {/* Floating Micro Badges Around Logo */}
            <div className="absolute -top-2 right-4 bg-white/90 dark:bg-[#1e1b4b]/80 border border-purple-200 dark:border-purple-500/30 px-3 py-1.5 rounded-full text-[11px] text-purple-700 dark:text-purple-200 backdrop-blur-md shadow-md flex items-center gap-1.5 animate-bounce">
              <Lock className="w-3 h-3 text-pink-500 dark:text-pink-400" />
              <span>Zero-Trust Verification</span>
            </div>

            <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-[#1e1b4b]/80 border border-pink-200 dark:border-pink-500/30 px-3 py-1.5 rounded-full text-[11px] text-pink-700 dark:text-pink-200 backdrop-blur-md shadow-md flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <span>XAI Engine Active</span>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Metrics Bar */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 pt-12 border-t border-slate-200 dark:border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">99.4%</p>
          <p className="text-xs text-slate-500">Detection Accuracy</p>
        </div>
        <div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">10M+</p>
          <p className="text-xs text-slate-500">Frames Processed</p>
        </div>
        <div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">&lt; 150ms</p>
          <p className="text-xs text-slate-500">Inference Speed</p>
        </div>
        <div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">Zero-Trust</p>
          <p className="text-xs text-slate-500">Media Verification</p>
        </div>
      </div>

    </div>
  );
}