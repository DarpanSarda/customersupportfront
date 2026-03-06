'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  useEffect(() => {
    // Save theme to localStorage and update document
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const colors = {
    dark: {
      // Minimal Dark - Soft, professional dark theme
      bg: '#09090b',           // Very dark gray (not pure black)
      card: '#18181b',         // Card background
      border: '#27272a',       // Subtle borders
      accent: '#14b8a6',       // Teal accent (calm, professional)
      accentSecondary: '#2dd4bf',
      text: '#e4e4e7',         // Light gray text (not white)
      textSecondary: '#a1a1aa', // Muted text
      inputBg: '#18181b',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b'
    },
    light: {
      // Minimal Light - Clean, modern light theme
      bg: '#ffffff',           // Pure white
      card: '#fafafa',         // Very light gray
      border: '#e5e5e5',       // Light borders
      accent: '#14b8a6',       // Same teal accent
      accentSecondary: '#2dd4bf',
      text: '#18181b',         // Nearly black text
      textSecondary: '#71717a', // Muted text
      inputBg: '#ffffff',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b'
    }
  }

  const currentColors = colors[theme]

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: currentColors }}>
      {children}
    </ThemeContext.Provider>
  )
}
