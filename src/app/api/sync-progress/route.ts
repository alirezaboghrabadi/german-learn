import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Sync progress data
    if (body.type === 'progress') {
      const { error } = await supabase.from('user_progress').upsert(body.data, {
        onConflict: 'user_id,lesson_id',
      })

      if (error) throw error
    }

    // Sync study session
    if (body.type === 'session') {
      const { error } = await supabase.from('study_sessions').insert(body.data)
      if (error) throw error
    }

    // Sync review results
    if (body.type === 'review') {
      const { error } = await supabase.from('review_items').upsert(body.data, {
        onConflict: 'user_id,vocabulary_id',
      })
      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync progress' },
      { status: 500 }
    )
  }
}
