'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

const RegisterPage = () => {
  const { colors, theme } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }

      // Auto-login after registration
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const loginData = await loginResponse.json()

      if (loginResponse.ok && loginData.token) {
        // Store token in cookie
        document.cookie = `auth_token=${loginData.token}; path=/; max-age=604800; secure; samesite=strict`

        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(loginData.user))

        // Redirect to dashboard
        window.location.href = '/dashboard'
      } else {
        // Registration successful, redirect to login
        window.location.href = '/login?registered=true'
      }

    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12" style={{ backgroundColor: colors.bg }}>
      <motion.div
        className="w-full max-w-md mx-4"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        {/* Logo and Title */}
        <motion.div
          className="text-center mb-8"
          variants={scaleIn}
        >
          <motion.img
            src="/helpgenie-logo.svg"
            alt="HelpGenie Logo"
            width={80}
            height={80}
            className="mx-auto mb-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <h1 className="text-4xl font-bold mb-2" style={{ color: colors.text }}>
            Create Account
          </h1>
          <p style={{ color: colors.accent }}>
            Join HelpGenie and transform your support
          </p>
        </motion.div>

        {/* Register Card */}
        <motion.div
          className="rounded-3xl p-8"
          style={{
            backgroundColor: colors.card,
            border: `1px solid ${colors.border}`
          }}
          variants={scaleIn}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <motion.div
                className="p-3 rounded-lg text-sm"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444' }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {/* Name Field */}
            <motion.div variants={fadeInUp}>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.accent }}>
                Full Name
              </label>
              <motion.input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
                whileFocus={{
                  scale: 1.02,
                  borderColor: colors.accent,
                  boxShadow: theme === 'dark' ? `0 0 20px rgba(20, 184, 166, 0.2)` : `0 0 20px rgba(20, 184, 166, 0.2)`
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
            </motion.div>

            {/* Email Field */}
            <motion.div variants={fadeInUp}>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.accent }}>
                Email Address
              </label>
              <motion.input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
                whileFocus={{
                  scale: 1.02,
                  borderColor: colors.accent,
                  boxShadow: theme === 'dark' ? `0 0 20px rgba(20, 184, 166, 0.2)` : `0 0 20px rgba(20, 184, 166, 0.2)`
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
            </motion.div>

            {/* Password Field */}
            <motion.div variants={fadeInUp}>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.accent }}>
                Password
              </label>
              <motion.input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength={8}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
                whileFocus={{
                  scale: 1.02,
                  borderColor: colors.accent,
                  boxShadow: theme === 'dark' ? `0 0 20px rgba(20, 184, 166, 0.2)` : `0 0 20px rgba(20, 184, 166, 0.2)`
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div variants={fadeInUp}>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.accent }}>
                Confirm Password
              </label>
              <motion.input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength={8}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
                whileFocus={{
                  scale: 1.02,
                  borderColor: colors.accent,
                  boxShadow: theme === 'dark' ? `0 0 20px rgba(20, 184, 166, 0.2)` : `0 0 20px rgba(20, 184, 166, 0.2)`
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
            </motion.div>

            {/* Terms & Conditions */}
            <motion.div
              className="flex items-start gap-3"
              variants={fadeInUp}
            >
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 rounded"
                style={{ accentColor: colors.accent }}
              />
              <span className="text-sm" style={{ color: colors.text }}>
                I agree to the{' '}
                <Link href="/terms" className="hover:opacity-80" style={{ color: colors.accent }}>
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="hover:opacity-80" style={{ color: colors.accent }}>
                  Privacy Policy
                </Link>
              </span>
            </motion.div>

            {/* Sign Up Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-lg disabled:opacity-50"
              style={{
                backgroundColor: colors.accent,
                color: theme === 'dark' ? '#0B0C10' : '#fff'
              }}
              variants={scaleIn}
              whileHover={
                loading
                  ? {}
                  : {
                      scale: 1.02,
                      boxShadow: theme === 'dark' ? '0 0 30px rgba(20, 184, 166, 0.4)' : '0 0 30px rgba(20, 184, 166, 0.3)'
                    }
              }
              whileTap={loading ? {} : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <motion.p
            className="text-center mt-6"
            style={{ color: colors.text }}
            variants={fadeInUp}
          >
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold hover:opacity-80 transition-opacity"
              style={{ color: colors.accent }}
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          className="text-center mt-6"
          variants={fadeInUp}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
            style={{ color: colors.text }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default RegisterPage
