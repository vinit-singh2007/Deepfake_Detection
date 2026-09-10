import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  Activity, 
  ChevronRight,
  Loader2,
  FileVideo,
  X,
  Play
} from 'lucide-react';
import { analyzeVideo } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [pipelineProgress, setPipelineProgress] = useState({
    face: false,
    mouth: false,
    lip: false,
    audio: false,
    percent: 0,
    currentSec: 0,
    totalSec: 32.1,
  });

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const formatTimecode = (sec) => {
    const s = Math.max(0, Number(sec) || 0);
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    const ms = Math.floor((s % 1) * 100);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  const getBlockBar = (percent) => {
    const totalBlocks = 16;
    const filledBlocks = Math.min(totalBlocks, Math.max(0, Math.round((percent / 100) * totalBlocks)));
    const emptyBlocks = totalBlocks - filledBlocks;
    return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setError('');
      setResult(null);
      localStorage.removeItem('latestReport');

      // Clean up previous preview URL to prevent memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const newUrl = URL.createObjectURL(selected);
      setPreviewUrl(newUrl);

      // Detect video duration for realistic frame timecode ticker
      try {
        const vid = document.createElement('video');
        vid.preload = 'metadata';
        vid.src = newUrl;
        vid.onloadedmetadata = () => {
          if (vid.duration && !isNaN(vid.duration) && vid.duration > 0) {
            setPipelineProgress((prev) => ({ ...prev, totalSec: vid.duration }));
          }
        };
      } catch {
        // fallback to default
      }
    }
  };

  const handleRemoveVideo = () => {
    if (loading) return;
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setError('');
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRunDetection = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    // Reset pipeline checklist
    setPipelineProgress((prev) => ({
      ...prev,
      face: false,
      mouth: false,
      lip: false,
      audio: false,
      percent: 0,
      currentSec: 0,
    }));

    // Start animated telemetry ticker
    const startTime = Date.now();
    const estDuration = 3800;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(95, Math.floor((elapsed / estDuration) * 95));

      setPipelineProgress((prev) => {
        const total = prev.totalSec || 32.1;
        const curSec = Math.min(total, (progress / 100) * total);
        return {
          ...prev,
          percent: progress,
          currentSec: curSec,
          face: progress >= 16,
          mouth: progress >= 40,
          lip: progress >= 66,
          audio: progress >= 85,
        };
      });
    }, 60);

    try {
      const data = await analyzeVideo(file);
      clearInterval(interval);

      const finalSec = data.duration_seconds || pipelineProgress.totalSec || 32.1;
      setPipelineProgress({
        face: true,
        mouth: true,
        lip: true,
        audio: true,
        percent: 100,
        currentSec: finalSec,
        totalSec: finalSec,
      });

      // Brief pause so user sees 100% completed checklist
      await new Promise((r) => setTimeout(r, 400));

      setResult(data);
      localStorage.setItem('latestReport', JSON.stringify(data));
    } catch (err) {
      clearInterval(interval);
      setError(err.message || 'Detection failed. Please make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const isDeepfake = result ? (result.verdict && result.verdict.toLowerCase().includes('manipulated')) : false;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 transition-colors duration-200">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Deepfake Analysis Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Upload a video file to run frame-by-frame lip-sync and landmark verification.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-xs underline hover:text-red-500 cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. UPLOAD VIDEO SECTION (FULL WIDTH)                                      */}
      {/* ========================================================================= */}
      <div className="w-full bg-white dark:bg-[#121829]/80 border border-slate-200 dark:border-purple-900/40 rounded-2xl p-6 shadow-sm dark:shadow-xl flex flex-col justify-between transition-colors duration-200">
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2">
            <Video className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Upload Video
          </h3>

          {!file || !previewUrl ? (
            <label className="border-2 border-dashed border-purple-200 dark:border-purple-900/50 hover:border-purple-500 dark:hover:border-purple-500/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-purple-50/30 dark:bg-[#090d16]/50 transition-all group">
              <div className="p-4 rounded-2xl bg-purple-100 dark:bg-purple-600/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform mb-3">
                <Video className="w-8 h-8" />
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Click or Drag video here
              </span>
              <span className="text-xs text-slate-500 mt-1">MP4, MOV, AVI, MKV, or WEBM (Max 50MB)</span>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="video/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Video Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 shrink-0">
                    <FileVideo className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || 'video/mp4'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/50 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    Change Video
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleRemoveVideo}
                    className="p-1.5 rounded-xl text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all cursor-pointer disabled:opacity-50"
                    title="Remove selected video"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Video Player Preview Box */}
              <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-200 dark:border-purple-900/50 shadow-md flex items-center justify-center max-h-[380px]">
                <video
                  key={previewUrl}
                  src={previewUrl}
                  controls
                  playsInline
                  className="w-full max-h-[380px] object-contain rounded-2xl bg-black"
                />
              </div>

              {/* Hidden file input for changing video */}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="video/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* LIVE FORENSIC TELEMETRY PIPELINE (DIRECTLY ABOVE BUTTON)              */}
        {/* ===================================================================== */}
        {loading && (
          <div className="mt-5 p-5 rounded-2xl bg-slate-50 dark:bg-[#0a0d1c] border border-purple-200 dark:border-purple-500/40 shadow-md dark:shadow-2xl font-mono text-xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-purple-100 dark:border-purple-900/50 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white tracking-wider uppercase">Live Telemetry Pipeline</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-[10px] font-semibold">
                MediaPipe • SyncNet
              </span>
            </div>

            {/* Checklist Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                { label: 'FACE DETECTED', active: pipelineProgress.face },
                { label: 'MOUTH DETECTED', active: pipelineProgress.mouth },
                { label: 'LIP TRACKING', active: pipelineProgress.lip },
                { label: 'AUDIO EXTRACTED', active: pipelineProgress.audio },
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all duration-300 ${
                    item.active 
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 shadow-sm' 
                      : 'bg-white dark:bg-slate-900/70 border-slate-200 dark:border-purple-900/30 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <span className="font-semibold tracking-wide text-[11px]">
                    {item.label}
                  </span>
                  {item.active ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm flex items-center gap-1">
                      ✓
                    </span>
                  ) : (
                    <Loader2 className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400/60 animate-spin" />
                  )}
                </div>
              ))}
            </div>

            {/* TEMPORAL ANALYSIS ASCII Block Bar */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#070914] border border-purple-100 dark:border-purple-900/40 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase text-[11px]">
                  TEMPORAL ANALYSIS
                </span>
                <span className="font-bold text-purple-700 dark:text-purple-300 text-sm">
                  {pipelineProgress.percent}%
                </span>
              </div>
              
              {/* ASCII Block Bar */}
              <div className="text-sm tracking-wider font-mono select-none overflow-hidden text-ellipsis whitespace-nowrap">
                <span className="text-purple-600 dark:text-purple-300 font-extrabold">{getBlockBar(pipelineProgress.percent)}</span>
                <span className="text-purple-700 dark:text-purple-300 font-bold ml-2">{pipelineProgress.percent}%</span>
              </div>

              {/* Progress bar line */}
              <div className="w-full bg-slate-100 dark:bg-purple-950/60 border border-slate-200 dark:border-purple-900/40 h-2 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-400 transition-all duration-150 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                  style={{ width: `${pipelineProgress.percent}%` }}
                />
              </div>
            </div>

            {/* CURRENT FRAME */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-white dark:bg-[#070914] border border-purple-100 dark:border-purple-900/40 shadow-sm text-[11px]">
              <span className="font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                CURRENT FRAME
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-purple-700 dark:text-purple-200 font-extrabold text-sm bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded border border-purple-200 dark:border-purple-800/40">
                  {formatTimecode(pipelineProgress.currentSec)} / {formatTimecode(pipelineProgress.totalSec)}
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400/80 font-mono hidden sm:inline">
                  [30 FPS Scan]
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleRunDetection}
          disabled={!file || loading}
          className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Video...
            </>
          ) : (
            'Run Detection'
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. DETECTION RESULTS & DECISION (FULL WIDTH, UNDERNEATH)                   */}
      {/* ========================================================================= */}
      <div className="w-full bg-white dark:bg-[#121829]/80 border border-slate-200 dark:border-purple-900/40 rounded-2xl p-6 shadow-sm dark:shadow-xl flex flex-col justify-between transition-colors duration-200">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 dark:text-white font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Detection Results & Decision
            </h3>
            {result && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 font-medium">
                Analysis Complete
              </span>
            )}
          </div>

          {result ? (
            <div className="space-y-4">
              {/* Decision Badge Card */}
              <div className={`p-6 rounded-xl border flex flex-col items-center text-center ${isDeepfake ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300' : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300'}`}>
                {isDeepfake ? <AlertTriangle className="w-12 h-12 mb-2 text-rose-500 dark:text-rose-400" /> : <ShieldCheck className="w-12 h-12 mb-2 text-emerald-500 dark:text-emerald-400" />}
                <h4 className="text-lg font-bold">{isDeepfake ? 'Deepfake Detected!' : 'Authentic Video Verified'}</h4>
                <p className="text-xs mt-1 font-semibold">Verdict: {result.verdict}</p>
                <p className="text-xs mt-0.5">Confidence Score: {result.overall_confidence != null ? Number(result.overall_confidence).toFixed(2) : 0}%</p>
              </div>

              {/* Forensic Metrics Grid - Purely Dynamic Backend Values */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 dark:bg-[#090d16]/60 p-3.5 rounded-xl border border-slate-200 dark:border-purple-900/30">
                  <p className="text-slate-500 dark:text-slate-400">Audio/Visual Offset</p>
                  <p className="text-slate-900 dark:text-white font-bold text-sm mt-1">{result.average_offset ?? 0} ms</p>
                </div>
                <div className="bg-slate-50 dark:bg-[#090d16]/60 p-3.5 rounded-xl border border-slate-200 dark:border-purple-900/30">
                  <p className="text-slate-500 dark:text-slate-400">Frames Analyzed</p>
                  <p className="text-slate-900 dark:text-white font-bold text-sm mt-1">{result.frames_analyzed ?? 0}</p>
                </div>
                {result.audio_integrity_score != null && (
                  <div className="bg-slate-50 dark:bg-[#090d16]/60 p-3.5 rounded-xl border border-slate-200 dark:border-purple-900/30">
                    <p className="text-slate-500 dark:text-slate-400">Voice Integrity</p>
                    <p className="text-slate-900 dark:text-white font-bold text-sm mt-1">{Math.round(result.audio_integrity_score)}%</p>
                  </div>
                )}
                {result.lip_sync_score != null && (
                  <div className="bg-slate-50 dark:bg-[#090d16]/60 p-3.5 rounded-xl border border-slate-200 dark:border-purple-900/30">
                    <p className="text-slate-500 dark:text-slate-400">Lip-Sync Accuracy</p>
                    <p className="text-slate-900 dark:text-white font-bold text-sm mt-1">{Math.round(result.lip_sync_score)}%</p>
                  </div>
                )}
                {result.duration_seconds != null && (
                  <div className="bg-slate-50 dark:bg-[#090d16]/60 p-3.5 rounded-xl border border-slate-200 dark:border-purple-900/30">
                    <p className="text-slate-500 dark:text-slate-400">Duration</p>
                    <p className="text-slate-900 dark:text-white font-bold text-sm mt-1">{Number(result.duration_seconds).toFixed(1)}s</p>
                  </div>
                )}
              </div>

              {/* Deep Analysis Button -> Navigates to Temporal Page */}
              <div className="pt-2">
                <button
                  onClick={() => navigate('/dashboard/temporal')}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/20 transition-all flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <Activity className="w-4 h-4 text-purple-200 animate-pulse" />
                  <span>Deep Analysis (Temporal Breakdown)</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                    View Mismatch Graph →
                  </span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          ) : (
            <div className="border border-slate-200 dark:border-purple-900/30 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-[#090d16]/30 h-64">
              <ShieldCheck className="w-10 h-10 text-purple-400/40 mb-3" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No analysis performed yet</p>
              <p className="text-xs text-slate-500 mt-1">Select a video and click "Run Detection"</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}