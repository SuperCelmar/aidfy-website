import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing from environment variables.');
}

// Create a single Supabase client instance
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Updated Template interface to match Supabase schema
export interface Template {
  id: string; // UUID
  user_id: string; // UUID
  title: string;
  slug: string;
  description: string;
  key_features: string[]; // TEXT[] in Supabase
  icp: string; // Ideal Customer Profile
  youtube_url?: string | null;
  video_description?: string | null; // Populated from video_highlights
  template_date: string; // DATE (YYYY-MM-DD)
  created_at: string; // TIMESTAMPTZ
  updated_at: string; // TIMESTAMPTZ
  // We might add a field here later if a specific thumbnail is uploaded for the card display
  // e.g., card_thumbnail_path?: string | null;
}

// Interface for template files
export interface TemplateFile {
  id: string; // UUID
  template_id: string; // UUID
  user_id: string; // UUID
  file_name: string;
  file_path: string; // Path in Supabase Storage
  file_size?: number | null;
  file_type?: string | null;
  created_at: string; // TIMESTAMPTZ
}

// Function to fetch all templates
export async function getAllTemplates(): Promise<Template[]> {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
  return data as Template[];
}

// Function to fetch a single template by slug
export async function getTemplateBySlug(slug: string): Promise<Template | null> {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('slug', slug)
    .single(); // Expects a single row

  if (error) {
    if (error.code === 'PGRST116') { // PostgREST error for no rows found or multiple rows for .single()
        // console.warn(`Template with slug "${slug}" not found.`); // Optional: keep if useful for debugging
        return null;
    }
    console.error('Error fetching template by slug:', error);
    return null;
  }
  return data as Template | null;
}

// Function to fetch files for a specific template
export async function getTemplateFiles(templateId: string): Promise<TemplateFile[]> {
  const { data, error } = await supabase
    .from('template_files')
    .select('*')
    .eq('template_id', templateId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error(`Supabase error fetching template files for ID ${templateId}:`, error);
    return []; // Return empty array on error
  }

  if (!data) {
    // console.warn(`Supabase returned null data for template files with ID ${templateId}.`); // Optional
    return []; // Return empty array if data is null
  }

  return data as TemplateFile[];
}

// Function to get a public URL for a file in Supabase Storage
// Assumes the bucket 'template-files' allows public reads, or use signed URLs for private files.
export function getPublicFileUrl(filePath: string): string {
  const { data } = supabase
    .storage
    .from('template-files') // Ensure this matches your bucket name
    .getPublicUrl(filePath);
  
  return data?.publicUrl || '';
}

// If you need signed URLs for private files (more secure but more complex to manage):
// export async function getSignedFileUrl(filePath: string): Promise<string | null> {
//   const { data, error } = await supabase
//     .storage
//     .from('template-files')
//     .createSignedUrl(filePath, 60 * 60); // URL valid for 1 hour

//   if (error) {
//     console.error('Error creating signed URL:', error);
//     return null;
//   }
//   return data?.signedUrl;
// } 