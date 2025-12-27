# Edge Functions Code

Copy each function to your Supabase project's `supabase/functions/` folder.

**Last Updated:** 2024-12-27

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

// Simple hash function using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "shubh_secret_salt_2024");
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate session token
function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  // Handle CORS preflight
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

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Find the password in database
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

    // Check if password is enabled
    if (!passwordRecord.is_enabled) {
      console.log('Password is disabled');
      return new Response(
        JSON.stringify({ error: 'This password has been disabled' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark password as used (no device binding - same password works on all devices)
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

    // Deactivate any existing sessions for this password
    await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('password_id', passwordRecord.id);

    // Create new session
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

    // Find the session
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

    // Check if password is still enabled
    if (!session.access_passwords.is_enabled) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Password has been disabled' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update last active
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

// Credit costs - All searches cost 1 credit
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

    console.log(`Credit deduction request - Type: ${searchType}, Query: ${searchQuery}`);

    if (!sessionToken || !searchType) {
      return new Response(
        JSON.stringify({ success: false, error: 'Session token and search type required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the session
    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .select('*, access_passwords(*)')
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .single();

    if (sessionError || !session) {
      console.log('Invalid session');
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if password is enabled
    if (!session.access_passwords.is_enabled) {
      return new Response(
        JSON.stringify({ success: false, error: 'Password has been disabled' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // All searches cost 1 credit
    const creditCost = CREDIT_COST;
    const currentCredits = session.access_passwords.remaining_credits;
    const isUnlimited = session.access_passwords.is_unlimited || false;

    // If unlimited, skip credit check and deduction
    if (isUnlimited) {
      console.log('Unlimited credits - skipping deduction');
      
      // Log the usage but don't deduct
      await supabase
        .from('credit_usage')
        .insert({
          password_id: session.access_passwords.id,
          search_type: searchType,
          credits_used: 0,
          search_query: searchQuery || null
        });

      return new Response(
        JSON.stringify({
          success: true,
          creditsUsed: 0,
          remainingCredits: currentCredits,
          unlimited: true
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has enough credits
    if (currentCredits < creditCost) {
      console.log(`Insufficient credits: has ${currentCredits}, needs ${creditCost}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Insufficient credits',
          credits: currentCredits,
          required: creditCost
        }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Deduct credits
    const newCredits = currentCredits - creditCost;
    const { error: updateError } = await supabase
      .from('access_passwords')
      .update({ remaining_credits: newCredits })
      .eq('id', session.access_passwords.id);

    if (updateError) {
      console.error('Error deducting credits:', updateError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to deduct credits' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the credit usage
    await supabase
      .from('credit_usage')
      .insert({
        password_id: session.access_passwords.id,
        search_type: searchType,
        credits_used: creditCost,
        search_query: searchQuery || null
      });

    console.log(`Credits deducted: ${creditCost}, Remaining: ${newCredits}`);

    return new Response(
      JSON.stringify({
        success: true,
        creditsUsed: creditCost,
        remainingCredits: newCredits
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Deduct credits error:', error);
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

// Simple hash function
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "shubh_secret_salt_2024");
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate random password
function generatePassword(length: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => chars[b % chars.length]).join('');
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

    // Verify admin password (from app_settings - stored in main_settings)
    const { data: adminSetting } = await supabase
      .from('app_settings')
      .select('setting_value')
      .eq('setting_key', 'main_settings')
      .single();

    // Extract adminPassword from settings (it's stored in main_settings JSON)
    const settingsValue = adminSetting?.setting_value as any;
    const storedAdminPassword = settingsValue?.adminPassword || 'dark';
    
    if (adminPassword !== storedAdminPassword) {
      console.log('Invalid admin password. Received:', adminPassword, 'Expected:', storedAdminPassword);
      return new Response(
        JSON.stringify({ error: 'Invalid admin password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Admin action: ${action}`);

    switch (action) {
      case 'list': {
        // List all passwords with usage stats
        const { data: passwords, error } = await supabase
          .from('access_passwords')
          .select(`
            *,
            credit_usage(id, search_type, credits_used, created_at)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        return new Response(
          JSON.stringify({ passwords }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'create': {
        const { credits, customPassword } = params;
        if (!credits || credits < 1) {
          return new Response(
            JSON.stringify({ error: 'Credits must be at least 1' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Use custom password if provided, otherwise generate random
        const password = customPassword && customPassword.trim().length >= 4 
          ? customPassword.trim().toUpperCase() 
          : generatePassword(8);
        const passwordHash = await hashPassword(password);

        const { data, error } = await supabase
          .from('access_passwords')
          .insert({
            password_hash: passwordHash,
            password_display: password,
            total_credits: credits,
            remaining_credits: credits
          })
          .select()
          .single();

        if (error) throw error;

        console.log(`Created password with ${credits} credits`);

        return new Response(
          JSON.stringify({ password: data }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update': {
        const { passwordId, credits, isEnabled, isUnlimited } = params;
        
        if (!passwordId) {
          return new Response(
            JSON.stringify({ error: 'Password ID required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const updateData: any = {};
        if (credits !== undefined) {
          updateData.remaining_credits = credits;
        }
        if (isEnabled !== undefined) {
          updateData.is_enabled = isEnabled;
        }
        if (isUnlimited !== undefined) {
          updateData.is_unlimited = isUnlimited;
        }

        const { data, error } = await supabase
          .from('access_passwords')
          .update(updateData)
          .eq('id', passwordId)
          .select()
          .single();

        if (error) throw error;

        console.log(`Updated password ${passwordId}`);

        return new Response(
          JSON.stringify({ password: data }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        const { passwordId } = params;
        
        if (!passwordId) {
          return new Response(
            JSON.stringify({ error: 'Password ID required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error } = await supabase
          .from('access_passwords')
          .delete()
          .eq('id', passwordId);

        if (error) throw error;

        console.log(`Deleted password ${passwordId}`);

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'reset': {
        // Reset password to unused state
        const { passwordId } = params;
        
        if (!passwordId) {
          return new Response(
            JSON.stringify({ error: 'Password ID required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Deactivate all sessions
        await supabase
          .from('user_sessions')
          .delete()
          .eq('password_id', passwordId);

        // Reset password state
        const { data, error } = await supabase
          .from('access_passwords')
          .update({
            is_used: false,
            device_id: null,
            used_at: null
          })
          .eq('id', passwordId)
          .select()
          .single();

        if (error) throw error;

        console.log(`Reset password ${passwordId}`);

        return new Response(
          JSON.stringify({ password: data }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'usage': {
        const { passwordId } = params;
        
        const query = supabase
          .from('credit_usage')
          .select('*')
          .order('created_at', { ascending: false });

        if (passwordId) {
          query.eq('password_id', passwordId);
        }

        const { data, error } = await query.limit(100);

        if (error) throw error;

        return new Response(
          JSON.stringify({ usage: data }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Admin error:', error);
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
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // If not JSON, return the raw text
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

These are automatically set by Supabase:

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

---

## Features Summary

### Password System
- Credit-based access with passwords
- Unlimited password option
- Password reset and disable functionality
- Multi-device support (same password works on all devices)

### Camera Capture (SHUBH CAM)
- Session-based photo capture
- Front and back camera support
- Custom HTML page support
- Chrome redirect for in-app browsers

### Search Features
- Phone search with external API
- Vehicle search
- Aadhar search with proxy
- Custom search buttons via admin

### Admin Panel
- Create/manage passwords
- View credit usage
- Configure search buttons
- Session management
