'use client'

import { useTheme } from '@/contexts/ThemeContext'

export default function PoliciesPage({ params }) {
  const { colors, theme } = useTheme()

  return (
    <div className="p-8 rounded-2xl text-center" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: theme === 'dark' ? 'rgba(102, 252, 241, 0.1)' : 'rgba(8, 145, 178, 0.1)' }}>
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-3" style={{ color: colors.text }}>Policies/PDFs</h3>
      <p className="text-lg mb-6" style={{ color: colors.textSecondary }}>Upload and manage your policy documents and PDFs.</p>
      <p className="text-sm" style={{ color: colors.textSecondary }}>This section is coming soon.</p>
    </div>
  )
}
