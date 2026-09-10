import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Layers
} from 'lucide-react';

export default function Temporal() {
  const navigate = useNavigate();
  const [filterMismatchOnly, setFilterMismatchOnly] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);

  // Load latest real analysis result from localStorage
  const result = useMemo(() => {
    try {
      const stored = localStorage.getItem('latestReport');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return null;
  }, []);

  const isDeepfake = result ? (result.verdict && result.verdict.toLowerCase().includes('manipulated')) : false;

  // Process REAL minute / second timeline points directly from backend
  const timelineData = useMemo(() => {
    if (!result) return [];

    // 1. Direct real deep_analysis returned from backend ML service
    if (result.deep_analysis && Array.isArray(result.deep_analysis) && result.deep_analysis.length > 0) {
      return result.deep_analysis.map((pt) => {
        const score = Number(pt.sync_score) || 0;
        const isMismatch = pt.is_suspicious || score < 70;
        return {
          second: pt.second,
          timestamp_label: pt.timestamp_label || `00:${String(pt.second - 1).padStart(2, '0')}`,
          sync_score: Math.round(score),
          audio_integrity: Math.round(Number(pt.audio_integrity) || 0),
          visual_consistency: Math.round(Number(pt.visual_consistency) || 0),
          is_mismatch: isMismatch,
          doubt_reason: pt.doubt_reason || (isMismatch ? 'Voice and audio desynchronization detected' : 'Synchronous voice and mouth movement'),
          offset_ms: Math.abs(result.average_offset ?? 0),
        };
      });
    }

    // 2. Real raw frame_sync_scores from backend ML service grouped per second
    if (result.frame_sync_scores && Array.isArray(result.frame_sync_scores) && result.frame_sync_scores.length > 0) {
      const scores = result.frame_sync_scores;
      const fps = 30;
      const totalSec = Math.max(1, Math.ceil(scores.length / fps));
      const points = [];

      for (let s = 0; s < totalSec; s++) {
        const slice = scores.slice(s * fps, (s + 1) * fps);
        if (slice.length === 0) continue;
        const avg = Math.round(slice.reduce((a, b) => a + b, 0) / slice.length);
        const isMismatch = avg < 70;
        const mStart = Math.floor(s / 60);
        const sStart = s % 60;
        const mEnd = Math.floor((s + 1) / 60);
        const sEnd = (s + 1) % 60;
        const label = `${String(mStart).padStart(2, '0')}:${String(sStart).padStart(2, '0')} - ${String(mEnd).padStart(2, '0')}:${String(sEnd).padStart(2, '0')}`;

        points.push({
          second: s + 1,
          timestamp_label: label,
          sync_score: avg,
          audio_integrity: Math.round(result.audio_integrity_score ?? 85),
          visual_consistency: Math.round(result.visual_consistency_score ?? 85),
          is_mismatch: isMismatch,
          doubt_reason: isMismatch 
            ? `Audio-visual desync: speech formant leads/lags lip aperture (Lag: ~${Math.round(result.average_offset ?? 0)}ms).`
            : 'Natural voice-to-viseme match; audio envelope aligns with mouth aperture.',
          offset_ms: Math.abs(result.average_offset ?? 0)
        });
      }
      return points;
    }

    return [];
  }, [result]);

  const displayedTimeline = useMemo(() => {
    if (filterMismatchOnly) {
      return timelineData.filter((item) => item.is_mismatch);
    }
    return timelineData;
  }, [timelineData, filterMismatchOnly]);

  const mismatchCount = useMemo(() => {
    return timelineData.filter((item) => item.is_mismatch).length;
  }, [timelineData]);

  if (!result) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-12">
        <div className="bg-[#121829]/80 border border-purple-900/40 rounded-2xl p-12 text-center shadow-xl space-y-4">
          <AlertTriangle className="w-12 h-12 text-purple-400 mx-auto opacity-60" />
          <h2 className="text-xl font-bold text-white">No Video Analysis Performed Yet</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Please upload a video in the Dashboard and click "Run Detection". The temporal voice-audio mismatch graph will automatically be generated from your video's real frames.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all cursor-pointer shadow-lg shadow-purple-600/30"
          >
            Go to Upload Video
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Analysis Dashboard
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" /> Temporal Synchronization Graph
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Voice and audio alignment graph across every second/minute of your uploaded video.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-[#121829] border border-slate-200 dark:border-purple-900/40 p-3 rounded-2xl shadow-sm">
          <div className="text-right text-xs">
            <span className="text-slate-500 dark:text-slate-400 block">Overall Verdict:</span>
            <strong className={isDeepfake ? 'text-rose-600 dark:text-rose-400' : 'text-purple-600 dark:text-purple-300'}>
              {result.verdict} ({result.overall_confidence != null ? Number(result.overall_confidence).toFixed(1) : 0}%)
            </strong>
          </div>
        </div>
      </div>

      {/* Top Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white dark:bg-[#121829]/80 border border-slate-200 dark:border-purple-900/40 p-4 rounded-2xl shadow-sm dark:shadow-xl flex items-center gap-3.5 transition-colors duration-200">
          <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Total Duration</span>
            <p className="text-slate-900 dark:text-white font-extrabold text-base mt-0.5">
              {result.duration_seconds ? `${Number(result.duration_seconds).toFixed(1)}s` : `${timelineData.length}s`}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121829]/80 border border-slate-200 dark:border-purple-900/40 p-4 rounded-2xl shadow-sm dark:shadow-xl flex items-center gap-3.5 transition-colors duration-200">
          <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
            <VolumeX className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Voice Mismatch Points</span>
            <p className="text-rose-600 dark:text-rose-400 font-extrabold text-base mt-0.5">
              {mismatchCount} {mismatchCount === 1 ? 'Interval' : 'Intervals'} Flagged
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121829]/80 border border-slate-200 dark:border-purple-900/40 p-4 rounded-2xl shadow-sm dark:shadow-xl flex items-center gap-3.5 transition-colors duration-200">
          <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Average Audio/Visual Offset</span>
            <p className="text-indigo-600 dark:text-indigo-300 font-extrabold text-base mt-0.5">
              {result.average_offset ?? 0} ms
            </p>
          </div>
        </div>
      </div>

      {/* Main Working Graph Card */}
      <div className="w-full bg-white dark:bg-[#121829]/90 border border-slate-200 dark:border-purple-800/40 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-2xl space-y-6 transition-colors duration-200">
        
        {/* Graph Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-purple-900/40">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Voice & Audio Sync Bar Chart
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Harmonized cyber spectrogram: Violet bars (&ge; 70%) indicate synchronized speech, while plum/crimson accents denote detected desync intervals.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#090d16] p-1 rounded-xl border border-slate-200 dark:border-purple-900/30">
            <button
              onClick={() => setFilterMismatchOnly(false)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !filterMismatchOnly
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Intervals ({timelineData.length})
            </button>
            <button
              onClick={() => setFilterMismatchOnly(true)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterMismatchOnly
                  ? 'bg-purple-950/80 text-rose-300 border border-rose-500/50 shadow-md shadow-purple-950/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-300'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
              Only Mismatches ({mismatchCount})
            </button>
          </div>
        </div>

        {timelineData.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-[#090d16]/40 rounded-xl border border-slate-200 dark:border-purple-900/30 text-slate-500 dark:text-slate-400 text-xs">
            No interval data available for this video.
          </div>
        ) : (
          <div className="p-6 bg-slate-50 dark:bg-[#090d16] rounded-2xl border border-slate-200 dark:border-purple-900/40 space-y-6">
            
            {/* Graph Legend & Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Time Interval vs Lip-Sync Correlation
              </span>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300">
                  <span className="w-3 h-3 rounded bg-gradient-to-t from-purple-800 to-indigo-400 ring-1 ring-purple-400/40 shadow-[0_0_6px_rgba(168,85,247,0.4)]" /> Voice Matched (&ge; 70%)
                </span>
                <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-300">
                  <span className="w-3 h-3 rounded bg-gradient-to-t from-[#2a1334] to-rose-400 ring-1 ring-rose-400/40 shadow-[0_0_6px_rgba(244,63,94,0.3)]" /> Voice Mismatch (&lt; 70%)
                </span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* THEME-MATCHED FORENSIC BAR CHART                                          */}
            {/* ========================================================================= */}
            <div className="relative bg-gradient-to-b from-slate-100 to-slate-50 dark:from-[#0e0a24]/90 dark:via-[#0a071b] dark:to-[#070514] rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-purple-900/50 shadow-inner dark:shadow-2xl">
              
              {/* Threshold line 70% */}
              <div 
                className="absolute left-10 right-4 border-b border-dashed border-purple-400/50 dark:border-purple-500/30 pointer-events-none z-10 flex items-center justify-end"
                style={{ bottom: '170px' }}
              >
                <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300/90 bg-white/95 dark:bg-[#0c1020]/95 px-2 py-0.5 rounded border border-purple-300 dark:border-purple-500/30 shadow-sm">
                  70% Sync Threshold
                </span>
              </div>

              {/* Chart Grid with Y-Axis */}
              <div className="flex gap-4 items-end">
                
                {/* Y-Axis scale */}
                <div className="h-[200px] flex flex-col justify-between text-[10px] font-mono text-slate-500 dark:text-purple-400/60 pb-6 select-none shrink-0 text-right pr-1">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>

                {/* Bars Container */}
                <div className="flex-1 h-[220px] flex items-end gap-3 sm:gap-4 overflow-x-auto pb-6 border-b border-l border-slate-300 dark:border-purple-900/40 scrollbar-thin px-2">
                  {timelineData.map((pt, idx) => {
                    const isMismatch = pt.is_mismatch;
                    const isSelected = selectedSegment?.second === pt.second;
                    // Exact pixel height: 0 to 100% mapped onto 180px height
                    const barHeightPx = Math.max(20, Math.round((pt.sync_score / 100) * 180));

                    return (
                      <div
                        key={pt.second || idx}
                        onClick={() => setSelectedSegment(pt)}
                        className="flex-1 min-w-[48px] max-w-[70px] flex flex-col items-center justify-end cursor-pointer group relative"
                      >
                        {/* Score Tag */}
                        <span className={`text-[11px] font-bold font-mono mb-1.5 transition-transform group-hover:scale-110 ${
                          isMismatch ? 'text-rose-600 dark:text-rose-300/90 group-hover:text-rose-700 dark:group-hover:text-rose-200' : 'text-purple-700 dark:text-purple-300/90 group-hover:text-purple-800 dark:group-hover:text-purple-200'
                        }`}>
                          {pt.sync_score}%
                        </span>

                        {/* Theme-aligned Elegant Cyber Bar */}
                        <div
                          className={`w-full rounded-t-lg transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                            isMismatch
                              ? 'bg-gradient-to-t from-[#2d1235] via-[#4c1630] to-[#7f1d3f] dark:from-[#1b102b] dark:via-[#2d1235] dark:to-[#4c1630] border border-rose-300/40 dark:border-purple-500/20 border-t-2 border-t-rose-500 dark:border-t-rose-400 group-hover:border-t-rose-600 dark:group-hover:border-t-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
                              : 'bg-gradient-to-t from-[#2b2260] via-[#4338ca] to-[#6366f1] dark:from-[#130f2b] dark:via-[#1c1642] dark:to-[#2d2263] border border-purple-300/40 dark:border-purple-500/20 border-t-2 border-t-indigo-500 dark:border-t-purple-400 group-hover:border-t-indigo-600 dark:group-hover:border-t-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                          } ${isSelected ? 'ring-2 ring-purple-500 dark:ring-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-105 z-20' : ''}`}
                          style={{ height: `${barHeightPx}px` }}
                        >
                          {/* Top Illuminated Laser Cap Line */}
                          <div className={`w-full h-1 shrink-0 ${
                            isMismatch 
                              ? 'bg-gradient-to-r from-purple-400/40 via-rose-400 to-purple-400/40 shadow-[0_0_8px_rgba(251,113,133,0.7)]' 
                              : 'bg-gradient-to-r from-indigo-400/40 via-purple-300 to-indigo-400/40 shadow-[0_0_8px_rgba(168,85,247,0.7)]'
                          }`} />
                        </div>

                        {/* X-axis Label */}
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-200 mt-2 whitespace-nowrap">
                          {pt.timestamp_label.split(' - ')[0]}
                        </span>

                        {/* Tooltip on Hover */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 dark:bg-[#0f1527] border border-purple-500/60 text-white text-[11px] p-2.5 rounded-xl shadow-2xl whitespace-nowrap z-30 pointer-events-none">
                          <p className="font-bold text-purple-300">{pt.timestamp_label}</p>
                          <p className="text-slate-300">Sync Level: <strong>{pt.sync_score}%</strong></p>
                          <p className="text-slate-400">Offset Lag: <strong>{pt.offset_ms} ms</strong></p>
                          <p className={isMismatch ? 'text-rose-300 font-semibold mt-1' : 'text-purple-300 font-semibold mt-1'}>
                            {isMismatch ? '⚠️ Voice & Audio Mismatch' : '✅ Voice Synchronized'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-3 px-2">
                <span>← 0s (Video Start)</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Click on any bar to inspect interval details</span>
                <span>{result.duration_seconds ? `${Number(result.duration_seconds).toFixed(1)}s (End)` : 'End'} →</span>
              </div>
            </div>

          </div>
        )}

        {/* Selected Interval Detail Box */}
        {selectedSegment && (
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div>
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Selected Interval: {selectedSegment.timestamp_label}
              </span>
              <p className="text-slate-600 dark:text-slate-300 mt-1">{selectedSegment.doubt_reason}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-2.5 py-1 rounded font-mono font-bold ${
                selectedSegment.is_mismatch ? 'bg-rose-100 dark:bg-purple-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30' : 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-200 border border-purple-200 dark:border-purple-500/40'
              }`}>
                Sync: {selectedSegment.sync_score}%
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-200 dark:bg-black/40 text-slate-800 dark:text-slate-200 font-mono">
                Lag: {selectedSegment.offset_ms} ms
              </span>
            </div>
          </div>
        )}

        {/* Detailed Horizontal Progress Meters for Every Interval */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <VolumeX className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Interval Mismatch Telemetry ({displayedTimeline.length} intervals)
            </span>
          </h4>

          {displayedTimeline.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-[#090d16]/40 rounded-xl border border-slate-200 dark:border-purple-900/30 text-slate-500 dark:text-slate-400 text-xs">
              No voice-audio mismatch intervals found in this selection.
            </div>
          ) : (
            displayedTimeline.map((item, i) => {
              const isMismatch = item.is_mismatch;
              return (
                <div
                  key={item.second || i}
                  className={`p-4 rounded-xl border transition-all ${
                    isMismatch 
                      ? 'bg-rose-50/50 dark:bg-[#110d24]/80 border-rose-200 dark:border-purple-900/40 hover:border-rose-300 dark:hover:border-purple-700/60 shadow-sm' 
                      : 'bg-white dark:bg-[#090d16]/70 border-slate-200 dark:border-purple-900/30 hover:border-purple-200 dark:hover:border-purple-800/60 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                          {item.timestamp_label}
                        </span>
                        
                        {isMismatch ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-purple-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-500 dark:text-rose-400" />
                            Voice & Audio Mismatch
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-200 border border-purple-200 dark:border-purple-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                            Synchronous / Matched
                          </span>
                        )}

                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Offset: <strong className="text-slate-900 dark:text-white">{item.offset_ms} ms</strong>
                        </span>
                      </div>

                      <p className={`text-xs ${isMismatch ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
                        {item.doubt_reason}
                      </p>

                      {/* Visual Horizontal Bar Meter */}
                      <div className="w-full max-w-md bg-slate-200 dark:bg-purple-950/50 border border-slate-300 dark:border-purple-900/30 h-2.5 rounded-full overflow-hidden mt-2 p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isMismatch 
                              ? 'bg-gradient-to-r from-purple-800 via-purple-600 to-rose-400/80 shadow-[0_0_8px_rgba(244,63,94,0.3)]' 
                              : 'bg-gradient-to-r from-purple-600 to-indigo-400 shadow-[0_0_8px_rgba(168,85,247,0.4)]'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(5, item.sync_score))}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Match Score</span>
                      <span className={`text-lg font-extrabold font-mono ${isMismatch ? 'text-rose-600 dark:text-rose-300' : 'text-purple-700 dark:text-purple-300'}`}>
                        {item.sync_score}%
                      </span>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}
