'use client'

import React, { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export default function HistoryPage({ params }) {
  const { id } = use(params)
  const { colors, theme } = useTheme()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedConversation, setSelectedConversation] = useState(null)

  useEffect(() => {
    fetchConversations()
  }, [id])

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/chatbots/${id}/conversations`)
      const data = await response.json()
      if (response.ok) {
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.sessionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.messages?.some(m => m.content?.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || conv.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      {/* Header with Search and Filter */}
      <div className="p-6 rounded-2xl mb-6" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 rounded-xl outline-none pl-12"
              style={{
                backgroundColor: colors.inputBg,
                border: `2px solid ${colors.border}`,
                color: colors.text
              }}
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-5 py-3 rounded-xl outline-none"
            style={{
              backgroundColor: colors.inputBg,
              border: `2px solid ${colors.border}`,
              color: colors.text
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Conversations List */}
      <div className="space-y-4">
        {filteredConversations.length === 0 ? (
          <div className="p-12 rounded-2xl text-center" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.textSecondary }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p style={{ color: colors.text }}>No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              className="p-6 rounded-2xl cursor-pointer"
              style={{
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
                borderColor: selectedConversation?.id === conversation.id ? colors.accent : colors.border
              }}
              onClick={() => setSelectedConversation(
                selectedConversation?.id === conversation.id ? null : conversation
              )}
              whileHover={{ scale: 1.01, borderColor: colors.accent }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold" style={{ color: colors.text }}>
                      Session: {conversation.sessionId?.slice(0, 8)}...
                    </h3>
                    <span className="px-3 py-1 rounded-full text-xs font-medium" style={{
                      backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
                      color: colors.accent
                    }}>
                      {conversation.status || 'active'}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    {formatDate(conversation.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm" style={{ color: colors.textSecondary }}>
                    {conversation.messageCount || conversation.messages?.length || 0} messages
                  </div>
                </div>
              </div>

              {conversation.preview && (
                <p className="text-sm line-clamp-2" style={{ color: colors.textSecondary }}>
                  {conversation.preview}
                </p>
              )}

              {/* Expanded Messages */}
              {selectedConversation?.id === conversation.id && conversation.messages && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 space-y-3"
                  style={{ borderTop: `1px solid ${colors.border}` }}
                >
                  {conversation.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl ${
                        message.role === 'user' ? 'ml-8' : 'mr-8'
                      }`}
                      style={{
                        backgroundColor: message.role === 'user'
                          ? theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'
                          : colors.border,
                        border: `1px solid ${colors.border}`
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold" style={{ color: colors.accent }}>
                          {message.role === 'user' ? 'User' : 'Bot'}
                        </span>
                        {message.timestamp && (
                          <span className="text-xs" style={{ color: colors.textSecondary }}>
                            {formatDate(message.timestamp)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm" style={{ color: colors.text }}>
                        {message.content}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
