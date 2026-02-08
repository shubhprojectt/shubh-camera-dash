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
    <div className="rounded-xl border border-pink-500/30 bg-gray-950/80 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-pink-500/20">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-cyan-400 font-mono">LOGS</span>
        </div>
        {logs.length > 0 && (
          <button onClick={onClear} className="text-red-400 hover:text-red-300 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <ScrollArea className="h-48">
        <div className="p-4 space-y-1.5">
          {logs.length === 0 ? (
            <div className="text-center py-8">
              <Terminal className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-mono">Koi log nahi. API hit karo.</p>
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id}>
                <div 
                  className="flex items-center gap-2 text-[10px] font-mono cursor-pointer hover:bg-gray-800/50 rounded px-1 py-0.5"
                  onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                >
                  {log.user_agent ? (
                    expandedLog === log.id ? <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" /> : <ChevronRight className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  ) : <span className="w-3" />}
                  <span className="text-gray-600">{new Date(log.created_at).toLocaleTimeString()}</span>
                  <span className={log.success ? 'text-green-400' : 'text-red-400'}>
                    [{log.status_code || 'ERR'}]
                  </span>
                  <span className="text-cyan-300 truncate">{log.api_name}</span>
                  {log.user_agent && (
                    <span className="text-purple-400 flex items-center gap-0.5 flex-shrink-0">
                      <Globe className="w-2.5 h-2.5" />
                      {getBrowserName(log.user_agent)} {getPlatform(log.user_agent)}
                    </span>
                  )}
                  {log.response_time != null && (
                    <span className="text-gray-500">{log.response_time}ms</span>
                  )}
                  {log.error_message && (
                    <span className="text-red-400 truncate">{log.error_message}</span>
                  )}
                </div>
                {expandedLog === log.id && log.user_agent && (
                  <div className="ml-6 mt-1 mb-1 px-2 py-1.5 rounded bg-gray-800/80 border border-purple-500/20">
                    <p className="text-[9px] text-purple-300 font-mono break-all">
                      <Globe className="w-3 h-3 inline mr-1" />
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
