import { useState } from 'react';
import { HitLog } from '@/hooks/useHitLogs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, Trash2, ChevronDown, ChevronRight, Globe } from 'lucide-react';

interface LogsPanelProps {
  logs: HitLog[];
  onClear: () => void;
}

function getBrowserName(ua: string | null): string {
  if (!ua) return '??';
  if (ua.includes('Brave')) return 'Brave';
  if (ua.includes('Vivaldi')) return 'Vivaldi';
  if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Chrome')) return 'Chrome';
  return 'Other';
}

function getPlatform(ua: string | null): string {
  if (!ua) return '';
  if (ua.includes('iPhone')) return '📱iPhone';
  if (ua.includes('Android')) return '📱Android';
  if (ua.includes('Windows')) return '💻Win';
  if (ua.includes('Macintosh') || ua.includes('Mac OS')) return '💻Mac';
  if (ua.includes('Linux')) return '💻Linux';
  return '';
}

export default function LogsPanel({ logs, onClear }: LogsPanelProps) {
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-white/40" />
          <span className="text-xs font-medium text-white/60">Logs</span>
          {logs.length > 0 && (
            <span className="text-[10px] text-white/25">({logs.length})</span>
          )}
        </div>
        {logs.length > 0 && (
          <button onClick={onClear} className="text-white/20 hover:text-red-400/70 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <ScrollArea className="h-48">
        <div className="p-3 space-y-0.5">
          {logs.length === 0 ? (
            <div className="text-center py-10">
              <Terminal className="w-8 h-8 text-white/[0.06] mx-auto mb-2" />
              <p className="text-[11px] text-white/20">No logs yet</p>
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id}>
                <div 
                  className="flex items-center gap-2 text-[10px] cursor-pointer hover:bg-white/[0.03] rounded-md px-2 py-1 transition-colors"
                  onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                >
                  {log.user_agent ? (
                    expandedLog === log.id 
                      ? <ChevronDown className="w-3 h-3 text-white/20 flex-shrink-0" /> 
                      : <ChevronRight className="w-3 h-3 text-white/20 flex-shrink-0" />
                  ) : <span className="w-3" />}
                  <span className="text-white/20 tabular-nums">{new Date(log.created_at).toLocaleTimeString()}</span>
                  <span className={`font-medium ${log.success ? 'text-emerald-400/80' : 'text-red-400/80'}`}>
                    [{log.status_code || 'ERR'}]
                  </span>
                  <span className="text-white/50 truncate">{log.api_name}</span>
                  {log.user_agent && (
                    <span className="text-violet-400/60 flex items-center gap-0.5 flex-shrink-0">
                      <Globe className="w-2.5 h-2.5" />
                      {getBrowserName(log.user_agent)} {getPlatform(log.user_agent)}
                    </span>
                  )}
                  {log.response_time != null && (
                    <span className="text-white/20 flex-shrink-0">{log.response_time}ms</span>
                  )}
                </div>
                {expandedLog === log.id && log.user_agent && (
                  <div className="ml-7 mt-0.5 mb-1 px-2 py-1.5 rounded-lg bg-white/[0.02] border border-violet-500/[0.1]">
                    <p className="text-[9px] text-violet-300/50 break-all flex items-start gap-1">
                      <Globe className="w-3 h-3 flex-shrink-0 mt-0.5" />
                      {log.user_agent}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
