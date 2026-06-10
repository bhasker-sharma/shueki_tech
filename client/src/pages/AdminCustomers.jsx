import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { customerAPI } from '../utils/api'
import {
  Plus, Edit2, Trash2, X, CheckCircle, AlertCircle, Loader2,
  Users, Eye, Mail, Phone, Building2, Link2, Unlink, FileText,
  Search, MapPin,
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

// ─── Customer Form Modal ──────────────────────────────────────────────────────

const CustomerForm = ({ customer, onClose, onSave }) => {
  const empty = { name: '', email: '', phone: '', company: '', address: '', city: '', gst_number: '', notes: '', status: 'active' }
  const [form, setForm] = useState(customer ? {
    name: customer.name || '', email: customer.email || '', phone: customer.phone || '',
    company: customer.company || '', address: customer.address || '', city: customer.city || '',
    gst_number: customer.gst_number || '', notes: customer.notes || '', status: customer.status || 'active',
  } : empty)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const result = customer?.id
        ? await customerAPI.update(customer.id, form)
        : await customerAPI.create(form)
      onSave(result.customer)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto py-6 px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">{customer ? 'Edit Customer' : 'Add Customer'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-3">
              <AlertCircle size={16} className="flex-shrink-0" />{error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Name <span className="text-red-400">*</span></label>
              <input name="name" value={form.name} onChange={set} required placeholder="Contact name" style={INPUT_STYLE} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Company</label>
              <input name="company" value={form.company} onChange={set} placeholder="Company / Organisation" style={INPUT_STYLE} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={set} placeholder="email@example.com" style={INPUT_STYLE} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
              <input name="phone" value={form.phone} onChange={set} placeholder="+91 99999 99999" style={INPUT_STYLE} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
            <textarea name="address" value={form.address} onChange={set} rows={2} placeholder="Street / plot / building" style={{ ...INPUT_STYLE, resize: 'none' }} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">City</label>
              <input name="city" value={form.city} onChange={set} placeholder="City" style={INPUT_STYLE} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">GST Number</label>
              <input name="gst_number" value={form.gst_number} onChange={set} placeholder="GSTIN (if applicable)" style={INPUT_STYLE} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
              <select name="status" value={form.status} onChange={set} style={INPUT_STYLE}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
            <textarea name="notes" value={form.notes} onChange={set} rows={3} placeholder="Internal notes about this customer…" style={{ ...INPUT_STYLE, resize: 'none' }} />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-700">
            <button type="button" onClick={onClose} disabled={saving}
              className="px-5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving…' : customer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Link Enquiry Sub-Modal ───────────────────────────────────────────────────

const LinkEnquiryModal = ({ customer, onClose, onLinked }) => {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading]     = useState(true)
  const [linking, setLinking]     = useState(null)

  useEffect(() => {
    customerAPI.getUnlinkedEnquiries()
      .then((d) => setEnquiries(d.enquiries || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleLink = async (enquiry) => {
    setLinking(enquiry.id)
    try {
      await customerAPI.linkEnquiry(customer.id, enquiry.id)
      onLinked(enquiry)
    } catch (err) {
      alert(err.message)
    } finally {
      setLinking(null)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h3 className="text-white font-semibold">Link Enquiry to {customer.name}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto space-y-2">
          {loading && <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-slate-400" /></div>}
          {!loading && enquiries.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-8">No unlinked enquiries found.</p>
          )}
          {!loading && enquiries.map((enq) => (
            <div key={enq.id} className="flex items-center justify-between bg-slate-700/50 rounded-lg px-4 py-3">
              <div>
                <p className="text-white text-sm font-medium">{enq.full_name}</p>
                <p className="text-slate-400 text-xs">{enq.email} · {enq.service_type?.replace(/-/g, ' ')}</p>
              </div>
              <button
                onClick={() => handleLink(enq)}
                disabled={linking === enq.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/20 text-accent hover:bg-primary/40 transition-colors disabled:opacity-50"
              >
                {linking === enq.id ? <Loader2 size={12} className="animate-spin" /> : <Link2 size={12} />}
                Link
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Customer Detail Modal ────────────────────────────────────────────────────

const CustomerDetail = ({ customerId, onClose, onEdit, onDelete }) => {
  const navigate = useNavigate()
  const [customer, setCustomer]       = useState(null)
  const [loading, setLoading]         = useState(true)
  const [showLinkModal, setShowLink]  = useState(false)
  const [unlinking, setUnlinking]     = useState(null)

  useEffect(() => {
    customerAPI.get(customerId)
      .then((d) => setCustomer(d.customer))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [customerId])

  const handleUnlink = async (enquiryId) => {
    setUnlinking(enquiryId)
    try {
      await customerAPI.unlinkEnquiry(enquiryId)
      setCustomer((c) => ({ ...c, enquiries: c.enquiries.filter((e) => e.id !== enquiryId) }))
    } catch (err) {
      alert(err.message)
    } finally {
      setUnlinking(null)
    }
  }

  const handleLinked = (enquiry) => {
    setCustomer((c) => ({ ...c, enquiries: [{ ...enquiry, customer_id: c.id }, ...(c.enquiries || [])] }))
    setShowLink(false)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto py-6 px-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-bold text-white">Customer Details</h2>
            <div className="flex items-center gap-2">
              {customer && (
                <>
                  <button onClick={() => onEdit(customer)} className="p-1.5 bg-slate-600 hover:bg-slate-500 text-white rounded-md transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => onDelete(customer.id)} className="p-1.5 bg-red-900/40 hover:bg-red-900/70 text-red-400 rounded-md border border-red-800/40 transition-colors"><Trash2 size={14} /></button>
                </>
              )}
              <button onClick={onClose} className="text-slate-400 hover:text-white ml-1"><X size={20} /></button>
            </div>
          </div>

          {loading && <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-slate-400" /></div>}

          {customer && !loading && (
            <div className="p-6 space-y-6">
              {/* Info */}
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  [Building2, 'Company', customer.company],
                  [Mail, 'Email', customer.email],
                  [Phone, 'Phone', customer.phone],
                  [MapPin, 'Location', [customer.city, customer.address].filter(Boolean).join(', ')],
                ].map(([Icon, label, val]) => val ? (
                  <div key={label} className="flex items-start gap-2 bg-slate-700/40 rounded-lg px-4 py-3">
                    <Icon size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-500 text-xs">{label}</p>
                      <p className="text-white text-sm">{val}</p>
                    </div>
                  </div>
                ) : null)}
                {customer.gst_number && (
                  <div className="flex items-start gap-2 bg-slate-700/40 rounded-lg px-4 py-3">
                    <FileText size={15} className="text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-500 text-xs">GSTIN</p>
                      <p className="text-white text-sm font-mono">{customer.gst_number}</p>
                    </div>
                  </div>
                )}
              </div>
              {customer.notes && (
                <div className="bg-slate-700/30 rounded-lg px-4 py-3">
                  <p className="text-slate-400 text-xs mb-1">Notes</p>
                  <p className="text-slate-300 text-sm whitespace-pre-wrap">{customer.notes}</p>
                </div>
              )}

              {/* Invoices Summary */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold text-sm">Invoices ({customer.invoices_count ?? 0})</h3>
                  <button
                    onClick={() => { onClose(); navigate(`/admin/invoices?customer_id=${customer.id}`) }}
                    className="text-xs text-accent hover:underline"
                  >
                    View all invoices
                  </button>
                </div>
                {(customer.invoices || []).length === 0 ? (
                  <p className="text-slate-500 text-xs py-3 text-center border border-dashed border-slate-700 rounded-lg">No invoices yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {customer.invoices.slice(0, 5).map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between bg-slate-700/30 rounded-lg px-3 py-2">
                        <span className="text-white text-sm font-mono">{inv.invoice_number}</span>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                            inv.status === 'paid' ? 'bg-green-600/30 text-green-300' :
                            inv.status === 'sent' ? 'bg-blue-600/30 text-blue-300' :
                            'bg-slate-600 text-slate-300'
                          }`}>{inv.status}</span>
                          <span className="text-slate-300 text-sm font-medium">₹{Number(inv.total).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Linked Enquiries */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold text-sm">Linked Enquiries ({(customer.enquiries || []).length})</h3>
                  <button
                    onClick={() => setShowLink(true)}
                    className="flex items-center gap-1.5 text-xs text-accent hover:text-white bg-primary/10 hover:bg-primary/30 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Link2 size={12} /> Link Enquiry
                  </button>
                </div>
                {(customer.enquiries || []).length === 0 ? (
                  <p className="text-slate-500 text-xs py-3 text-center border border-dashed border-slate-700 rounded-lg">No enquiries linked.</p>
                ) : (
                  <div className="space-y-1.5">
                    {customer.enquiries.map((enq) => (
                      <div key={enq.id} className="flex items-center justify-between bg-slate-700/30 rounded-lg px-3 py-2">
                        <div>
                          <p className="text-white text-sm">{enq.full_name}</p>
                          <p className="text-slate-400 text-xs">{enq.service_type?.replace(/-/g, ' ')} · {enq.status}</p>
                        </div>
                        <button
                          onClick={() => handleUnlink(enq.id)}
                          disabled={unlinking === enq.id}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                        >
                          {unlinking === enq.id ? <Loader2 size={12} className="animate-spin" /> : <Unlink size={12} />}
                          Unlink
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showLinkModal && customer && (
        <LinkEnquiryModal
          customer={customer}
          onClose={() => setShowLink(false)}
          onLinked={handleLinked}
        />
      )}
    </>
  )
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

const DeleteConfirm = ({ name, onCancel, onConfirm, deleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-red-900/40 rounded-full flex items-center justify-center">
          <Trash2 size={18} className="text-red-400" />
        </div>
        <h3 className="text-white font-semibold">Delete Customer</h3>
      </div>
      <p className="text-slate-400 text-sm mb-5">
        Delete <strong className="text-white">{name}</strong>? Their invoices will also be deleted. This cannot be undone.
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

// ─── Main Page ────────────────────────────────────────────────────────────────

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('all')
  const [showForm, setShowForm]   = useState(false)
  const [editItem, setEditItem]   = useState(null)
  const [viewId, setViewId]       = useState(null)
  const [deleteId, setDeleteId]   = useState(null)
  const [deleting, setDeleting]   = useState(false)
  const [toast, setToast]         = useState(null)

  useEffect(() => {
    customerAPI.getAll()
      .then((d) => setCustomers(d.customers || []))
      .catch((err) => showToast('error', err.message))
      .finally(() => setLoading(false))
  }, [])

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSave = (saved) => {
    setCustomers((prev) => {
      const exists = prev.find((c) => c.id === saved.id)
      return exists ? prev.map((c) => c.id === saved.id ? saved : c) : [saved, ...prev]
    })
    setShowForm(false)
    setEditItem(null)
    showToast('success', editItem ? 'Customer updated' : 'Customer added')
  }

  const handleEdit = (customer) => {
    setEditItem(customer)
    setViewId(null)
    setShowForm(true)
  }

  const handleDeleteConfirm = async () => {
    setDeleting(true)
    try {
      await customerAPI.delete(deleteId)
      setCustomers((prev) => prev.filter((c) => c.id !== deleteId))
      setDeleteId(null)
      showToast('success', 'Customer deleted')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setDeleting(false)
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return customers.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false
      if (!q) return true
      return [c.name, c.email, c.company, c.phone, c.city]
        .some((v) => v && v.toLowerCase().includes(q))
    })
  }, [customers, search, statusFilter])

  const deleteTarget = customers.find((c) => c.id === deleteId)

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
        <CustomerForm
          customer={editItem}
          onClose={() => { setShowForm(false); setEditItem(null) }}
          onSave={handleSave}
        />
      )}
      {viewId && (
        <CustomerDetail
          customerId={viewId}
          onClose={() => setViewId(null)}
          onEdit={handleEdit}
          onDelete={(id) => { setViewId(null); setDeleteId(id) }}
        />
      )}
      {deleteId && (
        <DeleteConfirm
          name={deleteTarget?.name || ''}
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDeleteConfirm}
          deleting={deleting}
        />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {loading ? 'Loading…' : `${customers.length} client${customers.length !== 1 ? 's' : ''} in database`}
          </p>
        </div>
        <button
          onClick={() => { setEditItem(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} /> Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-primary/60"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-slate-400" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Users size={48} className="text-slate-600 mb-4" />
          <p className="text-slate-400 font-medium">
            {customers.length === 0 ? 'No customers yet — add your first client.' : 'No customers match your search.'}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden sm:table-cell">Contact</th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden md:table-cell">Location</th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium">Status</th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium hidden lg:table-cell">Invoices</th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium hidden lg:table-cell">Enquiries</th>
                  <th className="text-right px-5 py-3 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-white font-medium">{c.name}</p>
                      {c.company && <p className="text-slate-400 text-xs mt-0.5">{c.company}</p>}
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      {c.email && <p className="text-slate-300 text-xs">{c.email}</p>}
                      {c.phone && <p className="text-slate-400 text-xs mt-0.5">{c.phone}</p>}
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <p className="text-slate-400 text-xs">{[c.city].filter(Boolean).join(', ') || '—'}</p>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        c.status === 'active' ? 'bg-green-600/30 text-green-300' : 'bg-slate-600 text-slate-300'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center hidden lg:table-cell">
                      <span className="text-slate-300 text-xs font-medium">{c.invoices_count ?? 0}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center hidden lg:table-cell">
                      <span className="text-slate-300 text-xs font-medium">{c.enquiries_count ?? 0}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setViewId(c.id)} title="View"
                          className="p-1.5 bg-slate-600 hover:bg-slate-500 text-white rounded-md transition-colors">
                          <Eye size={13} />
                        </button>
                        <button onClick={() => handleEdit(c)} title="Edit"
                          className="p-1.5 bg-slate-600 hover:bg-slate-500 text-white rounded-md transition-colors">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => setDeleteId(c.id)} title="Delete"
                          className="p-1.5 bg-red-900/40 hover:bg-red-900/70 text-red-400 rounded-md border border-red-800/40 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminCustomers
