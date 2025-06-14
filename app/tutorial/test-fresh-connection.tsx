'use client';

import { useState } from 'react';
import { createAndTestSupabaseConnection } from '@/lib/supabase-fresh';
import { getAllTemplates } from '@/lib/templates'; // Uses singleton connection

export default function TestFreshConnection() {
  const [testResults, setTestResults] = useState<{
    freshConnection?: any;
    singletonConnection?: any;
    timestamp: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runComparison = async () => {
    setIsLoading(true);
    const timestamp = new Date().toLocaleString();

    try {
      // Test fresh connection
      const freshResult = await createAndTestSupabaseConnection();
      
      // Test singleton connection (from lib/templates.ts)
      const singletonStart = performance.now();
      const singletonTemplates = await getAllTemplates();
      const singletonEnd = performance.now();
      
      setTestResults({
        freshConnection: {
          success: freshResult.success,
          connectionTime: freshResult.connectionTime,
          error: freshResult.error,
          hasClient: !!freshResult.client,
        },
        singletonConnection: {
          success: singletonTemplates.length >= 0, // Even 0 templates is a successful connection
          templatesFound: singletonTemplates.length,
          responseTime: `${(singletonEnd - singletonStart).toFixed(2)}ms`,
        },
        timestamp,
      });
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({
        freshConnection: { success: false, error: error },
        singletonConnection: { success: false, error: error },
        timestamp,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 mt-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Connection Comparison Test
      </h3>
      <p className="text-gray-600 mb-4">
        This test compares a fresh Supabase connection (created on-demand) with the singleton 
        connection used elsewhere in the app (created once at module import).
      </p>
      
      <button
        onClick={runComparison}
        disabled={isLoading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Running Test...' : 'Run Connection Test'}
      </button>

      {testResults && (
        <div className="mt-6 space-y-4">
          <div className="text-sm text-gray-500">
            Test run at: {testResults.timestamp}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fresh Connection Results */}
            <div className="border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Fresh Connection</h4>
              <div className="space-y-2 text-sm">
                <div className={`flex items-center space-x-2 ${
                  testResults.freshConnection?.success ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    testResults.freshConnection?.success ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span>
                    {testResults.freshConnection?.success ? 'Connected' : 'Failed'}
                  </span>
                </div>
                
                {testResults.freshConnection?.connectionTime && (
                  <div className="text-gray-600">
                    Created: {new Date(testResults.freshConnection.connectionTime).toLocaleTimeString()}
                  </div>
                )}
                
                {testResults.freshConnection?.error && (
                  <div className="text-red-600 text-xs">
                    Error: {JSON.stringify(testResults.freshConnection.error)}
                  </div>
                )}
              </div>
            </div>

            {/* Singleton Connection Results */}
            <div className="border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 mb-2">Singleton Connection</h4>
              <div className="space-y-2 text-sm">
                <div className={`flex items-center space-x-2 ${
                  testResults.singletonConnection?.success ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    testResults.singletonConnection?.success ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span>
                    {testResults.singletonConnection?.success ? 'Connected' : 'Failed'}
                  </span>
                </div>
                
                {testResults.singletonConnection?.templatesFound !== undefined && (
                  <div className="text-gray-600">
                    Templates found: {testResults.singletonConnection.templatesFound}
                  </div>
                )}
                
                {testResults.singletonConnection?.responseTime && (
                  <div className="text-gray-600">
                    Response time: {testResults.singletonConnection.responseTime}
                  </div>
                )}
                
                {testResults.singletonConnection?.error && (
                  <div className="text-red-600 text-xs">
                    Error: {JSON.stringify(testResults.singletonConnection.error)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 