import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Use SERVICE_ROLE key instead of PUBLIC_ANON key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Service role endpoint missing required environment variables');
}

// Create a special admin client with service role key
const adminSupabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

export async function POST(req: NextRequest) {
  console.log('[ADMIN API] Using service role key to bypass RLS');
  
  // Check if admin client was initialized
  if (!adminSupabase) {
    console.error('[ADMIN API] Missing service role key or URL');
    return NextResponse.json(
      { message: 'Server configuration error. Admin API not properly configured.' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

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
    };

    // Try to insert using admin/service role client (bypasses RLS)
    console.log('[ADMIN API] Attempting insert using SERVICE ROLE key...');
    
    const { data, error } = await adminSupabase
      .from('leads')
      .insert([leadData])
      .select();

    if (error) {
      console.error('[ADMIN API] Service role insert error:', error);
      return NextResponse.json({ 
        message: 'Error inserting lead with service role', 
        error: error 
      }, { status: 500 });
    }

    console.log('[ADMIN API] Insert successful with service role!');
    return NextResponse.json({ 
      message: 'Lead submitted successfully via admin API', 
      data 
    }, { status: 201 });

  } catch (error: any) {
    console.error('[ADMIN API] Error:', error);
    return NextResponse.json({ 
      message: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
} 