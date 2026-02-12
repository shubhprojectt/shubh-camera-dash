import { useState, useRef, useCallback } from 'react';
import { Zap, Phone, Square, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { HitApi } from '@/hooks/useHitApis';
import { HitLog } from '@/hooks/useHitLogs';

function replacePlaceholders(text: string, phone: string): string {
  return text.replace(/\{PHONE\}/gi, phone);
}

function replaceInObj(obj: Record<string, unknown>, phone: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') result[k] = replacePlaceholders(v, phone);
    else if (typeof v === 'object' && v !== null && !Array.isArray(v)) result[k] = replaceInObj(v as Record<string, unknown>, phone);
    else result[k] = v;
  }
  return result;
}

interface QuickHitEngineProps {
  apis: HitApi[];
  onLog: (log: Omit<HitLog, 'id' | 'created_at'>) => void;
  title?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  hitButtonText?: string;
  stopButtonText?: string;
  noApisWarning?: string;
  uaRotation?: boolean;
}

async function hitSingleApi(api: HitApi, phone: string, uaRotation: boolean): Promise<{
  api_name: string;
  success: boolean;
  status_code: number | null;
  response_time: number | null;
  error_message: string | null;
  user_agent: string | null;
}> {
  const finalUrl = replacePlaceholders(api.url, phone);
  const finalHeaders: Record<string, string> = {};
  for (const [k, v] of Object.entries(api.headers)) {
    finalHeaders[replacePlaceholders(k, phone)] = replacePlaceholders(v, phone);
  }
  const finalBody = api.body && Object.keys(api.body).length > 0 ? replaceInObj(api.body, phone) : undefined;

  let urlWithParams = finalUrl;
  if (api.query_params && Object.keys(api.query_params).length > 0) {
    try {
      const url = new URL(finalUrl);
      for (const [k, v] of Object.entries(api.query_params)) {
        url.searchParams.set(replacePlaceholders(k, phone), replacePlaceholders(v, phone));
      }
      urlWithParams = url.toString();
    } catch {}
  }

  try {
    const { data, error } = await supabase.functions.invoke('hit-api', {
      body: {
        url: urlWithParams,
        method: api.method,
        headers: finalHeaders,
        body: finalBody,
        bodyType: api.bodyType,
        uaRotation,
      },
    });
    if (error) throw error;
    return {
      api_name: api.name,
      success: data?.success ?? false,
      status_code: data?.status_code ?? null,
      response_time: data?.response_time ?? 0,
      error_message: data?.error_message ?? null,
      user_agent: data?.user_agent_used ?? null,
    };
  } catch (err) {
    return {
      api_name: api.name,
      success: false,
      status_code: null,
      response_time: 0,
      error_message: err instanceof Error ? err.message : 'Unknown error',
      user_agent: null,
    };
  }
}

export default function QuickHitEngine({
  apis,
  onLog,
  title = 'HIT ENGINE',
  phoneLabel = 'Phone Number',
  phonePlaceholder = '91XXXXXXXXXX',
  hitButtonText = 'START',
  stopButtonText = 'STOP',
  noApisWarning = 'Admin me APIs add karo.',
  uaRotation = true,
}: QuickHitEngineProps) {
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [isRunning1, setIsRunning1] = useState(false);
  const [isRunning2, setIsRunning2] = useState(false);
  const [stats1, setStats1] = useState({ rounds: 0, hits: 0, success: 0, fails: 0 });
  const [stats2, setStats2] = useState({ rounds: 0, hits: 0, success: 0, fails: 0 });
  const stopRef1 = useRef(false);
  const stopRef2 = useRef(false);

  const enabledApis = apis.filter(a => a.enabled);

  // INPUT 1: Sequential - ek ek API fire hoti hai, pahle jaisi
  const runSequential = useCallback(async () => {
    if (phone1.length < 10 || enabledApis.length === 0) return;
    setIsRunning1(true);
    stopRef1.current = false;
    setStats1({ rounds: 0, hits: 0, success: 0, fails: 0 });

    let round = 0;
    while (!stopRef1.current) {
      round++;
      setStats1(prev => ({ ...prev, rounds: round }));

      for (const api of enabledApis) {
        if (stopRef1.current) break;
        const r = await hitSingleApi(api, phone1, uaRotation);
        if (stopRef1.current) break;

        onLog({
          api_name: r.api_name,
          mode: 'SERVER',
          status_code: r.status_code,
          success: r.success,
          response_time: r.response_time,
          error_message: r.error_message,
          user_agent: r.user_agent,
        });
        setStats1(prev => ({
          ...prev,
          hits: prev.hits + 1,
          success: prev.success + (r.success ? 1 : 0),
          fails: prev.fails + (r.success ? 0 : 1),
        }));
      }
    }
    setIsRunning1(false);
  }, [enabledApis, onLog, uaRotation, phone1]);

  // INPUT 2: Parallel - saari APIs ek saath fire hoti hain, stop turant kaam karta hai
  const runParallel = useCallback(async () => {
    if (phone2.length < 10 || enabledApis.length === 0) return;
    setIsRunning2(true);
    stopRef2.current = false;
    setStats2({ rounds: 0, hits: 0, success: 0, fails: 0 });

    let round = 0;
    while (!stopRef2.current) {
      round++;
      setStats2(prev => ({ ...prev, rounds: round }));

      // Har API independent hai - stop hote hi pending results ignore ho jaate hain
      const settled = await Promise.allSettled(
        enabledApis.map(async (api) => {
          if (stopRef2.current) return null;
          const r = await hitSingleApi(api, phone2, uaRotation);
          if (stopRef2.current) return null;
          // Turant UI update - wait nahi karta doosri APIs ka
          onLog({
            api_name: r.api_name,
            mode: 'SERVER',
            status_code: r.status_code,
            success: r.success,
            response_time: r.response_time,
            error_message: r.error_message,
            user_agent: r.user_agent,
          });
          setStats2(prev => ({
            ...prev,
            hits: prev.hits + 1,
            success: prev.success + (r.success ? 1 : 0),
            fails: prev.fails + (r.success ? 0 : 1),
          }));
          return r;
        })
      );

      if (stopRef2.current) break;
    }
    setIsRunning2(false);
  }, [enabledApis, onLog, uaRotation, phone2]);

  const renderStats = (stats: { rounds: number; hits: number; success: number; fails: number }, isRunning: boolean) => {
    if (!isRunning) return null;
    return (
      <div className="grid grid-cols-4 gap-1.5 text-center">
        {[
          { label: 'Round', value: stats.rounds, color: 'text-white/80' },
          { label: 'Hits', value: stats.hits, color: 'text-blue-400' },
          { label: 'OK', value: stats.success, color: 'text-emerald-400' },
          { label: 'Fail', value: stats.fails, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <p className="text-[8px] text-white/30">{s.label}</p>
            <p className={`text-xs font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <h2 className="text-sm font-semibold text-white tracking-tight">{title}</h2>
        </div>
        {enabledApis.length > 0 && (
          <span className="h-5 px-2 rounded-full bg-white/[0.06] text-white/50 text-[9px] font-medium flex items-center">
            {enabledApis.length} APIs
          </span>
        )}
      </div>

      {enabledApis.length === 0 && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/[0.1]">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400/70" />
          <p className="text-[10px] text-white/40">{noApisWarning}</p>
        </div>
      )}

      {/* INPUT 1 - Sequential */}
      <div className="space-y-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[9px] font-bold text-white/40 tracking-wider">INPUT 1 — SEQUENTIAL</span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-white/30 flex-shrink-0" />
            <Input
              value={phone1}
              onChange={e => setPhone1(e.target.value.replace(/[^0-9+]/g, ''))}
              placeholder={phonePlaceholder}
              className="h-9 bg-white/[0.04] border-white/[0.08] text-white text-xs placeholder:text-white/15 focus:border-violet-500/40"
              disabled={isRunning1}
            />
          </div>
          {!isRunning1 ? (
            <button
              onClick={runSequential}
              disabled={phone1.length < 10 || enabledApis.length === 0}
              className="h-9 px-4 rounded-lg text-[10px] font-bold bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:opacity-90 active:scale-[0.97] disabled:opacity-30 transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3 h-3" /> {hitButtonText}
            </button>
          ) : (
            <button
              onClick={() => { stopRef1.current = true; }}
              className="h-9 px-4 rounded-lg text-[10px] font-bold bg-red-600 text-white hover:bg-red-700 active:scale-[0.97] transition-all flex items-center gap-1.5"
            >
              <Square className="w-3 h-3" /> {stopButtonText}
            </button>
          )}
        </div>
        {renderStats(stats1, isRunning1)}
      </div>

      {/* INPUT 2 - Parallel */}
      <div className="space-y-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span className="text-[9px] font-bold text-white/40 tracking-wider">INPUT 2 — PARALLEL</span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-white/30 flex-shrink-0" />
            <Input
              value={phone2}
              onChange={e => setPhone2(e.target.value.replace(/[^0-9+]/g, ''))}
              placeholder={phonePlaceholder}
              className="h-9 bg-white/[0.04] border-white/[0.08] text-white text-xs placeholder:text-white/15 focus:border-violet-500/40"
              disabled={isRunning2}
            />
          </div>
          {!isRunning2 ? (
            <button
              onClick={runParallel}
              disabled={phone2.length < 10 || enabledApis.length === 0}
              className="h-9 px-4 rounded-lg text-[10px] font-bold bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:opacity-90 active:scale-[0.97] disabled:opacity-30 transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3 h-3" /> {hitButtonText}
            </button>
          ) : (
            <button
              onClick={() => { stopRef2.current = true; }}
              className="h-9 px-4 rounded-lg text-[10px] font-bold bg-red-600 text-white hover:bg-red-700 active:scale-[0.97] transition-all flex items-center gap-1.5"
            >
              <Square className="w-3 h-3" /> {stopButtonText}
            </button>
          )}
        </div>
        {renderStats(stats2, isRunning2)}
      </div>
    </div>
  );
}
