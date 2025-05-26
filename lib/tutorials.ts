import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing from environment variables.');
}

// Create a single Supabase client instance
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Tutorial interface to match Supabase schema
export interface Tutorial {
  id: string; // UUID
  user_id: string; // UUID
  title: string;
  slug: string;
  content: string;
  description?: string | null;
  youtube_url: string;
  tags?: string[] | null; // TEXT[] in Supabase
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | null;
  estimated_duration?: string | null;
  is_published: boolean;
  created_at: string; // TIMESTAMPTZ
  updated_at: string; // TIMESTAMPTZ
}

// Function to fetch all published tutorials
export async function getAllTutorials(): Promise<Tutorial[]> {
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tutorials:', error);
    return [];
  }
  
  return data as Tutorial[];
}

// Function to fetch tutorials by difficulty level
export async function getTutorialsByDifficulty(difficulty: string): Promise<Tutorial[]> {
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('is_published', true)
    .eq('difficulty_level', difficulty)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tutorials by difficulty:', error);
    return [];
  }
  return data as Tutorial[];
}

// Function to fetch tutorials by tag
export async function getTutorialsByTag(tag: string): Promise<Tutorial[]> {
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('is_published', true)
    .contains('tags', [tag])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tutorials by tag:', error);
    return [];
  }
  return data as Tutorial[];
}

// Function to fetch a single tutorial by slug
export async function getTutorialBySlug(slug: string): Promise<Tutorial | null> {
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single(); // Expects a single row

  if (error) {
    if (error.code === 'PGRST116') { // PostgREST error for no rows found
      return null;
    }
    console.error('Error fetching tutorial by slug:', error);
    return null;
  }
  return data as Tutorial | null;
}

// Function to get all unique tags from published tutorials
export async function getAllTutorialTags(): Promise<string[]> {
  const { data, error } = await supabase
    .from('tutorials')
    .select('tags')
    .eq('is_published', true);

  if (error) {
    console.error('Error fetching tutorial tags:', error);
    return [];
  }

  // Flatten and deduplicate tags
  const allTags = data
    .flatMap(tutorial => tutorial.tags || [])
    .filter((tag, index, array) => array.indexOf(tag) === index)
    .sort();

  return allTags;
}

// Function to search tutorials by title or description
export async function searchTutorials(query: string): Promise<Tutorial[]> {
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('is_published', true)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching tutorials:', error);
    return [];
  }
  return data as Tutorial[];
}

// Helper function to extract YouTube video ID from URL
export function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

// Helper function to get YouTube thumbnail URL
export function getYouTubeThumbnail(url: string, quality: 'default' | 'hqdefault' | 'maxresdefault' = 'hqdefault'): string {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
} 