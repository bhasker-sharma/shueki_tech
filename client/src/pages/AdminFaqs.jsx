import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { faqAPI } from '../utils/api'
import {
  Plus, Edit2, Trash2, X, CheckCircle, AlertCircle,
  Loader2, HelpCircle, ChevronDown, ChevronUp,
} from 'lucide-react'

// ─── Config ───────────────────────────────────────────────────────────────────

const PAGE_OPTIONS = [
  { value: 'home',                label: 'Home Page' },
  { value: 'contact',             label: 'Contact Page' },
  { value: 'web-development',     label: 'Service: Website Development' },
  { value: 'machine-integration', label: 'Service: Machine Integration' },
  { value: 'ai-pipelines',        label: 'Service: AI Pipelines' },
  { value: 'pcb-designing',       label: 'Service: PCB Designing' },
  { value: 'app-development',     label: 'Service: App Development' },
  { value: 'rd-consultancy',      label: 'Service: R&D Consultancy' },
]

const EMPTY_FORM = {
  question: '', answer: '', page: 'home', sort_order: 0, status: 'published',
}

// ─── FAQ Form Modal ───────────────────────────────────────────────────────────

const FaqForm = ({ faq, defaultPage, onClose, onSave }) => {
  const [form, setForm] = useState(() =>
    faq ? {
      question:   faq.question   || '',
      answer:     faq.answer     || '',
      page:       faq.page       || defaultPage || 'home',
      sort_order: faq.sort_order ?? 0,
      status:     faq.status     || 'published',
    } : { ...EMPTY_FORM, page: defaultPage || 'home' }
  )
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = { ...form, sort_order: Number(form.sort_order) }
      const result = faq?.id
        ? await faqAPI.update(faq.id, payload)
        : await faqAPI.create(payload)
      onSave(result.faq)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto py-6 px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">
            {faq ? 'Edit FAQ' : 'Add FAQ'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-3">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Page + Status */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Page <span className="text-red-400">*</span>
              </label>
              <select name="page" value={form.page} onChange={handleChange} className="input-field">
                {PAGE_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Question <span className="text-red-400">*</span>
            </label>
            <textarea name="question" value={form.question} onChange={handleChange} required rows={2}
              placeholder="e.g. How long does a typical project take?"
              className="input-field resize-none" />
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Answer <span className="text-red-400">*</span>
            </label>
            <textarea name="answer" value={form.answer} onChange={handleChange} required rows={5}
              placeholder="Provide a clear, helpful answer..."
              className="input-field resize-none" />
          </div>

          {/* Sort Order */}
          <div className="w-44">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Sort Order
              <span className="text-slate-500 font-normal ml-1">(lower = first)</span>
            </label>
            <input name="sort_order" type="number" value={form.sort_order}
              onChange={handleChange} min="0" className="input-field" />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-700">
            <button type="button" onClick={onClose} disabled={saving}
              className="px-5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving…' : faq ? 'Update FAQ' : 'Add FAQ'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          background: rgb(15 23 42);
          border: 1px solid rgb(71 85 105);
          color: white;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input-field:focus { border-color: var(--color-primary, #6366f1); }
        .input-field::placeholder { color: rgb(100 116 139); }
        .input-field option { background: rgb(30 41 59); }
      `}</style>
    </div>
  )
}

// ─── FAQ Item Row ─────────────────────────────────────────────────────────────

const FaqItem = ({ faq, onEdit, onDelete }) => (
  <div className="bg-slate-700/40 border border-slate-600/40 rounded-lg p-4 group">
    <div className="flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold leading-snug mb-1">
          {faq.question}
        </p>
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{faq.answer}</p>
        {faq.sort_order > 0 && (
          <p className="text-slate-600 text-xs mt-1.5">Order: {faq.sort_order}</p>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
          faq.status === 'published'
            ? 'bg-green-600/80 text-white'
            : 'bg-slate-600 text-slate-200'
        }`}>
          {faq.status}
        </span>
        <button
          onClick={() => onEdit(faq)}
          className="p-1.5 bg-slate-600 hover:bg-slate-500 text-white rounded-md transition-colors"
          aria-label="Edit"
        >
          <Edit2 size={12} />
        </button>
        <button
          onClick={() => onDelete(faq.id)}
          className="p-1.5 bg-red-900/40 hover:bg-red-900/70 text-red-400 rounded-md transition-colors border border-red-800/40"
          aria-label="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  </div>
)

// ─── Page Section Card ────────────────────────────────────────────────────────

const PageSection = ({ page, faqs, onAdd, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      {/* Section header — clickable to collapse */}
      <div
        className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-slate-700/30 transition-colors select-none"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          {open ? (
            <ChevronUp size={15} className="text-slate-400 flex-shrink-0" />
          ) : (
            <ChevronDown size={15} className="text-slate-400 flex-shrink-0" />
          )}
          <span className="text-white font-semibold text-sm">{page.label}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            faqs.length > 0
              ? 'bg-primary/20 text-accent'
              : 'bg-slate-700 text-slate-400'
          }`}>
            {faqs.length} {faqs.length === 1 ? 'FAQ' : 'FAQs'}
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onAdd(page.value) }}
          className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-white bg-primary/10 hover:bg-primary/30 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={13} /> Add FAQ
        </button>
      </div>

      {/* FAQ list */}
      {open && (
        <div className="px-5 pb-5 space-y-2.5">
          {faqs.length === 0 ? (
            <p className="text-slate-500 text-xs py-4 text-center border border-dashed border-slate-700 rounded-lg">
              No FAQs for this page yet — click <strong className="text-slate-400">Add FAQ</strong> to create one.
            </p>
          ) : (
            faqs.map((faq) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const AdminFaqs = () => {
  const [faqs, setFaqs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [editItem, setEditItem]   = useState(null)
  const [defaultPage, setDefaultPage] = useState('home')
  const [deleteId, setDeleteId]   = useState(null)
  const [deleting, setDeleting]   = useState(false)
  const [toast, setToast]         = useState(null)

  useEffect(() => {
    faqAPI.getAll()
      .then((data) => setFaqs(data.faqs || []))
      .catch((err) => showToast('error', err.message))
      .finally(() => setLoading(false))
  }, [])

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const handleAdd = (page) => {
    setDefaultPage(page)
    setEditItem(null)
    setShowForm(true)
  }

  const handleEdit = (faq) => {
    setEditItem(faq)
    setDefaultPage(faq.page)
    setShowForm(true)
  }

  const handleSave = (saved) => {
    setFaqs((prev) => {
      const exists = prev.find((f) => f.id === saved.id)
      return exists
        ? prev.map((f) => (f.id === saved.id ? saved : f))
        : [...prev, saved]
    })
    setShowForm(false)
    setEditItem(null)
    showToast('success', editItem ? 'FAQ updated' : 'FAQ added')
  }

  const handleDeleteConfirm = async () => {
    setDeleting(true)
    try {
      await faqAPI.delete(deleteId)
      setFaqs((prev) => prev.filter((f) => f.id !== deleteId))
      setDeleteId(null)
      showToast('success', 'FAQ deleted')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setDeleting(false)
    }
  }

  // Group FAQs by page, sorted by sort_order then id
  const faqsByPage = PAGE_OPTIONS.reduce((acc, p) => {
    acc[p.value] = faqs
      .filter((f) => f.page === p.value)
      .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
    return acc
  }, {})

  return (
    <AdminLayout>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          toast.type === 'success'
            ? 'bg-green-800 border border-green-600 text-green-100'
            : 'bg-red-900 border border-red-700 text-red-100'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <FaqForm
          faq={editItem}
          defaultPage={defaultPage}
          onClose={() => { setShowForm(false); setEditItem(null) }}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-900/40 rounded-full flex items-center justify-center">
                <Trash2 size={18} className="text-red-400" />
              </div>
              <h3 className="text-white font-semibold">Delete FAQ</h3>
            </div>
            <p className="text-slate-400 text-sm mb-5">
              This will permanently delete this FAQ. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} disabled={deleting}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors">
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} disabled={deleting}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-red-700 hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                {deleting && <Loader2 size={14} className="animate-spin" />}
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">FAQs</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {loading
              ? 'Loading…'
              : `${faqs.length} FAQ${faqs.length !== 1 ? 's' : ''} across ${PAGE_OPTIONS.length} pages`}
          </p>
        </div>
        <button
          onClick={() => handleAdd('home')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-slate-400" />
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {PAGE_OPTIONS.map((page) => (
            <PageSection
              key={page.value}
              page={page}
              faqs={faqsByPage[page.value] || []}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminFaqs
