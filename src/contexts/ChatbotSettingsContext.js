'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, use } from 'next/navigation'

const defaultSettings = {
  branding: {
    logo_url: '',
    title: '',
    subtitle: ''
  },
  layout: {
    bot_message_side: 'left',
    user_message_side: 'right',
    bot_avatar_url: '',
    user_avatar_url: ''
  },
  widget: {
    widget_logo_url: '',
    widget_position: 'bottom-right'
  },
  content: {
    disclaimer_text: '',
    footer_text: '',
    header_text: ''
  },
  appearance: {
    chat_color: '#8b5cf6',           // Purple accent
    font_color: '#e4e4e7',
    font_family: 'Inter, sans-serif',
    bubble_style: 'rounded',
    bot_message_color: '#8b5cf6',    // Purple
    user_message_color: '#a78bfa',   // Lighter purple
    chat_background_color: '#18181b',
    chat_background_image: ''
  },
  size: {
    widget_size: 'medium',
    widget_width: 400,
    widget_height: 600
  },
  voiceLanguage: {
    enable_mic: false,
    supported_languages: ['en'],
    default_language: 'en'
  },
  sendButton: {
    send_button_color: '#8b5cf6',    // Purple
    send_button_icon: 'arrow',
    send_button_style: 'rounded'
  },
  loading: {
    loading_indicator_type: 'typing-dots',
    loading_indicator_color: '#8b5cf6', // Purple
    loading_text: 'Typing...'
  },
  statusBehavior: {
    status: 'active',
    show_typing_indicator: true,
    typing_delay_ms: 800,
    persist_chat_history: true
  },
  header: {
    header_background_color: '',
    header_font_color: '#0B0C10',
    show_header: true,
    show_close_button: true,
    show_minimize_button: false
  },
  messageText: {
    bot_text_color: '',
    user_text_color: ''
  },
  bubble: {
    bot_bubble_radius: 12,
    user_bubble_radius: 12,
    bot_bubble_shadow: false,
    user_bubble_shadow: false
  },
  avatarSizes: {
    bot_avatar_size: 32,
    user_avatar_size: 32
  },
  input: {
    input_placeholder: 'Type your message...',
    input_background_color: '',
    input_text_color: '',
    input_border_color: '',
    input_border_radius: 8
  },
  widgetButton: {
    widget_button_color: '',
    widget_button_icon: 'chat',
    widget_button_animation: 'pulse',
    widget_button_text: 'Chat with us',
    show_widget_text: false
  },
  fileUpload: {
    enable_file_upload: false,
    allowed_file_types: ['image/*', '.pdf', '.doc', '.docx'],
    max_file_size_mb: 10
  },
  notifications: {
    enable_notification_sound: false,
    notification_sound_url: ''
  },
  previewMessages: {
    preview_bot_message_1: 'Hello! How can I help you today?',
    preview_user_message: 'I have a question about your services.',
    preview_bot_message_2: "Sure! I'd be happy to help. What would you like to know?"
  }
}

const ChatbotSettingsContext = createContext({
  settings: defaultSettings,
  setSettings: () => {},
  updateSetting: () => {},
  hasChanges: false,
  setHasChanges: () => {},
  saving: false,
  handleSave: async () => {},
  loading: true
})

export const useChatbotSettings = () => useContext(ChatbotSettingsContext)

export function ChatbotSettingsProvider({ children, chatbotId }) {
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    fetchChatbot()
  }, [chatbotId])

  const fetchChatbot = async () => {
    try {
      const response = await fetch(`/api/chatbots/${chatbotId}`)
      const data = await response.json()

      if (response.ok) {
        // Deep merge database values with defaults
        const mergeWithDefaults = (defaults, dbData) => {
          const result = { ...defaults }

          for (const key in result) {
            const dbValue = dbData?.[key]
            if (dbValue !== undefined && dbValue !== null) {
              if (typeof result[key] === 'object' && !Array.isArray(result[key]) && result[key] !== null) {
                result[key] = { ...result[key], ...dbValue }
              } else {
                result[key] = dbValue
              }
            }
          }
          return result
        }

        setSettings(mergeWithDefaults(defaultSettings, data.chatbot))
      }
    } catch (error) {
      console.error('Failed to fetch chatbot:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates = {
        ...settings.branding,
        ...settings.layout,
        ...settings.widget,
        ...settings.content,
        ...settings.appearance,
        ...settings.size,
        ...settings.voiceLanguage,
        ...settings.sendButton,
        ...settings.loading,
        ...settings.statusBehavior,
        ...settings.header,
        ...settings.messageText,
        ...settings.bubble,
        ...settings.avatarSizes,
        ...settings.input,
        ...settings.widgetButton,
        ...settings.fileUpload,
        ...settings.notifications,
        ...settings.previewMessages
      }

      const response = await fetch(`/api/chatbots/${chatbotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        setHasChanges(false)
      } else {
        alert('Failed to save changes')
      }
    } catch (error) {
      console.error('Failed to save:', error)
      alert(error.message || 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ChatbotSettingsContext.Provider value={{
      settings,
      setSettings,
      updateSetting,
      hasChanges,
      setHasChanges,
      saving,
      handleSave,
      loading
    }}>
      {children}
    </ChatbotSettingsContext.Provider>
  )
}
