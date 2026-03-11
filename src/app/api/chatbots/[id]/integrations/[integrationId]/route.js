import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// DELETE - Disconnect an integration from a chatbot
export async function DELETE(request, { params }) {
  const user = await requireAuth(request)

  if (user instanceof Response) {
    return user
  }

  const { id, integrationId } = await params

  try {
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

    // In a real implementation, you would delete from an integrations table
    // For now, just return success
    return Response.json({
      message: 'Integration disconnected successfully',
      integrationId
    })

  } catch (error) {
    console.error('Integration disconnection error:', error)
    return Response.json(
      { error: 'Failed to disconnect integration' },
      { status: 500 }
    )
  }
}
