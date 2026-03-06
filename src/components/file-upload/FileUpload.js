'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

export default function FileUpload({ label, value, onChange, accept = 'image/*', maxSize = 2 * 1024 * 1024 }) {
  const { colors } = useTheme()
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  // Create preview URL for File objects
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      // Only set previewUrl if value is a non-empty string
      setPreviewUrl(value && typeof value === 'string' && value.trim() ? value : null)
    }
  }, [value])

  const handleFileSelect = (file) => {
    setError(null)

    // Validate file size
    if (file.size > maxSize) {
      setError(`File too large. Max ${maxSize / (1024 * 1024)}MB.`)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Invalid file type. Please upload an image.')
      return
    }

    // Pass the File object to parent (don't upload yet)
    onChange(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    onChange(null)
  }

  const hasValue = value instanceof File || (typeof value === 'string' && value)

  const uploadAreaStyle = {
    border: `2px dashed ${isDragging ? colors.accent : colors.border}`,
    borderRadius: '8px',
    padding: hasValue ? '16px' : '32px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: isDragging ? `${colors.accent}15` : colors.card,
    minHeight: hasValue ? 'auto' : '150px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  }

  const labelStyle = {
    color: colors.text,
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '12px',
    textAlign: 'left',
    width: '100%'
  }

  const previewStyle = {
    maxWidth: '100%',
    maxHeight: '200px',
    objectFit: 'contain',
    borderRadius: '4px'
  }

  const buttonStyle = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: colors.error,
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500'
  }

  const errorStyle = {
    color: colors.error,
    fontSize: '12px',
    marginTop: '8px'
  }

  const iconStyle = {
    fontSize: '32px',
    marginBottom: '8px',
    opacity: 0.7
  }

  const textStyle = {
    color: colors.textSecondary,
    fontSize: '14px'
  }

  const subTextStyle = {
    color: colors.textSecondary,
    fontSize: '12px',
    marginTop: '4px'
  }

  const pendingStyle = {
    color: colors.warning,
    fontSize: '12px',
    marginTop: '8px'
  }

  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <div
        style={uploadAreaStyle}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {hasValue ? (
          <>
            <button style={buttonStyle} onClick={handleRemove}>
              Remove
            </button>
            <img src={previewUrl} alt="Preview" style={previewStyle} />
            {value instanceof File && (
              <div style={pendingStyle}>Pending upload (will be saved on submit)</div>
            )}
          </>
        ) : (
          <>
            <div style={iconStyle}>📁</div>
            <div style={textStyle}>
              {isDragging ? 'Drop your image here' : 'Drag & drop or click to upload'}
            </div>
            <div style={subTextStyle}>
              PNG, JPEG, WebP, SVG up to {maxSize / (1024 * 1024)}MB
            </div>
          </>
        )}
      </div>

      {error && <div style={errorStyle}>{error}</div>}
    </div>
  )
}
