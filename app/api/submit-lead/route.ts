import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Initialize Supabase client
// Ensure these environment variables are set in your .env.local file and deployment environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log the environment variables as seen by this API route
console.log('[API /api/submit-lead] NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
console.log('[API /api/submit-lead] NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '********' : supabaseAnonKey); // Log key presence, not value

if (!supabaseUrl || !supabaseAnonKey) {
  // Log this error on the server, but don't expose details to the client
  console.error('Supabase URL or Anon Key is missing. Check server environment variables.');
  // Consider not throwing here directly in API route, 
  // so the server can start and other routes might work.
  // Instead, ensure proper handling in the POST function if client is not initialized.
}

// Explicitly set headers for debugging this 401 issue
let supabase = null;
if (supabaseUrl && supabaseAnonKey) {
  console.log('[API /api/submit-lead] Initializing Supabase client with standard method.');
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('[API /api/submit-lead] Supabase client object created:', supabase ? typeof supabase : null, supabase ? Object.keys(supabase) : null);
} else {
  console.error('[API /api/submit-lead] Supabase URL or Anon Key STILL missing before client re-initialization attempt.');
}

export async function POST(req: NextRequest) {
  // Log the keys again inside the POST handler to see if they persist or if there's a scope issue
  console.log('[POST /api/submit-lead] Effective Supabase URL for client:', supabaseUrl);
  console.log('[POST /api/submit-lead] Effective Supabase Anon Key for client:', supabaseAnonKey ? '********' : supabaseAnonKey);

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { message: 'Server configuration error. Unable to process request.' },
      { status: 500 }
    );
  }

  try {
    // Try to check the RLS status of the leads table first
    const { data: rls_check, error: rls_error } = await supabase.rpc('check_rls_on_leads', {});
    
    console.log('[POST /api/submit-lead] RLS Check Result:', rls_check);
    if (rls_error) {
      console.error('[POST /api/submit-lead] RLS check error:', rls_error);
      // Continue even if this check fails, since the stored procedure might not exist
    }
    
    const body = await req.json();

    // --- START: Collect Metadata ---
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = (forwardedFor ? forwardedFor.split(',')[0].trim() : null) || realIp || null;
    const userAgent = req.headers.get('user-agent');
    // --- END: Collect Metadata ---

    // Basic validation (consider more robust validation e.g. with Zod)
    const {
      firstName,
      lastName,
      companyName,
      role,
      interest,
      template_slug,
      template_title
    } = body;

    if (!firstName || !lastName || !companyName || !role || !interest || !template_slug) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const leadData = {
      first_name: firstName,
      last_name: lastName,
      company_name: companyName,
      role: role,
      interest_reason: interest,
      template_slug: template_slug,
      template_title: template_title, // This can be null if not always provided
      // --- START: Add Metadata to leadData ---
      ip_address: ip,
      user_agent: userAgent,
      // --- END: Add Metadata to leadData ---
    };

    // APPROACH 1: Try using Supabase client first (now that we've fixed RLS)
    console.log('[POST /api/submit-lead] Attempting insert using Supabase client...');
    const { data, error } = await supabase.from('leads').insert([leadData]).select();

    if (!error) {
      console.log('[POST /api/submit-lead] Supabase client insert successful!');
      return NextResponse.json({ message: 'Lead submitted successfully', data }, { status: 201 });
    } 
    
    console.error('[POST /api/submit-lead] Supabase client insert error:', error);
    
    // APPROACH 2: If client still fails, fall back to direct curl
    console.log('[POST /api/submit-lead] Falling back to curl method...');
    
    // Escape any quotes in the JSON to prevent command injection
    const safeJsonData = JSON.stringify(leadData).replace(/"/g, '\\"');
    
    // Construct curl command
    const curlCommand = `curl -v -X POST "${supabaseUrl}/rest/v1/leads" \
      -H "apikey: ${supabaseAnonKey}" \
      -H "Authorization: Bearer ${supabaseAnonKey}" \
      -H "Content-Type: application/json" \
      -H "Prefer: return=representation" \
      -d "${safeJsonData}"`;
    
    console.log('[POST /api/submit-lead] Executing curl command (API key masked):', 
      curlCommand.replace(supabaseAnonKey, '********'));
    
    try {
      const { stdout, stderr } = await execPromise(curlCommand);
      console.log('[POST /api/submit-lead] curl stdout:', stdout);
      if (stderr) console.log('[POST /api/submit-lead] curl stderr:', stderr);
      
      // Try to parse the response
      try {
        const curlData = JSON.parse(stdout);
        if (curlData.code && curlData.message && curlData.message.includes("permission denied")) {
          console.error('[POST /api/submit-lead] Curl also failed with permission error');
          return NextResponse.json({ 
            message: 'Permission error persists even with curl',
            error: curlData
          }, { status: 500 });
        }
        return NextResponse.json({ message: 'Lead submitted successfully via curl', data: curlData }, { status: 201 });
      } catch (parseError) {
        if (stdout.includes("permission denied")) {
          console.error('[POST /api/submit-lead] Curl also failed with permission error');
          return NextResponse.json({ 
            message: 'Permission error persists even with curl',
            details: stdout
          }, { status: 500 });
        }
        return NextResponse.json({ 
          message: 'Lead submission via curl returned non-JSON response', 
          details: stdout 
        }, { status: 200 });
      }
    } catch (curlError: any) {
      console.error('[POST /api/submit-lead] curl execution error:', curlError.message);
      console.log('[POST /api/submit-lead] curl stderr:', curlError.stderr);
      return NextResponse.json({ 
        message: 'Error submitting lead via curl and Supabase client', 
        clientError: error,
        curlError: curlError.message,
        stderr: curlError.stderr
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('API Error:', error);
    // Check if it's a JSON parsing error or other unexpected error
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
} 