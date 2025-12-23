# Edge Functions Code

Copy each function to your Supabase project's `supabase/functions/` folder.

---

## config.toml

**File:** `supabase/config.toml`

```toml
project_id = "YOUR_PROJECT_ID"

[functions.auth-login]
verify_jwt = false

[functions.auth-verify]
verify_jwt = false

[functions.credits-deduct]
verify_jwt = false

[functions.admin-passwords]
verify_jwt = false

[functions.aadhar-search]
verify_jwt = false
```

> **Note:** Replace `YOUR_PROJECT_ID` with your actual Supabase project ID.

---

## 1. auth-login

**File:** `supabase/functions/auth-login/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "shubh_secret_salt_2024");
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { password, deviceId } = await req.json();

    console.log(`Login attempt with device: ${deviceId}`);

    if (!password || !deviceId) {
      return new Response(
        JSON.stringify({ error: 'Password and device ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const passwordHash = await hashPassword(password);

    const { data: passwordRecord, error: findError } = await supabase
      .from('access_passwords')
      .select('*')
      .eq('password_hash', passwordHash)
      .single();

    if (findError || !passwordRecord) {
      console.log('Password not found');
      return new Response(
        JSON.stringify({ error: 'Invalid password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!passwordRecord.is_enabled) {
      console.log('Password is disabled');
      return new Response(
        JSON.stringify({ error: 'This password has been disabled' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!passwordRecord.is_used) {
      const { error: updateError } = await supabase
        .from('access_passwords')
        .update({
          is_used: true,
          used_at: new Date().toISOString()
        })
        .eq('id', passwordRecord.id);

      if (updateError) {
        console.error('Error updating password:', updateError);
      }
    }

    await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('password_id', passwordRecord.id);

    const sessionToken = generateSessionToken();
    const { error: sessionError } = await supabase
      .from('user_sessions')
      .insert({
        password_id: passwordRecord.id,
        device_id: deviceId,
        session_token: sessionToken,
        is_active: true
      });

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Login successful for password ${passwordRecord.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        sessionToken,
        credits: passwordRecord.remaining_credits,
        totalCredits: passwordRecord.total_credits
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## 2. auth-verify

**File:** `supabase/functions/auth-verify/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { sessionToken } = await req.json();

    if (!sessionToken) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Session token required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .select('*, access_passwords(*)')
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .single();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid or expired session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!session.access_passwords.is_enabled) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Password has been disabled' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabase
      .from('user_sessions')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', session.id);

    return new Response(
      JSON.stringify({
        valid: true,
        credits: session.access_passwords.remaining_credits,
        totalCredits: session.access_passwords.total_credits,
        isUnlimited: session.access_passwords.is_unlimited || false
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Verify error:', error);
    return new Response(
      JSON.stringify({ valid: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## 3. credits-deduct

**File:** `supabase/functions/credits-deduct/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CREDIT_COST = 1;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { sessionToken, searchType, searchQuery } = await req.json();

    if (!sessionToken) {
      return new Response(
        JSON.stringify({ success: false, error: 'Session token required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .select('*, access_passwords(*)')
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .single();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!session.access_passwords.is_enabled) {
      return new Response(
        JSON.stringify({ success: false, error: 'Password disabled' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const passwordRecord = session.access_passwords;

    // Handle unlimited credits
    if (passwordRecord.is_unlimited) {
      await supabase.from('credit_usage').insert({
        password_id: passwordRecord.id,
        credits_used: 0,
        search_type: searchType || 'unknown',
        search_query: searchQuery || ''
      });

      return new Response(
        JSON.stringify({
          success: true,
          remainingCredits: passwordRecord.remaining_credits,
          isUnlimited: true
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has enough credits
    if (passwordRecord.remaining_credits < CREDIT_COST) {
      return new Response(
        JSON.stringify({ success: false, error: 'Insufficient credits' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const newCredits = passwordRecord.remaining_credits - CREDIT_COST;

    // Update credits
    const { error: updateError } = await supabase
      .from('access_passwords')
      .update({ remaining_credits: newCredits })
      .eq('id', passwordRecord.id);

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to deduct credits' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log usage
    await supabase.from('credit_usage').insert({
      password_id: passwordRecord.id,
      credits_used: CREDIT_COST,
      search_type: searchType || 'unknown',
      search_query: searchQuery || ''
    });

    return new Response(
      JSON.stringify({
        success: true,
        remainingCredits: newCredits,
        isUnlimited: false
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Credit deduct error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## 4. admin-passwords

**File:** `supabase/functions/admin-passwords/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "shubh_secret_salt_2024");
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generatePassword(length: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  return password;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, adminPassword, ...params } = await req.json();

    console.log(`Admin action: ${action}`);

    // Verify admin password
    const { data: settings, error: settingsError } = await supabase
      .from('app_settings')
      .select('setting_value')
      .eq('setting_key', 'admin_password')
      .single();

    if (settingsError || !settings || settings.setting_value !== adminPassword) {
      console.log('Invalid admin password');
      return new Response(
        JSON.stringify({ error: 'Invalid admin password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (action) {
      case 'list': {
        const { data, error } = await supabase
          .from('access_passwords')
          .select('*, credit_usage(credits_used, search_type, created_at)')
          .order('created_at', { ascending: false });

        if (error) throw error;

        return new Response(
          JSON.stringify({ passwords: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'create': {
        const { credits, customPassword, isUnlimited } = params;
        const password = customPassword || generatePassword();
        const passwordHash = await hashPassword(password);

        const { data, error } = await supabase
          .from('access_passwords')
          .insert({
            password_hash: passwordHash,
            password_display: password,
            total_credits: isUnlimited ? 0 : (credits || 100),
            remaining_credits: isUnlimited ? 0 : (credits || 100),
            is_unlimited: isUnlimited || false
          })
          .select()
          .single();

        if (error) throw error;

        console.log(`Created password: ${password}`);

        return new Response(
          JSON.stringify({ password, record: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update': {
        const { passwordId, credits, isEnabled, isUnlimited } = params;
        const updates: any = {};
        
        if (credits !== undefined) updates.remaining_credits = credits;
        if (isEnabled !== undefined) updates.is_enabled = isEnabled;
        if (isUnlimited !== undefined) updates.is_unlimited = isUnlimited;

        const { error } = await supabase
          .from('access_passwords')
          .update(updates)
          .eq('id', passwordId);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        const { passwordId } = params;
        
        // First delete related sessions
        await supabase
          .from('user_sessions')
          .delete()
          .eq('password_id', passwordId);

        // Delete credit usage
        await supabase
          .from('credit_usage')
          .delete()
          .eq('password_id', passwordId);

        // Then delete password
        const { error } = await supabase
          .from('access_passwords')
          .delete()
          .eq('id', passwordId);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'reset': {
        const { passwordId } = params;
        
        // Deactivate all sessions
        await supabase
          .from('user_sessions')
          .update({ is_active: false })
          .eq('password_id', passwordId);

        // Reset password status
        const { error } = await supabase
          .from('access_passwords')
          .update({ 
            is_used: false, 
            used_at: null,
            device_id: null
          })
          .eq('id', passwordId);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'usage': {
        const { passwordId } = params;
        let query = supabase
          .from('credit_usage')
          .select('*')
          .order('created_at', { ascending: false });

        if (passwordId) {
          query = query.eq('password_id', passwordId);
        }

        const { data, error } = await query;

        if (error) throw error;

        return new Response(
          JSON.stringify({ usage: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Admin passwords error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## 5. aadhar-search

**File:** `supabase/functions/aadhar-search/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { term } = await req.json();
    
    if (!term) {
      return new Response(
        JSON.stringify({ error: "Term is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiUrl = `http://zionix.rf.gd/land.php?type=id_number&term=${encodeURIComponent(term)}`;
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Aadhar search error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch data";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

---

## Environment Variables

Make sure these are set in your Supabase project:

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Auto-set by Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-set by Supabase |
| `SUPABASE_ANON_KEY` | Auto-set by Supabase |

---

## Deployment

1. Create folders: `supabase/functions/auth-login/`, `auth-verify/`, `credits-deduct/`, `admin-passwords/`, `aadhar-search/`
2. Add `index.ts` file in each folder
3. Update `config.toml` with your project ID
4. Deploy using: `supabase functions deploy`
