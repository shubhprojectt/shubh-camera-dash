# Edge Functions Documentation

This folder contains documentation for all Supabase Edge Functions used in SHUBH OSINT.

## Functions List

| Function | File | Purpose |
|----------|------|---------|
| auth-login | `auth-login.ts` | User login with credit password |
| auth-verify | `auth-verify.ts` | Verify session and get credit info |
| credits-deduct | `credits-deduct.ts` | Deduct credits for searches |
| admin-passwords | `admin-passwords.ts` | Admin panel for password management |
| aadhar-search | `aadhar-search.ts` | Aadhar search proxy (CORS bypass) |

## Deployment

Edge functions are automatically deployed when you push to the repository.

The actual function code is in: `supabase/functions/`

## API Endpoints

All endpoints use POST method with JSON body.

### auth-login
```json
{
  "password": "USER_PASSWORD",
  "deviceId": "unique_device_id"
}
```

### auth-verify
```json
{
  "sessionToken": "session_token_from_login"
}
```

### credits-deduct
```json
{
  "sessionToken": "session_token",
  "searchType": "phone|aadhar|vehicle|etc",
  "searchQuery": "search_query"
}
```

### admin-passwords
```json
{
  "action": "list|create|update|delete|reset|usage",
  "adminPassword": "admin_password",
  // Additional params based on action
}
```

### aadhar-search
```json
{
  "term": "aadhar_number_or_phone"
}
```

## Environment Variables

These are automatically set by Supabase:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
