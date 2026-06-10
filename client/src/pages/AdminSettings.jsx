import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { settingsAPI, paymentMethodAPI } from '../utils/api'
import {
  Building2, CreditCard, Save, Plus, Edit2, Trash2, X,
  CheckCircle, AlertCircle, Loader2, Star,
} from 'lucide-react'

// ─── Shared input style ───────────────────────────────────────────────────────

const INPUT_STYLE = {
  width: '100%',
  background: 'rgb(15 23 42)',
  border: '1px solid rgb(71 85 105)',
  color: 'white',
  borderRadius: '0.5rem',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  outline: 'none',
}

const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-slate-300 mb-1">
    {children}{required && <span className="text-red-400 ml-0.5">*</span>}
  </label>
)

// ─── Payment Method Form Modal ────────────────────────────────────────────────

const EMPTY_PM = { label: '', type: 'bank', details: '', is_default: false, status: 'active', sort_order: 0 }

const PaymentMethodForm = ({ method, onClose, onSave }) => {
  const [form, setForm] = useState(method ? {
    label:      method.label      || '',
    type:       method.type       || 'bank',
    details:    method.details    || '',
    is_default: method.is_default || false,
    status:     method.status     || 'active',
    sort_order: method.sort_order ?? 0,
  } : { ...EMPTY_PM })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const set = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const placeholders = {
    bank: 'Account Name: Shueki Tech\nAccount No: 1234567890\nIFSC: HDFC0001234\nBank: HDFC Bank, Garhshankar Branch',
    upi:  'UPI ID: 8427182071@ybl\n(GPay / PhonePe / Paytm)',
    other: 'Enter payment instructions…',
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = { ...form, sort_order: Number(form.sort_order) }
      const result = method?.id
        ? await paymentMethodAPI.update(method.id, payload)
        : await paymentMethodAPI.create(payload)
      onSave(result.payment_method)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto py-6 px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">{method ? 'Edit Payment Method' : 'Add Payment Method'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-3">
              <AlertCircle size={16} className="flex-shrink-0" />{error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label required>Label</Label>
              <input name="label" value={form.label} onChange={set} required
                placeholder="e.g. HDFC Bank, GPay UPI" style={INPUT_STYLE} />
            </div>
            <div>
              <Label required>Type</Label>
              <select name="type" value={form.type} onChange={set} style={INPUT_STYLE}>
                <option value="bank">Bank Transfer</option>
                <option value="upi">UPI</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <Label required>Payment Details</Label>
            <textarea
              name="details"
              value={form.details}
              onChange={set}
              required
              rows={5}
              placeholder={placeholders[form.type]}
              style={{ ...INPUT_STYLE, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }}
            />
            <p className="text-slate-500 text-xs mt-1">This text is printed exactly as-is on the invoice PDF.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 items-center">
            <div>
              <Label>Status</Label>
              <select name="status" value={form.status} onChange={set} style={INPUT_STYLE}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-5">
              <input
                type="checkbox"
                id="is_default"
                name="is_default"
                checked={form.is_default}
                onChange={set}
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="is_default" className="text-sm text-slate-300 cursor-pointer">
                Set as default payment method
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-700">
            <button type="button" onClick={onClose} disabled={saving}
              className="px-5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving…' : method ? 'Update' : 'Add Method'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

const DeleteConfirm = ({ label, onCancel, onConfirm, deleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-red-900/40 rounded-full flex items-center justify-center">
          <Trash2 size={18} className="text-red-400" />
        </div>
        <h3 className="text-white font-semibold">Delete Payment Method</h3>
      </div>
      <p className="text-slate-400 text-sm mb-5">
        Delete <strong className="text-white">{label}</strong>? Existing invoices using this method will not be affected.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} disabled={deleting} className="flex-1 py-2 rounded-lg text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors">Cancel</button>
        <button onClick={onConfirm} disabled={deleting} className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-red-700 hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
          {deleting && <Loader2 size={14} className="animate-spin" />}
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
)

// ─── Main Settings Page ───────────────────────────────────────────────────────

const TYPE_LABELS = { bank: 'Bank', upi: 'UPI', other: 'Other' }
const TYPE_COLORS = { bank: 'bg-blue-600/30 text-blue-300', upi: 'bg-purple-600/30 text-purple-300', other: 'bg-slate-600 text-slate-300' }

const AdminSettings = () => {
  // Company settings state
  const [settings, setSettings]       = useState(null)
  const [settingsLoading, setSLoading] = useState(true)
  const [settingsSaving, setSaving]    = useState(false)
  const [settingsError, setSError]     = useState('')

  // Payment methods state
  const [methods, setMethods]         = useState([])
  const [methodsLoading, setMLoading] = useState(true)
  const [showForm, setShowForm]       = useState(false)
  const [editMethod, setEditMethod]   = useState(null)
  const [deleteId, setDeleteId]       = useState(null)
  const [deleting, setDeleting]       = useState(false)

  const [toast, setToast] = useState(null)

  useEffect(() => {
    settingsAPI.getCompany()
      .then((d) => setSettings(d.settings))
      .catch(() => {})
      .finally(() => setSLoading(false))

    paymentMethodAPI.getAll()
      .then((d) => setMethods(d.payment_methods || []))
      .catch(() => {})
      .finally(() => setMLoading(false))
  }, [])

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const setField = (e) => setSettings((s) => ({ ...s, [e.target.name]: e.target.value }))

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setSError('')
    setSaving(true)
    try {
      const result = await settingsAPI.updateCompany(settings)
      setSettings(result.settings)
      showToast('success', 'Company settings saved')
    } catch (err) {
      setSError(err.message || 'Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  const handleMethodSave = (saved) => {
    setMethods((prev) => {
      // If saved is default, clear other defaults in local state
      let updated = prev.map((m) => m.id === saved.id ? saved : (saved.is_default ? { ...m, is_default: false } : m))
      if (!prev.find((m) => m.id === saved.id)) updated = [...prev, saved]
      return updated
    })
    setShowForm(false)
    setEditMethod(null)
    showToast('success', editMethod ? 'Payment method updated' : 'Payment method added')
  }

  const handleDeleteConfirm = async () => {
    setDeleting(true)
    try {
      await paymentMethodAPI.delete(deleteId)
      setMethods((prev) => prev.filter((m) => m.id !== deleteId))
      setDeleteId(null)
      showToast('success', 'Payment method deleted')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setDeleting(false)
    }
  }

  const deleteTarget = methods.find((m) => m.id === deleteId)

  return (
    <AdminLayout>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-green-800 border border-green-600 text-green-100' : 'bg-red-900 border border-red-700 text-red-100'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <PaymentMethodForm
          method={editMethod}
          onClose={() => { setShowForm(false); setEditMethod(null) }}
          onSave={handleMethodSave}
        />
      )}
      {deleteId && (
        <DeleteConfirm
          label={deleteTarget?.label || ''}
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDeleteConfirm}
          deleting={deleting}
        />
      )}

      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-0.5">Company information and payment methods used on invoices.</p>
      </div>

      <div className="space-y-8">

        {/* ── Company Information ── */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <Building2 size={16} className="text-accent" />
            </div>
            <h2 className="text-white font-semibold">Company Information</h2>
          </div>

          {settingsLoading && (
            <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-slate-400" /></div>
          )}

          {settings && !settingsLoading && (
            <form onSubmit={handleSaveSettings} className="p-6 space-y-5">
              {settingsError && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-3">
                  <AlertCircle size={16} className="flex-shrink-0" />{settingsError}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label required>Company Name</Label>
                  <input name="company_name" value={settings.company_name || ''} onChange={setField} required style={INPUT_STYLE} />
                </div>
                <div>
                  <Label>Tagline</Label>
                  <input name="tagline" value={settings.tagline || ''} onChange={setField}
                    placeholder="Software for Connected Products and Operations" style={INPUT_STYLE} />
                </div>
              </div>

              <div>
                <Label>Address</Label>
                <textarea name="address" value={settings.address || ''} onChange={setField} rows={2}
                  placeholder="Street address" style={{ ...INPUT_STYLE, resize: 'none' }} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>City / State / PIN</Label>
                  <input name="city" value={settings.city || ''} onChange={setField}
                    placeholder="Garhshankar, Punjab – 144527" style={INPUT_STYLE} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <input name="phone" value={settings.phone || ''} onChange={setField}
                    placeholder="+91-84271-82071" style={INPUT_STYLE} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <input name="email" type="email" value={settings.email || ''} onChange={setField}
                    placeholder="info@shuekitech.com" style={INPUT_STYLE} />
                </div>
                <div>
                  <Label>Website</Label>
                  <input name="website" value={settings.website || ''} onChange={setField}
                    placeholder="https://shuekitech.com" style={INPUT_STYLE} />
                  <p className="text-slate-500 text-xs mt-1">Shown as a clickable link on the invoice PDF.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>GSTIN</Label>
                  <input name="gst_number" value={settings.gst_number || ''} onChange={setField}
                    placeholder="GST registration number (if applicable)" style={INPUT_STYLE} />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-700">
                <button type="submit" disabled={settingsSaving}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-60">
                  {settingsSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {settingsSaving ? 'Saving…' : 'Save Company Info'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── Payment Methods ── */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <CreditCard size={16} className="text-accent" />
              </div>
              <h2 className="text-white font-semibold">Payment Methods</h2>
            </div>
            <button
              onClick={() => { setEditMethod(null); setShowForm(true) }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus size={15} /> Add Method
            </button>
          </div>

          {methodsLoading && (
            <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-slate-400" /></div>
          )}

          {!methodsLoading && methods.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <CreditCard size={36} className="text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">No payment methods yet.</p>
              <p className="text-slate-500 text-xs mt-1">Add bank details or UPI to print on invoices.</p>
            </div>
          )}

          {!methodsLoading && methods.length > 0 && (
            <div className="p-4 space-y-3">
              {methods.map((m) => (
                <div key={m.id} className="flex items-start gap-4 bg-slate-700/40 border border-slate-600/40 rounded-xl p-4 group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-white font-semibold text-sm">{m.label}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${TYPE_COLORS[m.type] || TYPE_COLORS.other}`}>
                        {TYPE_LABELS[m.type] || m.type}
                      </span>
                      {m.is_default && (
                        <span className="flex items-center gap-1 text-xs font-medium text-amber-300 bg-amber-900/30 px-2 py-0.5 rounded">
                          <Star size={10} fill="currentColor" /> Default
                        </span>
                      )}
                      {m.status === 'inactive' && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-600 text-slate-400">Inactive</span>
                      )}
                    </div>
                    <pre className="text-slate-400 text-xs leading-relaxed whitespace-pre-wrap font-sans">{m.details}</pre>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditMethod(m); setShowForm(true) }}
                      className="p-1.5 bg-slate-600 hover:bg-slate-500 text-white rounded-md transition-colors">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => setDeleteId(m.id)}
                      className="p-1.5 bg-red-900/40 hover:bg-red-900/70 text-red-400 rounded-md border border-red-800/40 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  )
}

export default AdminSettings
