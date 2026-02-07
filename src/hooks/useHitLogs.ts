import { useState, useCallback, useRef } from 'react';

export interface HitLog {
  id: string;
  api_name: string;
  mode: string;
  status_code: number | null;
  success: boolean;
  response_time: number | null;
  error_message: string | null;
  created_at: string;
}

const MAX_LOGS = 100;

export function useHitLogs() {
  const [logs, setLogs] = useState<HitLog[]>([]);
  const idCounter = useRef(0);

  const addLog = useCallback((log: Omit<HitLog, 'id' | 'created_at'>) => {
    idCounter.current += 1;
    const newLog: HitLog = {
      ...log,
      id: `log-${Date.now()}-${idCounter.current}`,
      created_at: new Date().toISOString(),
    };
    setLogs(prev => {
      const updated = [newLog, ...prev];
      return updated.length > MAX_LOGS ? updated.slice(0, MAX_LOGS) : updated;
    });
    return newLog;
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  const successCount = logs.filter(l => l.success).length;
  const failCount = logs.filter(l => !l.success).length;

  return { logs, addLog, clearLogs, successCount, failCount };
}
