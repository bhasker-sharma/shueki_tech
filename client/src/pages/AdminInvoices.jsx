import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { invoiceAPI, customerAPI, paymentMethodAPI, settingsAPI } from '../utils/api'
import {
  Plus, Edit2, Trash2, X, CheckCircle, AlertCircle, Loader2,
  FileText, Download, Eye, Search, IndianRupee, PlusCircle, MinusCircle,
} from 'lucide-react'

// ─── Shared styles ────────────────────────────────────────────────────────────

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

const fmt = (n) => Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const today = () => new Date().toISOString().split('T')[0]

// ─── Invoice Print / PDF ──────────────────────────────────────────────────────

const printInvoice = (invoice, co = {}) => {
  const c   = invoice.customer      || {}
  const pm  = invoice.payment_method || null
  const items = invoice.items       || []

  const statusColor = invoice.status === 'paid' ? '#065f46' : invoice.status === 'sent' ? '#1e40af' : '#374151'
  const statusBg    = invoice.status === 'paid' ? '#d1fae5' : invoice.status === 'sent' ? '#dbeafe' : '#f3f4f6'

  const coName    = co.company_name || 'Shueki Tech'
  const coTagline = co.tagline      || ''
  const coAddr    = co.address      || 'Opp. UCO Bank, Ground Floor, Hoshiarpur Road'
  const coCity    = co.city         || 'Garhshankar, Punjab – 144527'
  const coPhone   = co.phone        || '+91-84271-82071'
  const coEmail   = co.email        || ''
  const coWeb     = co.website      || ''
  const coGST     = co.gst_number   || ''

  const pmTypeLabel = pm ? (pm.type === 'bank' ? 'Bank Transfer' : pm.type === 'upi' ? 'UPI Payment' : 'Payment') : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Invoice ${invoice.invoice_number}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; font-size: 13px; background: #fff; }
  .page { max-width: 760px; margin: 0 auto; padding: 40px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 3px solid #4f46e5; }
  .co-name { font-size: 26px; font-weight: 900; color: #4f46e5; letter-spacing: -0.5px; }
  .co-tagline { font-size: 11px; color: #888; margin-top: 1px; font-style: italic; }
  .co-details { font-size: 11px; color: #666; margin-top: 6px; line-height: 1.8; }
  .co-details a { color: #4f46e5; text-decoration: none; }
  .inv-right { text-align: right; }
  .inv-title { font-size: 30px; font-weight: 900; color: #4f46e5; letter-spacing: 1px; }
  .inv-num { font-size: 13px; color: #555; margin-top: 2px; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 6px; background: ${statusBg}; color: ${statusColor}; }
  .mid { display: flex; justify-content: space-between; margin-bottom: 28px; }
  .bill h4 { font-size: 10px; text-transform: uppercase; color: #999; letter-spacing: 0.8px; margin-bottom: 6px; }
  .bill-name { font-weight: 700; font-size: 15px; margin-bottom: 2px; }
  .bill-info { font-size: 12px; color: #555; line-height: 1.7; }
  .dates { text-align: right; }
  .d-row { margin-bottom: 8px; }
  .d-label { font-size: 10px; text-transform: uppercase; color: #999; letter-spacing: 0.5px; }
  .d-val { font-weight: 600; font-size: 13px; }
  .proj-box { background: #f0f0ff; border-left: 3px solid #4f46e5; padding: 8px 14px; margin-bottom: 24px; border-radius: 0 4px 4px 0; }
  .proj-label { font-size: 10px; text-transform: uppercase; color: #999; letter-spacing: 0.5px; margin-bottom: 2px; }
  .proj-name { font-weight: 700; color: #4f46e5; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  thead th { background: #4f46e5; color: #fff; padding: 9px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; }
  thead th.r { text-align: right; }
  tbody tr:nth-child(even) { background: #f8f8ff; }
  tbody td { padding: 9px 12px; border-bottom: 1px solid #eee; font-size: 13px; }
  tbody td.r { text-align: right; font-weight: 500; }
  .totals { display: flex; justify-content: flex-end; margin-bottom: 28px; }
  .totals-box { width: 260px; }
  .t-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; font-size: 13px; }
  .t-row.grand { border-top: 2px solid #4f46e5; border-bottom: none; padding-top: 8px; font-size: 15px; font-weight: 700; color: #4f46e5; }
  .two-col { display: flex; gap: 20px; margin-bottom: 28px; }
  .two-col > div { flex: 1; }
  .info-box { background: #f8f8f8; border-radius: 6px; padding: 14px 16px; }
  .info-box h4 { font-size: 10px; text-transform: uppercase; color: #999; letter-spacing: 0.5px; margin-bottom: 6px; }
  .info-box p { font-size: 12px; color: #555; line-height: 1.6; white-space: pre-wrap; font-family: Arial, sans-serif; }
  .pm-type { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #4f46e5; margin-bottom: 4px; }
  .pm-label { font-weight: 700; font-size: 13px; margin-bottom: 4px; }
  .footer { text-align: center; font-size: 11px; color: #bbb; padding-top: 16px; border-top: 1px solid #eee; }
  @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div>
      <div class="co-name">${coName}</div>
      ${coTagline ? `<div class="co-tagline">${coTagline}</div>` : ''}
      <div class="co-details">
        ${coAddr ? coAddr + '<br>' : ''}
        ${coCity ? coCity + '<br>' : ''}
        ${coPhone ? coPhone + (coEmail ? '  &nbsp;·&nbsp;  ' + coEmail : '') + '<br>' : ''}
        ${coWeb ? `<a href="${coWeb}">${coWeb.replace(/^https?:\/\//, '')}</a>` : ''}
        ${coGST ? '<br>GSTIN: ' + coGST : ''}
      </div>
    </div>
    <div class="inv-right">
      <div class="inv-title">INVOICE</div>
      <div class="inv-num">${invoice.invoice_number}</div>
      <div><span class="badge">${invoice.status.toUpperCase()}</span></div>
    </div>
  </div>

  <div class="mid">
    <div class="bill">
      <h4>Bill To</h4>
      <div class="bill-name">${c.name || ''}</div>
      <div class="bill-info">
        ${c.company ? c.company + '<br>' : ''}
        ${c.email   ? c.email   + '<br>' : ''}
        ${c.phone   ? c.phone   + '<br>' : ''}
        ${c.address ? c.address + '<br>' : ''}
        ${c.city    || ''}
        ${c.gst_number ? '<br>GSTIN: ' + c.gst_number : ''}
      </div>
    </div>
    <div class="dates">
      <div class="d-row">
        <div class="d-label">Issue Date</div>
        <div class="d-val">${invoice.issue_date || ''}</div>
      </div>
      ${invoice.due_date ? `
      <div class="d-row" style="margin-top:10px">
        <div class="d-label">Due Date</div>
        <div class="d-val">${invoice.due_date}</div>
      </div>` : ''}
    </div>
  </div>

  ${invoice.project_name ? `
  <div class="proj-box">
    <div class="proj-label">Project</div>
    <div class="proj-name">${invoice.project_name}</div>
  </div>` : ''}

  <table>
    <thead>
      <tr>
        <th style="width:50%">Description</th>
        <th class="r" style="width:12%">Qty</th>
        <th class="r" style="width:20%">Unit Price</th>
        <th class="r" style="width:18%">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${items.map((item) => `
      <tr>
        <td>${item.description}</td>
        <td class="r">${item.quantity}</td>
        <td class="r">₹${fmt(item.unit_price)}</td>
        <td class="r">₹${fmt(item.amount)}</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-box">
      <div class="t-row"><span>Subtotal</span><span>₹${fmt(invoice.subtotal)}</span></div>
      ${invoice.tax_percent > 0 ? `<div class="t-row"><span>Tax (${invoice.tax_percent}%)</span><span>₹${fmt(invoice.tax_amount)}</span></div>` : ''}
      <div class="t-row grand"><span>Total</span><span>₹${fmt(invoice.total)}</span></div>
    </div>
  </div>

  ${(invoice.notes || pm) ? `
  <div class="two-col">
    ${pm ? `
    <div class="info-box">
      <h4>Payment Details</h4>
      <div class="pm-type">${pmTypeLabel}</div>
      <div class="pm-label">${pm.label}</div>
      <p>${pm.details}</p>
    </div>` : '<div></div>'}
    ${invoice.notes ? `
    <div class="info-box">
      <h4>Notes</h4>
      <p>${invoice.notes}</p>
    </div>` : '<div></div>'}
  </div>` : ''}

  <div class="footer">
    Thank you for your business! &nbsp;|&nbsp; ${coName}${coTagline ? ' — ' + coTagline : ''}
  </div>
</div>
<script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`

  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
}

// ─── Invoice Form Modal ───────────────────────────────────────────────────────

const EMPTY_ITEM = { description: '', quantity: 1, unit_price: '' }

const InvoiceForm = ({ invoice, customers, paymentMethods, onClose, onSave }) => {
  const initItems = invoice?.items?.length
    ? invoice.items.map((i) => ({ description: i.description, quantity: i.quantity, unit_price: i.unit_price }))
    : [{ ...EMPTY_ITEM }]

  const [form, setForm] = useState({
    customer_id:        invoice?.customer_id        || '',
    payment_method_id:  invoice?.payment_method_id  || '',
    project_name:       invoice?.project_name       || '',
    status:             invoice?.status             || 'draft',
    issue_date:         invoice?.issue_date         || today(),
    due_date:           invoice?.due_date           || '',
    notes:              invoice?.notes              || '',
    tax_percent:        invoice?.tax_percent        ?? 0,
  })
  const [items, setItems]     = useState(initItems)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const setItem = (idx, field, value) =>
    setItems((prev) => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it))

  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }])

  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx))

  const subtotal = items.reduce((s, it) => s + (parseFloat(it.quantity) || 0) * (parseFloat(it.unit_price) || 0), 0)
  const taxPct   = parseFloat(form.tax_percent) || 0
  const taxAmt   = subtotal * taxPct / 100
  const total    = subtotal + taxAmt

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.some((it) => !it.description.trim())) {
      setError('Each line item must have a description.')
      return
    }
    setError('')
    setSaving(true)
    try {
      const payload = {
        ...form,
        tax_percent: taxPct,
        items: items.map((it) => ({
          description: it.description,
          quantity: parseFloat(it.quantity) || 1,
          unit_price: parseFloat(it.unit_price) || 0,
        })),
      }
      const result = invoice?.id
        ? await invoiceAPI.update(invoice.id, payload)
        : await invoiceAPI.create(payload)
      onSave(result.invoice)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto py-6 px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-3xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">{invoice ? 'Edit Invoice' : 'New Invoice'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-3">
              <AlertCircle size={16} className="flex-shrink-0" />{error}
            </div>
          )}

          {/* Customer + Project */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Customer <span className="text-red-400">*</span></label>
              <select name="customer_id" value={form.customer_id} onChange={set} required style={INPUT_STYLE}>
                <option value="">— Select customer —</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Project Name</label>
              <input name="project_name" value={form.project_name} onChange={set} placeholder="e.g. IoT Dashboard v2" style={INPUT_STYLE} />
            </div>
          </div>

          {/* Payment Method */}
          {paymentMethods.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Payment Method</label>
              <select name="payment_method_id" value={form.payment_method_id} onChange={set} style={INPUT_STYLE}>
                <option value="">— None / not specified —</option>
                {paymentMethods.filter((m) => m.status === 'active').map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label} ({m.type === 'bank' ? 'Bank' : m.type === 'upi' ? 'UPI' : 'Other'})
                    {m.is_default ? ' ★' : ''}
                  </option>
                ))}
              </select>
              <p className="text-slate-500 text-xs mt-1">Printed on the invoice PDF so the client knows how to pay.</p>
            </div>
          )}

          {/* Status + Dates */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
              <select name="status" value={form.status} onChange={set} style={INPUT_STYLE}>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Issue Date <span className="text-red-400">*</span></label>
              <input name="issue_date" type="date" value={form.issue_date} onChange={set} required style={INPUT_STYLE} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
              <input name="due_date" type="date" value={form.due_date} onChange={set} style={INPUT_STYLE} />
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">Line Items <span className="text-red-400">*</span></label>
              <button type="button" onClick={addItem}
                className="flex items-center gap-1.5 text-xs text-accent hover:text-white bg-primary/10 hover:bg-primary/30 px-3 py-1.5 rounded-lg transition-colors">
                <PlusCircle size={12} /> Add Item
              </button>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[1fr_80px_120px_100px_32px] gap-2 mb-1.5 px-1">
              {['Description', 'Qty', 'Unit Price (₹)', 'Amount', ''].map((h) => (
                <span key={h} className="text-xs text-slate-500 font-medium">{h}</span>
              ))}
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => {
                const amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)
                return (
                  <div key={idx} className="grid grid-cols-[1fr_80px_120px_100px_32px] gap-2 items-center">
                    <input
                      value={item.description}
                      onChange={(e) => setItem(idx, 'description', e.target.value)}
                      placeholder="Item description"
                      style={INPUT_STYLE}
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      min="0.01"
                      step="any"
                      onChange={(e) => setItem(idx, 'quantity', e.target.value)}
                      style={INPUT_STYLE}
                    />
                    <input
                      type="number"
                      value={item.unit_price}
                      min="0"
                      step="any"
                      placeholder="0"
                      onChange={(e) => setItem(idx, 'unit_price', e.target.value)}
                      style={INPUT_STYLE}
                    />
                    <div className="text-white text-sm font-medium bg-slate-700/40 rounded-lg px-3 py-2 text-right">
                      ₹{fmt(amount)}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      disabled={items.length === 1}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors disabled:opacity-20"
                    >
                      <MinusCircle size={18} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tax + Totals */}
          <div className="flex flex-wrap gap-6 items-start justify-between bg-slate-700/30 rounded-xl p-4">
            <div className="w-40">
              <label className="block text-sm font-medium text-slate-300 mb-1">Tax %</label>
              <input
                name="tax_percent"
                type="number"
                value={form.tax_percent}
                min="0"
                max="100"
                step="any"
                onChange={set}
                placeholder="0"
                style={INPUT_STYLE}
              />
              <p className="text-slate-500 text-xs mt-1">e.g. 18 for GST 18%</p>
            </div>
            <div className="text-right space-y-1.5 min-w-[200px]">
              <div className="flex justify-between gap-8 text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white font-medium">₹{fmt(subtotal)}</span>
              </div>
              {taxPct > 0 && (
                <div className="flex justify-between gap-8 text-sm">
                  <span className="text-slate-400">Tax ({taxPct}%)</span>
                  <span className="text-white font-medium">₹{fmt(taxAmt)}</span>
                </div>
              )}
              <div className="flex justify-between gap-8 text-base font-bold pt-2 border-t border-slate-600">
                <span className="text-white">Total</span>
                <span className="text-accent">₹{fmt(total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
            <textarea name="notes" value={form.notes} onChange={set} rows={3}
              placeholder="Payment terms, bank details, or any other notes…"
              style={{ ...INPUT_STYLE, resize: 'none' }} />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-700">
            <button type="button" onClick={onClose} disabled={saving}
              className="px-5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving…' : invoice ? 'Update Invoice' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Invoice View Modal ───────────────────────────────────────────────────────

const InvoiceView = ({ invoiceId, companySettings, onClose, onEdit }) => {
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    invoiceAPI.get(invoiceId)
      .then((d) => setInvoice(d.invoice))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [invoiceId])

  const statusColor = !invoice ? '' :
    invoice.status === 'paid' ? 'bg-green-600/30 text-green-300' :
    invoice.status === 'sent' ? 'bg-blue-600/30 text-blue-300' :
    'bg-slate-600 text-slate-300'

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto py-6 px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">{invoice?.invoice_number || 'Invoice'}</h2>
          <div className="flex items-center gap-2">
            {invoice && (
              <>
                <button onClick={() => { onClose(); onEdit(invoice) }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors">
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={() => printInvoice(invoice, companySettings)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-primary hover:bg-primary/90 transition-colors">
                  <Download size={12} /> Download PDF
                </button>
              </>
            )}
            <button onClick={onClose} className="text-slate-400 hover:text-white ml-1"><X size={20} /></button>
          </div>
        </div>

        {loading && <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-slate-400" /></div>}

        {invoice && !loading && (
          <div className="p-6 space-y-5">
            {/* Meta */}
            <div className="flex flex-wrap gap-4 items-start justify-between">
              <div>
                <p className="text-slate-400 text-xs">Customer</p>
                <p className="text-white font-semibold">{invoice.customer?.name}</p>
                {invoice.customer?.company && <p className="text-slate-400 text-xs">{invoice.customer.company}</p>}
              </div>
              {invoice.project_name && (
                <div>
                  <p className="text-slate-400 text-xs">Project</p>
                  <p className="text-white font-medium">{invoice.project_name}</p>
                </div>
              )}
              <div className="text-right">
                <p className="text-slate-400 text-xs">Issue Date</p>
                <p className="text-white text-sm">{invoice.issue_date}</p>
                {invoice.due_date && (
                  <>
                    <p className="text-slate-400 text-xs mt-1">Due Date</p>
                    <p className="text-white text-sm">{invoice.due_date}</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded ${statusColor}`}>
                {invoice.status.toUpperCase()}
              </span>
            </div>

            {/* Items */}
            <div className="border border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-700/60">
                    <th className="text-left px-4 py-2.5 text-slate-300 font-medium">Description</th>
                    <th className="text-right px-4 py-2.5 text-slate-300 font-medium w-16">Qty</th>
                    <th className="text-right px-4 py-2.5 text-slate-300 font-medium w-28">Unit Price</th>
                    <th className="text-right px-4 py-2.5 text-slate-300 font-medium w-28">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {(invoice.items || []).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-700/20">
                      <td className="px-4 py-2.5 text-white">{item.description}</td>
                      <td className="px-4 py-2.5 text-slate-300 text-right">{item.quantity}</td>
                      <td className="px-4 py-2.5 text-slate-300 text-right">₹{fmt(item.unit_price)}</td>
                      <td className="px-4 py-2.5 text-white font-medium text-right">₹{fmt(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-56 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white">₹{fmt(invoice.subtotal)}</span>
                </div>
                {invoice.tax_percent > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Tax ({invoice.tax_percent}%)</span>
                    <span className="text-white">₹{fmt(invoice.tax_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-600">
                  <span className="text-white">Total</span>
                  <span className="text-accent">₹{fmt(invoice.total)}</span>
                </div>
              </div>
            </div>

            {/* Payment method + Notes */}
            {(invoice.payment_method || invoice.notes) && (
              <div className="grid sm:grid-cols-2 gap-4">
                {invoice.payment_method && (
                  <div className="bg-slate-700/30 rounded-lg px-4 py-3">
                    <p className="text-slate-400 text-xs mb-1">Payment Method</p>
                    <p className="text-white text-sm font-medium">{invoice.payment_method.label}</p>
                    <p className="text-slate-500 text-xs mb-1.5">{invoice.payment_method.type === 'bank' ? 'Bank Transfer' : invoice.payment_method.type === 'upi' ? 'UPI' : 'Other'}</p>
                    <pre className="text-slate-300 text-xs whitespace-pre-wrap font-sans leading-relaxed">{invoice.payment_method.details}</pre>
                  </div>
                )}
                {invoice.notes && (
                  <div className="bg-slate-700/30 rounded-lg px-4 py-3">
                    <p className="text-slate-400 text-xs mb-1">Notes</p>
                    <p className="text-slate-300 text-sm whitespace-pre-wrap">{invoice.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

const DeleteConfirm = ({ invoiceNumber, onCancel, onConfirm, deleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-red-900/40 rounded-full flex items-center justify-center">
          <Trash2 size={18} className="text-red-400" />
        </div>
        <h3 className="text-white font-semibold">Delete Invoice</h3>
      </div>
      <p className="text-slate-400 text-sm mb-5">
        Delete invoice <strong className="text-white">{invoiceNumber}</strong>? This cannot be undone.
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

const STATUS_COLORS = {
  draft: 'bg-slate-600 text-slate-200',
  sent:  'bg-blue-600/30 text-blue-300',
  paid:  'bg-green-600/30 text-green-300',
}

const AdminInvoices = () => {
  const [searchParams] = useSearchParams()
  const [invoices, setInvoices]         = useState([])
  const [customers, setCustomers]       = useState([])
  const [paymentMethods, setPayMethods] = useState([])
  const [companySettings, setCoSettings] = useState({})
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]           = useState('')
  const [custFilter, setCustFilter]   = useState(searchParams.get('customer_id') || '')
  const [statusFilter, setStatusFilter] = useState('')
  const [showForm, setShowForm]       = useState(false)
  const [editItem, setEditItem]       = useState(null)
  const [viewId, setViewId]           = useState(null)
  const [deleteId, setDeleteId]       = useState(null)
  const [deleting, setDeleting]       = useState(false)
  const [downloading, setDownloading] = useState(null)
  const [toast, setToast]             = useState(null)

  useEffect(() => {
    Promise.all([
      invoiceAPI.getAll(custFilter ? { customer_id: custFilter } : {}),
      customerAPI.getAll(),
      paymentMethodAPI.getAll(),
      settingsAPI.getCompany(),
    ])
      .then(([invData, custData, pmData, coData]) => {
        setInvoices(invData.invoices || [])
        setCustomers(custData.customers || [])
        setPayMethods(pmData.payment_methods || [])
        setCoSettings(coData.settings || {})
      })
      .catch((err) => showToast('error', err.message))
      .finally(() => setLoading(false))
  }, [])

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSave = (saved) => {
    setInvoices((prev) => {
      const exists = prev.find((i) => i.id === saved.id)
      return exists ? prev.map((i) => i.id === saved.id ? saved : i) : [saved, ...prev]
    })
    setShowForm(false)
    setEditItem(null)
    showToast('success', editItem ? 'Invoice updated' : 'Invoice created')
  }

  const handleEdit = (inv) => {
    setEditItem(inv)
    setViewId(null)
    setShowForm(true)
  }

  const handleDownload = async (invId) => {
    setDownloading(invId)
    try {
      const data = await invoiceAPI.get(invId)
      printInvoice(data.invoice, companySettings)
    } catch (err) {
      showToast('error', 'Failed to load invoice for download')
    } finally {
      setDownloading(null)
    }
  }

  const handleDeleteConfirm = async () => {
    setDeleting(true)
    try {
      await invoiceAPI.delete(deleteId)
      setInvoices((prev) => prev.filter((i) => i.id !== deleteId))
      setDeleteId(null)
      showToast('success', 'Invoice deleted')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setDeleting(false)
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return invoices.filter((inv) => {
      if (custFilter && String(inv.customer_id) !== String(custFilter)) return false
      if (statusFilter && inv.status !== statusFilter) return false
      if (!q) return true
      return [inv.invoice_number, inv.project_name, inv.customer?.name, inv.customer?.company]
        .some((v) => v && v.toLowerCase().includes(q))
    })
  }, [invoices, search, custFilter, statusFilter])

  const deleteTarget = invoices.find((i) => i.id === deleteId)

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
        <InvoiceForm
          invoice={editItem}
          customers={customers}
          paymentMethods={paymentMethods}
          onClose={() => { setShowForm(false); setEditItem(null) }}
          onSave={handleSave}
        />
      )}
      {viewId && (
        <InvoiceView
          invoiceId={viewId}
          companySettings={companySettings}
          onClose={() => setViewId(null)}
          onEdit={handleEdit}
        />
      )}
      {deleteId && (
        <DeleteConfirm
          invoiceNumber={deleteTarget?.invoice_number || ''}
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDeleteConfirm}
          deleting={deleting}
        />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Invoices</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {loading ? 'Loading…' : `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => { setEditItem(null); setShowForm(true) }}
          disabled={customers.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={customers.length === 0 ? 'Add a customer first' : 'New Invoice'}
        >
          <Plus size={16} /> New Invoice
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice #, project, customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-primary/60"
          />
        </div>
        <select
          value={custFilter}
          onChange={(e) => setCustFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none"
        >
          <option value="">All Customers</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-slate-400" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FileText size={48} className="text-slate-600 mb-4" />
          <p className="text-slate-400 font-medium">
            {invoices.length === 0
              ? customers.length === 0
                ? 'Add a customer first, then create your first invoice.'
                : 'No invoices yet — click New Invoice to get started.'
              : 'No invoices match your filters.'}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">Invoice #</th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden md:table-cell">Project</th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium">Status</th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden sm:table-cell">Date</th>
                  <th className="text-right px-5 py-3 text-slate-400 font-medium">Total</th>
                  <th className="text-right px-5 py-3 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="text-white font-mono text-sm">{inv.invoice_number}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-white font-medium">{inv.customer?.name || '—'}</p>
                      {inv.customer?.company && <p className="text-slate-400 text-xs">{inv.customer.company}</p>}
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-slate-300 text-sm">{inv.project_name || '—'}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded ${STATUS_COLORS[inv.status] || STATUS_COLORS.draft}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="text-slate-300 text-sm">{inv.issue_date}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-white font-semibold">₹{fmt(inv.total)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setViewId(inv.id)} title="View"
                          className="p-1.5 bg-slate-600 hover:bg-slate-500 text-white rounded-md transition-colors">
                          <Eye size={13} />
                        </button>
                        <button onClick={() => handleEdit(inv)} title="Edit"
                          className="p-1.5 bg-slate-600 hover:bg-slate-500 text-white rounded-md transition-colors">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDownload(inv.id)} title="Download PDF"
                          disabled={downloading === inv.id}
                          className="p-1.5 bg-primary/20 hover:bg-primary/40 text-accent rounded-md transition-colors disabled:opacity-50">
                          {downloading === inv.id ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                        </button>
                        <button onClick={() => setDeleteId(inv.id)} title="Delete"
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

export default AdminInvoices
