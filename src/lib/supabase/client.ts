import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Define Supabase credentials within the function to ensure they are available.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Your project\'s URL and Key are required to create a Supabase client!')
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
