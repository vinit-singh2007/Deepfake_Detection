import React, { useEffect, useState } from 'react';
import { History as HistoryIcon, Clock, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { getAnalysisHistory } from '../services/api';
import LockedGate from '../components/LockedGate';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        let data = await getAnalysisHistory();
        // If API returned empty but user has a fresh latestReport in localStorage, show it
        if ((!data || data.length === 0)) {
          const rawLocal = localStorage.getItem('latestReport');
          if (rawLocal) {
            try {
              const parsed = JSON.parse(rawLocal);
              if (parsed && (parsed.verdict || parsed.overall_confidence)) {
                data = [parsed];
              }
            } catch {
              // ignore
            }
          }
        }
        setHistory(data || []);
      } catch (err) {
        console.error('Failed to fetch history:', err);
        // Fallback to local report if API errored
        const rawLocal = localStorage.getItem('latestReport');
        if (rawLocal) {
          try {
            const parsed = JSON.parse(rawLocal);
            if (parsed && (parsed.verdict || parsed.overall_confidence)) {
              setHistory([parsed]);
            }
          } catch {
            // ignore
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#121829]/80 border border-purple-900/40 rounded-2xl p-12 shadow-xl flex flex-col items-center justify-center text-center max-w-xl mx-auto my-12">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-2" />
        <p className="text-xs text-slate-400">Loading analysis history...</p>
      </div>
    );
  }

  // If no past scans found -> Locked Gate for new users
  if (history.length === 0) {
    return <LockedGate pageTitle="Analysis History" />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300 transition-colors duration-200">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Analysis History</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review past video scans and forensic detection logs.</p>
      </div>

      <div className="bg-white dark:bg-[#121829]/80 border border-slate-200 dark:border-purple-900/40 rounded-2xl p-6 shadow-sm dark:shadow-xl overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-purple-900/40 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="pb-3 px-4">Filename</th>
                <th className="pb-3 px-4">Verdict</th>
                <th className="pb-3 px-4">Confidence</th>
                <th className="pb-3 px-4">Avg Offset</th>
                <th className="pb-3 px-4">Frames</th>
                <th className="pb-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-purple-950/60 text-slate-700 dark:text-slate-200">
              {history.map((item, idx) => {
                const isDeepfake = item.verdict && item.verdict.toLowerCase().includes('manipulated');
                return (
                  <tr key={item.analysis_id || idx} className="hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="truncate max-w-[180px]">{item.filename || 'Uploaded Video'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${isDeepfake ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'}`}>
                        {isDeepfake ? <AlertTriangle className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                        {item.verdict || 'Real'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {item.overall_confidence != null ? `${Number(item.overall_confidence).toFixed(1)}%` : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {item.average_offset ?? 0} ms
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {item.frames_analyzed ?? 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}