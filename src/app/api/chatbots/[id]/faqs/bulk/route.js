import { requireAuth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Helper function to get tenant_id from chatbot_id
async function getTenantId(chatbotId) {
  const { data: chatbot, error } = await supabase
    .from('chatbots')
    .select('tenant_id')
    .eq('id', chatbotId)
    .single()

  if (error || !chatbot) {
    return null
  }

  return chatbot.tenant_id || chatbotId
}

// POST - Bulk import FAQs
export async function POST(request, { params }) {
  const user = await requireAuth(request)

  if (user instanceof Response) {
    return user
  }

  const { id } = await params

  try {
    // Get tenant_id from chatbot
    const tenantId = await getTenantId(id)

    if (!tenantId) {
      return Response.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      )
    }

    // Get the file from the form data
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return Response.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    // Forward the file to the external API
    const externalFormData = new FormData()
    externalFormData.append('file', file)

    const response = await fetch(`${API_URL}faq/bulk?tenant_id=${tenantId}`, {
      method: 'POST',
      body: externalFormData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to import FAQs')
    }

    const result = await response.json()

    // Fetch the newly created FAQs to return to the client
    const faqsResponse = await fetch(`${API_URL}faq/${tenantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const faqs = faqsResponse.ok ? await faqsResponse.json() : []

    return Response.json({
      message: `${result.created || 0} FAQs imported successfully`,
      faqs: faqs.map(f => ({
        ...f,
        is_active: true,
        created_at: f.created_at || new Date().toISOString()
      }))
    })

  } catch (error) {
    console.error('FAQ bulk import error:', error)
    return Response.json(
      { error: error.message || 'Failed to import FAQs' },
      { status: 500 }
    )
  }
}
