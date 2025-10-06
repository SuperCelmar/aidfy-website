import { describe, it, expect, vi } from 'vitest'

describe('/tutorials page caching', () => {
  it('exports force-dynamic to disable static rendering', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test_anon_key'
    vi.resetModules()
    const TutorialsPageModule = await import('../app/tutorials/page')
    expect((TutorialsPageModule as any).dynamic).toBe('force-dynamic')
  })

  it('exports revalidate=0 to prevent ISR and cache', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test_anon_key'
    vi.resetModules()
    const TutorialsPageModule = await import('../app/tutorials/page')
    expect((TutorialsPageModule as any).revalidate).toBe(0)
  })
})
