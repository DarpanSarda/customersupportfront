import { requireAuth } from '@/lib/auth'

// POST - Bulk import FAQs
export async function POST(request, { params }) {
  const user = await requireAuth(request)

  if (user instanceof Response) {
    return user
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { faqs } = body

    if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
      return Response.json(
        { error: 'FAQs array is required' },
        { status: 400 }
      )
    }

    // Validate each FAQ
    for (const faq of faqs) {
      if (!faq.question || !faq.answer) {
        return Response.json(
          { error: 'Each FAQ must have a question and answer' },
          { status: 400 }
        )
      }
    }

    // For now, return mock response
    const createdFaqs = faqs.map((faq, index) => ({
      id: Date.now().toString() + index,
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      order_index: faq.order_index || index + 1,
      is_active: true,
      created_at: new Date().toISOString()
    }))

    // In production, you would do a bulk insert:
    // const { data, error } = await supabase
    //   .from('faqs')
    //   .insert(
    //     faqs.map(faq => ({
    //       chatbot_id: id,
    //       question: faq.question,
    //       answer: faq.answer,
    //       category: faq.category || 'General',
    //       order_index: faq.order_index || 0
    //     }))
    //   )
    //   .select()

    return Response.json({
      message: `${createdFaqs.length} FAQs imported successfully`,
      faqs: createdFaqs
    })

  } catch (error) {
    console.error('FAQ bulk import error:', error)
    return Response.json(
      { error: 'Failed to import FAQs' },
      { status: 500 }
    )
  }
}
