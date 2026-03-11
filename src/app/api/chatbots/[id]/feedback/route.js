import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET - Fetch feedback for a chatbot
export async function GET(request, { params }) {
  const user = await requireAuth(request)

  if (user instanceof Response) {
    return user
  }

  const { id } = await params

  try {
    // For now, return empty feedback array
    // In a real implementation, you would fetch from a feedback table
    return Response.json({
      feedback: []
    })

  } catch (error) {
    console.error('Feedback fetch error:', error)
    return Response.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}
