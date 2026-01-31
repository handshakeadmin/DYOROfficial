# Supabase Configuration

## Credentials

| Key             | Value                                            |
| --------------- | ------------------------------------------------ |
| Project URL     | `https://vjqoarseyxptyadlxaza.supabase.co`       |
| DB Password     | `IVIMfvRbrJsijByg`                               |
| Publishable Key | `sb_publishable_1_bnaZSq3AQab4jUgNo_Sw_yXcE5rGA` |
| Secret Key      | `sb_secret_CM8Afi-O0hZsXE9nOhX81Q_TjmyeDM9`      |

---

## Environment Variables (`.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://vjqoarseyxptyadlxaza.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_1_bnaZSq3AQab4jUgNo_Sw_yXcE5rGA
```

---

## MCP Server

**URL:** `https://mcp.supabase.com/mcp?project_ref=vjqoarseyxptyadlxaza`

**CLI Command:**

```bash
claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=vjqoarseyxptyadlxaza"
```

**JSON Config:**

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=vjqoarseyxptyadlxaza"
    }
  }
}
```

---

## Code Files

### `utils/supabase/server.ts`

```typescript
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};
```

### `utils/supabase/client.ts`

```typescript
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const createClient = () =>
  createBrowserClient(supabaseUrl!, supabaseKey!);
```

### `utils/supabase/middleware.ts`

```typescript
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  return supabaseResponse;
};
```

### `page.tsx` (Example Usage)

```typescript
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <ul>
      {todos?.map((todo) => (
        <li>{todo}</li>
      ))}
    </ul>
  )
}
```
