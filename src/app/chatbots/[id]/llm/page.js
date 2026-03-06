'use client'

import { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

const LLM_PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4, GPT-4 Turbo, and GPT-3.5 Turbo',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
    requiresApiKey: true,
    requiresBaseUrl: false,
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.0993 3.8558L12.6 8.3829l2.02-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" fill={color || "#000"}/>
      </svg>
    )
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude 3 Opus, Sonnet, and Haiku',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
    requiresApiKey: true,
    requiresBaseUrl: false,
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.304 3.541l-.518-.259a11.493 11.493 0 0 0-5.254-1.242c-1.862 0-3.628.432-5.192 1.202l-.388.194c-.107.054-.214.111-.318.171l-.084.049a11.523 11.523 0 0 0-4.356 4.356l-.049.084c-.06.104-.117.211-.171.318l-.194.388a11.468 11.468 0 0 0-1.202 5.192c0 1.862.432 3.628 1.202 5.192l.194.388c.054.107.111.214.171.318l.049.084a11.523 11.523 0 0 0 4.356 4.356l.084.049c.104.06.211.117.318.171l.388.194a11.468 11.468 0 0 0 5.192 1.202c1.862 0 3.628-.432 5.192-1.202l.388-.194c.107-.054.214-.111.318-.171l.084-.049a11.523 11.523 0 0 0 4.356-4.356l.049-.084c.06-.104.117-.211.171-.318l.194-.388a11.468 11.468 0 0 0 1.202-5.192c0-1.862-.432-3.628-1.202-5.192l-.194-.388c-.054-.107-.111-.214-.171-.318l-.049-.084a11.523 11.523 0 0 0-4.356-4.356l-.084-.049c-.104-.06-.211-.117-.318-.171zM6.696 8.171l.518-.259c.842-.421 1.739-.646 2.664-.646 1.637 0 3.149.583 4.34 1.553l-3.416 3.416-4.106-4.064zm4.722 8.514c-1.637 0-3.149-.583-4.34-1.553l3.416-3.416 4.106 4.064c-.842.537-1.818.905-2.858.905zm7.549-4.506c-.259.842-.646 1.624-1.148 2.341l-3.945-3.945 3.416-3.416c1.025.842 1.739 2.044 1.941 3.416.119.842.179 1.699.179 2.556 0 .329-.015.658-.045.983l-.398-1.935z" fill={color || "#000"}/>
      </svg>
    )
  },
  {
    id: 'google',
    name: 'Google AI',
    description: 'Gemini Pro and Ultra models',
    models: ['gemini-2.0-flash-exp', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'],
    requiresApiKey: true,
    requiresBaseUrl: false,
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" fill={color || "#4285F4"}/>
        <path d="M12 6c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" fill={color || "#34A853"}/>
        <path d="M12 8c-2.209 0-4 1.791-4 4h8c0-2.209-1.791-4-4-4z" fill={color || "#EA4335"}/>
        <path d="M8 12h8v2H8z" fill={color || "#FBBC05"}/>
      </svg>
    )
  },
  {
    id: 'cohere',
    name: 'Cohere',
    description: 'Command R and Command R+',
    models: ['command-r-plus', 'command-r', 'command'],
    requiresApiKey: true,
    requiresBaseUrl: false,
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l7.5 3.75v7.14L12 18.82 4.5 15.07V7.93L12 4.18z" fill={color || "#39594D"}/>
        <path d="M12 7l-4 2v6l4 2 4-2V9l-4-2z" fill={color || "#39594D"} fillOpacity="0.7"/>
      </svg>
    )
  },
  {
    id: 'openai-compatible',
    name: 'OpenAI Compatible',
    description: 'Ollama, LocalAI, or any OpenAI-compatible API',
    models: [],
    requiresApiKey: false,
    requiresBaseUrl: true,
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill={color || "#000"}/>
      </svg>
    )
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    description: 'Access thousands of open-source models',
    models: [],
    requiresApiKey: true,
    requiresBaseUrl: false,
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="9" r="2" fill={color || "#FFD21E"}/>
        <circle cx="15" cy="9" r="2" fill={color || "#FFD21E"}/>
        <path d="M9 14c-1.5 0-2.8.8-3.5 2 .7 1.2 2 2 3.5 2s2.8-.8 3.5-2c-.7-1.2-2-2-3.5-2zm6 0c-1.5 0-2.8.8-3.5 2 .7 1.2 2 2 3.5 2s2.8-.8 3.5-2c-.7-1.2-2-2-3.5-2z" fill={color || "#FFD21E"}/>
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" fill={color || "#FFD21E"} fillOpacity="0.2"/>
      </svg>
    )
  }
]

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } }
}

export default function LLMPage({ params }) {
  const { id } = use(params)
  const { colors, theme } = useTheme()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  const [settings, setSettings] = useState({
    provider: 'openai',
    apiKey: '',
    baseUrl: '',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 4096,
    topP: 1,
    topK: 40,
    frequencyPenalty: 0,
    presencePenalty: 0
  })

  const [selectedProvider, setSelectedProvider] = useState('openai')

  // Get current provider config
  const currentProvider = LLM_PROVIDERS.find(p => p.id === selectedProvider) || LLM_PROVIDERS[0]

  useEffect(() => {
    fetchCredentials()
  }, [id])

  const fetchCredentials = async () => {
    try {
      const response = await fetch(`/api/chatbots/${id}/llm`)
      const data = await response.json()

      if (response.ok) {
        setSettings(data)
        setSelectedProvider(data.provider || 'openai')
      }
    } catch (error) {
      console.error('Failed to fetch LLM credentials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProviderChange = (providerId) => {
    setSelectedProvider(providerId)
    const provider = LLM_PROVIDERS.find(p => p.id === providerId)

    // Reset to default model for this provider
    if (provider.models.length > 0) {
      setSettings(prev => ({ ...prev, model: provider.models[0] }))
    } else {
      setSettings(prev => ({ ...prev, model: '' }))
    }

    setSettings(prev => ({ ...prev, provider: providerId }))
    setHasChanges(true)
  }

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/chatbots/${id}/llm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setHasChanges(false)
        alert('LLM configuration saved successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save LLM configuration')
      }
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save LLM configuration')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 rounded-2xl text-center" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
        <div style={{ color: colors.text }}>Loading LLM configuration...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: colors.text }}>LLM Configuration</h2>
            <p style={{ color: colors.textSecondary }}>Configure your language model provider and settings</p>
          </div>
        </div>
      </motion.div>

      {/* Provider Selection */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
      >
        <div className="p-6 rounded-2xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Select LLM Provider</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LLM_PROVIDERS.map((provider) => (
              <motion.button
                key={provider.id}
                onClick={() => handleProviderChange(provider.id)}
                className={`p-4 rounded-xl text-left transition-all ${
                  selectedProvider === provider.id ? 'ring-2' : ''
                }`}
                style={{
                  backgroundColor: selectedProvider === provider.id
                    ? `${colors.accent}15`
                    : 'transparent',
                  border: `1px solid ${selectedProvider === provider.id ? colors.accent : colors.border}`,
                  ring: selectedProvider === provider.id ? colors.accent : 'transparent'
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 shrink-0">
                    {provider.icon(selectedProvider === provider.id ? colors.accent : colors.text)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1" style={{ color: colors.text }}>
                      {provider.name}
                    </div>
                    <div className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                      {provider.description}
                    </div>
                    <div className="flex gap-2 text-xs">
                      {provider.requiresApiKey && (
                        <span className="px-2 py-1 rounded" style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}>
                          API Key
                        </span>
                      )}
                      {provider.requiresBaseUrl && (
                        <span className="px-2 py-1 rounded" style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}>
                          Custom URL
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* API Configuration */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <div className="p-6 rounded-2xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>API Configuration</h3>

          <div className="space-y-4">
            {/* API Key */}
            {currentProvider.requiresApiKey && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.apiKey || ''}
                    onChange={(e) => handleInputChange('apiKey', e.target.value)}
                    placeholder={`Enter your ${currentProvider.name} API key`}
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all pr-12"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.border}`,
                      color: colors.text
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
                    style={{ color: colors.textSecondary }}
                  >
                    {showApiKey ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs mt-2" style={{ color: colors.textSecondary }}>
                  Your API key is stored securely and used only for this chatbot.
                </p>
              </div>
            )}

            {/* Base URL (for custom endpoints) */}
            {currentProvider.requiresBaseUrl && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Base URL
                </label>
                <input
                  type="url"
                  value={settings.baseUrl || ''}
                  onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                  placeholder="https://api.example.com/v1"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
                <p className="text-xs mt-2" style={{ color: colors.textSecondary }}>
                  Enter the base URL for your OpenAI-compatible API endpoint (e.g., Ollama, LocalAI).
                </p>
              </div>
            )}

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Model
              </label>
              {currentProvider.models.length > 0 ? (
                <select
                  value={settings.model || currentProvider.models[0]}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                >
                  {currentProvider.models.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={settings.model || ''}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="Enter model name (e.g., llama2, mistral)"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Model Parameters */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <div className="p-6 rounded-2xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Model Parameters</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Temperature: {settings.temperature || 0.7}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature || 0.7}
                onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                className="w-full"
                style={{ accentColor: colors.accent }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: colors.textSecondary }}>
                <span>Precise (0)</span>
                <span>Creative (2)</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Max Tokens
              </label>
              <input
                type="number"
                min="1"
                max="128000"
                step="1"
                value={settings.maxTokens || 4096}
                onChange={(e) => handleInputChange('maxTokens', parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
              />
              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                Maximum number of tokens in the response
              </p>
            </div>

            {/* Top P */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Top P: {settings.topP || 1}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.topP || 1}
                onChange={(e) => handleInputChange('topP', parseFloat(e.target.value))}
                className="w-full"
                style={{ accentColor: colors.accent }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: colors.textSecondary }}>
                <span>Focused (0)</span>
                <span>Diverse (1)</span>
              </div>
            </div>

            {/* Top K */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Top K
              </label>
              <input
                type="number"
                min="1"
                max="100"
                step="1"
                value={settings.topK || 40}
                onChange={(e) => handleInputChange('topK', parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
              />
              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                Limits the token selection to top K options
              </p>
            </div>

            {/* Frequency Penalty */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Frequency Penalty: {settings.frequencyPenalty || 0}
              </label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={settings.frequencyPenalty || 0}
                onChange={(e) => handleInputChange('frequencyPenalty', parseFloat(e.target.value))}
                className="w-full"
                style={{ accentColor: colors.accent }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: colors.textSecondary }}>
                <span>More repetitive (-2)</span>
                <span>Less repetitive (2)</span>
              </div>
            </div>

            {/* Presence Penalty */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Presence Penalty: {settings.presencePenalty || 0}
              </label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={settings.presencePenalty || 0}
                onChange={(e) => handleInputChange('presencePenalty', parseFloat(e.target.value))}
                className="w-full"
                style={{ accentColor: colors.accent }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: colors.textSecondary }}>
                <span>Stay on topic (-2)</span>
                <span>Explore new topics (2)</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end gap-4"
        >
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
            style={{
              backgroundColor: colors.accent,
              color: theme === 'dark' ? '#0B0C10' : '#fff'
            }}
          >
            {saving ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Info Box */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
        className="flex items-start gap-3 p-4 rounded-xl"
        style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)', border: `1px solid ${colors.accent}30` }}
      >
        <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm" style={{ color: colors.textSecondary }}>
          <span className="font-medium" style={{ color: colors.text }}>Note:</span> API keys are stored securely using AES-256-GCM encryption. Different providers have different pricing models. Check the provider's documentation for details.
        </div>
      </motion.div>
    </div>
  )
}
