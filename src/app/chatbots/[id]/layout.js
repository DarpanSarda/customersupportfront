'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/theme-toggle/ThemeToggle'
import { useState, useEffect, use } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { ChatbotSettingsProvider, useChatbotSettings } from '@/contexts/ChatbotSettingsContext'

const sidebarItems = [
  { id: 'customize', label: 'Customize', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'embed', label: 'Embed Script', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { id: 'llm', label: 'LLM Settings', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id: 'policies', label: 'Policies/PDFs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'train', label: 'Train Database', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
  { id: 'faqs', label: 'FAQs', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
]

function LayoutContent({ children, params }) {
  const { id } = use(params)
  const { colors, theme } = useTheme()
  const pathname = usePathname()
  const [chatbot, setChatbot] = useState(null)

  // Get current path from the URL
  const getCurrentSection = () => {
    const segments = pathname.split('/')
    const lastSegment = segments[segments.length - 1]
    return sidebarItems.find(item => item.id === lastSegment)?.id || 'customize'
  }

  const currentSection = getCurrentSection()

  useEffect(() => {
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg }}>
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 md:px-12 lg:px-20" style={{ backgroundColor: theme === 'dark' ? 'rgba(11, 12, 16, 0.9)' : 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${colors.border}` }}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <img src="/helpgenie-logo.svg" alt="HelpGenie Logo" width={40} height={40} />
          <span className="text-2xl font-bold" style={{ color: colors.accent }}>HelpGenie</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ color: colors.text }}
          >
            Back to Dashboard
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* Header */}
      <div className="container mx-auto px-6 md:px-12 lg:px-20 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
              {chatbot?.name || 'Chatbot'}
            </h1>
            <p style={{ color: colors.accent }}>Manage your chatbot settings and configuration</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-12 lg:px-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              {sidebarItems.map(item => (
                <Link
                  key={item.id}
                  href={`/chatbots/${id}/${item.id}`}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    currentSection === item.id ? 'opacity-100' : 'opacity-60 hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: currentSection === item.id ? colors.accent : 'transparent',
                    color: currentSection === item.id ? (theme === 'dark' ? '#0B0C10' : '#fff') : colors.text,
                    border: currentSection === item.id ? 'none' : `1px solid ${colors.border}`
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Content Panel */}
          <div className="lg:col-span-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChatbotLayout({ children, params }) {
  const { id } = use(params)

  return (
    <ChatbotSettingsProvider chatbotId={id}>
      <LayoutContent params={params}>
        {children}
      </LayoutContent>
    </ChatbotSettingsProvider>
  )
}
