import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Video, 
  Cpu, 
  Eye, 
  Volume2, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import LockedGate from '../components/LockedGate';
import { getAnalysisHistory } from '../services/api';

export default function Overview() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawLocal = localStorage.getItem('latestReport');
    if (rawLocal) {
      try {
        setReportData(JSON.parse(rawLocal));
        setLoading(false);
        return;
      } catch {
        // ignore
      }
    }

    getAnalysisHistory().then((history) => {
      if (history && history.length > 0) {
        setReportData(history[0]);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        Checking forensic profile...
      </div>
    );
  }

  // If new user with no analysis run yet -> Lock page
  if (!reportData) {
    return <LockedGate pageTitle="System Overview" />;
  }

  const isDeepfake = reportData?.verdict?.toLowerCase().includes('manipulated');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300 transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-purple-600 dark:text-purple-400" /> Forensic System Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Unlocked forensic telemetry and multimodal model architecture diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Feature Unlocked
          </span>
        </div>
      </div>

      {/* Latest Analysis Status Bar */}
      <div className="bg-white dark:bg-[#121829]/80 border border-slate-200 dark:border-purple-900/40 rounded-2xl p-6 shadow-sm dark:shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-200">
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl border ${isDeepfake ? 'bg-rose-50 dark:bg-rose-500/15 border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400'}`}>
            {isDeepfake ? <AlertTriangle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Video Profile</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Verdict: <span className={isDeepfake ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>{reportData.verdict}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Confidence Score: <strong className="text-slate-900 dark:text-white">{reportData.overall_confidence ? Number(reportData.overall_confidence).toFixed(1) : 0}%</strong> • Offset: <strong className="text-slate-900 dark:text-white">{reportData.average_offset ?? 0} ms</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/report"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-lg shadow-purple-600/30"
          >
            View Full Audit Report →
          </Link>
          <Link
            to="/dashboard/temporal"
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#090d16] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-purple-900/40 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
          >
            Temporal Graph →
          </Link>
        </div>
      </div>

      {/* Multimodal Forensic Engines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Engine 1: Face Tracking */}
        <div className="bg-white dark:bg-[#121829]/80 border border-slate-200 dark:border-purple-900/40 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-3 transition-colors duration-200">
          <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 w-fit">
            <Eye className="w-5 h-5" />
          </div>
          <h4 className="text-slate-900 dark:text-white font-bold text-base">Facial Landmark Tracking</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            OpenCV Haar cascade model with forward-carrying bounding box tracks mouth region stability across frames and identifies micro-expression tremor anomalies.
          </p>
          <div className="pt-2 border-t border-slate-200 dark:border-purple-900/30 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Tracking Status:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active & Calibrated</span>
          </div>
        </div>

        {/* Engine 2: Audio/Voice Spectral Alignment */}
        <div className="bg-white dark:bg-[#121829]/80 border border-slate-200 dark:border-purple-900/40 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-3 transition-colors duration-200">
          <div className="p-3 rounded-xl bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20 w-fit">
            <Volume2 className="w-5 h-5" />
          </div>
          <h4 className="text-slate-900 dark:text-white font-bold text-base">Acoustic Envelope Extraction</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Standard library wave analysis converts speech audio into RMS amplitude curves. Voice activity gating (VAD) filters silent intervals before phase comparison.
          </p>
          <div className="pt-2 border-t border-slate-200 dark:border-purple-900/30 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Audio Pipeline:</span>
            <span className="text-violet-600 dark:text-violet-400 font-semibold">RMS & Spectral Match</span>
          </div>
        </div>

        {/* Engine 3: Temporal Lag Correlation */}
        <div className="bg-white dark:bg-[#121829]/80 border border-slate-200 dark:border-purple-900/40 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-3 transition-colors duration-200">
          <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 w-fit">
            <Activity className="w-5 h-5" />
          </div>
          <h4 className="text-slate-900 dark:text-white font-bold text-base">Cross-Lag Correlation</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Computes Pearson cross-correlation across ±15 frame lag offsets. A significant desynchronization between speech energy and mouth opening indicates AI dubbing.
          </p>
          <div className="pt-2 border-t border-slate-200 dark:border-purple-900/30 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Confidence Formula:</span>
            <span className="text-indigo-600 dark:text-indigo-300 font-semibold">Weighted Naturalness</span>
          </div>
        </div>

      </div>

    </div>
  );
}
