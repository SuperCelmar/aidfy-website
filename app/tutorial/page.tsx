'use client';

import { useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import TestFreshConnection from './test-fresh-connection';

export default function TutorialPage() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [connectionTime, setConnectionTime] = useState<string>('');

  // Create fresh Supabase connection on component mount (page refresh)
  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Supabase URL or Anon Key is missing from environment variables.');
        }

        // Create a fresh client instance on every page load
        const freshClient = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: false, // Don't persist session to ensure fresh connection
          },
          realtime: {
            params: {
              eventsPerSecond: 10,
            },
          },
        });

        // Test the connection by making a simple query
        const { data, error } = await freshClient
          .from('templates')
          .select('count')
          .limit(1);

        if (error) {
          console.error('Connection test failed:', error);
          setConnectionStatus('error');
        } else {
          setSupabase(freshClient);
          setConnectionStatus('connected');
          setConnectionTime(new Date().toLocaleString());
        }
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        setConnectionStatus('error');
      }
    };

    initializeSupabase();
  }, []); // Empty dependency array ensures this runs on every component mount (page refresh)

  const refreshConnection = () => {
    setConnectionStatus('connecting');
    setSupabase(null);
    
    // Re-run the connection initialization
    const initializeSupabase = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Supabase URL or Anon Key is missing from environment variables.');
        }

        const freshClient = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: false, 
          },
          realtime: {
            params: {
              eventsPerSecond: 10,
            },
          },
        });

        const { data, error } = await freshClient
          .from('templates')
          .select('count')
          .limit(1);

        if (error) {
          console.error('Connection test failed:', error);
          setConnectionStatus('error');
        } else {
          setSupabase(freshClient);
          setConnectionStatus('connected');
          setConnectionTime(new Date().toLocaleString());
        }
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        setConnectionStatus('error');
      }
    };

    initializeSupabase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Tutorial: Fresh Supabase Connection
          </h1>
          
          {/* Connection Status */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Connection Status</h2>
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
                'bg-red-500'
              }`}></div>
              <span className="text-gray-700 font-medium">
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'connecting' ? 'Connecting...' : 
                 'Connection Error'}
              </span>
              {connectionTime && (
                <span className="text-gray-500 text-sm">
                  Connected at: {connectionTime}
                </span>
              )}
            </div>
            
            <button
              onClick={refreshConnection}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              disabled={connectionStatus === 'connecting'}
            >
              {connectionStatus === 'connecting' ? 'Connecting...' : 'Refresh Connection'}
            </button>
          </div>

          {/* Tutorial Content */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">How This Works</h2>
              <div className="prose text-gray-600 space-y-4">
                <p>
                  This tutorial page demonstrates how to create a fresh Supabase connection on every page refresh, 
                  rather than using a singleton connection that's created only once during deployment.
                </p>
                
                <h3 className="text-lg font-medium text-gray-800">Key Features:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Fresh Connection:</strong> A new Supabase client is created every time you refresh this page</li>
                  <li><strong>No Session Persistence:</strong> Connection doesn't persist sessions, ensuring a clean state</li>
                  <li><strong>Connection Testing:</strong> Automatically tests the connection with a simple database query</li>
                  <li><strong>Manual Refresh:</strong> You can manually refresh the connection using the button above</li>
                  <li><strong>Visual Status:</strong> Real-time connection status with timestamp</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Implementation Details</h2>
              <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`// Fresh connection on every page load
useEffect(() => {
  const freshClient = createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: false, // Key: Don't persist sessions
    },
  });
  
  // Test connection and update state
  testConnection(freshClient);
}, []); // Empty deps = runs on every mount`}
                </pre>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Testing Instructions</h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                  <li>Refresh this page (Ctrl+R or Cmd+R) and watch the connection status</li>
                  <li>Notice the "Connected at" timestamp changes with each refresh</li>
                  <li>Click the "Refresh Connection" button to manually create a new connection</li>
                  <li>Open browser dev tools to see connection logs in the console</li>
                </ol>
              </div>
            </section>

                         {/* Connection Info for Debugging */}
             {supabase && (
               <section>
                 <h2 className="text-2xl font-semibold text-gray-800 mb-4">Connection Information</h2>
                 <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                   <p className="text-green-800">
                     ✅ Supabase client successfully initialized and tested
                   </p>
                   <p className="text-green-700 text-sm mt-2">
                     This connection was created fresh when the page loaded and is ready for database operations.
                   </p>
                 </div>
               </section>
             )}

             {/* Test Component */}
             <TestFreshConnection />
           </div>
         </div>
       </div>
     </div>
   );
 } 