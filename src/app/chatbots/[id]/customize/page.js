'use client'

import React, { useState, use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { useChatbotSettings } from '@/contexts/ChatbotSettingsContext'
import FileUpload from '@/components/file-upload/FileUpload'

const chatbotCustomizeTabs = [
  { id: 'branding', label: 'Branding', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'layout', label: 'Layout', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
  { id: 'widget', label: 'Widget', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { id: 'content', label: 'Content', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'appearance', label: 'Appearance', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
  { id: 'size', label: 'Size', icon: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' },
  { id: 'voice-language', label: 'Voice & Language', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z M12 2a2 2 0 012 2v2a2 2 0 01-4 0V4a2 2 0 012-2z M8.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z M15.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' },
  { id: 'send-button', label: 'Send Button', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
  { id: 'loading', label: 'Loading', icon: 'M12 4v2m0 12v2M8 8.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 8.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z M12 8a4 4 0 100 8 4 4 0 000-8z' },
  { id: 'status-behavior', label: 'Status & Behavior', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'header', label: 'Header', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13h16v-2H4v2z' },
  { id: 'messages', label: 'Messages', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { id: 'input', label: 'Input', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { id: 'widget-button', label: 'Widget Button', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { id: 'file-upload', label: 'File Upload', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
  { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { id: 'preview-messages', label: 'Preview Messages', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' }
]

const languageOptions = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿' },
  { code: 'el', name: 'Greek', flag: '🇬🇷' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺' }
]

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export default function CustomizePage({ params }) {
  const { id } = use(params)
  const { colors, theme } = useTheme()
  const { settings, updateSetting, hasChanges, saving, handleSave, loading } = useChatbotSettings()
  const [activeTab, setActiveTab] = useState('branding')
  const [chatbot, setChatbot] = useState(null)

  // Fetch chatbot name for header
  React.useEffect(() => {
    fetchChatbot()
  }, [id])

  const fetchChatbot = async () => {
    try {
      const response = await fetch(`/api/chatbots/${id}`)
      const data = await response.json()
      if (response.ok) {
        setChatbot(data.chatbot)
      }
    } catch (error) {
      console.error('Failed to fetch chatbot:', error)
    }
  }

  const uploadFile = async (file, oldUrl) => {
    const formData = new FormData()
    formData.append('file', file)
    if (oldUrl) {
      formData.append('oldUrl', oldUrl)
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    if (data.success) {
      return data.url
    }
    throw new Error(data.error || 'Upload failed')
  }

  const handleSaveWithUpload = async () => {
    // Upload files first if they are File objects
    let logoUrl = settings.branding.logo_url
    let widgetLogoUrl = settings.widget.widget_logo_url
    let botAvatarUrl = settings.layout.bot_avatar_url
    let userAvatarUrl = settings.layout.user_avatar_url
    let chatBackgroundImageUrl = settings.appearance.chat_background_image

    // Upload logo if it's a File
    if (logoUrl instanceof File) {
      logoUrl = await uploadFile(logoUrl, chatbot?.logo_url)
      updateSetting('branding', 'logo_url', logoUrl)
    }

    // Upload widget logo if it's a File
    if (widgetLogoUrl instanceof File) {
      widgetLogoUrl = await uploadFile(widgetLogoUrl, chatbot?.widget_logo_url)
      updateSetting('widget', 'widget_logo_url', widgetLogoUrl)
    }

    // Upload bot avatar if it's a File
    if (botAvatarUrl instanceof File) {
      botAvatarUrl = await uploadFile(botAvatarUrl, chatbot?.bot_avatar_url)
      updateSetting('layout', 'bot_avatar_url', botAvatarUrl)
    }

    // Upload user avatar if it's a File
    if (userAvatarUrl instanceof File) {
      userAvatarUrl = await uploadFile(userAvatarUrl, chatbot?.user_avatar_url)
      updateSetting('layout', 'user_avatar_url', userAvatarUrl)
    }

    // Upload chat background image if it's a File
    if (chatBackgroundImageUrl instanceof File) {
      chatBackgroundImageUrl = await uploadFile(chatBackgroundImageUrl, chatbot?.chat_background_image)
      updateSetting('appearance', 'chat_background_image', chatBackgroundImageUrl)
    }

    // Call the original handleSave from context
    await handleSave()
  }

  // Helper functions to get avatar URLs (handles both strings and File objects)
  const getBotAvatarUrl = () => {
    if (settings.layout.bot_avatar_url instanceof File) {
      return URL.createObjectURL(settings.layout.bot_avatar_url)
    }
    return settings.layout.bot_avatar_url
  }

  const getUserAvatarUrl = () => {
    if (settings.layout.user_avatar_url instanceof File) {
      return URL.createObjectURL(settings.layout.user_avatar_url)
    }
    return settings.layout.user_avatar_url
  }

  const getBrandLogoUrl = () => {
    if (settings.branding.logo_url instanceof File) {
      return URL.createObjectURL(settings.branding.logo_url)
    }
    return settings.branding.logo_url
  }

  const getChatBackgroundImageUrl = () => {
    if (settings.appearance.chat_background_image instanceof File) {
      return URL.createObjectURL(settings.appearance.chat_background_image)
    }
    return settings.appearance.chat_background_image
  }

  // Helper to render loading indicator preview
  const renderLoadingIndicator = (type) => {
    const color = settings.loading.loading_indicator_color
    switch (type) {
      case 'typing-dots':
        return (
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: color,
                  animationDelay: `${i * 0.15}s`
                }}
              />
            ))}
          </div>
        )
      case 'pulsing-dot':
        return (
          <div
            className="w-3 h-3 rounded-full animate-ping"
            style={{ backgroundColor: color }}
          />
        )
      case 'spinning-dots':
        return (
          <div className="flex gap-1 animate-spin">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: color,
                  opacity: 1 - (i * 0.3)
                }}
              />
            ))}
          </div>
        )
      case 'wave':
        return (
          <div className="flex gap-1 items-end">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-1.5 rounded-full animate-bounce"
                style={{
                  backgroundColor: color,
                  height: '12px',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
        <div className="text-2xl" style={{ color: colors.accent }}>Loading...</div>
      </div>
    )
  }

  const renderSettingsPanel = () => {
    switch (activeTab) {
      case 'branding':
        return (
          <motion.div key="branding" initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>Branding</h3>

            <FileUpload
              label="Logo"
              value={settings.branding.logo_url}
              onChange={(url) => updateSetting('branding', 'logo_url', url)}
            />

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Title</label>
              <input
                type="text"
                value={settings.branding.title}
                onChange={(e) => updateSetting('branding', 'title', e.target.value)}
                placeholder="My Chatbot"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Subtitle</label>
              <textarea
                value={settings.branding.subtitle}
                onChange={(e) => updateSetting('branding', 'subtitle', e.target.value)}
                placeholder="How can I help you today?"
                rows={3}
                className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
              />
            </div>
          </motion.div>
        )

      case 'layout':
        return (
          <motion.div key="layout" initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>Layout</h3>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Bot Message Side</label>
              <div className="flex gap-4">
                {['left', 'right'].map(side => (
                  <button
                    key={side}
                    onClick={() => updateSetting('layout', 'bot_message_side', side)}
                    className={`px-6 py-3 rounded-xl font-semibold capitalize ${
                      settings.layout.bot_message_side === side ? 'opacity-100' : 'opacity-50'
                    }`}
                    style={{
                      backgroundColor: settings.layout.bot_message_side === side ? colors.accent : colors.card,
                      color: settings.layout.bot_message_side === side ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                    }}
                  >
                    {side}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>User Message Side</label>
              <div className="flex gap-4">
                {['left', 'right'].map(side => (
                  <button
                    key={side}
                    onClick={() => updateSetting('layout', 'user_message_side', side)}
                    className={`px-6 py-3 rounded-xl font-semibold capitalize ${
                      settings.layout.user_message_side === side ? 'opacity-100' : 'opacity-50'
                    }`}
                    style={{
                      backgroundColor: settings.layout.user_message_side === side ? colors.accent : colors.card,
                      color: settings.layout.user_message_side === side ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                    }}
                  >
                    {side}
                  </button>
                ))}
              </div>
            </div>

            <FileUpload
              label="Bot Avatar"
              value={settings.layout.bot_avatar_url}
              onChange={(url) => updateSetting('layout', 'bot_avatar_url', url)}
            />

            <FileUpload
              label="User Avatar"
              value={settings.layout.user_avatar_url}
              onChange={(url) => updateSetting('layout', 'user_avatar_url', url)}
            />
          </motion.div>
        )

      case 'widget':
        return (
          <motion.div key="widget" initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>Widget</h3>

            <FileUpload
              label="Widget Logo"
              value={settings.widget.widget_logo_url}
              onChange={(url) => updateSetting('widget', 'widget_logo_url', url)}
            />

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Widget Position</label>
              <div className="flex gap-4">
                {['bottom-right', 'bottom-left'].map(position => (
                  <button
                    key={position}
                    onClick={() => updateSetting('widget', 'widget_position', position)}
                    className={`px-6 py-3 rounded-xl font-semibold capitalize ${
                      settings.widget.widget_position === position ? 'opacity-100' : 'opacity-50'
                    }`}
                    style={{
                      backgroundColor: settings.widget.widget_position === position ? colors.accent : colors.card,
                      color: settings.widget.widget_position === position ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                    }}
                  >
                    {position.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 'content':
        return (
          <motion.div key="content" initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>Content</h3>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Header Text</label>
              <input
                type="text"
                value={settings.content.header_text}
                onChange={(e) => updateSetting('content', 'header_text', e.target.value)}
                placeholder="Welcome to our chat!"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Disclaimer Text</label>
              <textarea
                value={settings.content.disclaimer_text}
                onChange={(e) => updateSetting('content', 'disclaimer_text', e.target.value)}
                placeholder="This chatbot is for demo purposes only."
                rows={3}
                className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Footer Text</label>
              <textarea
                value={settings.content.footer_text}
                onChange={(e) => updateSetting('content', 'footer_text', e.target.value)}
                placeholder="Powered by HelpGenie"
                rows={2}
                className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
              />
            </div>
          </motion.div>
        )

      case 'appearance':
        return (
          <motion.div key="appearance" initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>Appearance</h3>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Chat Color</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.appearance.chat_color}
                  onChange={(e) => updateSetting('appearance', 'chat_color', e.target.value)}
                  className="w-16 h-16 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.appearance.chat_color}
                  onChange={(e) => updateSetting('appearance', 'chat_color', e.target.value)}
                  placeholder="#8b5cf6"
                  className="flex-1 px-4 py-3 rounded-xl outline-none uppercase"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Font Color</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.appearance.font_color}
                  onChange={(e) => updateSetting('appearance', 'font_color', e.target.value)}
                  className="w-16 h-16 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.appearance.font_color}
                  onChange={(e) => updateSetting('appearance', 'font_color', e.target.value)}
                  placeholder="#C5C6C7"
                  className="flex-1 px-4 py-3 rounded-xl outline-none uppercase"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Font Family</label>
              <select
                value={settings.appearance.font_family}
                onChange={(e) => updateSetting('appearance', 'font_family', e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Open Sans, sans-serif">Open Sans</option>
                <option value="Lato, sans-serif">Lato</option>
                <option value="Montserrat, sans-serif">Montserrat</option>
                <option value="Poppins, sans-serif">Poppins</option>
                <option value="Nunito, sans-serif">Nunito</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Bubble Style</label>
              <div className="flex gap-4">
                {['rounded', 'pill', 'square'].map(style => (
                  <button
                    key={style}
                    onClick={() => updateSetting('appearance', 'bubble_style', style)}
                    className={`px-6 py-3 rounded-xl font-semibold capitalize ${
                      settings.appearance.bubble_style === style ? 'opacity-100' : 'opacity-50'
                    }`}
                    style={{
                      backgroundColor: settings.appearance.bubble_style === style ? colors.accent : colors.card,
                      color: settings.appearance.bubble_style === style ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Bot Message Color</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.appearance.bot_message_color}
                  onChange={(e) => updateSetting('appearance', 'bot_message_color', e.target.value)}
                  className="w-16 h-16 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.appearance.bot_message_color}
                  onChange={(e) => updateSetting('appearance', 'bot_message_color', e.target.value)}
                  placeholder="#8b5cf6"
                  className="flex-1 px-4 py-3 rounded-xl outline-none uppercase"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>User Message Color</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.appearance.user_message_color}
                  onChange={(e) => updateSetting('appearance', 'user_message_color', e.target.value)}
                  className="w-16 h-16 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.appearance.user_message_color}
                  onChange={(e) => updateSetting('appearance', 'user_message_color', e.target.value)}
                  placeholder="#7c3aed"
                  className="flex-1 px-4 py-3 rounded-xl outline-none uppercase"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Chat Background Color</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.appearance.chat_background_color}
                  onChange={(e) => updateSetting('appearance', 'chat_background_color', e.target.value)}
                  className="w-16 h-16 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.appearance.chat_background_color}
                  onChange={(e) => updateSetting('appearance', 'chat_background_color', e.target.value)}
                  placeholder="#1F2937"
                  className="flex-1 px-4 py-3 rounded-xl outline-none uppercase"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              </div>
            </div>

            <FileUpload
              label="Chat Background Image"
              value={settings.appearance.chat_background_image}
              onChange={(url) => updateSetting('appearance', 'chat_background_image', url)}
              accept="image/*"
            />
          </motion.div>
        )

      case 'size':
        return (
          <motion.div key="size" initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>Size</h3>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Widget Size Preset</label>
              <div className="flex gap-4 flex-wrap">
                {[
                  { id: 'small', label: 'Small', width: 350, height: 500 },
                  { id: 'medium', label: 'Medium', width: 400, height: 600 },
                  { id: 'large', label: 'Large', width: 450, height: 700 },
                  { id: 'extra-large', label: 'Extra Large', width: 500, height: 800 }
                ].map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      updateSetting('size', 'widget_size', preset.id)
                      updateSetting('size', 'widget_width', preset.width)
                      updateSetting('size', 'widget_height', preset.height)
                    }}
                    className={`px-4 py-2 rounded-xl font-semibold ${
                      settings.size.widget_size === preset.id ? 'opacity-100' : 'opacity-50'
                    }`}
                    style={{
                      backgroundColor: settings.size.widget_size === preset.id ? colors.accent : colors.card,
                      color: settings.size.widget_size === preset.id ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
                Widget Width: {settings.size.widget_width}px
              </label>
              <input
                type="range"
                min="300"
                max="600"
                step="10"
                value={settings.size.widget_width}
                onChange={(e) => updateSetting('size', 'widget_width', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
                Widget Height: {settings.size.widget_height}px
              </label>
              <input
                type="range"
                min="400"
                max="800"
                step="10"
                value={settings.size.widget_height}
                onChange={(e) => updateSetting('size', 'widget_height', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </motion.div>
        )

      case 'voice-language':
        return (
          <motion.div key="voice-language" initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>Voice & Language</h3>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Enable Microphone</label>
              <button
                onClick={() => updateSetting('voiceLanguage', 'enable_mic', !settings.voiceLanguage.enable_mic)}
                className={`px-6 py-3 rounded-xl font-semibold ${
                  settings.voiceLanguage.enable_mic ? 'opacity-100' : 'opacity-50'
                }`}
                style={{
                  backgroundColor: settings.voiceLanguage.enable_mic ? colors.accent : colors.card,
                  color: settings.voiceLanguage.enable_mic ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                }}
              >
                {settings.voiceLanguage.enable_mic ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Default Language</label>
              <select
                value={settings.voiceLanguage.default_language}
                onChange={(e) => updateSetting('voiceLanguage', 'default_language', e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
              >
                {languageOptions.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Supported Languages</label>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {languageOptions.map(lang => (
                  <label key={lang.code} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:opacity-80" style={{ backgroundColor: colors.card }}>
                    <input
                      type="checkbox"
                      checked={settings.voiceLanguage.supported_languages.includes(lang.code)}
                      onChange={(e) => {
                        const newLangs = e.target.checked
                          ? [...settings.voiceLanguage.supported_languages, lang.code]
                          : settings.voiceLanguage.supported_languages.filter(l => l !== lang.code)
                        updateSetting('voiceLanguage', 'supported_languages', newLangs.length > 0 ? newLangs : ['en'])
                      }}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm" style={{ color: colors.text }}>
                      {lang.flag} {lang.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 'send-button':
        return (
          <motion.div key="send-button" initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>Send Button</h3>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Send Button Color</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.sendButton.send_button_color}
                  onChange={(e) => updateSetting('sendButton', 'send_button_color', e.target.value)}
                  className="w-16 h-16 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.sendButton.send_button_color}
                  onChange={(e) => updateSetting('sendButton', 'send_button_color', e.target.value)}
                  placeholder="#8b5cf6"
                  className="flex-1 px-4 py-3 rounded-xl outline-none uppercase"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Send Button Icon</label>
              <div className="flex gap-4">
                {['arrow', 'paper-plane'].map(icon => (
                  <button
                    key={icon}
                    onClick={() => updateSetting('sendButton', 'send_button_icon', icon)}
                    className={`px-6 py-3 rounded-xl font-semibold capitalize ${
                      settings.sendButton.send_button_icon === icon ? 'opacity-100' : 'opacity-50'
                    }`}
                    style={{
                      backgroundColor: settings.sendButton.send_button_icon === icon ? colors.accent : colors.card,
                      color: settings.sendButton.send_button_icon === icon ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                    }}
                  >
                    {icon.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Send Button Style</label>
              <div className="flex gap-4">
                {['rounded', 'circle', 'square'].map(style => (
                  <button
                    key={style}
                    onClick={() => updateSetting('sendButton', 'send_button_style', style)}
                    className={`px-6 py-3 rounded-xl font-semibold capitalize ${
                      settings.sendButton.send_button_style === style ? 'opacity-100' : 'opacity-50'
                    }`}
                    style={{
                      backgroundColor: settings.sendButton.send_button_style === style ? colors.accent : colors.card,
                      color: settings.sendButton.send_button_style === style ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 'loading':
        return (
          <motion.div key="loading" initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>Loading</h3>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Loading Indicator Type</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'typing-dots', label: 'Typing Dots' },
                  { id: 'pulsing-dot', label: 'Pulsing Dot' },
                  { id: 'spinning-dots', label: 'Spinning Dots' },
                  { id: 'wave', label: 'Wave' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => updateSetting('loading', 'loading_indicator_type', type.id)}
                    className={`flex items-center justify-center gap-3 px-4 py-4 rounded-xl font-semibold ${
                      settings.loading.loading_indicator_type === type.id ? 'opacity-100' : 'opacity-50'
                    }`}
                    style={{
                      backgroundColor: settings.loading.loading_indicator_type === type.id ? colors.accent : colors.card,
                      color: settings.loading.loading_indicator_type === type.id ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                    }}
                  >
                    <div className="w-8">
                      {renderLoadingIndicator(type.id)}
                    </div>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Loading Indicator Color</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.loading.loading_indicator_color}
                  onChange={(e) => updateSetting('loading', 'loading_indicator_color', e.target.value)}
                  className="w-16 h-16 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.loading.loading_indicator_color}
                  onChange={(e) => updateSetting('loading', 'loading_indicator_color', e.target.value)}
                  placeholder="#8b5cf6"
                  className="flex-1 px-4 py-3 rounded-xl outline-none uppercase"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Loading Text</label>
              <input
                type="text"
                value={settings.loading.loading_text}
                onChange={(e) => updateSetting('loading', 'loading_text', e.target.value)}
                placeholder="Typing..."
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
              />
            </div>
          </motion.div>
        )

      case 'status-behavior':
        return (
          <motion.div key="status-behavior" initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>Status & Behavior</h3>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Chatbot Status</label>
              <div className="flex gap-4">
                {['active', 'inactive'].map(status => (
                  <button
                    key={status}
                    onClick={() => updateSetting('statusBehavior', 'status', status)}
                    className={`px-6 py-3 rounded-xl font-semibold capitalize ${
                      settings.statusBehavior.status === status ? 'opacity-100' : 'opacity-50'
                    }`}
                    style={{
                      backgroundColor: settings.statusBehavior.status === status ? colors.accent : colors.card,
                      color: settings.statusBehavior.status === status ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Show Typing Indicator</label>
              <button
                onClick={() => updateSetting('statusBehavior', 'show_typing_indicator', !settings.statusBehavior.show_typing_indicator)}
                className={`px-6 py-3 rounded-xl font-semibold ${
                  settings.statusBehavior.show_typing_indicator ? 'opacity-100' : 'opacity-50'
                }`}
                style={{
                  backgroundColor: settings.statusBehavior.show_typing_indicator ? colors.accent : colors.card,
                  color: settings.statusBehavior.show_typing_indicator ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                }}
              >
                {settings.statusBehavior.show_typing_indicator ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
                Typing Delay: {settings.statusBehavior.typing_delay_ms}ms
              </label>
              <input
                type="range"
                min="200"
                max="2000"
                step="100"
                value={settings.statusBehavior.typing_delay_ms}
                onChange={(e) => updateSetting('statusBehavior', 'typing_delay_ms', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Persist Chat History</label>
              <button
                onClick={() => updateSetting('statusBehavior', 'persist_chat_history', !settings.statusBehavior.persist_chat_history)}
                className={`px-6 py-3 rounded-xl font-semibold ${
                  settings.statusBehavior.persist_chat_history ? 'opacity-100' : 'opacity-50'
                }`}
                style={{
                  backgroundColor: settings.statusBehavior.persist_chat_history ? colors.accent : colors.card,
                  color: settings.statusBehavior.persist_chat_history ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                }}
              >
                {settings.statusBehavior.persist_chat_history ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </motion.div>
        )

      case 'header':
        return (
          <motion.div key="header" initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>Header Customization</h3>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Show Header</label>
              <button
                onClick={() => updateSetting('header', 'show_header', !settings.header.show_header)}
                className={`px-6 py-3 rounded-xl font-semibold ${
                  settings.header.show_header ? 'opacity-100' : 'opacity-50'
                }`}
                style={{
                  backgroundColor: settings.header.show_header ? colors.accent : colors.card,
                  color: settings.header.show_header ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                }}
              >
                {settings.header.show_header ? 'Visible' : 'Hidden'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Header Background Color</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.header.header_background_color || settings.appearance.chat_color}
                  onChange={(e) => updateSetting('header', 'header_background_color', e.target.value)}
                  className="w-16 h-16 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.header.header_background_color || settings.appearance.chat_color}
                  onChange={(e) => updateSetting('header', 'header_background_color', e.target.value)}
                  placeholder="Use chat color"
                  className="flex-1 px-4 py-3 rounded-xl outline-none uppercase"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Leave empty to use chat color</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Header Font Color</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.header.header_font_color || '#0B0C10'}
                  onChange={(e) => updateSetting('header', 'header_font_color', e.target.value)}
                  className="w-16 h-16 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.header.header_font_color || '#0B0C10'}
                  onChange={(e) => updateSetting('header', 'header_font_color', e.target.value)}
                  placeholder="#0B0C10"
                  className="flex-1 px-4 py-3 rounded-xl outline-none uppercase"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Show Close Button</label>
              <button
                onClick={() => updateSetting('header', 'show_close_button', !settings.header.show_close_button)}
                className={`px-6 py-3 rounded-xl font-semibold ${
                  settings.header.show_close_button ? 'opacity-100' : 'opacity-50'
                }`}
                style={{
                  backgroundColor: settings.header.show_close_button ? colors.accent : colors.card,
                  color: settings.header.show_close_button ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                }}
              >
                {settings.header.show_close_button ? 'Visible' : 'Hidden'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Show Minimize Button</label>
              <button
                onClick={() => updateSetting('header', 'show_minimize_button', !settings.header.show_minimize_button)}
                className={`px-6 py-3 rounded-xl font-semibold ${
                  settings.header.show_minimize_button ? 'opacity-100' : 'opacity-50'
                }`}
                style={{
                  backgroundColor: settings.header.show_minimize_button ? colors.accent : colors.card,
                  color: settings.header.show_minimize_button ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                }}
              >
                {settings.header.show_minimize_button ? 'Visible' : 'Hidden'}
              </button>
            </div>
          </motion.div>
        )

      case 'messages':
        return (
          <motion.div key="messages" initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>Message Customization</h3>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Bot Text Color</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.messageText.bot_text_color || settings.appearance.font_color}
                  onChange={(e) => updateSetting('messageText', 'bot_text_color', e.target.value)}
                  className="w-16 h-16 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.messageText.bot_text_color || settings.appearance.font_color}
                  onChange={(e) => updateSetting('messageText', 'bot_text_color', e.target.value)}
                  placeholder="Use font color"
                  className="flex-1 px-4 py-3 rounded-xl outline-none uppercase"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Leave empty to use font color</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>User Text Color</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.messageText.user_text_color || (theme === 'dark' ? '#0B0C10' : '#fff')}
                  onChange={(e) => updateSetting('messageText', 'user_text_color', e.target.value)}
                  className="w-16 h-16 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.messageText.user_text_color || (theme === 'dark' ? '#0B0C10' : '#fff')}
                  onChange={(e) => updateSetting('messageText', 'user_text_color', e.target.value)}
                  placeholder="Use theme default"
                  className="flex-1 px-4 py-3 rounded-xl outline-none uppercase"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Leave empty to use theme default</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
                Bot Bubble Radius: {settings.bubble.bot_bubble_radius}px
              </label>
              <input
                type="range"
                min="0"
                max="24"
                value={settings.bubble.bot_bubble_radius}
                onChange={(e) => updateSetting('bubble', 'bot_bubble_radius', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
                User Bubble Radius: {settings.bubble.user_bubble_radius}px
              </label>
              <input
                type="range"
                min="0"
                max="24"
                value={settings.bubble.user_bubble_radius}
                onChange={(e) => updateSetting('bubble', 'user_bubble_radius', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Bot Bubble Shadow</label>
              <button
                onClick={() => updateSetting('bubble', 'bot_bubble_shadow', !settings.bubble.bot_bubble_shadow)}
                className={`px-6 py-3 rounded-xl font-semibold ${
                  settings.bubble.bot_bubble_shadow ? 'opacity-100' : 'opacity-50'
                }`}
                style={{
                  backgroundColor: settings.bubble.bot_bubble_shadow ? colors.accent : colors.card,
                  color: settings.bubble.bot_bubble_shadow ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                }}
              >
                {settings.bubble.bot_bubble_shadow ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>User Bubble Shadow</label>
              <button
                onClick={() => updateSetting('bubble', 'user_bubble_shadow', !settings.bubble.user_bubble_shadow)}
                className={`px-6 py-3 rounded-xl font-semibold ${
                  settings.bubble.user_bubble_shadow ? 'opacity-100' : 'opacity-50'
                }`}
                style={{
                  backgroundColor: settings.bubble.user_bubble_shadow ? colors.accent : colors.card,
                  color: settings.bubble.user_bubble_shadow ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                }}
              >
                {settings.bubble.user_bubble_shadow ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
                Bot Avatar Size: {settings.avatarSizes.bot_avatar_size}px
              </label>
              <input
                type="range"
                min="16"
                max="64"
                value={settings.avatarSizes.bot_avatar_size}
                onChange={(e) => updateSetting('avatarSizes', 'bot_avatar_size', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
                User Avatar Size: {settings.avatarSizes.user_avatar_size}px
              </label>
              <input
                type="range"
                min="16"
                max="64"
                value={settings.avatarSizes.user_avatar_size}
                onChange={(e) => updateSetting('avatarSizes', 'user_avatar_size', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </motion.div>
        )

      case 'input':
        return (
          <motion.div key="input" initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>Input Field Customization</h3>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Placeholder Text</label>
              <input
                type="text"
                value={settings.input.input_placeholder}
                onChange={(e) => updateSetting('input', 'input_placeholder', e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Input Background Color</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.input.input_background_color || '#F3F4F6'}
                  onChange={(e) => updateSetting('input', 'input_background_color', e.target.value)}
                  className="w-16 h-16 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.input.input_background_color || '#F3F4F6'}
                  onChange={(e) => updateSetting('input', 'input_background_color', e.target.value)}
                  placeholder="#F3F4F6"
                  className="flex-1 px-4 py-3 rounded-xl outline-none uppercase"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Input Text Color</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.input.input_text_color || '#1F2937'}
                  onChange={(e) => updateSetting('input', 'input_text_color', e.target.value)}
                  className="w-16 h-16 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.input.input_text_color || '#1F2937'}
                  onChange={(e) => updateSetting('input', 'input_text_color', e.target.value)}
                  placeholder="#1F2937"
                  className="flex-1 px-4 py-3 rounded-xl outline-none uppercase"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Input Border Color</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.input.input_border_color || '#E5E7EB'}
                  onChange={(e) => updateSetting('input', 'input_border_color', e.target.value)}
                  className="w-16 h-16 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.input.input_border_color || '#E5E7EB'}
                  onChange={(e) => updateSetting('input', 'input_border_color', e.target.value)}
                  placeholder="#E5E7EB"
                  className="flex-1 px-4 py-3 rounded-xl outline-none uppercase"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
                Input Border Radius: {settings.input.input_border_radius}px
              </label>
              <input
                type="range"
                min="0"
                max="24"
                value={settings.input.input_border_radius}
                onChange={(e) => updateSetting('input', 'input_border_radius', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </motion.div>
        )

      case 'widget-button':
        return (
          <motion.div key="widget-button" initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>Widget Button</h3>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Button Color</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.widgetButton.widget_button_color || settings.appearance.chat_color}
                  onChange={(e) => updateSetting('widgetButton', 'widget_button_color', e.target.value)}
                  className="w-16 h-16 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.widgetButton.widget_button_color || settings.appearance.chat_color}
                  onChange={(e) => updateSetting('widgetButton', 'widget_button_color', e.target.value)}
                  placeholder="Use chat color"
                  className="flex-1 px-4 py-3 rounded-xl outline-none uppercase"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Leave empty to use chat color</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Button Icon</label>
              <div className="flex gap-4">
                {['chat', 'message', 'support'].map(icon => (
                  <button
                    key={icon}
                    onClick={() => updateSetting('widgetButton', 'widget_button_icon', icon)}
                    className={`px-6 py-3 rounded-xl font-semibold capitalize ${
                      settings.widgetButton.widget_button_icon === icon ? 'opacity-100' : 'opacity-50'
                    }`}
                    style={{
                      backgroundColor: settings.widgetButton.widget_button_icon === icon ? colors.accent : colors.card,
                      color: settings.widgetButton.widget_button_icon === icon ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Button Animation</label>
              <select
                value={settings.widgetButton.widget_button_animation}
                onChange={(e) => updateSetting('widgetButton', 'widget_button_animation', e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
              >
                <option value="none">None</option>
                <option value="pulse">Pulse</option>
                <option value="bounce">Bounce</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Show Button Text</label>
              <button
                onClick={() => updateSetting('widgetButton', 'show_widget_text', !settings.widgetButton.show_widget_text)}
                className={`px-6 py-3 rounded-xl font-semibold ${
                  settings.widgetButton.show_widget_text ? 'opacity-100' : 'opacity-50'
                }`}
                style={{
                  backgroundColor: settings.widgetButton.show_widget_text ? colors.accent : colors.card,
                  color: settings.widgetButton.show_widget_text ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                }}
              >
                {settings.widgetButton.show_widget_text ? 'Visible' : 'Hidden'}
              </button>
            </div>

            {settings.widgetButton.show_widget_text && (
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Button Text</label>
                <input
                  type="text"
                  value={settings.widgetButton.widget_button_text}
                  onChange={(e) => updateSetting('widgetButton', 'widget_button_text', e.target.value)}
                  placeholder="Chat with us"
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              </div>
            )}
          </motion.div>
        )

      case 'file-upload':
        return (
          <motion.div key="file-upload" initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>File Upload Settings</h3>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Enable File Upload</label>
              <button
                onClick={() => updateSetting('fileUpload', 'enable_file_upload', !settings.fileUpload.enable_file_upload)}
                className={`px-6 py-3 rounded-xl font-semibold ${
                  settings.fileUpload.enable_file_upload ? 'opacity-100' : 'opacity-50'
                }`}
                style={{
                  backgroundColor: settings.fileUpload.enable_file_upload ? colors.accent : colors.card,
                  color: settings.fileUpload.enable_file_upload ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                }}
              >
                {settings.fileUpload.enable_file_upload ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
                Max File Size: {settings.fileUpload.max_file_size_mb}MB
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={settings.fileUpload.max_file_size_mb}
                onChange={(e) => updateSetting('fileUpload', 'max_file_size_mb', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Allowed File Types</label>
              <div className="space-y-2">
                {['image/*', '.pdf', '.doc', '.docx', '.txt', '.csv'].map(type => (
                  <label key={type} className="flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:opacity-80" style={{ backgroundColor: colors.card }}>
                    <input
                      type="checkbox"
                      checked={settings.fileUpload.allowed_file_types.includes(type)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...settings.fileUpload.allowed_file_types, type]
                          : settings.fileUpload.allowed_file_types.filter(t => t !== type)
                        updateSetting('fileUpload', 'allowed_file_types', newTypes.length > 0 ? newTypes : ['image/*'])
                      }}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-medium" style={{ color: colors.text }}>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 'notifications':
        return (
          <motion.div key="notifications" initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>Notification Settings</h3>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Enable Notification Sound</label>
              <button
                onClick={() => updateSetting('notifications', 'enable_notification_sound', !settings.notifications.enable_notification_sound)}
                className={`px-6 py-3 rounded-xl font-semibold ${
                  settings.notifications.enable_notification_sound ? 'opacity-100' : 'opacity-50'
                }`}
                style={{
                  backgroundColor: settings.notifications.enable_notification_sound ? colors.accent : colors.card,
                  color: settings.notifications.enable_notification_sound ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
                }}
              >
                {settings.notifications.enable_notification_sound ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {settings.notifications.enable_notification_sound && (
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Sound URL</label>
                <input
                  type="text"
                  value={settings.notifications.notification_sound_url}
                  onChange={(e) => updateSetting('notifications', 'notification_sound_url', e.target.value)}
                  placeholder="https://example.com/notification.mp3"
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              </div>
            )}
          </motion.div>
        )

      case 'preview-messages':
        return (
          <motion.div key="preview-messages" initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>Preview Messages</h3>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Customize the sample messages shown in the live preview
            </p>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Bot Message 1</label>
              <textarea
                value={settings.previewMessages.preview_bot_message_1}
                onChange={(e) => updateSetting('previewMessages', 'preview_bot_message_1', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>User Message</label>
              <textarea
                value={settings.previewMessages.preview_user_message}
                onChange={(e) => updateSetting('previewMessages', 'preview_user_message', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Bot Message 2</label>
              <textarea
                value={settings.previewMessages.preview_bot_message_2}
                onChange={(e) => updateSetting('previewMessages', 'preview_bot_message_2', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
              />
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Sub-tabs for Chatbot Customize */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin" style={{ scrollbarWidth: 'thin', scrollbarColor: `${colors.accent} ${colors.card}` }}>
        {chatbotCustomizeTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap shrink-0 ${
              activeTab === tab.id ? 'opacity-100' : 'opacity-50 hover:opacity-70'
            }`}
            style={{
              backgroundColor: activeTab === tab.id ? colors.accent : colors.card,
              color: activeTab === tab.id ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Panel with Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Form */}
        <div className="lg:col-span-2">
          <div className="p-8 rounded-2xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
            {renderSettingsPanel()}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h3 className="text-xl font-bold mb-4" style={{ color: colors.text }}>Live Preview</h3>

            {/* Widget Preview Container */}
            <div className="flex justify-center">
              {/* Chat Widget - scaled preview */}
              <div
                className="overflow-hidden shadow-2xl"
                style={{
                  width: `${Math.min(settings.size.widget_width, 420)}px`,
                  height: `${Math.min(settings.size.widget_height, 650)}px`,
                  backgroundColor: colors.card,
                  borderRadius: '16px',
                  border: `1px solid ${colors.border}`,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Widget Header */}
                <div
                  className="p-4 flex items-center gap-3"
                  style={{
                    backgroundColor: settings.header.header_background_color || settings.appearance.chat_color,
                    borderBottom: `1px solid ${(settings.header.header_background_color || settings.appearance.chat_color)}99`,
                    display: settings.header.show_header ? 'flex' : 'none'
                  }}
                >
                  {/* Branding Logo - shown in chat widget header */}
                  {getBrandLogoUrl() ? (
                    <img
                      src={getBrandLogoUrl()}
                      alt="Brand"
                      className="w-10 h-10 rounded-lg object-cover"
                      style={{ backgroundColor: 'white' }}
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'white' }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke={settings.appearance.chat_color} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                  )}

                  {/* Header Text */}
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-semibold text-sm truncate"
                      style={{ color: settings.header.header_font_color || '#0B0C10' }}
                    >
                      {settings.branding.title || 'Chatbot'}
                    </div>
                    {settings.branding.subtitle && (
                      <div
                        className="text-xs truncate opacity-80"
                        style={{ color: settings.header.header_font_color || '#0B0C10' }}
                      >
                        {settings.branding.subtitle}
                      </div>
                    )}
                  </div>

                  {/* Minimize Button */}
                  {settings.header.show_minimize_button && (
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center opacity-70 hover:opacity-100"
                      style={{ backgroundColor: 'rgba(11, 12, 16, 0.1)', color: settings.header.header_font_color || '#0B0C10' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                  )}

                  {/* Close Button */}
                  {settings.header.show_close_button && (
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center opacity-70 hover:opacity-100"
                      style={{ backgroundColor: 'rgba(11, 12, 16, 0.1)', color: settings.header.header_font_color || '#0B0C10' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Chat Messages */}
                <div
                  className="flex-1 p-4 space-y-4 overflow-y-auto"
                  style={{
                    backgroundColor: getChatBackgroundImageUrl() ? 'transparent' : settings.appearance.chat_background_color,
                    backgroundImage: getChatBackgroundImageUrl() ? `url(${getChatBackgroundImageUrl()})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    fontFamily: settings.appearance.font_family
                  }}
                >
                  {/* Header Text in Chat */}
                  {settings.content.header_text && (
                    <div className="text-center mb-4">
                      <div
                        className="text-sm font-medium px-4 py-2 rounded-lg inline-block"
                        style={{
                          backgroundColor: settings.appearance.chat_color + '15',
                          color: settings.appearance.chat_color
                        }}
                      >
                        {settings.content.header_text}
                      </div>
                    </div>
                  )}

                  {/* Bot Message */}
                  <div className={`flex gap-2 ${settings.layout.bot_message_side === 'left' ? '' : 'justify-end'}`}>
                    {settings.layout.bot_message_side === 'left' && (
                      <div className="shrink-0">
                        {getBotAvatarUrl() ? (
                          <img
                            src={getBotAvatarUrl()}
                            alt="Bot"
                            className="rounded-full object-cover"
                            style={{ width: `${settings.avatarSizes.bot_avatar_size}px`, height: `${settings.avatarSizes.bot_avatar_size}px` }}
                          />
                        ) : (
                          <div
                            className="rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: settings.appearance.bot_message_color,
                              width: `${settings.avatarSizes.bot_avatar_size}px`,
                              height: `${settings.avatarSizes.bot_avatar_size}px`
                            }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17l9-9-9 9-9-9 9 9zm0 0l-9 9" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      className="max-w-[80%] px-4 py-3"
                      style={{
                        backgroundColor: settings.appearance.bot_message_color + '30',
                        color: settings.messageText.bot_text_color || settings.appearance.font_color,
                        borderRadius: settings.appearance.bubble_style === 'pill' ? '9999px' : settings.appearance.bubble_style === 'square' ? '4px' : `${settings.bubble.bot_bubble_radius}px`,
                        fontSize: '14px',
                        lineHeight: '1.5',
                        boxShadow: settings.bubble.bot_bubble_shadow ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
                      }}
                    >
                      {settings.previewMessages.preview_bot_message_1 || 'Hello! How can I help you today?'}
                    </div>
                    {settings.layout.bot_message_side === 'right' && (
                      <div className="shrink-0">
                        {getBotAvatarUrl() ? (
                          <img
                            src={getBotAvatarUrl()}
                            alt="Bot"
                            className="rounded-full object-cover"
                            style={{ width: `${settings.avatarSizes.bot_avatar_size}px`, height: `${settings.avatarSizes.bot_avatar_size}px` }}
                          />
                        ) : (
                          <div
                            className="rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: settings.appearance.bot_message_color,
                              width: `${settings.avatarSizes.bot_avatar_size}px`,
                              height: `${settings.avatarSizes.bot_avatar_size}px`
                            }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17l9-9-9 9-9-9 9 9zm0 0l-9 9" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* User Message */}
                  <div className={`flex gap-2 ${settings.layout.user_message_side === 'left' ? '' : 'justify-end'}`}>
                    {settings.layout.user_message_side === 'left' && (
                      <div className="shrink-0">
                        {getUserAvatarUrl() ? (
                          <img
                            src={getUserAvatarUrl()}
                            alt="User"
                            className="rounded-full object-cover"
                            style={{ width: `${settings.avatarSizes.user_avatar_size}px`, height: `${settings.avatarSizes.user_avatar_size}px` }}
                          />
                        ) : (
                          <div
                            className="rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: settings.appearance.user_message_color,
                              width: `${settings.avatarSizes.user_avatar_size}px`,
                              height: `${settings.avatarSizes.user_avatar_size}px`
                            }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      className="max-w-[80%] px-4 py-3"
                      style={{
                        backgroundColor: settings.appearance.user_message_color,
                        color: settings.messageText.user_text_color || (theme === 'dark' ? '#0B0C10' : '#fff'),
                        borderRadius: settings.appearance.bubble_style === 'pill' ? '9999px' : settings.appearance.bubble_style === 'square' ? '4px' : `${settings.bubble.user_bubble_radius}px`,
                        fontSize: '14px',
                        lineHeight: '1.5',
                        boxShadow: settings.bubble.user_bubble_shadow ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
                      }}
                    >
                      {settings.previewMessages.preview_user_message || 'I have a question about your services.'}
                    </div>
                    {settings.layout.user_message_side === 'right' && (
                      <div className="shrink-0">
                        {getUserAvatarUrl() ? (
                          <img
                            src={getUserAvatarUrl()}
                            alt="User"
                            className="rounded-full object-cover"
                            style={{ width: `${settings.avatarSizes.user_avatar_size}px`, height: `${settings.avatarSizes.user_avatar_size}px` }}
                          />
                        ) : (
                          <div
                            className="rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: settings.appearance.user_message_color,
                              width: `${settings.avatarSizes.user_avatar_size}px`,
                              height: `${settings.avatarSizes.user_avatar_size}px`
                            }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bot Reply */}
                  <div className={`flex gap-2 ${settings.layout.bot_message_side === 'left' ? '' : 'justify-end'}`}>
                    {settings.layout.bot_message_side === 'left' && (
                      <div className="shrink-0">
                        {getBotAvatarUrl() ? (
                          <img
                            src={getBotAvatarUrl()}
                            alt="Bot"
                            className="rounded-full object-cover"
                            style={{ width: `${settings.avatarSizes.bot_avatar_size}px`, height: `${settings.avatarSizes.bot_avatar_size}px` }}
                          />
                        ) : (
                          <div
                            className="rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: settings.appearance.bot_message_color,
                              width: `${settings.avatarSizes.bot_avatar_size}px`,
                              height: `${settings.avatarSizes.bot_avatar_size}px`
                            }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17l9-9-9 9-9-9 9 9zm0 0l-9 9" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      className="max-w-[80%] px-4 py-3"
                      style={{
                        backgroundColor: settings.appearance.bot_message_color + '30',
                        color: settings.messageText.bot_text_color || settings.appearance.font_color,
                        borderRadius: settings.appearance.bubble_style === 'pill' ? '9999px' : settings.appearance.bubble_style === 'square' ? '4px' : `${settings.bubble.bot_bubble_radius}px`,
                        fontSize: '14px',
                        lineHeight: '1.5',
                        boxShadow: settings.bubble.bot_bubble_shadow ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
                      }}
                    >
                      {settings.previewMessages.preview_bot_message_2 || "Sure! I'd be happy to help. What would you like to know?"}
                    </div>
                    {settings.layout.bot_message_side === 'right' && (
                      <div className="shrink-0">
                        {getBotAvatarUrl() ? (
                          <img
                            src={getBotAvatarUrl()}
                            alt="Bot"
                            className="rounded-full object-cover"
                            style={{ width: `${settings.avatarSizes.bot_avatar_size}px`, height: `${settings.avatarSizes.bot_avatar_size}px` }}
                          />
                        ) : (
                          <div
                            className="rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: settings.appearance.bot_message_color,
                              width: `${settings.avatarSizes.bot_avatar_size}px`,
                              height: `${settings.avatarSizes.bot_avatar_size}px`
                            }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17l9-9-9 9-9-9 9 9zm0 0l-9 9" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Loading Indicator Preview */}
                  <div className={`flex gap-2 mt-4 ${settings.layout.bot_message_side === 'left' ? '' : 'justify-end'}`}>
                    {settings.layout.bot_message_side === 'left' && (
                      <div className="shrink-0">
                        {getBotAvatarUrl() ? (
                          <img
                            src={getBotAvatarUrl()}
                            alt="Bot"
                            className="rounded-full object-cover"
                            style={{ width: `${settings.avatarSizes.bot_avatar_size}px`, height: `${settings.avatarSizes.bot_avatar_size}px` }}
                          />
                        ) : (
                          <div
                            className="rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: settings.appearance.bot_message_color,
                              width: `${settings.avatarSizes.bot_avatar_size}px`,
                              height: `${settings.avatarSizes.bot_avatar_size}px`
                            }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17l9-9-9 9-9-9 9 9zm0 0l-9 9" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      className="px-4 py-3 flex items-center gap-2"
                      style={{
                        backgroundColor: settings.appearance.bot_message_color + '30',
                        borderRadius: settings.appearance.bubble_style === 'pill' ? '9999px' : settings.appearance.bubble_style === 'square' ? '4px' : `${settings.bubble.bot_bubble_radius}px`,
                        boxShadow: settings.bubble.bot_bubble_shadow ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
                      }}
                    >
                      {renderLoadingIndicator(settings.loading.loading_indicator_type)}
                      {settings.loading.loading_text && (
                        <span className="text-sm" style={{ color: settings.messageText.bot_text_color || settings.appearance.font_color }}>
                          {settings.loading.loading_text}
                        </span>
                      )}
                    </div>
                    {settings.layout.bot_message_side === 'right' && (
                      <div className="shrink-0">
                        {getBotAvatarUrl() ? (
                          <img
                            src={getBotAvatarUrl()}
                            alt="Bot"
                            className="rounded-full object-cover"
                            style={{ width: `${settings.avatarSizes.bot_avatar_size}px`, height: `${settings.avatarSizes.bot_avatar_size}px` }}
                          />
                        ) : (
                          <div
                            className="rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: settings.appearance.bot_message_color,
                              width: `${settings.avatarSizes.bot_avatar_size}px`,
                              height: `${settings.avatarSizes.bot_avatar_size}px`
                            }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17l9-9-9 9-9-9 9 9zm0 0l-9 9" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Input Area */}
                <div
                  className="p-3"
                  style={{
                    backgroundColor: colors.card,
                    borderTop: `1px solid ${colors.border}`
                  }}
                >
                  <div
                    className="flex items-center gap-1.5 px-3 py-2"
                    style={{
                      backgroundColor: settings.input.input_background_color || colors.inputBg,
                      border: `1px solid ${settings.input.input_border_color || colors.border}`,
                      borderRadius: `${settings.input.input_border_radius}px`
                    }}
                  >
                    <input
                      type="text"
                      placeholder={settings.input.input_placeholder || 'Type your message...'}
                      disabled
                      className="flex-1 bg-transparent outline-none text-sm min-w-0"
                      style={{ color: settings.input.input_text_color || colors.textSecondary }}
                    />
                    {/* Language Selector - compact */}
                    {settings.voiceLanguage.supported_languages.length > 1 && (
                      <select
                        disabled
                        className="text-[10px] px-1.5 py-1 rounded-md bg-transparent outline-none shrink-0 cursor-default"
                        style={{ color: colors.text, border: `1px solid ${colors.border}40`, minWidth: '32px' }}
                      >
                        {settings.voiceLanguage.supported_languages.map(langCode => {
                          const lang = languageOptions.find(l => l.code === langCode)
                          return lang ? (
                            <option key={lang.code} value={lang.code}>
                              {lang.code.toUpperCase()}
                            </option>
                          ) : null
                        })}
                      </select>
                    )}
                    {/* Mic Button */}
                    {settings.voiceLanguage.enable_mic && (
                      <button
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 hover:opacity-70"
                        style={{ backgroundColor: 'transparent', color: colors.textSecondary }}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </button>
                    )}
                    {/* Send Button */}
                    <button
                      className="w-7 h-7 flex items-center justify-center shrink-0 hover:opacity-90"
                      style={{
                        backgroundColor: settings.sendButton.send_button_color,
                        color: theme === 'dark' ? '#0B0C10' : '#fff',
                        borderRadius: settings.sendButton.send_button_style === 'circle' ? '9999px' : settings.sendButton.send_button_style === 'square' ? '4px' : '6px'
                      }}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                          settings.sendButton.send_button_icon === 'paper-plane'
                            ? 'M3 10l10-10 10 10M3 10l6 6M3 10v6a2 2 0 002 2h14a2 2 0 002-2v-6'
                            : 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                        } />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Footer */}
                {settings.content.footer_text && (
                  <div
                    className="px-3 pb-3 text-center text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    {settings.content.footer_text}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end items-center gap-4">
        {hasChanges && (
          <span className="text-sm" style={{ color: colors.accent }}>
            Unsaved changes
          </span>
        )}
        <motion.button
          onClick={handleSaveWithUpload}
          disabled={saving || !hasChanges}
          className="px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
          style={{
            backgroundColor: colors.accent,
            color: theme === 'dark' ? '#0B0C10' : '#fff'
          }}
          whileHover={saving || !hasChanges ? {} : { scale: 1.02 }}
          whileTap={saving || !hasChanges ? {} : { scale: 0.98 }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>
    </div>
  )
}
