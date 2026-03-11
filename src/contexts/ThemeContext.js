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
      // Modern Dark Theme - Purple Accent
      bg: '#0a0a0f',           // Very dark background
      card: '#15151a',         // Dark card background
      cardHover: '#1a1a20',    // Card hover state
      border: '#2a2a35',       // Subtle borders
      accent: '#8b5cf6',       // Purple accent
      accentHover: '#a78bfa',  // Lighter purple for hover
      text: '#f4f4f5',         // Light text
      textSecondary: '#a1a1aa', // Muted text
      inputBg: '#15151a',      // Input background
      inputBorder: '#3f3f46',  // Input border
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      shadow: 'rgba(139, 92, 246, 0.15)',
      overlay: 'rgba(10, 10, 15, 0.8)'
    },
    light: {
      // Modern Light Theme - Purple Accent
      bg: '#f8f8fc',           // Soft light background with purple tint
      card: '#ffffff',         // White cards
      cardHover: '#f5f5ff',    // Card hover state with purple tint
      border: '#e8e8f0',       // Light borders
      accent: '#8b5cf6',       // Purple accent
      accentHover: '#a78bfa',  // Lighter purple for hover
      text: '#1a1a2e',         // Dark text
      textSecondary: '#6b6b7b', // Muted text
      inputBg: '#ffffff',      // White input
      inputBorder: '#d4d4dc',  // Input border
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      shadow: 'rgba(139, 92, 246, 0.1)',
      overlay: 'rgba(0, 0, 0, 0.5)'
    }
  }

  const currentColors = colors[theme]

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: currentColors }}>
      {children}
    </ThemeContext.Provider>
  )
}
