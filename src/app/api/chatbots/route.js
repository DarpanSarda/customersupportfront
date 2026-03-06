import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET - List all chatbots for authenticated user
export async function GET(request) {
  const user = await requireAuth(request)

  // Return error response if auth failed
  if (user instanceof Response) {
    return user
  }

  try {
    const { data: chatbots, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('user_id', user.userId)
      .order('created_at', { ascending: false })

    if (error) {
      return Response.json(
        { error: 'Failed to fetch chatbots' },
        { status: 500 }
      )
    }

    return Response.json({ chatbots })

  } catch (error) {
    console.error('Chatbots fetch error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new chatbot
export async function POST(request) {
  const user = await requireAuth(request)

  // Return error response if auth failed
  if (user instanceof Response) {
    return user
  }

  try {
    const body = await request.json()
    const { name } = body

    // Validate input
    if (!name || name.trim() === '') {
      return Response.json(
        { error: 'Chatbot name is required' },
        { status: 400 }
      )
    }

    // Create chatbot with default settings
    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .insert([
        {
          user_id: user.userId,
          name: name.trim(),
          status: 'inactive'
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Chatbot creation error:', error)
      return Response.json(
        { error: 'Failed to create chatbot' },
        { status: 500 }
      )
    }

    return Response.json(
      {
        message: 'Chatbot created successfully',
        chatbot
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Chatbot creation error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
