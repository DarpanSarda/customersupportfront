import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET - Fetch integrations for a chatbot
export async function GET(request, { params }) {
  const user = await requireAuth(request)

  if (user instanceof Response) {
    return user
  }

  const { id } = await params

  try {
    // For now, return empty integrations array
    // In a real implementation, you would fetch from an integrations table
    return Response.json({
      integrations: []
    })

  } catch (error) {
    console.error('Integrations fetch error:', error)
    return Response.json(
      { error: 'Failed to fetch integrations' },
      { status: 500 }
    )
  }
}

// POST - Add an integration to a chatbot
export async function POST(request, { params }) {
  const user = await requireAuth(request)

  if (user instanceof Response) {
    return user
  }

  const { id } = await params

  try {
    const body = await request.json()

    // Verify chatbot ownership
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!chatbot || chatbot.user_id !== user.userId) {
      return Response.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      )
    }

    // In a real implementation, you would insert into an integrations table
    // For now, just return success
    return Response.json({
      message: 'Integration connected successfully',
      integrationId: body.integrationId
    })

  } catch (error) {
    console.error('Integration connection error:', error)
    return Response.json(
      { error: 'Failed to connect integration' },
      { status: 500 }
    )
  }
}
