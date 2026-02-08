import { useState, useRef, useCallback } from 'react';
import { Zap, Phone, Clock, Timer, Square, Loader2, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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

interface HitEngineProps {
  apis: HitApi[];
  onLog: (log: Omit<HitLog, 'id' | 'created_at'>) => void;
  residentialProxyUrl?: string;
  uaRotationEnabled?: boolean;
}

export default function HitEngine({ apis, onLog, residentialProxyUrl, uaRotationEnabled = true }: HitEngineProps) {
  const [phone, setPhone] = useState('');
  const [delay, setDelay] = useState(500);
  const [maxRounds, setMaxRounds] = useState(1);
  const [useProxy, setUseProxy] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [currentApi, setCurrentApi] = useState('');
  const [stats, setStats] = useState({ rounds: 0, hits: 0, success: 0, fails: 0 });
  const stopRef = useRef(false);

  const enabledApis = apis.filter(a => a.enabled);

  const hitApi = useCallback(async (api: HitApi, phoneNumber: string) => {
    const finalUrl = replacePlaceholders(api.url, phoneNumber);
    const finalHeaders: Record<string, string> = {};
    for (const [k, v] of Object.entries(api.headers)) {
      finalHeaders[replacePlaceholders(k, phoneNumber)] = replacePlaceholders(v, phoneNumber);
    }
    const finalBody = api.body && Object.keys(api.body).length > 0 ? replaceInObj(api.body, phoneNumber) : undefined;

    let urlWithParams = finalUrl;
    if (api.query_params && Object.keys(api.query_params).length > 0) {
      const url = new URL(finalUrl);
      for (const [k, v] of Object.entries(api.query_params)) {
        url.searchParams.set(replacePlaceholders(k, phoneNumber), replacePlaceholders(v, phoneNumber));
      }
      urlWithParams = url.toString();
    }

    try {
      const { data, error } = await supabase.functions.invoke('hit-api', {
        body: {
          url: urlWithParams,
          method: api.method,
          headers: finalHeaders,
          body: finalBody,
          bodyType: api.bodyType,
          useProxy: useProxy || api.proxy_enabled,
          useResidentialProxy: api.residential_proxy_enabled,
          residentialProxyUrl: api.residential_proxy_enabled ? residentialProxyUrl : undefined,
          uaRotation: uaRotationEnabled,
        },
      });

      if (error) throw error;
      return {
        success: data?.success ?? false,
        status_code: data?.status_code ?? null,
        response_time: data?.response_time ?? 0,
        error_message: data?.error_message ?? null,
        user_agent_used: data?.user_agent_used ?? null,
      };
    } catch (err) {
      return {
        success: false, status_code: null, response_time: 0,
        error_message: err instanceof Error ? err.message : 'Unknown error',
        user_agent_used: null,
      };
    }
  }, [useProxy, residentialProxyUrl, uaRotationEnabled]);

  const start = useCallback(async () => {
    if (phone.length < 10 || enabledApis.length === 0) return;
    setIsRunning(true);
    stopRef.current = false;
    setStats({ rounds: 0, hits: 0, success: 0, fails: 0 });

    for (let round = 1; round <= maxRounds; round++) {
      if (stopRef.current) break;
      setStats(prev => ({ ...prev, rounds: round }));

      for (const api of enabledApis) {
        if (stopRef.current) break;
        setCurrentApi(api.name);

        const result = await hitApi(api, phone);
        setStats(prev => ({
          ...prev, hits: prev.hits + 1,
          success: prev.success + (result.success ? 1 : 0),
          fails: prev.fails + (result.success ? 0 : 1),
        }));

        onLog({
          api_name: api.name, mode: 'SERVER',
          status_code: result.status_code, success: result.success,
          response_time: result.response_time, error_message: result.error_message,
          user_agent: result.user_agent_used || null,
        });

        if (delay > 0 && !stopRef.current) {
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }
    setIsRunning(false);
    setCurrentApi('');
  }, [phone, delay, maxRounds, enabledApis, hitApi, onLog]);

  const stop = useCallback(() => { stopRef.current = true; }, []);

  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-5 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
          <Zap className="w-4 h-4 text-emerald-400" />
        </div>
        <h2 className="text-sm font-semibold text-white tracking-tight">HIT ENGINE</h2>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-medium text-white/40 flex items-center gap-1.5">
          <Phone className="w-3 h-3" /> Phone Number
        </label>
        <Input value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9+]/g, ''))} placeholder="9876543210"
          className="h-11 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/15 focus:border-violet-500/40" disabled={isRunning} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-white/40 flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> Delay (ms)
          </label>
          <Input type="number" value={delay} onChange={e => setDelay(Number(e.target.value))} min={0} max={5000}
            className="h-10 bg-white/[0.04] border-white/[0.08] text-white/80 focus:border-violet-500/40" disabled={isRunning} />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-white/40 flex items-center gap-1.5">
            <Timer className="w-3 h-3" /> Rounds
          </label>
          <Input type="number" value={maxRounds} onChange={e => setMaxRounds(Number(e.target.value))} min={1} max={999}
            className="h-10 bg-white/[0.04] border-white/[0.08] text-white/80 focus:border-violet-500/40" disabled={isRunning} />
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <div>
          <p className="text-xs font-medium text-white/70">Free Proxy</p>
          <p className="text-[10px] text-white/25">Route through CORS proxies</p>
        </div>
        <Switch checked={useProxy} onCheckedChange={setUseProxy} disabled={isRunning} />
      </div>

      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <div className="text-center flex-1">
          <p className="text-[9px] text-white/25">APIs</p>
          <p className="text-sm font-semibold text-blue-400">{enabledApis.length}</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-[9px] text-white/25 flex items-center justify-center gap-1"><Shield className="w-2.5 h-2.5" /> Mode</p>
          <p className="text-sm font-semibold text-emerald-400">SERVER</p>
        </div>
        {!isRunning ? (
          <button onClick={start} disabled={phone.length < 10 || enabledApis.length === 0}
            className="ml-auto h-10 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium disabled:opacity-30 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2">
            <Zap className="w-4 h-4" /> START
          </button>
        ) : (
          <button onClick={stop}
            className="ml-auto h-10 px-6 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 active:scale-[0.98] transition-all flex items-center gap-2">
            <Square className="w-4 h-4" /> STOP
          </button>
        )}
      </div>

      {isRunning && (
        <>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: 'Round', value: `${stats.rounds}/${maxRounds}`, color: 'text-white/80' },
              { label: 'Hits', value: stats.hits, color: 'text-blue-400' },
              { label: 'OK', value: stats.success, color: 'text-emerald-400' },
              { label: 'Fail', value: stats.fails, color: 'text-red-400' },
            ].map(s => (
              <div key={s.label} className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[9px] text-white/25">{s.label}</p>
                <p className={`text-sm font-semibold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          {currentApi && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/[0.06] border border-violet-500/[0.1]">
              <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin" />
              <span className="text-[11px] text-white/50 truncate">{currentApi}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
