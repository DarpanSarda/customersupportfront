'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import ThemeToggle from '@/components/theme-toggle/ThemeToggle'
import CreateChatbotWizard from '@/components/chatbot-wizard/CreateChatbotWizard'

const DashboardPage = () => {
  const router = useRouter()
  const { colors, theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [chatbots, setChatbots] = useState([])
  const [loading, setLoading] = useState(true)
  const [showWizard, setShowWizard] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchChatbots()
  }, [])

  const fetchChatbots = async () => {
    try {
      const response = await fetch('/api/chatbots')
      const data = await response.json()

      if (response.ok) {
        setChatbots(data.chatbots || [])
      } else {
        console.error('Failed to fetch chatbots:', data)
      }
    } catch (error) {
      console.error('Failed to fetch chatbots:', error)
    } finally {
      setLoading(false)
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  }

  const filteredChatbots = chatbots.filter(bot =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateBot = async (formData) => {
    setCreating(true)

    try {
      const response = await fetch('/api/chatbots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name
        })
      })

      const data = await response.json()

      if (response.ok) {
        await fetchChatbots() // Refresh the list
        return true
      } else {
        alert(data.error || 'Failed to create chatbot')
        return false
      }
    } catch (error) {
      console.error('Failed to create chatbot:', error)
      alert('Failed to create chatbot')
      return false
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteBot = async (id) => {
    if (!confirm('Are you sure you want to delete this chatbot?')) {
      return
    }

    try {
      const response = await fetch(`/api/chatbots/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchChatbots() // Refresh the list
      } else {
        alert('Failed to delete chatbot')
      }
    } catch (error) {
      console.error('Failed to delete chatbot:', error)
      alert('Failed to delete chatbot')
    }
  }

  const toggleBotStatus = async (id) => {
    const bot = chatbots.find(b => b.id === id)
    if (!bot) return

    const newStatus = bot.status === 'active' ? 'inactive' : 'active'

    try {
      const response = await fetch(`/api/chatbots/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        await fetchChatbots() // Refresh the list
      } else {
        alert('Failed to update chatbot status')
      }
    } catch (error) {
      console.error('Failed to update chatbot status:', error)
      alert('Failed to update chatbot status')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
        <div className="text-2xl" style={{ color: colors.accent }}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg }}>
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center p-6 md:px-12 lg:px-20 sticky top-0 z-50"
        style={{
          backgroundColor: theme === 'dark' ? 'rgba(11, 12, 16, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${colors.border}`
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="flex items-center gap-3"
        >
          <motion.img
            src="/helpgenie-logo.svg"
            alt="HelpGenie Logo"
            width={40}
            height={40}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          <span className="text-2xl font-bold" style={{ color: colors.accent }}>
            HelpGenie
          </span>
        </motion.div>

        <div className="flex items-center gap-6">
          <motion.div
            className="hidden md:flex gap-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {['Dashboard', 'Analytics', 'Settings'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:opacity-80 transition-opacity"
                style={{ color: colors.text }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {item}
              </motion.a>
            ))}
          </motion.div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full relative"
              style={{ backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center" style={{ backgroundColor: colors.accent, color: theme === 'dark' ? '#0B0C10' : '#fff' }}>
                3
              </span>
            </motion.button>

            <ThemeToggle />

            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: colors.accent, color: theme === 'dark' ? '#0B0C10' : '#fff' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-bold">JD</span>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12">
        {/* Header Section */}
        <motion.div
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.text }}>
              My Chatbots
            </h1>
            <p className="text-xl" style={{ color: colors.accent }}>
              Manage and customize your AI assistants
            </p>
          </motion.div>

          {/* Search and Create Button */}
          <motion.div
            className="flex flex-col md:flex-row gap-4 mt-8"
            variants={fadeInUp}
          >
            <div className="flex-1 relative">
              <motion.input
                type="text"
                placeholder="Search chatbots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 rounded-xl outline-none"
                style={{
                  backgroundColor: colors.card,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
                whileHover={{
                  scale: 1.01,
                  borderColor: colors.accent
                }}
                whileFocus={{
                  scale: 1.01,
                  borderColor: colors.accent,
                  boxShadow: theme === 'dark' ? '0 0 20px rgba(139, 92, 246, 0.2)' : '0 0 20px rgba(139, 92, 246, 0.2)'
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
              <svg className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <motion.button
              onClick={() => setShowWizard(true)}
              className="px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              style={{
                backgroundColor: colors.accent,
                color: theme === 'dark' ? '#0B0C10' : '#fff'
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: theme === 'dark' ? '0 0 30px rgba(139, 92, 246, 0.4)' : '0 0 30px rgba(139, 92, 246, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Chatbot
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {[
            {
              label: 'Total Chatbots',
              value: chatbots.length,
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )
            },
            {
              label: 'Active',
              value: chatbots.filter(b => b.status === 'active').length,
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            },
            {
              label: 'Inactive',
              value: chatbots.filter(b => b.status === 'inactive').length,
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            },
            {
              label: 'Created',
              value: chatbots.length > 0 ? 'Today' : '-',
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`
              }}
              variants={scaleIn}
              whileHover={{
                scale: 1.02,
                y: -5,
                boxShadow: theme === 'dark' ? '0 10px 40px rgba(139, 92, 246, 0.15)' : '0 10px 40px rgba(139, 92, 246, 0.1)',
                transition: { type: 'spring', stiffness: 300 }
              }}
            >
              <div className="mb-3" style={{ color: colors.accent }}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: colors.accent }}>
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: colors.text }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Chatbots Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {filteredChatbots.map((chatbot) => (
            <motion.div
              key={chatbot.id}
              className="rounded-2xl p-6 relative overflow-hidden group"
              style={{
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`
              }}
              variants={scaleIn}
              whileHover={{
                scale: 1.02,
                y: -5,
                boxShadow: theme === 'dark' ? '0 15px 40px rgba(139, 92, 246, 0.2)' : '0 15px 40px rgba(139, 92, 246, 0.1)',
                transition: { type: 'spring', stiffness: 300 }
              }}
            >
              {/* Status Indicator */}
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{
                  backgroundColor: chatbot.status === 'active' ? colors.success : colors.textSecondary,
                  boxShadow: chatbot.status === 'active' ? `0 0 10px ${colors.success}` : 'none'
                }}></span>
                <span className="text-sm capitalize" style={{ color: colors.text }}>
                  {chatbot.status}
                </span>
              </div>

              {/* Chatbot Icon */}
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${colors.accent}20` }}
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </motion.div>

              {/* Chatbot Info */}
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.text }}>
                {chatbot.name}
              </h3>
              <p className="text-sm mb-4 line-clamp-2" style={{ color: colors.textSecondary }}>
                {chatbot.title || chatbot.subtitle || 'Customize your chatbot settings'}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Link
                  href={`/chatbots/${chatbot.id}/customize`}
                  className="flex-1 py-2 px-4 rounded-lg font-semibold text-sm text-center hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: colors.accent,
                    color: theme === 'dark' ? '#0B0C10' : '#fff'
                  }}
                >
                  Edit Settings
                </Link>

                <motion.button
                  onClick={() => toggleBotStatus(chatbot.id)}
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent }}>
                    {chatbot.status === 'active' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </>
                    )}
                  </svg>
                </motion.button>

                <motion.button
                  onClick={() => handleDeleteBot(chatbot.id)}
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.error }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}

          {/* Add New Chatbot Card */}
          <motion.div
            onClick={() => setShowWizard(true)}
            className="rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer border-dashed"
            style={{
              backgroundColor: 'transparent',
              border: `2px dashed ${colors.border}`,
              minHeight: '280px'
            }}
            variants={scaleIn}
            whileHover={{
              scale: 1.02,
              borderColor: colors.accent,
              backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.05)'
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)' }}
              whileHover={{ rotate: 90, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </motion.div>
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.accent }}>
              Create New Chatbot
            </h3>
            <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
              Add a new AI assistant to your workspace
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Create Chatbot Wizard */}
      <AnimatePresence>
        {showWizard && (
          <CreateChatbotWizard
            onClose={() => setShowWizard(false)}
            onCreate={handleCreateBot}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default DashboardPage
