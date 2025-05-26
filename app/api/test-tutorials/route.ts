import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ 
        error: 'Missing Supabase environment variables',
        supabaseUrl: !!supabaseUrl,
        supabaseAnonKey: !!supabaseAnonKey
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Test basic connection
    const { data: allData, error: allError } = await supabase
      .from('tutorials')
      .select('id, title, slug, is_published, created_at')
      .order('created_at', { ascending: false });

    if (allError) {
      return NextResponse.json({ 
        error: 'Database query failed', 
        details: allError 
      }, { status: 500 });
    }

    // Test published only
    const { data: publishedData, error: publishedError } = await supabase
      .from('tutorials')
      .select('id, title, slug, is_published, created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (publishedError) {
      return NextResponse.json({ 
        error: 'Published query failed', 
        details: publishedError 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      environment: {
        supabaseUrl: supabaseUrl?.substring(0, 30) + '...',
        hasAnonKey: !!supabaseAnonKey
      },
      allTutorials: {
        count: allData?.length || 0,
        tutorials: allData?.map(t => ({
          id: t.id,
          title: t.title,
          slug: t.slug,
          is_published: t.is_published,
          created_at: t.created_at
        }))
      },
      publishedTutorials: {
        count: publishedData?.length || 0,
        tutorials: publishedData?.map(t => ({
          id: t.id,
          title: t.title,
          slug: t.slug,
          is_published: t.is_published,
          created_at: t.created_at
        }))
      }
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 