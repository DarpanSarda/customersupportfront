import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET - Fetch single chatbot
export async function GET(request, { params }) {
  const user = await requireAuth(request)

  if (user instanceof Response) {
    return user
  }

  const { id } = await params

  try {
    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.userId)
      .single()

    if (error || !chatbot) {
      return Response.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      )
    }

    return Response.json({ chatbot })

  } catch (error) {
    console.error('Chatbot fetch error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update chatbot
export async function PUT(request, { params }) {
  const user = await requireAuth(request)

  if (user instanceof Response) {
    return user
  }

  const { id } = await params

  try {
    const updates = await request.json()

    // Verify ownership
    const { data: existing } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existing || existing.user_id !== user.userId) {
      return Response.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      )
    }

    // Update chatbot
    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Chatbot update error:', error)
      return Response.json(
        { error: 'Failed to update chatbot' },
        { status: 500 }
      )
    }

    return Response.json({
      message: 'Chatbot updated successfully',
      chatbot
    })

  } catch (error) {
    console.error('Chatbot update error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete chatbot
export async function DELETE(request, { params }) {
  const user = await requireAuth(request)

  if (user instanceof Response) {
    return user
  }

  const { id } = await params

  try {
    // Verify ownership
    const { data: existing } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existing || existing.user_id !== user.userId) {
      return Response.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      )
    }

    // Delete chatbot
    const { error } = await supabase
      .from('chatbots')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Chatbot delete error:', error)
      return Response.json(
        { error: 'Failed to delete chatbot' },
        { status: 500 }
      )
    }

    return Response.json({
      message: 'Chatbot deleted successfully'
    })

  } catch (error) {
    console.error('Chatbot delete error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
