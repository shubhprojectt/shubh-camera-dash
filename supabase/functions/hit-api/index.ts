import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const FREE_PROXIES = [
  { name: 'allorigins', url: 'https://api.allorigins.win/raw?url=' },
  { name: 'corsproxy', url: 'https://corsproxy.io/?' },
  { name: 'cors-anywhere', url: 'https://cors-anywhere.herokuapp.com/' },
];

// 30+ different browser User-Agents for rate limit bypass
const USER_AGENTS = [
  // Chrome Windows
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  // Chrome Mac
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  // Chrome Linux
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  // Firefox Windows
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:119.0) Gecko/20100101 Firefox/119.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
  // Firefox Mac
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0',
  // Firefox Linux
  'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
  // Safari Mac
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15',
  // Edge Windows
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
  // Opera
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0',
  // Mobile Chrome
  'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 13; Pixel 7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 14; SM-A546E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36',
  // Mobile Safari (iPhone)
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  // Brave
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Brave/120',
  // Vivaldi
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Vivaldi/6.5',
];

// Request counter for sequential rotation
let requestCounter = 0;

function getRandomUserAgent(): string {
  const idx = requestCounter % USER_AGENTS.length;
  requestCounter++;
  return USER_AGENTS[idx];
}

interface HitApiRequest {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown> | string;
  bodyType?: 'json' | 'form-urlencoded' | 'text' | 'none';
  useProxy?: boolean;
  useResidentialProxy?: boolean;
  residentialProxyUrl?: string;
}

function buildBody(body: Record<string, unknown> | string | undefined, bodyType: string): { serialized: string | null; contentType: string | null } {
  if (!body || bodyType === 'none') return { serialized: null, contentType: null };

  if (bodyType === 'json') {
    return {
      serialized: typeof body === 'string' ? body : JSON.stringify(body),
      contentType: 'application/json',
    };
  }

  if (bodyType === 'form-urlencoded') {
    if (typeof body === 'string') return { serialized: body, contentType: 'application/x-www-form-urlencoded' };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(body)) {
      params.append(k, String(v));
    }
    return { serialized: params.toString(), contentType: 'application/x-www-form-urlencoded' };
  }

  if (bodyType === 'text') {
    return { serialized: typeof body === 'string' ? body : JSON.stringify(body), contentType: 'text/plain' };
  }

  return { serialized: null, contentType: null };
}

async function hitDirect(url: string, method: string, headers: Record<string, string>, serializedBody: string | null): Promise<{ status: number; text: string; time: number }> {
  const start = Date.now();
  const res = await fetch(url, {
    method,
    headers,
    body: serializedBody,
    redirect: 'follow',
  });
  const time = Date.now() - start;
  const text = await res.text();
  return { status: res.status, text: text.substring(0, 1000), time };
}

async function hitWithProxy(proxyUrl: string, targetUrl: string, method: string, headers: Record<string, string>, serializedBody: string | null): Promise<{ status: number; text: string; time: number; proxyName: string }> {
  const encoded = encodeURIComponent(targetUrl);
  const finalUrl = proxyUrl + encoded;
  const start = Date.now();
  const res = await fetch(finalUrl, {
    method,
    headers,
    body: serializedBody,
    redirect: 'follow',
  });
  const time = Date.now() - start;
  const text = await res.text();
  return { status: res.status, text: text.substring(0, 1000), time, proxyName: proxyUrl };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const data: HitApiRequest = await req.json();
    const { url, method = 'GET', headers: customHeaders = {}, body, bodyType = 'none', useProxy = false, useResidentialProxy = false, residentialProxyUrl } = data;

    if (!url) {
      return new Response(JSON.stringify({ success: false, error_message: 'URL is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Pick a random User-Agent from the rotation pool
    const rotatedUA = getRandomUserAgent();

    // Build browser-like headers with rotated User-Agent
    const parsedUrl = new URL(url);
    const finalHeaders: Record<string, string> = {
      'User-Agent': rotatedUA,
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Origin': parsedUrl.origin,
      'Referer': parsedUrl.origin + '/',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-CH-UA-Platform': rotatedUA.includes('Windows') ? '"Windows"' : rotatedUA.includes('Macintosh') ? '"macOS"' : rotatedUA.includes('Linux') ? '"Linux"' : '"Unknown"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      ...customHeaders,
    };

    const { serialized, contentType } = buildBody(body, bodyType);
    if (contentType && !finalHeaders['Content-Type'] && !finalHeaders['content-type']) {
      finalHeaders['Content-Type'] = contentType;
    }

    let result: { status: number; text: string; time: number; proxyName?: string };

    if (useResidentialProxy && residentialProxyUrl) {
      // For residential proxy, we add proxy auth header and hit direct
      try {
        const proxyParsed = new URL(residentialProxyUrl);
        if (proxyParsed.username && proxyParsed.password) {
          finalHeaders['Proxy-Authorization'] = 'Basic ' + btoa(`${proxyParsed.username}:${proxyParsed.password}`);
        }
        const r = await hitDirect(url, method, finalHeaders, serialized);
        result = { ...r, proxyName: 'residential' };
      } catch (e) {
        // Fallback to direct
        console.error('Residential proxy failed, falling back to direct:', e);
        const r = await hitDirect(url, method, finalHeaders, serialized);
        result = { ...r, proxyName: 'direct (residential failed)' };
      }
    } else if (useProxy) {
      // Try free proxies in order, fallback to direct
      let success = false;
      result = { status: 0, text: '', time: 0, proxyName: 'none' };
      for (const proxy of FREE_PROXIES) {
        try {
          const r = await hitWithProxy(proxy.url, url, method, finalHeaders, serialized);
          result = { ...r, proxyName: proxy.name };
          success = true;
          break;
        } catch (e) {
          console.log(`Proxy ${proxy.name} failed:`, e);
          continue;
        }
      }
      if (!success) {
        // All proxies failed, try direct
        try {
          const r = await hitDirect(url, method, finalHeaders, serialized);
          result = { ...r, proxyName: 'direct (all proxies failed)' };
        } catch (e) {
          result = { status: 0, text: '', time: 0, proxyName: 'all failed' };
          throw e;
        }
      }
    } else {
      // Direct hit
      const r = await hitDirect(url, method, finalHeaders, serialized);
      result = { ...r, proxyName: 'direct' };
    }

    console.log(`[hit-api] ${method} ${url} => ${result.status} (${result.time}ms) via ${result.proxyName} | UA: ${rotatedUA.substring(0, 50)}...`);

    return new Response(JSON.stringify({
      success: result.status >= 200 && result.status < 400,
      status_code: result.status,
      response_time: result.time,
      response_text: result.text,
      proxy_used: result.proxyName || 'direct',
      user_agent_used: rotatedUA.substring(0, 60),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[hit-api] Error:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({
      success: false,
      status_code: null,
      response_time: 0,
      error_message: msg,
      proxy_used: 'none',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
