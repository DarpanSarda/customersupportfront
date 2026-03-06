import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth'
import { encrypt, decrypt } from '@/lib/encryption'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET - Fetch LLM credentials for a chatbot
export async function GET(request, { params }) {
  const user = await requireAuth(request)

  if (user instanceof Response) {
    return user
  }

  const { id } = await params

  try {
    const { data: credentials, error } = await supabase
      .from('llm_credentials')
      .select('*')
      .eq('chatbot_id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No credentials found yet, return defaults
        return Response.json({
          provider: 'openai',
          baseUrl: '',
          model: 'gpt-4o',
          temperature: 0.7,
          maxTokens: 4096,
          topP: 1,
          topK: 40,
          frequencyPenalty: 0,
          presencePenalty: 0,
          apiKey: ''
        })
      }
      throw error
    }

    // Decrypt API key
    const decryptedKey = decrypt(
      credentials.api_key_encrypted,
      credentials.iv,
      credentials.tag
    )

    return Response.json({
      provider: credentials.provider,
      baseUrl: credentials.base_url || '',
      model: credentials.model || 'gpt-4o',
      temperature: credentials.temperature || 0.7,
      maxTokens: credentials.max_tokens || 4096,
      topP: credentials.top_p || 1,
      topK: credentials.top_k || 40,
      frequencyPenalty: credentials.frequency_penalty || 0,
      presencePenalty: credentials.presence_penalty || 0,
      apiKey: decryptedKey
    })

  } catch (error) {
    console.error('LLM credentials fetch error:', error)
    return Response.json(
      { error: 'Failed to fetch LLM credentials' },
      { status: 500 }
    )
  }
}

// POST - Create or update LLM credentials for a chatbot
export async function POST(request, { params }) {
  const user = await requireAuth(request)

  if (user instanceof Response) {
    return user
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { provider, apiKey, baseUrl, model, temperature, maxTokens, topP, topK, frequencyPenalty, presencePenalty } = body

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

    // Encrypt API key
    const encrypted = encrypt(apiKey)

    // Check if credentials already exist
    const { data: existing } = await supabase
      .from('llm_credentials')
      .select('id')
      .eq('chatbot_id', id)
      .eq('provider', provider)
      .single()

    const credentialsData = {
      chatbot_id: id,
      provider,
      api_key_encrypted: encrypted.encrypted,
      iv: encrypted.iv,
      tag: encrypted.tag,
      base_url: baseUrl || null,
      model: model || null,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 4096,
      top_p: topP || 1,
      top_k: topK || 40,
      frequency_penalty: frequencyPenalty || 0,
      presence_penalty: presencePenalty || 0
    }

    let result
    if (existing) {
      // Update existing credentials
      const { data, error } = await supabase
        .from('llm_credentials')
        .update(credentialsData)
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Create new credentials
      const { data, error } = await supabase
        .from('llm_credentials')
        .insert(credentialsData)
        .select()
        .single()

      if (error) throw error
      result = data
    }

    return Response.json({
      message: 'LLM credentials saved successfully',
      provider: result.provider,
      model: result.model
    })

  } catch (error) {
    console.error('LLM credentials save error:', error)
    return Response.json(
      { error: 'Failed to save LLM credentials' },
      { status: 500 }
    )
  }
}

// DELETE - Delete LLM credentials for a chatbot
export async function DELETE(request, { params }) {
  const user = await requireAuth(request)

  if (user instanceof Response) {
    return user
  }

  const { id } = await params

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

    // Delete credentials
    const { error } = await supabase
      .from('llm_credentials')
      .delete()
      .eq('chatbot_id', id)

    if (error) throw error

    return Response.json({
      message: 'LLM credentials deleted successfully'
    })

  } catch (error) {
    console.error('LLM credentials delete error:', error)
    return Response.json(
      { error: 'Failed to delete LLM credentials' },
      { status: 500 }
    )
  }
}
