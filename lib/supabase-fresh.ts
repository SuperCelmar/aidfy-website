import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a fresh Supabase client instance
 * Use this when you need a new connection rather than the singleton from lib/templates.ts
 * 
 * @param options - Optional configuration for the Supabase client
 * @returns A new SupabaseClient instance or null if environment variables are missing
 */
export function createFreshSupabaseClient(options?: {
  persistSession?: boolean;
  autoRefreshToken?: boolean;
}): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing from environment variables.');
    return null;
  }

  const defaultOptions = {
    persistSession: false, // Default: don't persist sessions for fresh connections
    autoRefreshToken: true, // Default: allow token refresh
  };

  const finalOptions = { ...defaultOptions, ...options };

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: finalOptions.autoRefreshToken,
      persistSession: finalOptions.persistSession,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
}

/**
 * Creates a fresh Supabase client and tests the connection
 * 
 * @param testTable - Table name to test connection against (defaults to 'templates')
 * @returns Promise resolving to { client, success, error }
 */
export async function createAndTestSupabaseConnection(testTable: string = 'templates'): Promise<{
  client: SupabaseClient | null;
  success: boolean;
  error?: any;
  connectionTime: string;
}> {
  const connectionTime = new Date().toISOString();
  
  try {
    const client = createFreshSupabaseClient();
    
    if (!client) {
      return {
        client: null,
        success: false,
        error: 'Failed to create Supabase client - missing environment variables',
        connectionTime,
      };
    }

    // Test the connection with a simple query
    const { data, error } = await client
      .from(testTable)
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase connection test failed:', error);
      return {
        client: null,
        success: false,
        error,
        connectionTime,
      };
    }

    console.log(`Fresh Supabase connection established at ${connectionTime}`);
    return {
      client,
      success: true,
      connectionTime,
    };
  } catch (error) {
    console.error('Failed to create and test Supabase connection:', error);
    return {
      client: null,
      success: false,
      error,
      connectionTime,
    };
  }
}

/**
 * Hook for React components to create fresh Supabase connections
 * This is useful when you want to ensure a fresh connection in a specific component
 */
export function useFreshSupabase() {
  return {
    createFreshClient: createFreshSupabaseClient,
    createAndTestConnection: createAndTestSupabaseConnection,
  };
} 