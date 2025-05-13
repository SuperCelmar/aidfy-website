import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing from environment variables.');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(req: NextRequest) {
  console.log('[API /api/test-templates] NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.log('[API /api/test-templates] NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '********' : supabaseAnonKey);
  
  try {
    // Try to fetch templates (should work since templates table allows SELECT for anon)
    const { data: templates, error: templatesError } = await supabase
      .from('templates')
      .select('*')
      .limit(1);
    
    if (templatesError) {
      console.error('Error fetching templates:', templatesError);
      return NextResponse.json({
        success: false,
        message: 'Error fetching templates',
        error: templatesError
      }, { status: 500 });
    }
    
    // Try to insert into leads (should fail based on our previous tests)
    const testLeadData = {
      first_name: 'Test',
      last_name: 'User',
      company_name: 'Test Company',
      role: 'Tester',
      interest_reason: 'Testing permissions',
      template_slug: 'test-slug',
      template_title: 'Test Template'
    };
    
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .insert([testLeadData])
      .select();
    
    return NextResponse.json({
      success: true,
      templates: templates,
      leadInsertResult: {
        success: !leadError,
        data: leadData,
        error: leadError
      }
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
} 