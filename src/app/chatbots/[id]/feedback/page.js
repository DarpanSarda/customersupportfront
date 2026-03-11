'use client'

import React, { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export default function FeedbackPage({ params }) {
  const { id } = use(params)
  const { colors, theme } = useTheme()
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchFeedback()
  }, [id])

  const fetchFeedback = async () => {
    try {
      const response = await fetch(`/api/chatbots/${id}/feedback`)
      const data = await response.json()
      if (response.ok) {
        setFeedback(data.feedback || [])
      }
    } catch (error) {
      console.error('Failed to fetch feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFeedback = feedback.filter(item => {
    return filterType === 'all' || item.type === filterType
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const likesCount = feedback.filter(f => f.sentiment === 'like').length
  const dislikesCount = feedback.filter(f => f.sentiment === 'dislike').length
  const totalCount = feedback.length
  const satisfactionRate = totalCount > 0 ? Math.round((likesCount / totalCount) * 100) : 0

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
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>Feedback</h2>
        <p style={{ color: colors.textSecondary }}>
          User feedback on your chatbot responses
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-xl" style={{
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`
        }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
              backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'
            }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: colors.text }}>
                {totalCount}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Total Feedback
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl" style={{
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`
        }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
              backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)'
            }}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" style={{ color: colors.success }}>
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: colors.success }}>
                {likesCount}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Likes
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl" style={{
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`
        }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
              backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)'
            }}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" style={{ color: colors.error }}>
                <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: colors.error }}>
                {dislikesCount}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Dislikes
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl" style={{
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`
        }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
              backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'
            }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: colors.accent }}>
                {satisfactionRate}%
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Satisfaction Rate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Satisfaction Bar */}
      <div className="p-8 rounded-2xl mb-6" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
        <h3 className="text-xl font-bold mb-6" style={{ color: colors.text }}>Satisfaction Overview</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: colors.text }}>Likes</span>
              <span className="text-sm font-bold" style={{ color: colors.success }}>{likesCount}</span>
            </div>
            <div className="w-full h-4 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: colors.success }}
                initial={{ width: 0 }}
                animate={{ width: totalCount > 0 ? `${(likesCount / totalCount) * 100}%` : '0%' }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: colors.text }}>Dislikes</span>
              <span className="text-sm font-bold" style={{ color: colors.error }}>{dislikesCount}</span>
            </div>
            <div className="w-full h-4 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: colors.error }}
                initial={{ width: 0 }}
                animate={{ width: totalCount > 0 ? `${(dislikesCount / totalCount) * 100}%` : '0%' }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 rounded-2xl mb-6" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
              Filter by Sentiment
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
              <option value="all">All Feedback</option>
              <option value="like">Likes Only</option>
              <option value="dislike">Dislikes Only</option>
            </select>
          </div>

          <div className="flex items-end">
            <motion.button
              onClick={fetchFeedback}
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

      {/* Feedback List */}
      <div className="p-8 rounded-2xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
        <h3 className="text-xl font-bold mb-6" style={{ color: colors.text }}>Recent Feedback</h3>

        {filteredFeedback.length === 0 ? (
          <div className="text-center py-12" style={{ color: colors.textSecondary }}>
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No feedback found</p>
            <p className="text-sm mt-2">Feedback will appear here when users interact with your chatbot</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFeedback.map((item) => (
              <motion.div
                key={item.id}
                className="flex items-start gap-4 p-4 rounded-xl"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.03)',
                  border: `1px solid ${colors.border}`
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  item.sentiment === 'like'
                    ? theme === 'dark' ? 'bg-green-500/20' : 'bg-green-500/10'
                    : theme === 'dark' ? 'bg-red-500/20' : 'bg-red-500/10'
                }`}>
                  {item.sentiment === 'like' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: colors.success }}>
                      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: colors.error }}>
                      <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
                    </svg>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold ${
                      item.sentiment === 'like' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {item.sentiment === 'like' ? 'Liked' : 'Disliked'}
                    </span>
                    <span className="text-xs px-2 py-1 rounded" style={{
                      backgroundColor: colors.border,
                      color: colors.textSecondary
                    }}>
                      {item.sentiment === 'like' ? colors.success : colors.error}
                    </span>
                  </div>

                  {item.message && (
                    <p className="text-sm mb-2" style={{ color: colors.text }}>
                      "{item.message}"
                    </p>
                  )}

                  {item.botResponse && (
                    <p className="text-xs mb-2 p-2 rounded" style={{
                      backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
                      color: colors.textSecondary
                    }}>
                      <span className="font-medium">Bot response:</span> {item.botResponse}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs" style={{ color: colors.textSecondary }}>
                    <span>{formatDate(item.timestamp)}</span>
                    {item.sessionId && (
                      <>
                        <span>•</span>
                        <span>Session: {item.sessionId.slice(0, 8)}...</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="mt-6 p-6 rounded-xl" style={{
        backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
        border: `1px solid ${colors.border}`
      }}>
        <div className="flex items-start gap-4">
          <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold mb-2" style={{ color: colors.text }}>User Feedback</h4>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Users can like or dislike chatbot responses. This feedback helps you understand which responses are helpful and which need improvement.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
