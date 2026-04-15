import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { testimonialAPI } from '../utils/api'
import { SERVICE_TYPE_LABELS } from '../utils/constants'
import {
  Plus, Edit2, Trash2, X, CheckCircle, AlertCircle,
  Loader2, MessageSquare, Star,
} from 'lucide-react'

// ─── Config ───────────────────────────────────────────────────────────────────

const GRADIENT_OPTIONS = [
  { value: 'from-blue-500 to-cyan-500',    label: 'Blue → Cyan' },
  { value: 'from-purple-500 to-pink-500',  label: 'Purple → Pink' },
  { value: 'from-orange-500 to-red-500',   label: 'Orange → Red' },
  { value: 'from-green-500 to-teal-500',   label: 'Green → Teal' },
  { value: 'from-yellow-500 to-orange-500',label: 'Yellow → Orange' },
  { value: 'from-indigo-500 to-purple-500',label: 'Indigo → Purple' },
  { value: 'from-rose-500 to-pink-500',    label: 'Rose → Pink' },
  { value: 'from-sky-500 to-blue-600',     label: 'Sky → Blue' },
  { value: 'from-emerald-500 to-cyan-500', label: 'Emerald → Cyan' },
  { value: 'from-lime-500 to-green-600',   label: 'Lime → Green' },
]

const SERVICE_LABELS = Object.entries(SERVICE_TYPE_LABELS)
  .filter(([k]) => k !== 'general')
  .map(([, label]) => label)

const computeInitials = (name) => {
  if (!name) return ''
  const words = name.trim().split(/\s+/)
  return words.map((w) => w[0]?.toUpperCase() || '').join('').slice(0, 2)
}

const EMPTY_FORM = {
  name: '', role: '', company: '', text: '',
  rating: 5, service: '', initials: '',
  gradient: 'from-blue-500 to-cyan-500',
  featured: false, sort_order: 0, status: 'published',
}

// ─── Testimonial Form Modal ───────────────────────────────────────────────────

const TestimonialForm = ({ testimonial, onClose, onSave }) => {
  const [form, setForm] = useState(() =>
    testimonial ? {
      name:       testimonial.name       || '',
      role:       testimonial.role       || '',
      company:    testimonial.company    || '',
      text:       testimonial.text       || '',
      rating:     testimonial.rating     || 5,
      service:    testimonial.service    || '',
      initials:   testimonial.initials   || '',
      gradient:   testimonial.gradient   || 'from-blue-500 to-cyan-500',
      featured:   testimonial.featured   || false,
      sort_order: testimonial.sort_order || 0,
      status:     testimonial.status     || 'published',
    } : { ...EMPTY_FORM }
  )
  const [initialsManual, setInitialsManual] = useState(!!testimonial?.initials)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    if (name === 'initials') setInitialsManual(true)

    setForm((f) => {
      const updated = { ...f, [name]: newValue }
      if (name === 'name' && !initialsManual) {
        updated.initials = computeInitials(newValue)
      }
      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        ...form,
        rating:     Number(form.rating),
        sort_order: Number(form.sort_order),
      }
      const result = testimonial?.id
        ? await testimonialAPI.update(testimonial.id, payload)
        : await testimonialAPI.create(payload)
      onSave(result.testimonial)
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
            {testimonial ? 'Edit Testimonial' : 'Add Testimonial'}
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

          {/* Name + Role */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Name <span className="text-red-400">*</span>
              </label>
              <input name="name" value={form.name} onChange={handleChange} required
                placeholder="e.g. Rajiv Mehta" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Role <span className="text-red-400">*</span>
              </label>
              <input name="role" value={form.role} onChange={handleChange} required
                placeholder="e.g. Founder & CEO" className="input-field" />
            </div>
          </div>

          {/* Company + Initials */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Company <span className="text-red-400">*</span>
              </label>
              <input name="company" value={form.company} onChange={handleChange} required
                placeholder="e.g. RetailNexus" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Initials
                <span className="text-slate-500 font-normal ml-1">(auto from name)</span>
              </label>
              <input name="initials" value={form.initials} onChange={handleChange}
                maxLength={3} placeholder="e.g. RM" className="input-field" />
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Review Text <span className="text-red-400">*</span>
            </label>
            <textarea name="text" value={form.text} onChange={handleChange} required rows={4}
              placeholder="What did the client say about working with you?"
              className="input-field resize-none" />
          </div>

          {/* Rating + Service */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Rating</label>
              <select name="rating" value={form.rating} onChange={handleChange} className="input-field">
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{'★'.repeat(r)} ({r}/5)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Service
                <span className="text-slate-500 font-normal ml-1">(optional)</span>
              </label>
              <select name="service" value={form.service} onChange={handleChange} className="input-field">
                <option value="">— None —</option>
                {SERVICE_LABELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Gradient + Status + Sort Order */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Avatar Colour</label>
              <select name="gradient" value={form.gradient} onChange={handleChange} className="input-field">
                {GRADIENT_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
              <div className={`mt-2 h-5 rounded bg-gradient-to-r ${form.gradient}`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Sort Order</label>
              <input name="sort_order" type="number" value={form.sort_order}
                onChange={handleChange} min="0" className="input-field" />
            </div>
          </div>

          {/* Featured */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input type="checkbox" name="featured" checked={form.featured}
              onChange={handleChange} className="w-4 h-4 accent-primary" />
            <div>
              <span className="text-sm font-medium text-slate-300">Featured on homepage</span>
              <p className="text-xs text-slate-500">Shown in the testimonials slider on the home page</p>
            </div>
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-700">
            <button type="button" onClick={onClose} disabled={saving}
              className="px-5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving…' : testimonial ? 'Update Testimonial' : 'Add Testimonial'}
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

// ─── Testimonial Card ─────────────────────────────────────────────────────────

const TestimonialCard = ({ testimonial, onEdit, onDelete }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col">
    {/* Gradient strip */}
    <div className={`h-1.5 bg-gradient-to-r ${testimonial.gradient || 'from-blue-500 to-cyan-500'}`} />

    <div className="p-4 flex flex-col flex-1">
      {/* Author row */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient || 'from-blue-500 to-cyan-500'} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white text-xs font-bold">{testimonial.initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-tight truncate">{testimonial.name}</p>
          <p className="text-slate-400 text-xs truncate">{testimonial.role}, {testimonial.company}</p>
        </div>
        <div className="flex flex-col gap-1 items-end flex-shrink-0">
          {testimonial.featured && (
            <span className="text-xs bg-yellow-500 text-black font-bold px-2 py-0.5 rounded">
              Featured
            </span>
          )}
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
            testimonial.status === 'published'
              ? 'bg-green-600 text-white'
              : 'bg-slate-600 text-slate-200'
          }`}>
            {testimonial.status}
          </span>
        </div>
      </div>

      {/* Stars + service badge */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className="flex gap-0.5">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
          ))}
        </div>
        {testimonial.service && (
          <span className="text-xs bg-primary/20 text-accent px-2 py-0.5 rounded">
            {testimonial.service}
          </span>
        )}
      </div>

      {/* Text preview */}
      <p className="text-slate-300 text-xs leading-relaxed line-clamp-3 flex-1 mb-4">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(testimonial)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded-lg transition-colors"
        >
          <Edit2 size={13} /> Edit
        </button>
        <button
          onClick={() => onDelete(testimonial.id)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-900/30 hover:bg-red-900/60 text-red-400 hover:text-red-300 text-xs font-medium rounded-lg transition-colors border border-red-800/40"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading]           = useState(true)
  const [showForm, setShowForm]         = useState(false)
  const [editItem, setEditItem]         = useState(null)
  const [deleteId, setDeleteId]         = useState(null)
  const [deleting, setDeleting]         = useState(false)
  const [toast, setToast]               = useState(null)

  useEffect(() => {
    testimonialAPI.getAll()
      .then((data) => setTestimonials(data.testimonials || []))
      .catch((err) => showToast('error', err.message))
      .finally(() => setLoading(false))
  }, [])

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSave = (saved) => {
    setTestimonials((prev) => {
      const exists = prev.find((t) => t.id === saved.id)
      return exists ? prev.map((t) => t.id === saved.id ? saved : t) : [saved, ...prev]
    })
    setShowForm(false)
    setEditItem(null)
    showToast('success', editItem ? 'Testimonial updated' : 'Testimonial added')
  }

  const handleDeleteConfirm = async () => {
    setDeleting(true)
    try {
      await testimonialAPI.delete(deleteId)
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteId))
      setDeleteId(null)
      showToast('success', 'Testimonial deleted')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setDeleting(false)
    }
  }

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
        <TestimonialForm
          testimonial={editItem}
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
              <h3 className="text-white font-semibold">Delete Testimonial</h3>
            </div>
            <p className="text-slate-400 text-sm mb-5">
              This will permanently delete the testimonial. This action cannot be undone.
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
          <h1 className="text-2xl font-bold text-white">Testimonials</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {loading
              ? 'Loading…'
              : `${testimonials.length} testimonial${testimonials.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => { setEditItem(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-slate-400" />
        </div>
      )}

      {!loading && testimonials.length === 0 && (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={28} className="text-slate-500" />
          </div>
          <h3 className="text-white font-semibold mb-2">No testimonials yet</h3>
          <p className="text-slate-400 text-sm mb-6">
            Add client testimonials to showcase on the website.
          </p>
          <button
            onClick={() => { setEditItem(null); setShowForm(true) }}
            className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Add First Testimonial
          </button>
        </div>
      )}

      {!loading && testimonials.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {testimonials.map((t) => (
            <TestimonialCard
              key={t.id}
              testimonial={t}
              onEdit={(item) => { setEditItem(item); setShowForm(true) }}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminTestimonials
