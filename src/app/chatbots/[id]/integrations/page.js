'use client'

import React, { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

const integrationsList = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notified in Slack when new conversations start or escalate.',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    category: 'Communication',
    color: '#4A154B',
    features: ['New conversation alerts', 'Escalation notifications', 'Daily summaries']
  },
  {
    id: 'zendesk',
    name: 'Zendesk',
    description: 'Sync conversations with Zendesk tickets for seamless support.',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    category: 'Help Desk',
    color: '#03363D',
    features: ['Ticket creation', 'Status sync', 'Agent handoff']
  },
  {
    id: 'intercom',
    name: 'Intercom',
    description: 'Connect with Intercom for unified customer messaging.',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    category: 'Customer Messaging',
    color: '#1F8DED',
    features: ['Message sync', 'User data import', 'Conversation history']
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Connect chat conversations to Salesforce CRM records.',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    category: 'CRM',
    color: '#00A1E0',
    features: ['Lead capture', 'Contact sync', 'Activity logging']
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Automatically create and update HubSpot contacts from chats.',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    category: 'CRM',
    color: '#FF7A59',
    features: ['Contact creation', 'Deal tracking', 'Chat transcripts']
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Forward conversations to Gmail for email-based follow-ups.',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    category: 'Email',
    color: '#EA4335',
    features: ['Email forwarding', 'Thread creation', 'Attachments']
  },
  {
    id: 'webhook',
    name: 'Custom Webhook',
    description: 'Send chat data to your custom endpoint via webhooks.',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    category: 'Developer',
    color: '#14b8a6',
    features: ['POST/GET support', 'Custom headers', 'Event filters']
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect to 5000+ apps through Zapier automation.',
    icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z',
    category: 'Automation',
    color: '#FF4A00',
    features: ['5000+ apps', 'Custom workflows', 'Real-time sync']
  }
]

export default function IntegrationsPage({ params }) {
  const { id } = use(params)
  const { colors, theme } = useTheme()
  const [connectedIntegrations, setConnectedIntegrations] = useState([])
  const [selectedIntegration, setSelectedIntegration] = useState(null)
  const [configModal, setConfigModal] = useState(false)

  useEffect(() => {
    fetchIntegrations()
  }, [id])

  const fetchIntegrations = async () => {
    try {
      const response = await fetch(`/api/chatbots/${id}/integrations`)
      const data = await response.json()
      if (response.ok) {
        setConnectedIntegrations(data.integrations || [])
      }
    } catch (error) {
      console.error('Failed to fetch integrations:', error)
    }
  }

  const toggleIntegration = async (integrationId) => {
    const isConnected = connectedIntegrations.includes(integrationId)
    try {
      const response = await fetch(`/api/chatbots/${id}/integrations/${integrationId}`, {
        method: isConnected ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        setConnectedIntegrations(prev =>
          isConnected
            ? prev.filter(i => i !== integrationId)
            : [...prev, integrationId]
        )
      } else {
        alert('Failed to update integration')
      }
    } catch (error) {
      console.error('Failed to toggle integration:', error)
      alert('Failed to update integration')
    }
  }

  const categories = [...new Set(integrationsList.map(i => i.category))]

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>Integrations</h2>
        <p style={{ color: colors.textSecondary }}>
          Connect your chatbot with your favorite tools and services
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                {connectedIntegrations.length}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Active Integrations
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: colors.text }}>
                {integrationsList.length}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Available Integrations
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: colors.text }}>
                24/7
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Sync Status
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integrations by Category */}
      {categories.map(category => (
        <div key={category} className="mb-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>{category}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {integrationsList
              .filter(i => i.category === category)
              .map((integration, index) => {
                const isConnected = connectedIntegrations.includes(integration.id)
                return (
                  <motion.div
                    key={integration.id}
                    className="p-6 rounded-xl"
                    style={{
                      backgroundColor: colors.card,
                      border: `1px solid ${isConnected ? colors.accent : colors.border}`
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, borderColor: colors.accent }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${integration.color}20` }}
                        >
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: integration.color }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={integration.icon} />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg" style={{ color: colors.text }}>
                            {integration.name}
                          </h4>
                          {isConnected && (
                            <span className="text-xs px-2 py-1 rounded-full" style={{
                              backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                              color: colors.success
                            }}>
                              Connected
                            </span>
                          )}
                        </div>
                      </div>
                      <motion.button
                        onClick={() => toggleIntegration(integration.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
                        style={{
                          backgroundColor: isConnected
                            ? theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)'
                            : colors.accent,
                          color: isConnected ? colors.error : (theme === 'dark' ? '#0B0C10' : '#fff')
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isConnected ? 'Disconnect' : 'Connect'}
                      </motion.button>
                    </div>

                    <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                      {integration.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {integration.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                            color: colors.accent
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
          </div>
        </div>
      ))}

      {/* Info Banner */}
      <div className="mt-8 p-6 rounded-xl" style={{
        backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
        border: `1px solid ${colors.border}`
      }}>
        <div className="flex items-start gap-4">
          <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold mb-2" style={{ color: colors.text }}>Need help setting up integrations?</h4>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Check our documentation for detailed setup guides for each integration. You can also contact our support team for assistance with custom integrations.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
