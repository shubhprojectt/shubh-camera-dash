import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0',
  'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6099.144 Mobile Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 OPR/108.0.0.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Brave/122',
];

let requestCounter = 0;

function getRotatedUA(): string {
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
  uaRotation?: boolean;
}

function buildBody(body: Record<string, unknown> | string | undefined, bodyType: string): { serialized: string | null; contentType: string | null } {
  if (!body || bodyType === 'none') return { serialized: null, contentType: null };
  if (bodyType === 'json') return { serialized: typeof body === 'string' ? body : JSON.stringify(body), contentType: 'application/json' };
  if (bodyType === 'form-urlencoded') {
    if (typeof body === 'string') return { serialized: body, contentType: 'application/x-www-form-urlencoded' };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(body)) params.append(k, String(v));
    return { serialized: params.toString(), contentType: 'application/x-www-form-urlencoded' };
  }
  if (bodyType === 'text') return { serialized: typeof body === 'string' ? body : JSON.stringify(body), contentType: 'text/plain' };
  return { serialized: null, contentType: null };
}

async function hitWithTimeout(url: string, method: string, headers: Record<string, string>, body: string | null, timeoutMs: number): Promise<{ status: number; time: number }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const start = Date.now();
  try {
    const res = await fetch(url, { method, headers, body, redirect: 'follow', signal: controller.signal });
    const time = Date.now() - start;
    // Drain body but don't store
    await res.text();
    return { status: res.status, time };
  } finally {
    clearTimeout(timer);
  }
}

async function hitWithRetry(url: string, method: string, headers: Record<string, string>, body: string | null): Promise<{ status: number; time: number; error?: string }> {
  try {
    return await hitWithTimeout(url, method, headers, body, 10000);
  } catch (e) {
    // Retry once after 1.5s
    await new Promise(r => setTimeout(r, 1500));
    try {
      return await hitWithTimeout(url, method, headers, body, 10000);
    } catch (e2) {
      return { status: 0, time: 0, error: e2 instanceof Error ? e2.message : 'Timeout' };
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const data: HitApiRequest = await req.json();
    const { url, method = 'GET', headers: customHeaders = {}, body, bodyType = 'none', uaRotation = true } = data;

    if (!url) {
      return new Response(JSON.stringify({ success: false, error_message: 'URL is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ua = uaRotation ? getRotatedUA() : '';

    // Use admin-configured headers as-is, only add UA if rotation enabled
    const finalHeaders: Record<string, string> = {
      ...customHeaders,
      ...(ua ? { 'User-Agent': ua } : {}),
    };

    const { serialized, contentType } = buildBody(body, bodyType);
    if (contentType && !finalHeaders['Content-Type'] && !finalHeaders['content-type']) {
      finalHeaders['Content-Type'] = contentType;
    }

    const result = await hitWithRetry(url, method, finalHeaders, serialized);

    return new Response(JSON.stringify({
      success: !result.error && result.status >= 200 && result.status < 400,
      status_code: result.status || null,
      response_time: result.time,
      error_message: result.error || null,
      user_agent_used: ua || null,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({
      success: false, status_code: null, response_time: 0, error_message: msg,
    }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
