'use client'

import { useState, useEffect, use, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Upload, FileText, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function FAQsPage({ params }) {
  const { id } = use(params)
  const { theme, colors } = useTheme()

  const [faqs, setFaqs] = useState([])
  const [filteredFaqs, setFilteredFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showModal, setShowModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importedFaqs, setImportedFaqs] = useState([])
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Form state
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'faq',
    order_index: 1
  })

  // Stats
  const stats = {
    total: faqs.length,
    active: faqs.filter(f => f.is_active).length
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedFaqs = filteredFaqs.slice(startIndex, endIndex)

  useEffect(() => {
    fetchFAQs()
  }, [id])

  useEffect(() => {
    filterFAQs()
  }, [faqs, searchQuery, sortBy])

  useEffect(() => {
    setCurrentPage(1)
  }, [filteredFaqs.length])

  const fetchFAQs = async () => {
    try {
      const response = await fetch(`/api/chatbots/${id}/faqs`)
      const data = await response.json()
      if (response.ok) {
        setFaqs(data.faqs)
      }
    } catch (error) {
      console.error('Failed to fetch FAQs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterFAQs = () => {
    let filtered = faqs

    if (searchQuery) {
      filtered = filtered.filter(f =>
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case 'oldest':
        filtered = [...filtered].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        break
      case 'alphabetical':
        filtered = [...filtered].sort((a, b) => a.question.localeCompare(b.question))
        break
      case 'reverse-alphabetical':
        filtered = [...filtered].sort((a, b) => b.question.localeCompare(a.question))
        break
      default:
        break
    }

    setFilteredFaqs(filtered)
  }

  const handleOpenModal = (faq = null) => {
    if (faq) {
      setEditingFaq(faq)
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category || 'general',
        order_index: faq.order_index
      })
    } else {
      setEditingFaq(null)
      setFormData({
        question: '',
        answer: '',
        category: 'general',
        order_index: faqs.length + 1
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingFaq(null)
    setFormData({
      question: '',
      answer: '',
      category: 'general',
      order_index: 1
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = `/api/chatbots/${id}/faqs`
      const method = editingFaq ? 'PUT' : 'POST'
      const body = editingFaq
        ? { ...formData, faqId: editingFaq.id }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        const data = await response.json()
        if (editingFaq) {
          setFaqs(faqs.map(f => f.id === editingFaq.id ? data.faq : f))
        } else {
          setFaqs([...faqs, data.faq])
        }
        handleCloseModal()
      } else {
        alert('Failed to save FAQ')
      }
    } catch (error) {
      console.error('Failed to save FAQ:', error)
      alert('Failed to save FAQ')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (faq) => {
    try {
      const response = await fetch(`/api/chatbots/${id}/faqs`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          faqId: faq.id,
          is_active: !faq.is_active
        })
      })

      if (response.ok) {
        setFaqs(faqs.map(f => f.id === faq.id ? { ...f, is_active: !f.is_active } : f))
      }
    } catch (error) {
      console.error('Failed to toggle FAQ:', error)
    }
  }

  const handleDelete = async (faqId) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return

    try {
      const response = await fetch(`/api/chatbots/${id}/faqs?faqId=${faqId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setFaqs(faqs.filter(f => f.id !== faqId))
      }
    } catch (error) {
      console.error('Failed to delete FAQ:', error)
      alert('Failed to delete FAQ')
    }
  }

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    const fileExtension = selectedFile.name.split('.').pop().toLowerCase()

    if (fileExtension !== 'csv' && fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      alert('Please upload a CSV or Excel file')
      return
    }

    setFile(selectedFile)
    setImportedFaqs([{ name: selectedFile.name }])
  }

  const handleBulkImport = async () => {
    if (!file) {
      alert('Please select a file to import')
      return
    }

    setImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`/api/chatbots/${id}/faqs/bulk`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        await fetchFAQs()
        setShowBulkModal(false)
        setImportedFaqs([])
        setFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        alert(data.message || 'FAQs imported successfully')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to import FAQs')
      }
    } catch (error) {
      console.error('Failed to import FAQs:', error)
      alert('Failed to import FAQs')
    } finally {
      setImporting(false)
    }
  }

  const handleOpenBulkModal = () => {
    setShowBulkModal(true)
    setShowDropdown(false)
  }

  const handleCloseBulkModal = () => {
    setShowBulkModal(false)
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: colors.bg }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p style={{ color: colors.textSecondary }}>Loading FAQs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6" style={{ background: colors.bg }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>FAQs</h1>
            <p style={{ color: colors.textSecondary }}>Manage frequently asked questions for your chatbot</p>
          </div>
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
              style={{ background: colors.accent, color: 'white' }}
            >
              <Plus size={20} />
              Add FAQ
              <ChevronDown size={16} />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showDropdown && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl overflow-hidden z-20"
                    style={{ background: colors.card, borderColor: colors.border, borderWidth: '1px' }}
                  >
                    <motion.button
                      whileHover={{ backgroundColor: colors.bg }}
                      onClick={() => {
                        handleOpenModal()
                        setShowDropdown(false)
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 transition-all text-left"
                      style={{ color: colors.text }}
                    >
                      <FileText size={18} style={{ color: colors.accent }} />
                      <div>
                        <p className="font-medium">Single FAQ</p>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>Add one FAQ at a time</p>
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: colors.bg }}
                      onClick={handleOpenBulkModal}
                      className="w-full px-4 py-3 flex items-center gap-3 transition-all text-left"
                      style={{ color: colors.text }}
                    >
                      <Upload size={18} style={{ color: colors.accent }} />
                      <div>
                        <p className="font-medium">Bulk Import</p>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>Import from CSV/XLSX</p>
                      </div>
                    </motion.button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-6 rounded-2xl border" style={{ background: colors.card, borderColor: colors.border }}>
            <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>Total FAQs</p>
            <p className="text-3xl font-bold" style={{ color: colors.text }}>{stats.total}</p>
          </div>
          <div className="p-6 rounded-2xl border" style={{ background: colors.card, borderColor: colors.border }}>
            <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>Active</p>
            <p className="text-3xl font-bold" style={{ color: colors.accent }}>{stats.active}</p>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSecondary }} />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all"
              style={{
                background: colors.card,
                borderColor: colors.border,
                color: colors.text
              }}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all cursor-pointer"
            style={{
              background: colors.card,
              borderColor: colors.border,
              color: colors.text
            }}
          >
            <option value="newest" className={theme === 'dark' ? 'bg-zinc-800' : 'bg-white'}>Newest First</option>
            <option value="oldest" className={theme === 'dark' ? 'bg-zinc-800' : 'bg-white'}>Oldest First</option>
            <option value="alphabetical" className={theme === 'dark' ? 'bg-zinc-800' : 'bg-white'}>A-Z</option>
            <option value="reverse-alphabetical" className={theme === 'dark' ? 'bg-zinc-800' : 'bg-white'}>Z-A</option>
          </select>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          <AnimatePresence>
            {paginatedFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 rounded-2xl border"
                style={{ background: colors.card, borderColor: colors.border }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {faq.category && (
                        <span className="px-3 py-1 rounded-lg text-xs font-medium capitalize"
                          style={{
                            background: colors.accent + '20',
                            color: colors.accent
                          }}>
                          {faq.category}
                        </span>
                      )}
                      {!faq.is_active && (
                        <span className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-500/20 text-gray-400">
                          Inactive
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>{faq.question}</h3>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleActive(faq)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: faq.is_active ? colors.accent : colors.textSecondary }}
                    >
                      {faq.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleOpenModal(faq)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: colors.textSecondary }}
                    >
                      <Edit2 size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(faq.id)}
                      className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12" style={{ color: colors.textSecondary }}>
              <p className="text-lg mb-2">No FAQs found</p>
              <p className="text-sm">Create your first FAQ to get started</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 p-4 rounded-xl" style={{ background: colors.card, borderColor: colors.border, borderWidth: '1px' }}>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredFaqs.length)} of {filteredFaqs.length} FAQs
            </p>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: colors.bg, color: colors.text }}
              >
                <ChevronLeft size={20} />
              </motion.button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(page)}
                  className="w-10 h-10 rounded-lg font-medium transition-all"
                  style={{
                    background: currentPage === page ? colors.accent : colors.bg,
                    color: currentPage === page ? 'white' : colors.text
                  }}
                >
                  {page}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: colors.bg, color: colors.text }}
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-lg p-6 rounded-2xl shadow-2xl"
                style={{ background: colors.card }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                    {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCloseModal}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: colors.textSecondary }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Question</label>
                    <input
                      type="text"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all"
                      placeholder="e.g., What are your business hours?"
                      style={{
                        background: colors.bg,
                        borderColor: colors.border,
                        color: colors.text
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Answer</label>
                    <textarea
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all resize-none"
                      rows={4}
                      placeholder="Provide a helpful answer..."
                      style={{
                        background: colors.bg,
                        borderColor: colors.border,
                        color: colors.text
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all cursor-pointer"
                      style={{
                        background: colors.bg,
                        borderColor: colors.border,
                        color: colors.text
                      }}
                    >
                      <option value="general" className={theme === 'dark' ? 'bg-zinc-800' : 'bg-white'}>General</option>
                      <option value="shipping" className={theme === 'dark' ? 'bg-zinc-800' : 'bg-white'}>Shipping</option>
                      <option value="returns" className={theme === 'dark' ? 'bg-zinc-800' : 'bg-white'}>Returns</option>
                      <option value="refund" className={theme === 'dark' ? 'bg-zinc-800' : 'bg-white'}>Refund</option>
                      <option value="payment" className={theme === 'dark' ? 'bg-zinc-800' : 'bg-white'}>Payment</option>
                      <option value="account" className={theme === 'dark' ? 'bg-zinc-800' : 'bg-white'}>Account</option>
                      <option value="support" className={theme === 'dark' ? 'bg-zinc-800' : 'bg-white'}>Support</option>
                      <option value="billing" className={theme === 'dark' ? 'bg-zinc-800' : 'bg-white'}>Billing</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCloseModal}
                      className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all"
                      style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={saving}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                      style={{ background: colors.accent, color: 'white' }}
                    >
                      {saving ? 'Saving...' : editingFaq ? 'Update' : 'Create'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Import Modal */}
        <AnimatePresence>
          {showBulkModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={handleCloseBulkModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-2xl p-6 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                style={{ background: colors.card }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: colors.text }}>Bulk Import FAQs</h2>
                    <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>Import FAQs from CSV or Excel file</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCloseBulkModal}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: colors.textSecondary }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                {/* File Upload Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Upload File (CSV or XLSX)
                  </label>
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <motion.label
                      htmlFor="file-upload"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all"
                      style={{
                        borderColor: importedFaqs.length > 0 ? colors.accent : colors.border,
                        background: colors.bg
                      }}
                    >
                      <Upload size={40} className="mb-3" style={{ color: colors.accent }} />
                      <p className="font-medium mb-1" style={{ color: colors.text }}>
                        {file ? file.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>
                        CSV or XLSX file with columns: question, answer, category
                      </p>
                    </motion.label>
                  </div>
                </div>

                {/* File Info */}
                {file && (
                  <div className="mb-6 p-4 rounded-lg" style={{ background: colors.bg, borderColor: colors.accent, borderWidth: '1px' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: colors.accent + '20' }}>
                          <FileText size={20} style={{ color: colors.accent }} />
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: colors.text }}>{file.name}</p>
                          <p className="text-xs" style={{ color: colors.textSecondary }}>
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setFile(null)
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ''
                          }
                        }}
                        className="text-sm px-3 py-1 rounded-lg"
                        style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCloseBulkModal}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all"
                    style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBulkImport}
                    disabled={!file || importing}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: colors.accent, color: 'white' }}
                  >
                    {importing ? 'Importing...' : 'Import File'}
                  </motion.button>
                </div>

                {/* Sample Format Help */}
                <div className="mt-6 p-4 rounded-lg" style={{ background: colors.bg, borderColor: colors.border, borderWidth: '1px' }}>
                  <p className="text-sm font-medium mb-2" style={{ color: colors.text }}>Expected CSV Format:</p>
                  <pre className="text-xs overflow-x-auto p-2 rounded" style={{ background: colors.card, color: colors.textSecondary }}>
{`question,answer,category
"What are your hours?","We're open 9-5 EST","shipping"
"How to reset password?","Click Forgot Password","account"
"What payment methods?","Visa, MasterCard, PayPal","payment"`}
                  </pre>
                  <p className="text-xs mt-2" style={{ color: colors.textSecondary }}>
                    Supported categories: shipping, returns, refund, payment, account, general
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
