'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

const CreateChatbotWizard = ({ onClose, onCreate }) => {
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const { colors, theme } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setCreating(true)
    const success = await onCreate({ name: name.trim() })
    setCreating(false)

    if (success) {
      setName('')
    }
  }

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-md rounded-3xl p-8 relative"
        style={{
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
          style={{ backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)', color: colors.text }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto"
            style={{ backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)' }}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: colors.text }}>
            Create New Chatbot
          </h2>
          <p className="text-center text-sm" style={{ color: colors.accent }}>
            Give your chatbot a name to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3" style={{ color: colors.accent }}>
              Chatbot Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Customer Support Bot"
              className="w-full px-5 py-4 rounded-xl outline-none text-lg"
              style={{
                backgroundColor: colors.inputBg,
                border: `2px solid ${colors.border}`,
                color: colors.text
              }}
              autoFocus
            />
          </div>

          <div className="p-4 rounded-xl" style={{ backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)' }}>
            <p className="text-sm text-center" style={{ color: colors.text }}>
              You can customize appearance, colors, and other settings after creation
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              type="button"
              onClick={onClose}
              disabled={creating}
              className="flex-1 py-3 rounded-xl font-semibold disabled:opacity-50"
              style={{
                backgroundColor: 'transparent',
                border: `2px solid ${colors.accent}`,
                color: colors.accent
              }}
              whileHover={creating ? {} : { scale: 1.02 }}
              whileTap={creating ? {} : { scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={creating || !name.trim()}
              className="flex-1 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: name.trim() ? colors.accent : theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)',
                color: theme === 'dark' ? '#0B0C10' : '#fff'
              }}
              whileHover={creating || !name.trim() ? {} : { scale: 1.02 }}
              whileTap={creating || !name.trim() ? {} : { scale: 0.98 }}
            >
              {creating ? 'Creating...' : 'Create Chatbot'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default CreateChatbotWizard
