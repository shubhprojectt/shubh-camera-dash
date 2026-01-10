# 🔥 SHUBH OSINT - Complete API Documentation
> Last Updated: 2025-01-10 | Version: 2.0

---

## 📋 Table of Contents
1. [Frontend Tab APIs](#frontend-tab-apis)
2. [Edge Functions (Backend Proxies)](#edge-functions-backend-proxies)
3. [Authentication APIs](#authentication-apis)
4. [File Locations](#file-locations)

---

## 🎯 Frontend Tab APIs

### 1. Phone Search
| Property | Value |
|----------|-------|
| **Tab ID** | `phone` |
| **Search Type** | `phone` |
| **Default API URL** | `https://anmolzz.teamxferry.workers.dev/?mobile=` |
| **Alternate API** | `https://userbotgroup.onrender.com/num?number=` |
| **File Location** | `src/components/NumberDetailFinder.tsx` |
| **Line Numbers** | 215-250 |
| **Method** | Direct `fetch()` call |
| **Usage** | `fetch(apiUrl + phoneNumber)` |

---

### 2. NUM INFO V2
| Property | Value |
|----------|-------|
| **Tab ID** | `numinfov2` |
| **Search Type** | `numinfov2` |
| **Edge Function** | `numinfo-v2` |
| **Backend API** | `https://userbotgroup.onrender.com/num?number=` |
| **File Location** | `src/components/NumberDetailFinder.tsx` |
| **Line Numbers** | 269-300 |
| **Edge Function File** | `supabase/functions/numinfo-v2/index.ts` |
| **Method** | `supabase.functions.invoke('numinfo-v2')` |

---

### 3. Aadhar Search
| Property | Value |
|----------|-------|
| **Tab ID** | `aadhar` |
| **Search Type** | `aadhar` |
| **Edge Function** | `aadhar-search` |
| **Backend API** | `http://zionix.rf.gd/land.php?type=id_number&term=` |
| **File Location** | `src/components/NumberDetailFinder.tsx` |
| **Line Numbers** | 305-340 |
| **Edge Function File** | `supabase/functions/aadhar-search/index.ts` |
| **Method** | `supabase.functions.invoke('aadhar-search')` |

---

### 4. Vehicle Search
| Property | Value |
|----------|-------|
| **Tab ID** | `vehicle` |
| **Search Type** | `vehicle` |
| **Default API URL** | `https://darknagi-osint-vehicle-api.vercel.app/api/vehicle?rc=` |
| **File Location** | `src/components/NumberDetailFinder.tsx` |
| **Line Numbers** | Settings-based (manual API) |
| **Method** | Opens in new tab via `window.open()` |

---

### 5. All Search (LeakOSINT)
| Property | Value |
|----------|-------|
| **Tab ID** | `allsearch` |
| **Search Type** | `allsearch` |
| **API URL** | `https://lek-steel.vercel.app/api/search?q=` |
| **File Location** | `src/components/NumberDetailFinder.tsx` |
| **Line Numbers** | 344-380 |
| **Method** | Direct `fetch()` call |
| **Usage** | `fetch(apiUrl + searchQuery)` |

---

### 6. Manual Search
| Property | Value |
|----------|-------|
| **Tab ID** | `manual` |
| **Search Type** | `manual` |
| **Default API URL** | `https://hydrashop.in.net/number.php?q=` |
| **File Location** | `src/pages/Page2.tsx` |
| **Line Numbers** | 56-57 |
| **Method** | Opens in new tab via `window.open()` |

---

### 7. Hard Bomber (DarkDB)
| Property | Value |
|----------|-------|
| **Tab ID** | `darkdb` |
| **Search Type** | `darkdb` |
| **API URL / iFrame** | `https://2info.vercel.app` |
| **File Location** | `src/components/NumberDetailFinder.tsx` |
| **Line Numbers** | Renders as iFrame |
| **Method** | Embedded iFrame |

---

### 8. PHPRAT Panel
| Property | Value |
|----------|-------|
| **Tab ID** | `phprat` |
| **Search Type** | `phprat` |
| **Default iFrame URL** | `https://userb-92mn.onrender.com/` |
| **File Location** | `src/components/NumberDetailFinder.tsx` |
| **Line Numbers** | 1156-1165 |
| **Method** | Embedded iFrame |

---

### 9. RANDI Panel
| Property | Value |
|----------|-------|
| **Tab ID** | `randipanel` |
| **Search Type** | `randipanel` |
| **Page** | Dedicated page `/randi-panel` |
| **File Location** | `src/pages/RandiPanel.tsx` |
| **Method** | Full page component |

---

### 10. CAM HACK (Shubh)
| Property | Value |
|----------|-------|
| **Tab ID** | `shubh` |
| **Search Type** | `shubh` |
| **Component** | `ShubhCam` |
| **File Location** | `src/components/ShubhCam.tsx` |
| **Method** | Custom component with capture pages |

---

## 📡 Telegram OSINT APIs

### Telegram OSINT Component
| Property | Value |
|----------|-------|
| **Tab ID** | `telegram` |
| **Component File** | `src/components/TelegramOSINT.tsx` |
| **Line Numbers** | 215-222 |
| **Edge Function** | `telegram-osint` |
| **Edge Function File** | `supabase/functions/telegram-osint/index.ts` |
| **Base URL** | `https://funstat.info` |
| **Auth** | JWT Token (from settings) |

### Telegram OSINT Tools & Endpoints

| Tool ID | Tool Name | Endpoint | Description |
|---------|-----------|----------|-------------|
| `getUserInfo` | Get User Info | `/api/v1/users/get_user` | Get Telegram user details |
| `getGroupsChannels` | Groups & Channels | `/api/v1/users/groups_and_channels` | Get user's groups/channels |
| `getProfilePhotos` | Profile Photos | `/api/v1/users/profile_photos` | Get profile photo history |
| `getUsernames` | Username History | `/api/v1/users/get_usernames` | Get past usernames |
| `resolveUsername` | Resolve Username | `/api/v1/users/resolve_username` | Convert username to user ID |
| `usernameUsage` | Username Usage | `/api/v1/users/username_usage` | Check username usage stats |

---

## ⚡ Edge Functions (Backend Proxies)

### 1. numinfo-v2
```
📁 File: supabase/functions/numinfo-v2/index.ts
🔗 Backend API: https://userbotgroup.onrender.com/num?number=
📍 Line: 26-34
🛠️ Purpose: Proxy for phone number lookup to bypass CORS
```

### 2. aadhar-search
```
📁 File: supabase/functions/aadhar-search/index.ts
🔗 Backend API: http://zionix.rf.gd/land.php?type=id_number&term=
📍 Line: 23-30
🛠️ Purpose: Proxy for Aadhar number search
```

### 3. telegram-osint
```
📁 File: supabase/functions/telegram-osint/index.ts
🔗 Base URL: https://funstat.info
📍 Line: 50-75
🛠️ Purpose: Proxy for all Telegram OSINT API calls
🔑 Auth: JWT Token from app_settings
```

### 4. auth-login
```
📁 File: supabase/functions/auth-login/index.ts
🛠️ Purpose: User authentication with password
📍 Used in: src/contexts/AuthContext.tsx (line 77-79)
```

### 5. auth-verify
```
📁 File: supabase/functions/auth-verify/index.ts
🛠️ Purpose: Verify session token validity
📍 Used in: src/contexts/AuthContext.tsx (line 49-51)
```

### 6. credits-deduct
```
📁 File: supabase/functions/credits-deduct/index.ts
🛠️ Purpose: Deduct credits for searches
📍 Used in: src/contexts/AuthContext.tsx (line 117-119)
```

### 7. admin-passwords
```
📁 File: supabase/functions/admin-passwords/index.ts
🛠️ Purpose: Admin password management (CRUD)
📍 Used in: src/pages/Admin.tsx
```

---

## 🔐 Authentication APIs

| Function | Edge Function | File Location | Line |
|----------|---------------|---------------|------|
| Login | `auth-login` | `src/contexts/AuthContext.tsx` | 77-79 |
| Verify Session | `auth-verify` | `src/contexts/AuthContext.tsx` | 49-51 |
| Deduct Credits | `credits-deduct` | `src/contexts/AuthContext.tsx` | 117-119 |

---

## 📂 File Locations Summary

### Frontend Components
| File | APIs/Functions |
|------|----------------|
| `src/components/NumberDetailFinder.tsx` | Phone, NumInfoV2, Aadhar, AllSearch, DarkDB, PHPRAT |
| `src/components/TelegramOSINT.tsx` | All Telegram OSINT tools |
| `src/pages/Page2.tsx` | Manual search |
| `src/pages/RandiPanel.tsx` | Randi Panel page |
| `src/components/ShubhCam.tsx` | CAM HACK feature |

### Edge Functions
| File | Purpose |
|------|---------|
| `supabase/functions/numinfo-v2/index.ts` | Phone number proxy |
| `supabase/functions/aadhar-search/index.ts` | Aadhar search proxy |
| `supabase/functions/telegram-osint/index.ts` | Telegram OSINT proxy |
| `supabase/functions/auth-login/index.ts` | User login |
| `supabase/functions/auth-verify/index.ts` | Session verification |
| `supabase/functions/credits-deduct/index.ts` | Credit deduction |
| `supabase/functions/admin-passwords/index.ts` | Admin management |

### Configuration Files
| File | Contains |
|------|----------|
| `src/contexts/SettingsContext.tsx` | Default API URLs for all tabs (line 92-106) |
| `supabase/config.toml` | Edge function configurations |

---

## 🔧 Default Tab Configuration

Located in: `src/contexts/SettingsContext.tsx` (Lines 92-106)

```typescript
const defaultTabs = [
  { id: "phone", apiUrl: "https://userbotgroup.onrender.com/num?number=" },
  { id: "numinfov2", apiUrl: "https://userbotgroup.onrender.com/num?number=" },
  { id: "aadhar", apiUrl: "" }, // Uses edge function
  { id: "vehicle", apiUrl: "https://darknagi-osint-vehicle-api.vercel.app/api/vehicle?rc=" },
  { id: "manual", apiUrl: "https://hydrashop.in.net/number.php?q=" },
  { id: "darkdb", apiUrl: "https://2info.vercel.app" },
  { id: "allsearch", apiUrl: "https://lek-steel.vercel.app/api/search?q=" },
  // ... more tabs
];
```

---

## 📊 API Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
├─────────────────────────────────────────────────────────────────┤
│  NumberDetailFinder.tsx                                         │
│  ├── Phone Search ──────► Direct fetch() to API                 │
│  ├── NumInfoV2 ─────────► Edge Function (numinfo-v2)            │
│  ├── Aadhar ────────────► Edge Function (aadhar-search)         │
│  ├── AllSearch ─────────► Direct fetch() to LeakOSINT           │
│  ├── DarkDB ────────────► iFrame embed                          │
│  └── PHPRAT ────────────► iFrame embed                          │
│                                                                  │
│  TelegramOSINT.tsx                                              │
│  └── All Tools ─────────► Edge Function (telegram-osint)        │
│                                                                  │
│  Page2.tsx                                                      │
│  └── Manual ────────────► window.open() new tab                 │
├─────────────────────────────────────────────────────────────────┤
│                     EDGE FUNCTIONS                               │
├─────────────────────────────────────────────────────────────────┤
│  numinfo-v2 ────────────► userbotgroup.onrender.com             │
│  aadhar-search ─────────► zionix.rf.gd                          │
│  telegram-osint ────────► funstat.info                          │
│  auth-login ────────────► Supabase DB                           │
│  auth-verify ───────────► Supabase DB                           │
│  credits-deduct ────────► Supabase DB                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Important Notes

1. **CORS Bypass**: NumInfoV2, Aadhar, and Telegram APIs use edge functions to bypass CORS restrictions.

2. **JWT Token**: Telegram OSINT requires a JWT token configured in Admin settings (`settings.telegramOsint.jwtToken`).

3. **API URL Override**: All tab API URLs can be overridden from Admin panel → Tab Settings.

4. **Credit System**: All searches (except iFrame tabs) deduct credits via `credits-deduct` edge function.

5. **Settings Storage**: API configurations are stored in Supabase `app_settings` table with key `main_settings`.

---

*Generated for SHUBH OSINT Project*
