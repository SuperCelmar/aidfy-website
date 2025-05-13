import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import JSZip from 'jszip';
// Readable stream import is not strictly necessary if directly using ArrayBuffer from blob

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ZIP API: Missing Supabase URL or Service Role Key. Check environment variables.');
  // No need to create adminSupabase if keys are missing
}

// Initialize admin client only if keys exist
const adminSupabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

export async function POST(req: NextRequest) {
  if (!adminSupabase) {
    console.error('ZIP API: Supabase admin client is not initialized. Configuration error.');
    return NextResponse.json(
      { error: 'Server configuration error preventing file download.' },
      { status: 500 }
    );
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      console.warn('ZIP API: Failed to parse request JSON:', jsonError);
      return NextResponse.json({ error: 'Invalid request format.' }, { status: 400 });
    }
    
    const { filePaths, templateSlug, leadInfo } = body;

    if (!filePaths || !Array.isArray(filePaths) || filePaths.length === 0 || 
        filePaths.some(path => typeof path !== 'string' || !path)) {
      console.warn('ZIP API: Invalid or missing filePaths.', { filePaths });
      return NextResponse.json({ error: 'Missing or invalid file paths provided.' }, { status: 400 });
    }

    // Store lead information if provided
    if (leadInfo && templateSlug && typeof templateSlug === 'string') {
      // Basic validation for leadInfo fields (can be more extensive)
      if (leadInfo.firstName && leadInfo.lastName && leadInfo.companyName && leadInfo.role && leadInfo.interest) {
        const { error: leadError } = await adminSupabase
          .from('leads')
          .insert([{
            first_name: leadInfo.firstName,
            last_name: leadInfo.lastName,
            company_name: leadInfo.companyName,
            role: leadInfo.role,
            interest_reason: leadInfo.interest,
            template_slug: templateSlug,
            template_title: leadInfo.templateTitle || null // templateTitle is optional
          }]);

        if (leadError) {
          console.error('ZIP API: Error storing lead information:', leadError.message);
          // Non-critical error, proceed with ZIP creation
        }
      } else {
        console.warn('ZIP API: Incomplete leadInfo received, not storing lead.', { leadInfo });
      }
    }

    const zip = new JSZip();
    let filesAddedToZip = 0;
    
    for (const filePath of filePaths) {
      try {
        const fileName = filePath.split('/').pop() || 'unknown-file';
        const { data, error } = await adminSupabase.storage.from('template-files').download(filePath);
        
        if (error || !data) {
          console.error(`ZIP API: Error downloading file ${filePath} from storage:`, error?.message || 'No data');
          continue; // Skip this file and try the next
        }
        
        zip.file(fileName, await data.arrayBuffer());
        filesAddedToZip++;
      } catch (fileProcessingError) {
        console.error(`ZIP API: Error processing file ${filePath} for zipping:`, fileProcessingError);
        // Continue to try and zip other files
      }
    }
    
    if (filesAddedToZip === 0) {
      console.error('ZIP API: Failed to add any files to the ZIP.');
      return NextResponse.json({ error: 'Could not retrieve any files for download.' }, { status: 500 });
    }
    
    const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });
    const zipFileName = templateSlug ? `${templateSlug}-files.zip` : 'template-files.zip';
    
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFileName}"`,
      },
    });
    
  } catch (error: any) {
    console.error('ZIP API: Unexpected error generating ZIP file:', error.message, { stack: error.stack });
    return NextResponse.json(
      { error: 'An unexpected error occurred while preparing your download.' },
      { status: 500 }
    );
  }
} 