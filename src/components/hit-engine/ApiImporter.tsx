import { useState } from 'react';
import { Code, Zap, AlertTriangle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { HitApi } from '@/hooks/useHitApis';

// Headers to remove from parsed code
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
    // Extract URL
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

    // Extract method
    const methodMatch = code.match(/method\s*:\s*["'`](\w+)["'`]/i);
    const method = methodMatch ? methodMatch[1].toUpperCase() : 'GET';

    // Extract headers
    const headers: Record<string, string> = {};
    
    // Pattern 1: new Headers() with .append()
    const appendMatches = code.matchAll(/\.append\s*\(\s*["'`]([^"'`]+)["'`]\s*,\s*["'`]([^"'`]+)["'`]\s*\)/g);
    for (const m of appendMatches) {
      headers[m[1]] = m[2];
    }

    // Pattern 2: Direct object literal
    const headerObjMatch = code.match(/headers\s*:\s*\{([^}]+)\}/s);
    if (headerObjMatch) {
      const pairs = headerObjMatch[1].matchAll(/["'`]([^"'`]+)["'`]\s*:\s*["'`]([^"'`]+)["'`]/g);
      for (const p of pairs) {
        headers[p[1]] = p[2];
      }
    }

    // Clean headers
    for (const key of Object.keys(headers)) {
      if (HEADERS_TO_REMOVE.includes(key.toLowerCase()) || SEC_HEADER_PATTERN.test(key)) {
        delete headers[key];
      }
      // Fix X-Requested-With
      if (key.toLowerCase() === 'x-requested-with' && (headers[key].includes('mark.via') || headers[key].includes('mark.via.gp'))) {
        headers[key] = 'XMLHttpRequest';
      }
    }

    // Detect body type and parse body
    let bodyType: ParsedResult['bodyType'] = 'none';
    let body: Record<string, unknown> = {};

    // JSON.stringify body
    const jsonBodyMatch = code.match(/JSON\.stringify\s*\(\s*(\{[\s\S]*?\})\s*\)/);
    if (jsonBodyMatch) {
      bodyType = 'json';
      try {
        body = JSON.parse(jsonBodyMatch[1].replace(/'/g, '"').replace(/(\w+)\s*:/g, '"$1":'));
      } catch {
        // Try eval-safe parsing
        try {
          const cleaned = jsonBodyMatch[1]
            .replace(/'/g, '"')
            .replace(/(\w+)\s*:/g, '"$1":')
            .replace(/,\s*}/g, '}')
            .replace(/,\s*]/g, ']');
          body = JSON.parse(cleaned);
        } catch {
          warnings.push('Could not parse JSON body - manual check needed');
        }
      }
    }

    // URLSearchParams body
    if (code.includes('new URLSearchParams') || code.includes('URLSearchParams')) {
      bodyType = 'form-urlencoded';
      const urlParamAppends = code.matchAll(/(?:urlencoded|params|searchParams)\.append\s*\(\s*["'`]([^"'`]+)["'`]\s*,\s*["'`]([^"'`]+)["'`]\s*\)/gi);
      for (const m of urlParamAppends) {
        body[m[1]] = m[2];
      }
    }

    // FormData body
    if (code.includes('new FormData')) {
      bodyType = 'multipart';
      const fdAppends = code.matchAll(/(?:formData|formdata|fd)\.append\s*\(\s*["'`]([^"'`]+)["'`]\s*,\s*["'`]([^"'`]+)["'`]\s*\)/gi);
      for (const m of fdAppends) {
        body[m[1]] = m[2];
      }
    }

    // Generate name from URL
    let name = method;
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(p => p && !/^[0-9a-f-]{8,}$/i.test(p) && !/^\d+$/.test(p));
      if (pathParts.length > 0) {
        name = `${method} ${pathParts.slice(-2).join(' ')}`;
      } else {
        name = `${method} ${urlObj.hostname.split('.')[0]}`;
      }
    } catch {}

    return {
      result: { name, url, method, headers, body, bodyType, query_params },
      warnings,
    };
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
    if (result) {
      setParsed(result);
      setApiName(result.name);
      setError('');
    }
  };

  const handleImport = () => {
    if (!parsed) return;
    onImport({
      name: apiName || parsed.name,
      url: parsed.url,
      method: parsed.method as HitApi['method'],
      headers: parsed.headers,
      body: parsed.body,
      bodyType: parsed.bodyType,
      query_params: parsed.query_params,
      enabled,
      proxy_enabled: proxyEnabled,
      force_proxy: false,
      rotation_enabled: false,
      residential_proxy_enabled: false,
    });
    // Reset
    setCode('');
    setParsed(null);
    setApiName('');
    setError('');
    setWarnings([]);
  };

  return (
    <div className="rounded-xl border border-pink-500/30 bg-gray-950/80 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Code className="w-5 h-5 text-pink-400" />
        <h3 className="text-sm font-bold text-pink-400 font-mono">Paste Node.js Fetch Code</h3>
      </div>

      <Textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder={`// Paste your Node.js fetch code here (from Reqable)\n// Supports: JSON, URLSearchParams, FormData, Plain Text\n\n// Example 1 - JSON:\nfetch("https://api.example.com/login", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ phone: "{PHONE}" })\n});`}
        className="bg-gray-900 border-gray-700 text-green-400 font-mono text-xs h-48 placeholder:text-gray-600"
      />

      <button onClick={handleParse}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 text-white font-mono font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
        <Code className="w-4 h-4" /> Parse & Preview API
      </button>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
          ❌ {error}
        </div>
      )}

      {warnings.length > 0 && warnings.map((w, i) => (
        <div key={i} className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {w}
        </div>
      ))}

      {parsed && (
        <div className="space-y-3 p-4 rounded-xl bg-gray-900/50 border border-cyan-500/20">
          <div>
            <label className="text-[10px] text-cyan-400 font-mono font-bold">API Name</label>
            <Input value={apiName} onChange={e => setApiName(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white font-mono mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="p-2 rounded bg-gray-800"><span className="text-gray-500">Method:</span> <span className="text-cyan-400">{parsed.method}</span></div>
            <div className="p-2 rounded bg-gray-800"><span className="text-gray-500">Body:</span> <span className="text-pink-400">{parsed.bodyType}</span></div>
          </div>
          <div className="p-2 rounded bg-gray-800 text-[10px] font-mono text-gray-400 break-all">{parsed.url}</div>
          {Object.keys(parsed.headers).length > 0 && (
            <div className="p-2 rounded bg-gray-800 text-[10px] font-mono text-gray-400">
              <p className="text-cyan-400 mb-1">Headers:</p>
              {Object.entries(parsed.headers).map(([k, v]) => (
                <p key={k} className="truncate"><span className="text-green-400">{k}:</span> {v}</p>
              ))}
            </div>
          )}
          {Object.keys(parsed.body).length > 0 && (
            <div className="p-2 rounded bg-gray-800 text-[10px] font-mono text-gray-400">
              <p className="text-pink-400 mb-1">Body:</p>
              <pre className="whitespace-pre-wrap">{JSON.stringify(parsed.body, null, 2)}</pre>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 font-mono">Enabled</span>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 font-mono">Proxy</span>
              <Switch checked={proxyEnabled} onCheckedChange={setProxyEnabled} />
            </div>
          </div>

          <button onClick={handleImport}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-cyan-600 text-white font-mono font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" /> Import API
          </button>
        </div>
      )}
    </div>
  );
}
