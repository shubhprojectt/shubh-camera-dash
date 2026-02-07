import { HitLog } from '@/hooks/useHitLogs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, Trash2 } from 'lucide-react';

interface LogsPanelProps {
  logs: HitLog[];
  onClear: () => void;
}

export default function LogsPanel({ logs, onClear }: LogsPanelProps) {
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
              <div key={log.id} className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-gray-600">{new Date(log.created_at).toLocaleTimeString()}</span>
                <span className={log.success ? 'text-green-400' : 'text-red-400'}>
                  [{log.status_code || 'ERR'}]
                </span>
                <span className="text-cyan-300 truncate">{log.api_name}</span>
                {log.response_time != null && (
                  <span className="text-gray-500">{log.response_time}ms</span>
                )}
                {log.error_message && (
                  <span className="text-red-400 truncate">{log.error_message}</span>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
