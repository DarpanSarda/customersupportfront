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

// GET - Fetch all FAQs for a chatbot
export async function GET(request, { params }) {
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

    // Fetch from external API
    const response = await fetch(`${API_URL}faq/${tenantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch FAQs from external API')
    }

    const faqs = await response.json()

    return Response.json({
      faqs: faqs.map(f => ({
        ...f,
        is_active: true,
        created_at: f.created_at || new Date().toISOString()
      })),
      total: faqs.length
    })

  } catch (error) {
    console.error('FAQs fetch error:', error)
    return Response.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    )
  }
}

// POST - Create a new FAQ
export async function POST(request, { params }) {
  const user = await requireAuth(request)

  if (user instanceof Response) {
    return user
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { question, answer, category } = body

    if (!question || !answer) {
      return Response.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      )
    }

    // Get tenant_id from chatbot
    const tenantId = await getTenantId(id)

    if (!tenantId) {
      return Response.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      )
    }

    // Create FAQ via external API
    const response = await fetch(`${API_URL}faq/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tenant_id: tenantId,
        question,
        answer,
        category: category || 'general'
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to create FAQ')
    }

    const faq = await response.json()

    return Response.json({
      message: 'FAQ created successfully',
      faq: {
        ...faq,
        is_active: true,
        created_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('FAQ creation error:', error)
    return Response.json(
      { error: error.message || 'Failed to create FAQ' },
      { status: 500 }
    )
  }
}

// PUT - Update an FAQ
export async function PUT(request, { params }) {
  const user = await requireAuth(request)

  if (user instanceof Response) {
    return user
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { faqId, question, answer, category, is_active } = body

    if (!faqId) {
      return Response.json(
        { error: 'FAQ ID is required' },
        { status: 400 }
      )
    }

    // Get tenant_id from chatbot
    const tenantId = await getTenantId(id)

    if (!tenantId) {
      return Response.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      )
    }

    // Update FAQ via external API
    const response = await fetch(`${API_URL}faq/${faqId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tenant_id: tenantId,
        question,
        answer,
        category: category || 'general'
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to update FAQ')
    }

    const faq = await response.json()

    return Response.json({
      message: 'FAQ updated successfully',
      faq: {
        ...faq,
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('FAQ update error:', error)
    return Response.json(
      { error: error.message || 'Failed to update FAQ' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an FAQ
export async function DELETE(request, { params }) {
  const user = await requireAuth(request)

  if (user instanceof Response) {
    return user
  }

  const { id } = await params

  try {
    const { searchParams } = new URL(request.url)
    const faqId = searchParams.get('faqId')

    if (!faqId) {
      return Response.json(
        { error: 'FAQ ID is required' },
        { status: 400 }
      )
    }

    // Get tenant_id from chatbot
    const tenantId = await getTenantId(id)

    if (!tenantId) {
      return Response.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      )
    }

    // Delete FAQ via external API
    const response = await fetch(`${API_URL}faq/${tenantId}/${faqId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to delete FAQ')
    }

    return Response.json({
      message: 'FAQ deleted successfully'
    })

  } catch (error) {
    console.error('FAQ deletion error:', error)
    return Response.json(
      { error: error.message || 'Failed to delete FAQ' },
      { status: 500 }
    )
  }
}
