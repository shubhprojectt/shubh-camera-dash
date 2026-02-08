import { useState } from 'react';
import { Code, Zap, AlertTriangle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { HitApi } from '@/hooks/useHitApis';

const HEADERS_TO_REMOVE = [
  'user-agent', 'cookie', 'accept-encoding', 'content-length',
  'priority', 'accept-language', 'host', 'connection',
  'upgrade-insecure-requests', 'cache-control', 'pragma',
];
const SEC_HEADER_PATTERN = /^sec-/i;

interface ParsedResult {
  name: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
  bodyType: 'json' | 'form-urlencoded' | 'multipart' | 'text' | 'none';
  query_params: Record<string, string>;
}

function parseCode(code: string): { result?: ParsedResult; error?: string; warnings: string[] } {
  const warnings: string[] = [];
  try {
    const urlMatch = code.match(/fetch\s*\(\s*["'`]([^"'`]+)["'`]/);
    if (!urlMatch) return { error: 'Could not find fetch() URL', warnings };
    
    let url = urlMatch[1];
    const query_params: Record<string, string> = {};
    
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.forEach((v, k) => { query_params[k] = v; });
      urlObj.search = '';
      url = urlObj.toString();
    } catch {}

    const methodMatch = code.match(/method\s*:\s*["'`](\w+)["'`]/i);
    const method = methodMatch ? methodMatch[1].toUpperCase() : 'GET';

    const headers: Record<string, string> = {};
    const appendMatches = code.matchAll(/\.append\s*\(\s*["'`]([^"'`]+)["'`]\s*,\s*["'`]([^"'`]+)["'`]\s*\)/g);
    for (const m of appendMatches) { headers[m[1]] = m[2]; }

    const headerObjMatch = code.match(/headers\s*:\s*\{([^}]+)\}/s);
    if (headerObjMatch) {
      const pairs = headerObjMatch[1].matchAll(/["'`]([^"'`]+)["'`]\s*:\s*["'`]([^"'`]+)["'`]/g);
      for (const p of pairs) { headers[p[1]] = p[2]; }
    }

    for (const key of Object.keys(headers)) {
      if (HEADERS_TO_REMOVE.includes(key.toLowerCase()) || SEC_HEADER_PATTERN.test(key)) {
        delete headers[key];
      }
      if (key.toLowerCase() === 'x-requested-with' && (headers[key].includes('mark.via') || headers[key].includes('mark.via.gp'))) {
        headers[key] = 'XMLHttpRequest';
      }
    }

    let bodyType: ParsedResult['bodyType'] = 'none';
    let body: Record<string, unknown> = {};

    const jsonBodyMatch = code.match(/JSON\.stringify\s*\(\s*(\{[\s\S]*?\})\s*\)/);
    if (jsonBodyMatch) {
      bodyType = 'json';
      try {
        body = JSON.parse(jsonBodyMatch[1].replace(/'/g, '"').replace(/(\w+)\s*:/g, '"$1":'));
      } catch {
        try {
          const cleaned = jsonBodyMatch[1].replace(/'/g, '"').replace(/(\w+)\s*:/g, '"$1":').replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
          body = JSON.parse(cleaned);
        } catch {
          warnings.push('Could not parse JSON body - manual check needed');
        }
      }
    }

    if (code.includes('new URLSearchParams') || code.includes('URLSearchParams')) {
      bodyType = 'form-urlencoded';
      const urlParamAppends = code.matchAll(/(?:urlencoded|params|searchParams)\.append\s*\(\s*["'`]([^"'`]+)["'`]\s*,\s*["'`]([^"'`]+)["'`]\s*\)/gi);
      for (const m of urlParamAppends) { body[m[1]] = m[2]; }
    }

    if (code.includes('new FormData')) {
      bodyType = 'multipart';
      const fdAppends = code.matchAll(/(?:formData|formdata|fd)\.append\s*\(\s*["'`]([^"'`]+)["'`]\s*,\s*["'`]([^"'`]+)["'`]\s*\)/gi);
      for (const m of fdAppends) { body[m[1]] = m[2]; }
    }

    let name = method;
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(p => p && !/^[0-9a-f-]{8,}$/i.test(p) && !/^\d+$/.test(p));
      if (pathParts.length > 0) { name = `${method} ${pathParts.slice(-2).join(' ')}`; }
      else { name = `${method} ${urlObj.hostname.split('.')[0]}`; }
    } catch {}

    return { result: { name, url, method, headers, body, bodyType, query_params }, warnings };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Parse error', warnings };
  }
}

interface ApiImporterProps {
  onImport: (api: Omit<HitApi, 'id'>) => void;
}

export default function ApiImporter({ onImport }: ApiImporterProps) {
  const [code, setCode] = useState('');
  const [parsed, setParsed] = useState<ParsedResult | null>(null);
  const [error, setError] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [apiName, setApiName] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [proxyEnabled, setProxyEnabled] = useState(false);

  const handleParse = () => {
    const { result, error: err, warnings: warns } = parseCode(code);
    setWarnings(warns);
    if (err) { setError(err); setParsed(null); return; }
    if (result) { setParsed(result); setApiName(result.name); setError(''); }
  };

  const handleImport = () => {
    if (!parsed) return;
    onImport({
      name: apiName || parsed.name, url: parsed.url,
      method: parsed.method as HitApi['method'],
      headers: parsed.headers, body: parsed.body,
      bodyType: parsed.bodyType, query_params: parsed.query_params,
      enabled, proxy_enabled: proxyEnabled,
      force_proxy: false, rotation_enabled: false, residential_proxy_enabled: false,
    });
    setCode(''); setParsed(null); setApiName(''); setError(''); setWarnings([]);
  };

  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-5 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <Code className="w-4 h-4 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-white/90">Paste Fetch Code</h3>
      </div>

      <Textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder={`// Paste Node.js fetch code here\nfetch("https://api.example.com/login", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ phone: "{PHONE}" })\n});`}
        className="bg-white/[0.04] border-white/[0.08] text-emerald-400/80 text-xs h-40 placeholder:text-white/15 focus:border-violet-500/40"
      />

      <button onClick={handleParse}
        className="w-full h-10 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
        <Code className="w-4 h-4" /> Parse & Preview
      </button>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/[0.08] border border-red-500/[0.15] text-red-400/80 text-xs">
          ❌ {error}
        </div>
      )}

      {warnings.map((w, i) => (
        <div key={i} className="p-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/[0.12] text-amber-400/70 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {w}
        </div>
      ))}

      {parsed && (
        <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="space-y-1.5">
            <label className="text-[10px] text-white/40">API Name</label>
            <Input value={apiName} onChange={e => setApiName(e.target.value)}
              className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/15 focus:border-violet-500/40" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <span className="text-white/30">Method:</span> <span className="text-blue-400">{parsed.method}</span>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <span className="text-white/30">Body:</span> <span className="text-violet-400">{parsed.bodyType}</span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.03] text-[10px] text-white/30 break-all">{parsed.url}</div>
          {Object.keys(parsed.headers).length > 0 && (
            <div className="p-2 rounded-lg bg-white/[0.03] text-[10px] text-white/30">
              <p className="text-white/50 mb-1">Headers:</p>
              {Object.entries(parsed.headers).map(([k, v]) => (
                <p key={k} className="truncate"><span className="text-emerald-400/60">{k}:</span> {v}</p>
              ))}
            </div>
          )}
          {Object.keys(parsed.body).length > 0 && (
            <div className="p-2 rounded-lg bg-white/[0.03] text-[10px] text-white/30">
              <p className="text-white/50 mb-1">Body:</p>
              <pre className="whitespace-pre-wrap">{JSON.stringify(parsed.body, null, 2)}</pre>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-white/40">Enabled</span>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-white/40">Proxy</span>
              <Switch checked={proxyEnabled} onCheckedChange={setProxyEnabled} />
            </div>
          </div>

          <button onClick={handleImport}
            className="w-full h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" /> Import API
          </button>
        </div>
      )}
    </div>
  );
}
