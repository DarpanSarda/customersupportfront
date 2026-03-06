'use client'

import { useTheme } from '@/contexts/ThemeContext'

export default function TrainPage({ params }) {
  const { colors, theme } = useTheme()

  return (
    <div className="p-8 rounded-2xl text-center" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: theme === 'dark' ? 'rgba(102, 252, 241, 0.1)' : 'rgba(8, 145, 178, 0.1)' }}>
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-3" style={{ color: colors.text }}>Train Database</h3>
      <p className="text-lg mb-6" style={{ color: colors.textSecondary }}>Train your chatbot with your custom data.</p>
      <p className="text-sm" style={{ color: colors.textSecondary }}>This section is coming soon.</p>
    </div>
  )
}
