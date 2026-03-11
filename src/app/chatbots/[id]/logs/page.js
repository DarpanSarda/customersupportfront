'use client'

import React, { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export default function LogsPage({ params }) {
  const { id } = use(params)
  const { colors, theme } = useTheme()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchLogs()
  }, [id])

  const fetchLogs = async () => {
    try {
      const response = await fetch(`/api/chatbots/${id}/logs`)
      const data = await response.json()
      if (response.ok) {
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel
    const matchesType = filterType === 'all' || log.type === filterType
    return matchesLevel && matchesType
  })

  const getLevelColor = (level) => {
    switch (level) {
      case 'error': return colors.error
      case 'warning': return colors.warning
      case 'info': return colors.accent
      case 'debug': return colors.textSecondary
      default: return colors.text
    }
  }

  const getLevelIcon = (level) => {
    switch (level) {
      case 'error':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      case 'warning':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      case 'info':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      case 'debug':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      default:
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12" style={{ backgroundColor: colors.card }}>
        <div style={{ color: colors.accent }}>Loading...</div>
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      {/* Filters */}
      <div className="p-6 rounded-2xl mb-6" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
              Log Level
            </label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full px-5 py-3 rounded-xl outline-none"
              style={{
                backgroundColor: colors.inputBg,
                border: `2px solid ${colors.border}`,
                color: colors.text
              }}
            >
              <option value="all">All Levels</option>
              <option value="error">Errors</option>
              <option value="warning">Warnings</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
              Log Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-5 py-3 rounded-xl outline-none"
              style={{
                backgroundColor: colors.inputBg,
                border: `2px solid ${colors.border}`,
                color: colors.text
              }}
            >
              <option value="all">All Types</option>
              <option value="api">API</option>
              <option value="system">System</option>
              <option value="user">User</option>
              <option value="error">Error</option>
              <option value="performance">Performance</option>
            </select>
          </div>

          <div className="flex items-end">
            <motion.button
              onClick={fetchLogs}
              className="px-6 py-3 rounded-xl font-semibold"
              style={{
                backgroundColor: colors.accent,
                color: theme === 'dark' ? '#0B0C10' : '#fff'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Refresh
            </motion.button>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="p-12 rounded-2xl text-center" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.textSecondary }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p style={{ color: colors.text }}>No logs found</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <motion.div
              key={log.id}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
                borderLeftWidth: '4px',
                borderLeftColor: getLevelColor(log.level)
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: getLevelColor(log.level) }}>
                    {getLevelIcon(log.level)}
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-semibold uppercase px-2 py-1 rounded" style={{
                      backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
                      color: getLevelColor(log.level)
                    }}>
                      {log.level}
                    </span>
                    <span className="text-xs px-2 py-1 rounded" style={{
                      backgroundColor: colors.border,
                      color: colors.textSecondary
                    }}>
                      {log.type}
                    </span>
                    <span className="text-xs" style={{ color: colors.textSecondary }}>
                      {formatDate(log.timestamp)}
                    </span>
                  </div>

                  <p className="text-sm font-medium mb-1" style={{ color: colors.text }}>
                    {log.message}
                  </p>

                  {log.details && (
                    <div className="mt-2 p-3 rounded-lg text-xs font-mono" style={{
                      backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
                      color: colors.textSecondary
                    }}>
                      {log.details}
                    </div>
                  )}

                  {log.metadata && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(log.metadata).map(([key, value]) => (
                        <span key={key} className="text-xs px-2 py-1 rounded" style={{
                          backgroundColor: colors.border,
                          color: colors.textSecondary
                        }}>
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredLogs.length > 0 && (
        <div className="mt-6 text-center">
          <motion.button
            className="px-8 py-3 rounded-xl font-semibold"
            style={{
              backgroundColor: 'transparent',
              border: `2px solid ${colors.accent}`,
              color: colors.accent
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Load More Logs
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}
