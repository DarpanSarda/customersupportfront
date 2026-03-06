'use client'

import { use } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useChatbotSettings } from '@/contexts/ChatbotSettingsContext'

export default function EmbedPage({ params }) {
  const { id } = use(params)
  const { colors, theme } = useTheme()
  const { settings, loading } = useChatbotSettings()

  if (loading) {
    return (
      <div className="p-8 rounded-2xl text-center" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
        <div style={{ color: colors.text }}>Loading...</div>
      </div>
    )
  }

  // Generate the embed script
  const embedCode = `<script>
  window.helpgenie_config = {
    chatbot_id: "${id}",
    position: "${settings.widget.widget_position || 'bottom-right'}",
    theme: {
      primary_color: "${settings.appearance.chat_color}",
      font_family: "${settings.appearance.font_family}"
    }
  };
<\/script>
<script src="${window.location.origin}/widget.js" async><\/script>`

  return (
    <div className="p-8 rounded-2xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold" style={{ color: colors.text }}>Embed Script</h3>
          <p style={{ color: colors.textSecondary }}>Add this chatbot to your website</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Instructions */}
        <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(20, 184, 166, 0.05)' }}>
          <h4 className="font-semibold mb-3" style={{ color: colors.text }}>How to embed:</h4>
          <ol className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
            <li className="flex gap-2">
              <span className="font-bold" style={{ color: colors.accent }}>1.</span>
              Copy the embed code below
            </li>
            <li className="flex gap-2">
              <span className="font-bold" style={{ color: colors.accent }}>2.</span>
              Paste it into your website's HTML, just before the closing <code className="px-2 py-1 rounded" style={{ backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)' }}>&lt;/body&gt;</code> tag
            </li>
            <li className="flex gap-2">
              <span className="font-bold" style={{ color: colors.accent }}>3.</span>
              Save and refresh your website
            </li>
          </ol>
        </div>

        {/* Code Block */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold" style={{ color: colors.text }}>Embed Code</h4>
            <button
              onClick={() => {
                navigator.clipboard.writeText(embedCode)
                alert('Code copied to clipboard!')
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: colors.accent, color: theme === 'dark' ? '#0B0C10' : '#fff' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Code
            </button>
          </div>
          <div className="relative">
            <pre
              className="p-4 rounded-xl text-xs overflow-x-auto"
              style={{
                backgroundColor: theme === 'dark' ? '#0B0C10' : '#1a1a1a',
                color: '#a0aec0',
                border: `1px solid ${colors.border}`,
                maxHeight: '300px'
              }}
            >
              <code>{embedCode}</code>
            </pre>
          </div>
        </div>

        {/* Configuration Preview */}
        <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(20, 184, 166, 0.05)' }}>
          <h4 className="font-semibold mb-4" style={{ color: colors.text }}>Current Configuration</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span style={{ color: colors.textSecondary }}>Widget Position:</span>
              <span className="ml-2 font-medium" style={{ color: colors.text }}>
                {settings.widget.widget_position || 'bottom-right'}
              </span>
            </div>
            <div>
              <span style={{ color: colors.textSecondary }}>Primary Color:</span>
              <span className="ml-2 flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded inline-block"
                  style={{ backgroundColor: settings.appearance.chat_color }}
                />
                <span className="font-medium" style={{ color: colors.text }}>
                  {settings.appearance.chat_color}
                </span>
              </span>
            </div>
            <div>
              <span style={{ color: colors.textSecondary }}>Font Family:</span>
              <span className="ml-2 font-medium" style={{ color: colors.text }}>
                {settings.appearance.font_family}
              </span>
            </div>
            <div>
              <span style={{ color: colors.textSecondary }}>Status:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                settings.statusBehavior.status === 'active'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {settings.statusBehavior.status || 'active'}
              </span>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: theme === 'dark' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.1)' }}>
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#F59E0B' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="text-sm" style={{ color: colors.textSecondary }}>
            <span className="font-medium" style={{ color: colors.text }}>Note:</span> Changes made to the chatbot settings will be reflected automatically on your website without needing to update the embed code.
          </div>
        </div>
      </div>
    </div>
  )
}
