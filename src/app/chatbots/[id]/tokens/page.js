'use client'

import React, { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export default function TokensPage({ params }) {
  const { id } = use(params)
  const { colors, theme } = useTheme()
  const [tokens, setTokens] = useState(null)
  const [loading, setLoading] = useState(true)
  const [agentUsage, setAgentUsage] = useState([])

  useEffect(() => {
    fetchTokens()
  }, [id])

  const fetchTokens = async () => {
    try {
      const response = await fetch(`/api/chatbots/${id}/tokens`)
      const data = await response.json()
      if (response.ok) {
        setTokens(data.tokens)
        setAgentUsage(data.agentUsage || [])
      }
    } catch (error) {
      console.error('Failed to fetch tokens:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calculate totals by agent
  const getAgentTotals = () => {
    const totals = {}
    agentUsage.forEach(entry => {
      if (!totals[entry.agent]) {
        totals[entry.agent] = { tokens: 0, count: 0 }
      }
      totals[entry.agent].tokens += entry.tokens
      totals[entry.agent].count += 1
    })
    return totals
  }

  const agentTotals = getAgentTotals()
  const totalTokens = Object.values(agentTotals).reduce((sum, agent) => sum + agent.tokens, 0)

  // Agent icons mapping
  const getAgentIcon = (agent) => {
    const icons = {
      'gpt-4o': 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      'gpt-4o-mini': 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      'claude-3.5-sonnet': 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      'embeddings': 'M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm4 2h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z',
      'vector-search': 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z M10 7v3m0 0v3m0-3h3m-3 0H7'
    }
    return icons[agent] || icons['gpt-4o']
  }

  const getAgentColor = (agent) => {
    const colors_map = {
      'gpt-4o': '#10a37f',
      'gpt-4o-mini': '#20b8aa',
      'claude-3.5-sonnet': '#8b5cf6',
      'embeddings': '#f59e0b',
      'vector-search': '#ef4444'
    }
    return colors_map[agent] || colors.accent
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
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>Token Usage</h2>
        <p style={{ color: colors.textSecondary }}>
          Track which agents and tools are consuming tokens
        </p>
      </div>

      {/* Overview Stats */}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: colors.text }}>
                {totalTokens.toLocaleString()}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Total Tokens Used
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: colors.text }}>
                {agentUsage.length}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Total Requests
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: colors.text }}>
                {Object.keys(agentTotals).length}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Active Agents
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: colors.text }}>
                ${((totalTokens / 1000000) * 5).toFixed(2)}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Est. Cost
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage by Agent */}
      <div className="p-8 rounded-2xl mb-6" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
        <h3 className="text-xl font-bold mb-6" style={{ color: colors.text }}>Usage by Agent</h3>

        {Object.keys(agentTotals).length === 0 ? (
          <div className="text-center py-12" style={{ color: colors.textSecondary }}>
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No token usage data yet</p>
            <p className="text-sm mt-2">Token usage will appear here as agents process requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(agentTotals).map(([agent, data]) => (
              <motion.div
                key={agent}
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.03)',
                  border: `1px solid ${colors.border}`
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                    backgroundColor: `${getAgentColor(agent)}20`
                  }}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: getAgentColor(agent) }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getAgentIcon(agent)} />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold" style={{ color: colors.text }}>
                        {agent.charAt(0).toUpperCase() + agent.slice(1)}
                      </h4>
                      <span className="text-lg font-bold" style={{ color: getAgentColor(agent) }}>
                        {data.tokens.toLocaleString()} tokens
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm" style={{ color: colors.textSecondary }}>
                      <span>{data.count} requests</span>
                      <span>•</span>
                      <span>{((data.tokens / totalTokens) * 100).toFixed(1)}% of total</span>
                    </div>
                    <div className="mt-3 w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: getAgentColor(agent) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.tokens / totalTokens) * 100}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="p-8 rounded-2xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
        <h3 className="text-xl font-bold mb-6" style={{ color: colors.text }}>Recent Activity</h3>

        {agentUsage.length === 0 ? (
          <div className="text-center py-12" style={{ color: colors.textSecondary }}>
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {agentUsage.slice(0, 20).map((entry, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.03)',
                  border: `1px solid ${colors.border}`
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                  backgroundColor: `${getAgentColor(entry.agent)}20`
                }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: getAgentColor(entry.agent) }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getAgentIcon(entry.agent)} />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium" style={{ color: colors.text }}>{entry.agent}</span>
                    <span className="font-semibold" style={{ color: colors.accent }}>{entry.tokens.toLocaleString()} tokens</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm mt-1" style={{ color: colors.textSecondary }}>
                    <span>{formatDate(entry.timestamp)}</span>
                    {entry.operation && <span>• {entry.operation}</span>}
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
            <h4 className="font-semibold mb-2" style={{ color: colors.text }}>Token Tracking</h4>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              This page tracks token usage by different AI agents and tools in your chatbot. Each request logs which agent processed it and how many tokens were consumed.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
