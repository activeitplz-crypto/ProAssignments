
'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../database.types';

// This function needs to be a singleton.
let client: ReturnType<typeof createBrowserClient<Database>> | undefined = undefined;

export function createClient() {
  if (client) {
    return client;
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
}
