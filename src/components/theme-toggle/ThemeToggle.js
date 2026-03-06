'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, colors } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative w-16 h-8 rounded-full p-1 ${className}`}
      style={{
        backgroundColor: theme === 'dark' ? colors.card : colors.border
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-1 bottom-1 w-6 h-6 rounded-full flex items-center justify-center"
        style={{
          left: theme === 'dark' ? '4px' : 'auto',
          right: theme === 'light' ? '4px' : 'auto',
          backgroundColor: colors.accent
        }}
        animate={{
          left: theme === 'dark' ? '4px' : 'calc(100% - 28px)',
          right: theme === 'light' ? '4px' : 'auto'
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {theme === 'dark' ? (
          <motion.span
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            🌙
          </motion.span>
        ) : (
          <motion.span
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            ☀️
          </motion.span>
        )}
      </motion.div>

      {/* Icons in background */}
      <span
        className="absolute left-2 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
        style={{ opacity: theme === 'light' ? 0.3 : 0.6 }}
      >
        🌙
      </span>
      <span
        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
        style={{ opacity: theme === 'dark' ? 0.3 : 0.6 }}
      >
        ☀️
      </span>
    </motion.button>
  )
}

export default ThemeToggle
