import { useState, useRef, useCallback } from 'react';
import { Zap, Phone, Clock, Square, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
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
}

export default function QuickHitEngine({
  apis,
  onLog,
  title = 'QUICK HIT',
  phoneLabel = 'Phone Number',
  phonePlaceholder = '91XXXXXXXXXX',
  hitButtonText = 'START',
  stopButtonText = 'STOP',
  noApisWarning = 'Admin me APIs add karo.',
}: QuickHitEngineProps) {
  const [phone, setPhone] = useState('');
  const [delay, setDelay] = useState(0);
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

    // Add query params
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
          useProxy: api.proxy_enabled,
          useResidentialProxy: api.residential_proxy_enabled,
        },
      });

      if (error) throw error;

      return {
        success: data?.success ?? false,
        status_code: data?.status_code ?? null,
        response_time: data?.response_time ?? 0,
        error_message: data?.error_message ?? null,
      };
    } catch (err) {
      return {
        success: false,
        status_code: null,
        response_time: 0,
        error_message: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }, []);

  const start = useCallback(async () => {
    if (phone.length < 10 || enabledApis.length === 0) return;
    setIsRunning(true);
    stopRef.current = false;
    setStats({ rounds: 0, hits: 0, success: 0, fails: 0 });

    let round = 0;
    // Continuous looping for public
    while (!stopRef.current) {
      round++;
      setStats(prev => ({ ...prev, rounds: round }));

      for (const api of enabledApis) {
        if (stopRef.current) break;
        setCurrentApi(api.name);

        const result = await hitApi(api, phone);
        
        setStats(prev => ({
          ...prev,
          hits: prev.hits + 1,
          success: prev.success + (result.success ? 1 : 0),
          fails: prev.fails + (result.success ? 0 : 1),
        }));

        onLog({
          api_name: api.name,
          mode: 'SERVER',
          status_code: result.status_code,
          success: result.success,
          response_time: result.response_time,
          error_message: result.error_message,
        });

        if (delay > 0 && !stopRef.current) {
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }
    setIsRunning(false);
    setCurrentApi('');
  }, [phone, delay, enabledApis, hitApi, onLog]);

  const stop = useCallback(() => {
    stopRef.current = true;
  }, []);

  return (
    <div className="rounded-xl border border-pink-500/30 bg-gray-950/80 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-cyan-400 font-mono">{title}</h2>
        </div>
        {enabledApis.length > 0 && (
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold font-mono border border-cyan-500/30">
            {enabledApis.length}/{apis.length} APIs
          </span>
        )}
      </div>

      {enabledApis.length === 0 && (
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-mono">
          ⚠ {noApisWarning}
        </div>
      )}

      <div>
        <label className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5 mb-1.5">
          <Phone className="w-3.5 h-3.5" /> {phoneLabel}
        </label>
        <Input
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
          placeholder={phonePlaceholder}
          className="bg-gray-900/50 border-gray-700 text-white font-mono placeholder:text-gray-600 focus:border-cyan-500"
          disabled={isRunning}
        />
      </div>

      <div>
        <label className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5 mb-1.5">
          <Clock className="w-3.5 h-3.5" /> {delay}ms
        </label>
        <Slider
          value={[delay]}
          onValueChange={v => setDelay(v[0])}
          max={2000}
          step={50}
          className="py-2"
          disabled={isRunning}
        />
      </div>

      {isRunning && (
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-lg bg-gray-800/50 border border-gray-700">
            <p className="text-[10px] text-gray-500 font-mono">Round</p>
            <p className="text-sm font-bold text-white font-mono">{stats.rounds}</p>
          </div>
          <div className="p-2 rounded-lg bg-gray-800/50 border border-gray-700">
            <p className="text-[10px] text-gray-500 font-mono">Hits</p>
            <p className="text-sm font-bold text-cyan-400 font-mono">{stats.hits}</p>
          </div>
          <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="text-[10px] text-gray-500 font-mono">OK</p>
            <p className="text-sm font-bold text-green-400 font-mono">{stats.success}</p>
          </div>
          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-[10px] text-gray-500 font-mono">Fail</p>
            <p className="text-sm font-bold text-red-400 font-mono">{stats.fails}</p>
          </div>
        </div>
      )}

      {currentApi && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
          <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span className="text-[10px] text-cyan-400 font-mono truncate">{currentApi}</span>
        </div>
      )}

      {!isRunning ? (
        <button
          onClick={start}
          disabled={phone.length < 10 || enabledApis.length === 0}
          className="w-full py-3 rounded-xl font-bold font-mono text-sm bg-gradient-to-r from-green-600 to-green-500 text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
        >
          <Zap className="w-4 h-4" />
          {hitButtonText} ({enabledApis.length})
        </button>
      ) : (
        <button
          onClick={stop}
          className="w-full py-3 rounded-xl font-bold font-mono text-sm bg-gradient-to-r from-red-600 to-red-500 text-white hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 animate-pulse"
        >
          <Square className="w-4 h-4" />
          {stopButtonText}
        </button>
      )}
    </div>
  );
}
