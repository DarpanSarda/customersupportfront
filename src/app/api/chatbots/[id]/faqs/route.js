import { requireAuth } from '@/lib/auth'

// Mock FAQ data (will be replaced with database queries later)
const MOCK_FAQS = [
  {
    id: '1',
    question: 'What are your business hours?',
    answer: 'We are open Monday through Friday, 9 AM to 5 PM EST. Our support team is available during these hours to assist you with any questions.',
    category: 'General',
    order_index: 1,
    is_active: true
  },
  {
    id: '2',
    question: 'How do I reset my password?',
    answer: 'To reset your password, click on the "Forgot Password" link on the login page. You will receive an email with instructions to create a new password.',
    category: 'Account',
    order_index: 2,
    is_active: true
  },
  {
    id: '3',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards including Visa, MasterCard, and American Express. We also support PayPal and bank transfers for enterprise customers.',
    category: 'Billing',
    order_index: 3,
    is_active: true
  },
  {
    id: '4',
    question: 'How can I contact customer support?',
    answer: 'You can reach our customer support team through the contact form on our website, email us at support@example.com, or call us at 1-800-123-4567.',
    category: 'Support',
    order_index: 4,
    is_active: true
  },
  {
    id: '5',
    question: 'What is your refund policy?',
    answer: 'We offer a 30-day money-back guarantee on all our products. If you are not satisfied, contact our support team for a full refund.',
    category: 'Billing',
    order_index: 5,
    is_active: true
  }
]

// GET - Fetch all FAQs for a chatbot
export async function GET(request, { params }) {
  const user = await requireAuth(request)

  if (user instanceof Response) {
    return user
  }

  const { id } = await params

  // Verify chatbot ownership
  try {
    // For now, return mock data
    // In production, this would query the database:
    // const { data: faqs } = await supabase
    //   .from('faqs')
    //   .select('*')
    //   .eq('chatbot_id', id)
    //   .order('order_index', { ascending: true })

    return Response.json({
      faqs: MOCK_FAQS,
      total: MOCK_FAQS.length
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
    const { question, answer, category, order_index } = body

    if (!question || !answer) {
      return Response.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      )
    }

    // For now, return mock response
    const newFaq = {
      id: Date.now().toString(),
      question,
      answer,
      category: category || 'General',
      order_index: order_index || MOCK_FAQS.length + 1,
      is_active: true,
      created_at: new Date().toISOString()
    }

    // In production:
    // const { data, error } = await supabase
    //   .from('faqs')
    //   .insert({
    //     chatbot_id: id,
    //     question,
    //     answer,
    //     category,
    //     order_index
    //   })
    //   .select()
    //   .single()

    return Response.json({
      message: 'FAQ created successfully',
      faq: newFaq
    })

  } catch (error) {
    console.error('FAQ creation error:', error)
    return Response.json(
      { error: 'Failed to create FAQ' },
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
    const { faqId, question, answer, category, order_index, is_active } = body

    if (!faqId) {
      return Response.json(
        { error: 'FAQ ID is required' },
        { status: 400 }
      )
    }

    // For now, return mock response
    const updatedFaq = {
      id: faqId,
      question: question || 'Updated question',
      answer: answer || 'Updated answer',
      category: category || 'General',
      order_index: order_index || 1,
      is_active: is_active !== undefined ? is_active : true,
      updated_at: new Date().toISOString()
    }

    return Response.json({
      message: 'FAQ updated successfully',
      faq: updatedFaq
    })

  } catch (error) {
    console.error('FAQ update error:', error)
    return Response.json(
      { error: 'Failed to update FAQ' },
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

    // For now, return mock response
    return Response.json({
      message: 'FAQ deleted successfully'
    })

  } catch (error) {
    console.error('FAQ deletion error:', error)
    return Response.json(
      { error: 'Failed to delete FAQ' },
      { status: 500 }
    )
  }
}
