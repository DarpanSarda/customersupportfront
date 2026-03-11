'use client'

import React, { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export default function AnalyticsPage({ params }) {
  const { id } = use(params)
  const { colors, theme } = useTheme()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchAnalytics()
  }, [id, timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/chatbots/${id}/analytics?range=${timeRange}`)
      const data = await response.json()
      if (response.ok) {
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = analytics?.stats || {
    totalConversations: 0,
    totalMessages: 0,
    avgResponseTime: 0,
    satisfactionRate: 0
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatTime = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`
    return `${Math.round(seconds / 3600)}h`
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
      {/* Header with Time Range Selector */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: colors.text }}>Analytics Overview</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-5 py-3 rounded-xl outline-none"
          style={{
            backgroundColor: colors.card,
            border: `2px solid ${colors.border}`,
            color: colors.text
          }}
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: 'Total Conversations',
            value: formatNumber(stats.totalConversations),
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
            change: analytics?.changes?.conversations || '+0%'
          },
          {
            label: 'Total Messages',
            value: formatNumber(stats.totalMessages),
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />,
            change: analytics?.changes?.messages || '+0%'
          },
          {
            label: 'Avg Response Time',
            value: formatTime(stats.avgResponseTime),
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
            change: analytics?.changes?.responseTime || '+0%'
          },
          {
            label: 'Satisfaction Rate',
            value: `${stats.satisfactionRate}%`,
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
            change: analytics?.changes?.satisfaction || '+0%'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-2xl"
            style={{
              backgroundColor: colors.card,
              border: `1px solid ${colors.border}`
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, borderColor: colors.accent }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'
              }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent }}>
                  {stat.icon}
                </svg>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`} style={{
                backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
                color: stat.change.startsWith('+') ? colors.success : colors.error
              }}>
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
              {stat.value}
            </div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Conversations Over Time */}
        <div className="p-6 rounded-2xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Conversations Over Time</h3>
          <div className="h-64 flex items-end justify-around gap-2">
            {analytics?.conversationsChart?.map((data, index) => (
              <motion.div
                key={index}
                className="flex-1 flex flex-col items-center"
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="w-full rounded-t-lg" style={{
                  height: `${(data.value / Math.max(...analytics.conversationsChart.map(d => d.value))) * 100}%`,
                  backgroundColor: colors.accent,
                  opacity: 0.8
                }} />
                <div className="text-xs mt-2" style={{ color: colors.textSecondary }}>
                  {data.label}
                </div>
              </motion.div>
            )) || (
              <div className="w-full h-full flex items-center justify-center" style={{ color: colors.textSecondary }}>
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Message Distribution */}
        <div className="p-6 rounded-2xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Message Distribution</h3>
          <div className="space-y-4">
            {analytics?.messageDistribution?.map((data, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm" style={{ color: colors.text }}>{data.label}</span>
                  <span className="text-sm font-semibold" style={{ color: colors.accent }}>{data.value}%</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: colors.accent }}
                    initial={{ width: 0 }}
                    animate={{ width: `${data.value}%` }}
                    transition={{ delay: index * 0.1 }}
                  />
                </div>
              </div>
            )) || (
              <div className="w-full h-48 flex items-center justify-center" style={{ color: colors.textSecondary }}>
                No data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Questions */}
      <div className="p-6 rounded-2xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Top Questions</h3>
        <div className="space-y-3">
          {analytics?.topQuestions?.map((question, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl" style={{
              backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)'
            }}>
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{
                  backgroundColor: colors.accent,
                  color: theme === 'dark' ? '#0B0C10' : '#fff'
                }}>
                  {index + 1}
                </span>
                <span className="text-sm" style={{ color: colors.text }}>{question.text}</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: colors.accent }}>
                {question.count}x
              </span>
            </div>
          )) || (
            <div className="text-center py-8" style={{ color: colors.textSecondary }}>
              No data available
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
