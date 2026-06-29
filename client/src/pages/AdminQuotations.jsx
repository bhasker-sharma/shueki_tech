import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../components/AdminLayout'
import { quotationAPI, customerAPI, settingsAPI, paymentMethodAPI } from '../utils/api'
import {
  Plus, Edit2, Trash2, X, Loader2, FileText, Eye, Search,
  IndianRupee, PlusCircle, MinusCircle, Printer, CheckCircle,
  XCircle, Calendar, ClipboardList, ChevronDown, ChevronUp,
  AlertCircle, User, Building2, Mail, Phone,
} from 'lucide-react'

// ─── Shared helpers ────────────────────────────────────────────────────────────

const INPUT = {
  width: '100%',
  background: 'rgb(15 23 42)',
  border: '1px solid rgb(71 85 105)',
  color: 'white',
  borderRadius: '0.5rem',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  outline: 'none',
}

const fmt = (n) =>
  Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const today = () => new Date().toISOString().split('T')[0]

const currSym = (c) => (c === 'USD' ? '$' : '₹')

const STATUS_META = {
  draft:    { label: 'Draft',    bg: 'bg-slate-700',  text: 'text-slate-200' },
  sent:     { label: 'Sent',     bg: 'bg-blue-800',   text: 'text-blue-200'  },
  accepted: { label: 'Accepted', bg: 'bg-green-800',  text: 'text-green-200' },
  rejected: { label: 'Rejected', bg: 'bg-red-800',    text: 'text-red-200'   },
  expired:  { label: 'Expired',  bg: 'bg-yellow-800', text: 'text-yellow-200'},
}

const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.draft
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${m.bg} ${m.text}`}>
      {m.label}
    </span>
  )
}

// ─── Section type config ───────────────────────────────────────────────────────

const SECTION_TYPES = [
  {
    type: 'scope_in',
    label: "What's Included",
    icon: CheckCircle,
    hint: 'Enter each included item on a new line — they become bullet points in the PDF.',
    structured: false,
  },
  {
    type: 'scope_out',
    label: 'Out of Scope',
    icon: XCircle,
    hint: 'Enter each excluded item on a new line.',
    structured: false,
  },
  {
    type: 'steps',
    label: 'Deliverables / Steps',
    icon: ClipboardList,
    hint: 'Enter each step or deliverable on a new line — they become a numbered list.',
    structured: false,
  },
  {
    type: 'timeline',
    label: 'Project Timeline',
    icon: Calendar,
    hint: 'Add phases with duration and a short description.',
    structured: 'timeline',
  },
  {
    type: 'payment_terms',
    label: 'Payment Terms',
    icon: IndianRupee,
    hint: 'Define payment milestones with amounts and due dates.',
    structured: 'payment_terms',
  },
  {
    type: 'custom',
    label: 'Custom Section',
    icon: FileText,
    hint: 'Free-form section with a custom title and content.',
    structured: false,
  },
]

const defaultTitle = (type) =>
  SECTION_TYPES.find((s) => s.type === type)?.label || 'Section'

// ─── Section editor ────────────────────────────────────────────────────────────

function SectionEditor({ section, index, onChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) {
  const meta = SECTION_TYPES.find((s) => s.type === section.type) || {}

  const parseRows = (content) => {
    try { return JSON.parse(content || '[]') } catch { return [] }
  }

  const rows = meta.structured ? parseRows(section.content) : []

  const updateRows = (newRows) =>
    onChange(index, { ...section, content: JSON.stringify(newRows) })

  const addTimelineRow = () =>
    updateRows([...rows, { phase: '', duration: '', notes: '' }])

  const addPaymentRow = () =>
    updateRows([...rows, { milestone: '', amount: '', due_date: '', notes: '' }])

  const updateRow = (i, field, val) =>
    updateRows(rows.map((r, j) => (j === i ? { ...r, [field]: val } : r)))

  const removeRow = (i) =>
    updateRows(rows.filter((_, j) => j !== i))

  const Icon = meta.icon || FileText

  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-700/50">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-indigo-400" />
          {section.type === 'custom' ? (
            <input
              style={{ ...INPUT, width: '220px', padding: '0.25rem 0.5rem' }}
              value={section.title}
              onChange={(e) => onChange(index, { ...section, title: e.target.value })}
              placeholder="Section title…"
            />
          ) : (
            <span className="text-sm font-semibold text-white">{section.title}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!isFirst && (
            <button onClick={() => onMoveUp(index)} className="p-1 text-slate-400 hover:text-white" title="Move up">
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
          {!isLast && (
            <button onClick={() => onMoveDown(index)} className="p-1 text-slate-400 hover:text-white" title="Move down">
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => onRemove(index)} className="p-1 text-red-400 hover:text-red-300 ml-1" title="Remove section">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Section content */}
      <div className="p-4">
        {meta.hint && (
          <p className="text-xs text-slate-400 mb-3">{meta.hint}</p>
        )}

        {/* Plain textarea sections */}
        {!meta.structured && (
          <textarea
            style={{ ...INPUT, resize: 'vertical' }}
            rows={section.type === 'custom' ? 5 : 6}
            value={section.content || ''}
            onChange={(e) => onChange(index, { ...section, content: e.target.value })}
            placeholder={
              section.type === 'scope_in'  ? 'User authentication module\nAdmin dashboard\nRESTful API integration…' :
              section.type === 'scope_out' ? 'Mobile application\nThird-party integrations\nData migration from old system…' :
              section.type === 'steps'     ? 'Requirements gathering & sign-off\nUI/UX wireframes\nBackend API development\nFrontend development\nTesting & QA\nDeployment…' :
              'Enter content here…'
            }
          />
        )}

        {/* Timeline rows */}
        {meta.structured === 'timeline' && (
          <div className="space-y-2">
            {rows.length === 0 && (
              <p className="text-xs text-slate-500 italic">No phases yet — click Add Phase below.</p>
            )}
            {rows.map((row, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input
                  style={{ ...INPUT, flex: 2 }}
                  value={row.phase || ''}
                  onChange={(e) => updateRow(i, 'phase', e.target.value)}
                  placeholder="Phase name (e.g. Discovery)"
                />
                <input
                  style={{ ...INPUT, flex: 1 }}
                  value={row.duration || ''}
                  onChange={(e) => updateRow(i, 'duration', e.target.value)}
                  placeholder="Duration (e.g. 1 week)"
                />
                <input
                  style={{ ...INPUT, flex: 3 }}
                  value={row.notes || ''}
                  onChange={(e) => updateRow(i, 'notes', e.target.value)}
                  placeholder="Description"
                />
                <button
                  onClick={() => removeRow(i)}
                  className="p-2 text-red-400 hover:text-red-300 flex-shrink-0"
                >
                  <MinusCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addTimelineRow}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 mt-2"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Phase
            </button>
          </div>
        )}

        {/* Payment term rows */}
        {meta.structured === 'payment_terms' && (
          <div className="space-y-2">
            {rows.length === 0 && (
              <p className="text-xs text-slate-500 italic">No milestones yet — click Add Milestone below.</p>
            )}
            {rows.map((row, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input
                  style={{ ...INPUT, flex: 3 }}
                  value={row.milestone || ''}
                  onChange={(e) => updateRow(i, 'milestone', e.target.value)}
                  placeholder="Milestone (e.g. On project start)"
                />
                <input
                  style={{ ...INPUT, flex: 1.5 }}
                  value={row.amount || ''}
                  onChange={(e) => updateRow(i, 'amount', e.target.value)}
                  placeholder="Amount (₹)"
                  type="number"
                  min="0"
                />
                <input
                  style={{ ...INPUT, flex: 1.5 }}
                  value={row.due_date || ''}
                  onChange={(e) => updateRow(i, 'due_date', e.target.value)}
                  placeholder="Due date"
                  type="date"
                />
                <input
                  style={{ ...INPUT, flex: 2 }}
                  value={row.notes || ''}
                  onChange={(e) => updateRow(i, 'notes', e.target.value)}
                  placeholder="Notes"
                />
                <button
                  onClick={() => removeRow(i)}
                  className="p-2 text-red-400 hover:text-red-300 flex-shrink-0"
                >
                  <MinusCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addPaymentRow}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 mt-2"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Milestone
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PDF generator ─────────────────────────────────────────────────────────────

const printQuotation = (qt, co = {}) => {
  const customer = qt.customer       || null
  const pm       = qt.payment_method || null
  const items    = qt.items          || []
  const sections = qt.sections       || []

  const sym           = currSym(qt.currency)
  const clientName    = customer?.name    || qt.customer_name    || ''
  const clientEmail   = customer?.email   || qt.customer_email   || ''
  const clientPhone   = customer?.phone   || qt.customer_phone   || ''
  const clientCompany = customer?.company || qt.customer_company || ''

  const pmTypeLabel = pm
    ? (pm.type === 'bank' ? 'Bank Transfer' : pm.type === 'upi' ? 'UPI Payment' : 'Payment Details')
    : ''

  const coName    = co.company_name || 'Shueki Tech'
  const coTagline = co.tagline      || ''
  const coAddr    = co.address      || 'Opp. UCO Bank, Ground Floor, Hoshiarpur Road'
  const coCity    = co.city         || 'Garhshankar, Punjab – 144527'
  const coPhone   = co.phone        || '+91-84271-82071'
  const coEmail   = co.email        || ''
  const coWeb     = co.website      || ''
  const coGST     = co.gst_number   || ''

  const statusColors = {
    draft:    ['#374151', '#f3f4f6'],
    sent:     ['#1e40af', '#dbeafe'],
    accepted: ['#065f46', '#d1fae5'],
    rejected: ['#991b1b', '#fee2e2'],
    expired:  ['#92400e', '#fef3c7'],
  }
  const [sc, sb] = statusColors[qt.status] || statusColors.draft

  // Items table
  const itemsHtml = items.length > 0 ? `
    <section class="sec">
      <h3 class="sec-title">Price Breakdown</h3>
      <table>
        <thead>
          <tr>
            <th style="width:52%">Description</th>
            <th class="r" style="width:12%">Qty</th>
            <th class="r" style="width:18%">Unit Price</th>
            <th class="r" style="width:18%">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((it) => `
            <tr>
              <td>${it.description}</td>
              <td class="r">${it.quantity}</td>
              <td class="r">${sym} ${fmt(it.unit_price)}</td>
              <td class="r">${sym} ${fmt(it.amount)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="totals-wrap">
        <div class="totals-box">
          <div class="t-row"><span>Subtotal</span><span>${sym} ${fmt(qt.subtotal)}</span></div>
          ${qt.tax_percent > 0 ? `<div class="t-row"><span>GST / Tax (${qt.tax_percent}%)</span><span>${sym} ${fmt(qt.tax_amount)}</span></div>` : ''}
          <div class="t-row grand"><span>Total</span><span>${sym} ${fmt(qt.total)}</span></div>
        </div>
      </div>
    </section>` : ''

  // Optional sections
  const sectionHtml = sections.map((sec) => {
    let body = ''
    if (sec.type === 'scope_in' || sec.type === 'scope_out') {
      const lines = (sec.content || '').split('\n').filter((l) => l.trim())
      body = `<ul class="blist">${lines.map((l) => `<li>${l.trim()}</li>`).join('')}</ul>`
    } else if (sec.type === 'steps') {
      const lines = (sec.content || '').split('\n').filter((l) => l.trim())
      body = `<ol class="nlist">${lines.map((l) => `<li>${l.trim()}</li>`).join('')}</ol>`
    } else if (sec.type === 'timeline') {
      let phases = []
      try { phases = JSON.parse(sec.content || '[]') } catch (_) {}
      body = phases.length ? `
        <table>
          <thead><tr><th style="width:28%">Phase</th><th style="width:18%">Duration</th><th>Description</th></tr></thead>
          <tbody>
            ${phases.map((p) => `<tr><td><strong>${p.phase || ''}</strong></td><td>${p.duration || ''}</td><td>${p.notes || ''}</td></tr>`).join('')}
          </tbody>
        </table>` : '<p class="prose">—</p>'
    } else if (sec.type === 'payment_terms') {
      let ms = []
      try { ms = JSON.parse(sec.content || '[]') } catch (_) {}
      body = ms.length ? `
        <table>
          <thead><tr><th>Milestone</th><th class="r" style="width:18%">Amount</th><th class="r" style="width:16%">Due Date</th><th style="width:22%">Notes</th></tr></thead>
          <tbody>
            ${ms.map((m) => `<tr>
              <td>${m.milestone || ''}</td>
              <td class="r">${sym} ${fmt(m.amount)}</td>
              <td class="r">${m.due_date || '—'}</td>
              <td>${m.notes || ''}</td>
            </tr>`).join('')}
          </tbody>
        </table>` : '<p class="prose">—</p>'
    } else {
      body = `<p class="prose">${(sec.content || '').replace(/\n/g, '<br>')}</p>`
    }
    return `<section class="sec"><h3 class="sec-title">${sec.title}</h3>${body}</section>`
  }).join('')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Quotation ${qt.quotation_number}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;font-size:13px;background:#fff}
  .page{max-width:760px;margin:0 auto;padding:40px}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:18px;border-bottom:3px solid #4f46e5}
  .co-name{font-size:25px;font-weight:900;color:#4f46e5;letter-spacing:-.5px}
  .co-tag{font-size:11px;color:#888;margin-top:1px;font-style:italic}
  .co-det{font-size:11px;color:#666;margin-top:6px;line-height:1.8}
  .co-det a{color:#4f46e5;text-decoration:none}
  .qt-right{text-align:right}
  .qt-ttl{font-size:28px;font-weight:900;color:#4f46e5;letter-spacing:1px}
  .qt-num{font-size:12px;color:#555;margin-top:2px}
  .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-top:6px;background:${sb};color:${sc}}
  .subj{background:#f0f0ff;border-left:3px solid #4f46e5;padding:8px 14px;margin-bottom:22px;border-radius:0 4px 4px 0}
  .subj-lbl{font-size:10px;text-transform:uppercase;color:#999;letter-spacing:.5px;margin-bottom:2px}
  .subj-val{font-weight:700;color:#4f46e5;font-size:14px}
  .mid{display:flex;justify-content:space-between;margin-bottom:26px}
  .bill h4{font-size:10px;text-transform:uppercase;color:#999;letter-spacing:.8px;margin-bottom:6px}
  .bill-name{font-weight:700;font-size:14px;margin-bottom:2px}
  .bill-info{font-size:12px;color:#555;line-height:1.7}
  .dates{text-align:right}
  .d-row{margin-bottom:7px}
  .d-lbl{font-size:10px;text-transform:uppercase;color:#999;letter-spacing:.5px}
  .d-val{font-weight:600;font-size:13px}
  .sec{margin-bottom:24px}
  .sec-title{font-size:13px;font-weight:700;color:#4f46e5;text-transform:uppercase;letter-spacing:.5px;margin-bottom:9px;padding-bottom:4px;border-bottom:1px solid #e0e0ff}
  table{width:100%;border-collapse:collapse;margin-bottom:6px}
  thead th{background:#4f46e5;color:#fff;padding:8px 11px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;text-align:left}
  thead th.r{text-align:right}
  tbody tr:nth-child(even){background:#f8f8ff}
  tbody td{padding:8px 11px;border-bottom:1px solid #eee;font-size:12px}
  tbody td.r{text-align:right;font-weight:500}
  .totals-wrap{display:flex;justify-content:flex-end;margin-top:6px}
  .totals-box{width:240px}
  .t-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;font-size:13px}
  .t-row.grand{border-top:2px solid #4f46e5;border-bottom:none;padding-top:7px;font-size:15px;font-weight:700;color:#4f46e5}
  .blist{padding-left:18px}
  .blist li{margin-bottom:4px;font-size:12px;line-height:1.5}
  .nlist{padding-left:18px}
  .nlist li{margin-bottom:5px;font-size:12px;line-height:1.5}
  .prose{font-size:12px;line-height:1.7;color:#555;white-space:pre-wrap}
  .notes-box{background:#f8f8f8;border-radius:6px;padding:12px 14px;margin-bottom:22px}
  .notes-box h4{font-size:10px;text-transform:uppercase;color:#999;letter-spacing:.5px;margin-bottom:5px}
  .notes-box p{font-size:12px;color:#555;line-height:1.6;white-space:pre-wrap}
  .info-box{background:#f8f8f8;border-radius:6px;padding:12px 14px}
  .info-box h4{font-size:10px;text-transform:uppercase;color:#999;letter-spacing:.5px;margin-bottom:5px}
  .info-box p{font-size:12px;color:#555;line-height:1.6;white-space:pre-wrap}
  .pm-type{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#4f46e5;margin-bottom:3px}
  .pm-label{font-weight:700;font-size:13px;margin-bottom:4px}
  .footer{text-align:center;font-size:11px;color:#bbb;padding-top:14px;border-top:1px solid #eee;margin-top:18px}
  @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div>
      <div class="co-name">${coName}</div>
      ${coTagline ? `<div class="co-tag">${coTagline}</div>` : ''}
      <div class="co-det">
        ${coAddr ? `${coAddr}<br>` : ''}${coCity ? `${coCity}<br>` : ''}${coPhone || ''}${coEmail ? ` · <a href="mailto:${coEmail}">${coEmail}</a>` : ''}${coWeb ? `<br><a href="${coWeb}">${coWeb}</a>` : ''}${coGST ? `<br>GST: ${coGST}` : ''}
      </div>
    </div>
    <div class="qt-right">
      <div class="qt-ttl">QUOTATION</div>
      <div class="qt-num">${qt.quotation_number}</div>
      <div class="badge">${(qt.status || 'draft').toUpperCase()}</div>
    </div>
  </div>

  <div class="subj">
    <div class="subj-lbl">Subject / Project</div>
    <div class="subj-val">${qt.title}</div>
  </div>

  <div class="mid">
    <div class="bill">
      <h4>Prepared For</h4>
      ${clientName ? `<div class="bill-name">${clientName}</div>` : ''}
      <div class="bill-info">
        ${clientCompany ? `${clientCompany}<br>` : ''}${clientEmail ? `${clientEmail}<br>` : ''}${clientPhone || ''}
      </div>
    </div>
    <div class="dates">
      <div class="d-row"><div class="d-lbl">Date Issued</div><div class="d-val">${qt.issue_date}</div></div>
      ${qt.valid_until ? `<div class="d-row"><div class="d-lbl">Valid Until</div><div class="d-val">${qt.valid_until}</div></div>` : ''}
      <div class="d-row"><div class="d-lbl">Currency</div><div class="d-val">${qt.currency || 'INR'}</div></div>
    </div>
  </div>

  ${itemsHtml}
  ${sectionHtml}

  ${(pm || qt.notes) ? `
  <div style="display:flex;gap:20px;margin-bottom:24px">
    ${pm ? `
    <div class="info-box" style="flex:1">
      <h4>Payment Details</h4>
      <div class="pm-type">${pmTypeLabel}</div>
      <div class="pm-label">${pm.label}</div>
      <p>${(pm.details || '').replace(/\n/g, '<br>')}</p>
    </div>` : '<div style="flex:1"></div>'}
    ${qt.notes ? `
    <div class="info-box" style="flex:1">
      <h4>Notes</h4>
      <p>${qt.notes}</p>
    </div>` : '<div style="flex:1"></div>'}
  </div>` : ''}

  <div class="footer">
    This quotation is valid until ${qt.valid_until || 'further notice'} &nbsp;·&nbsp; ${coName} &nbsp;·&nbsp; ${coPhone}${coEmail ? ` &nbsp;·&nbsp; ${coEmail}` : ''}
  </div>
</div>
</body>
</html>`

  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 500)
}

// ─── Customer quick-create mini-modal ─────────────────────────────────────────

function CustomerQuickCreate({ onCreated, onClose }) {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')
  const [company, setCompany] = useState('')
  const [saving, setSaving]   = useState(false)
  const [err, setErr]         = useState('')

  const handleCreate = async () => {
    if (!name.trim()) { setErr('Name is required'); return }
    setSaving(true)
    try {
      const res = await customerAPI.create({ name, email, phone, company, status: 'active' })
      onCreated(res.customer)
    } catch (e) {
      setErr(e.message || 'Failed to create customer')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-600 rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Add New Customer</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Full Name *</label>
            <input style={INPUT} value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" autoFocus />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Company</label>
            <input style={INPUT} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Pvt Ltd" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Email</label>
              <input style={INPUT} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Phone</label>
              <input style={INPUT} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
            </div>
          </div>
          {err && <p className="text-red-400 text-xs">{err}</p>}
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 text-sm">Cancel</button>
          <button
            onClick={handleCreate}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm disabled:opacity-60"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Create & Select
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Quotation Form ────────────────────────────────────────────────────────────

const EMPTY_FORM = () => ({
  customer_id: '',
  payment_method_id: '',
  title: '',
  status: 'draft',
  issue_date: today(),
  valid_until: '',
  currency: 'INR',
  notes: '',
  tax_percent: 0,
  items: [{ description: '', quantity: 1, unit_price: '' }],
  sections: [],
})

const buildFormFromQuotation = (qt) => ({
  customer_id: qt.customer_id ? String(qt.customer_id) : '',
  payment_method_id: qt.payment_method_id ? String(qt.payment_method_id) : '',
  title: qt.title || '',
  status: qt.status || 'draft',
  issue_date: qt.issue_date || today(),
  valid_until: qt.valid_until || '',
  currency: qt.currency || 'INR',
  notes: qt.notes || '',
  tax_percent: qt.tax_percent ?? 0,
  items: qt.items?.length
    ? qt.items.map((it) => ({ description: it.description, quantity: it.quantity, unit_price: it.unit_price }))
    : [{ description: '', quantity: 1, unit_price: '' }],
  sections: qt.sections?.map((s) => ({ type: s.type, title: s.title, content: s.content || '' })) || [],
})

function QuotationForm({ initial, customers: initialCustomers, paymentMethods, onSave, onClose, saving }) {
  const [form, setForm]               = useState(() => (initial ? buildFormFromQuotation(initial) : EMPTY_FORM()))
  const [errors, setErrors]           = useState({})
  const [customers, setCustomers]     = useState(initialCustomers)
  const [showQuickCreate, setShowQuickCreate] = useState(false)

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }))

  const selectedCustomer = customers.find((c) => String(c.id) === String(form.customer_id)) || null

  const handleCustomerCreated = (newCustomer) => {
    setCustomers((prev) => [newCustomer, ...prev])
    setForm((f) => ({ ...f, customer_id: String(newCustomer.id) }))
    setShowQuickCreate(false)
  }

  // Items
  const setItem = (i, field, val) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((it, j) => (j === i ? { ...it, [field]: val } : it)),
    }))

  const addItem = () =>
    setForm((f) => ({ ...f, items: [...f.items, { description: '', quantity: 1, unit_price: '' }] }))

  const removeItem = (i) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, j) => j !== i) }))

  // Sections
  const addSection = (type) => {
    if (form.sections.some((s) => s.type === type && type !== 'custom')) return
    setForm((f) => ({
      ...f,
      sections: [...f.sections, { type, title: defaultTitle(type), content: '' }],
    }))
  }

  const updateSection = (index, updated) =>
    setForm((f) => ({ ...f, sections: f.sections.map((s, i) => (i === index ? updated : s)) }))

  const removeSection = (index) =>
    setForm((f) => ({ ...f, sections: f.sections.filter((_, i) => i !== index) }))

  const moveSectionUp = (index) => {
    if (index === 0) return
    setForm((f) => {
      const s = [...f.sections]
      ;[s[index - 1], s[index]] = [s[index], s[index - 1]]
      return { ...f, sections: s }
    })
  }

  const moveSectionDown = (index) => {
    setForm((f) => {
      if (index === f.sections.length - 1) return f
      const s = [...f.sections]
      ;[s[index], s[index + 1]] = [s[index + 1], s[index]]
      return { ...f, sections: s }
    })
  }

  // Totals
  const subtotal = form.items.reduce((sum, it) => sum + (parseFloat(it.quantity) || 0) * (parseFloat(it.unit_price) || 0), 0)
  const taxAmt   = subtotal * (parseFloat(form.tax_percent) || 0) / 100
  const total    = subtotal + taxAmt

  const validate = () => {
    const e = {}
    if (!form.customer_id) e.customer_id = 'Select a customer — or create one first'
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.issue_date) e.issue_date = 'Issue date is required'
    if (form.items.some((it) => !it.description.trim())) e.items = 'All item descriptions are required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    const payload = {
      customer_id: form.customer_id,
      payment_method_id: form.payment_method_id || null,
      title: form.title,
      status: form.status,
      issue_date: form.issue_date,
      valid_until: form.valid_until || null,
      currency: form.currency,
      notes: form.notes,
      tax_percent: parseFloat(form.tax_percent) || 0,
      items: form.items.filter((it) => it.description.trim()).map((it) => ({
        description: it.description,
        quantity: parseFloat(it.quantity) || 1,
        unit_price: parseFloat(it.unit_price) || 0,
      })),
      sections: form.sections,
    }
    onSave(payload)
  }

  const activeSectionTypes = form.sections.map((s) => s.type)

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">
            {initial ? 'Edit Quotation' : 'New Quotation'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* ── Client ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Customer *</h3>
              <button
                type="button"
                onClick={() => setShowQuickCreate(true)}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300"
              >
                <PlusCircle className="w-3.5 h-3.5" /> New Customer
              </button>
            </div>

            {/* Selector row */}
            <select
              style={INPUT}
              value={form.customer_id}
              onChange={(e) => set('customer_id', e.target.value)}
            >
              <option value="">— Select a customer —</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.company ? ` · ${c.company}` : ''}
                </option>
              ))}
            </select>
            {errors.customer_id && (
              <p className="text-red-400 text-xs mt-1">{errors.customer_id}</p>
            )}

            {/* Customer card (shown once selected) */}
            {selectedCustomer && (
              <div className="mt-3 bg-slate-800 border border-slate-600 rounded-lg p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600/30 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{selectedCustomer.name}</p>
                  {selectedCustomer.company && (
                    <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <Building2 className="w-3 h-3" /> {selectedCustomer.company}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                    {selectedCustomer.email && (
                      <p className="flex items-center gap-1 text-xs text-slate-400">
                        <Mail className="w-3 h-3" /> {selectedCustomer.email}
                      </p>
                    )}
                    {selectedCustomer.phone && (
                      <p className="flex items-center gap-1 text-xs text-slate-400">
                        <Phone className="w-3 h-3" /> {selectedCustomer.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showQuickCreate && (
              <CustomerQuickCreate
                onCreated={handleCustomerCreated}
                onClose={() => setShowQuickCreate(false)}
              />
            )}
          </div>

          {/* ── Basic Info ── */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Quotation Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Subject / Project Title *</label>
                <input
                  style={INPUT}
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="e.g. Web Dashboard Development Proposal"
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Status</label>
                  <select style={INPUT} value={form.status} onChange={(e) => set('status', e.target.value)}>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Currency</label>
                  <select style={INPUT} value={form.currency} onChange={(e) => set('currency', e.target.value)}>
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Issue Date *</label>
                  <input style={INPUT} type="date" value={form.issue_date} onChange={(e) => set('issue_date', e.target.value)} />
                  {errors.issue_date && <p className="text-red-400 text-xs mt-1">{errors.issue_date}</p>}
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Valid Until</label>
                  <input style={INPUT} type="date" value={form.valid_until} onChange={(e) => set('valid_until', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Line Items ── */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Price Items (optional)</h3>
            <div className="space-y-2">
              <div className="grid gap-2 text-xs text-slate-400 px-1" style={{ gridTemplateColumns: '1fr 80px 120px 32px' }}>
                <span>Description</span><span className="text-center">Qty</span><span className="text-right">Unit Price</span><span />
              </div>
              {form.items.map((it, i) => (
                <div key={i} className="grid gap-2 items-center" style={{ gridTemplateColumns: '1fr 80px 120px 32px' }}>
                  <input
                    style={INPUT}
                    value={it.description}
                    onChange={(e) => setItem(i, 'description', e.target.value)}
                    placeholder="Description of service or deliverable"
                  />
                  <input
                    style={{ ...INPUT, textAlign: 'center' }}
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={it.quantity}
                    onChange={(e) => setItem(i, 'quantity', e.target.value)}
                  />
                  <input
                    style={{ ...INPUT, textAlign: 'right' }}
                    type="number"
                    min="0"
                    step="0.01"
                    value={it.unit_price}
                    onChange={(e) => setItem(i, 'unit_price', e.target.value)}
                    placeholder="0.00"
                  />
                  <button
                    onClick={() => removeItem(i)}
                    disabled={form.items.length === 1}
                    className="text-red-400 hover:text-red-300 disabled:opacity-30"
                  >
                    <MinusCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {errors.items && <p className="text-red-400 text-xs">{errors.items}</p>}
              <button
                onClick={addItem}
                className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 mt-1"
              >
                <PlusCircle className="w-4 h-4" /> Add Item
              </button>
            </div>

            {/* Totals */}
            {(subtotal > 0 || parseFloat(form.tax_percent) > 0) && (
              <div className="mt-4 flex justify-end">
                <div className="w-56 space-y-1.5">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Subtotal</span>
                    <span>{currSym(form.currency)} {fmt(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-300 gap-2">
                    <span className="flex items-center gap-1">
                      GST / Tax
                      <input
                        type="number" min="0" max="100" step="0.01"
                        value={form.tax_percent}
                        onChange={(e) => set('tax_percent', e.target.value)}
                        className="w-14 text-center rounded px-1 py-0.5 text-xs"
                        style={{ background: 'rgb(15 23 42)', border: '1px solid rgb(71 85 105)', color: 'white', outline: 'none' }}
                      />
                      <span className="text-xs text-slate-400">%</span>
                    </span>
                    <span>{currSym(form.currency)} {fmt(taxAmt)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-indigo-400 border-t border-slate-700 pt-1.5">
                    <span>Total</span>
                    <span>{currSym(form.currency)} {fmt(total)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Optional Sections ── */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-1 uppercase tracking-wide">Optional Sections</h3>
            <p className="text-xs text-slate-500 mb-3">Click a section to add it to the quotation. Each enabled section will appear in the PDF.</p>

            {/* Toggle buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {SECTION_TYPES.map((st) => {
                const Icon = st.icon
                const active = activeSectionTypes.includes(st.type) && st.type !== 'custom'
                return (
                  <button
                    key={st.type}
                    onClick={() => addSection(st.type)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      active
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 cursor-default'
                        : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-indigo-500 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {st.label}
                    {active && <CheckCircle className="w-3 h-3 ml-0.5 text-indigo-400" />}
                  </button>
                )
              })}
            </div>

            {/* Section editors */}
            {form.sections.length > 0 && (
              <div className="space-y-3">
                {form.sections.map((sec, i) => (
                  <SectionEditor
                    key={`${sec.type}-${i}`}
                    section={sec}
                    index={i}
                    onChange={updateSection}
                    onRemove={removeSection}
                    onMoveUp={moveSectionUp}
                    onMoveDown={moveSectionDown}
                    isFirst={i === 0}
                    isLast={i === form.sections.length - 1}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Payment Method (optional) ── */}
          {paymentMethods?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                Payment Details <span className="text-slate-500 normal-case font-normal">(optional)</span>
              </h3>
              <select
                style={INPUT}
                value={form.payment_method_id}
                onChange={(e) => set('payment_method_id', e.target.value)}
              >
                <option value="">— Don't include payment details —</option>
                {paymentMethods.map((pm) => (
                  <option key={pm.id} value={pm.id}>{pm.label}</option>
                ))}
              </select>
              {form.payment_method_id && (() => {
                const pm = paymentMethods.find((p) => String(p.id) === String(form.payment_method_id))
                return pm ? (
                  <div className="mt-2 bg-slate-800 border border-slate-600 rounded-lg p-3">
                    <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-1">
                      {pm.type === 'bank' ? 'Bank Transfer' : pm.type === 'upi' ? 'UPI Payment' : 'Payment'}
                    </p>
                    <p className="text-sm font-medium text-white mb-1">{pm.label}</p>
                    <p className="text-xs text-slate-400 whitespace-pre-wrap">{pm.details}</p>
                  </div>
                ) : null
              })()}
            </div>
          )}

          {/* ── Notes ── */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Notes (optional — appears in PDF)</label>
            <textarea
              style={{ ...INPUT, resize: 'vertical' }}
              rows={3}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Any additional notes or terms…"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-700">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 text-sm">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium disabled:opacity-60"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {initial ? 'Update Quotation' : 'Create Quotation'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Quotation View ────────────────────────────────────────────────────────────

function QuotationView({ quotation, onClose, onEdit, coSettings }) {
  const qt  = quotation
  const sym = currSym(qt.currency)
  const clientName = qt.customer?.name || qt.customer_name || '—'

  const renderSectionPreview = (sec) => {
    if (sec.type === 'scope_in' || sec.type === 'scope_out' || sec.type === 'steps') {
      const lines = (sec.content || '').split('\n').filter((l) => l.trim())
      const Tag = sec.type === 'steps' ? 'ol' : 'ul'
      return (
        <Tag className={sec.type === 'steps' ? 'list-decimal list-inside space-y-0.5' : 'list-disc list-inside space-y-0.5'}>
          {lines.map((l, i) => <li key={i} className="text-sm text-slate-300">{l.trim()}</li>)}
        </Tag>
      )
    }
    if (sec.type === 'timeline') {
      let rows = []
      try { rows = JSON.parse(sec.content || '[]') } catch (_) {}
      return (
        <table className="w-full text-sm">
          <thead><tr className="text-xs text-slate-400 border-b border-slate-700">
            <th className="text-left py-1 pr-3">Phase</th>
            <th className="text-left py-1 pr-3">Duration</th>
            <th className="text-left py-1">Description</th>
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-slate-800">
                <td className="py-1.5 pr-3 text-white font-medium">{r.phase}</td>
                <td className="py-1.5 pr-3 text-slate-300">{r.duration}</td>
                <td className="py-1.5 text-slate-300">{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
    if (sec.type === 'payment_terms') {
      let rows = []
      try { rows = JSON.parse(sec.content || '[]') } catch (_) {}
      return (
        <table className="w-full text-sm">
          <thead><tr className="text-xs text-slate-400 border-b border-slate-700">
            <th className="text-left py-1 pr-3">Milestone</th>
            <th className="text-right py-1 pr-3">Amount</th>
            <th className="text-right py-1 pr-3">Due Date</th>
            <th className="text-left py-1">Notes</th>
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-slate-800">
                <td className="py-1.5 pr-3 text-white">{r.milestone}</td>
                <td className="py-1.5 pr-3 text-right text-slate-300">{sym} {fmt(r.amount)}</td>
                <td className="py-1.5 pr-3 text-right text-slate-300">{r.due_date || '—'}</td>
                <td className="py-1.5 text-slate-400 text-xs">{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
    return <p className="text-sm text-slate-300 whitespace-pre-wrap">{sec.content}</p>
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-3xl my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white">{qt.quotation_number}</h2>
              <StatusBadge status={qt.status} />
            </div>
            <p className="text-sm text-slate-400 mt-0.5">{qt.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => printQuotation(qt, coSettings)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm"
            >
              <Printer className="w-4 h-4" /> Print / PDF
            </button>
            <button
              onClick={() => { onClose(); onEdit(qt) }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white ml-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-800 rounded-lg p-4">
            <div><p className="text-xs text-slate-400">Client</p><p className="text-sm font-medium text-white">{clientName}</p></div>
            <div><p className="text-xs text-slate-400">Issue Date</p><p className="text-sm text-white">{qt.issue_date}</p></div>
            <div><p className="text-xs text-slate-400">Valid Until</p><p className="text-sm text-white">{qt.valid_until || '—'}</p></div>
            <div><p className="text-xs text-slate-400">Currency</p><p className="text-sm text-white">{qt.currency || 'INR'}</p></div>
          </div>

          {/* Items */}
          {qt.items?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Price Breakdown</h4>
              <table className="w-full text-sm">
                <thead><tr className="text-xs text-slate-400 border-b border-slate-700">
                  <th className="text-left py-1.5">Description</th>
                  <th className="text-center py-1.5 w-16">Qty</th>
                  <th className="text-right py-1.5 w-28">Unit Price</th>
                  <th className="text-right py-1.5 w-28">Amount</th>
                </tr></thead>
                <tbody>
                  {qt.items.map((it, i) => (
                    <tr key={i} className="border-b border-slate-800">
                      <td className="py-1.5 text-slate-200">{it.description}</td>
                      <td className="py-1.5 text-center text-slate-300">{it.quantity}</td>
                      <td className="py-1.5 text-right text-slate-300">{sym} {fmt(it.unit_price)}</td>
                      <td className="py-1.5 text-right text-slate-200 font-medium">{sym} {fmt(it.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 flex justify-end">
                <div className="w-48 space-y-1 text-sm">
                  <div className="flex justify-between text-slate-300"><span>Subtotal</span><span>{sym} {fmt(qt.subtotal)}</span></div>
                  {qt.tax_percent > 0 && <div className="flex justify-between text-slate-300"><span>GST ({qt.tax_percent}%)</span><span>{sym} {fmt(qt.tax_amount)}</span></div>}
                  <div className="flex justify-between text-indigo-400 font-bold border-t border-slate-700 pt-1"><span>Total</span><span>{sym} {fmt(qt.total)}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Sections */}
          {qt.sections?.map((sec, i) => (
            <div key={i}>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{sec.title}</h4>
              {renderSectionPreview(sec)}
            </div>
          ))}

          {/* Payment method */}
          {qt.payment_method && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Payment Details</h4>
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-3">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-0.5">
                  {qt.payment_method.type === 'bank' ? 'Bank Transfer' : qt.payment_method.type === 'upi' ? 'UPI Payment' : 'Payment'}
                </p>
                <p className="text-sm font-medium text-white mb-1">{qt.payment_method.label}</p>
                <p className="text-xs text-slate-400 whitespace-pre-wrap">{qt.payment_method.details}</p>
              </div>
            </div>
          )}

          {/* Notes */}
          {qt.notes && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Notes</h4>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{qt.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Delete confirm ────────────────────────────────────────────────────────────

function DeleteConfirm({ quotation, onConfirm, onClose, deleting }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-white mb-2">Delete Quotation</h3>
        <p className="text-slate-300 text-sm mb-6">
          Delete <strong>{quotation.quotation_number}</strong> — "{quotation.title}"? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 text-sm">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm disabled:opacity-60"
          >
            {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ toast }) {
  if (!toast) return null
  return (
    <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
      toast.type === 'success' ? 'bg-green-700 text-white' : 'bg-red-700 text-white'
    }`}>
      {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {toast.message}
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function AdminQuotations() {
  const [quotations, setQuotations]     = useState([])
  const [customers, setCustomers]       = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [coSettings, setCoSettings]     = useState({})
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showForm, setShowForm]       = useState(false)
  const [editItem, setEditItem]       = useState(null)
  const [viewItem, setViewItem]       = useState(null)
  const [deleteItem, setDeleteItem]   = useState(null)
  const [saving, setSaving]           = useState(false)
  const [deleting, setDeleting]       = useState(false)
  const [toast, setToast]             = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const [qRes, cRes, pmRes, sRes] = await Promise.all([
        quotationAPI.getAll(),
        customerAPI.getAll(),
        paymentMethodAPI.getAll().catch(() => ({ payment_methods: [] })),
        settingsAPI.getCompany().catch(() => ({ settings: {} })),
      ])
      setQuotations(qRes.quotations || [])
      setCustomers(cRes.customers || [])
      setPaymentMethods(pmRes.payment_methods || [])
      setCoSettings(sRes.settings || {})
    } catch {
      showToast('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { loadAll() }, [loadAll])

  const handleSave = async (payload) => {
    setSaving(true)
    try {
      if (editItem) {
        const res = await quotationAPI.update(editItem.id, payload)
        setQuotations((prev) => prev.map((q) => q.id === editItem.id ? res.quotation : q))
        showToast('Quotation updated')
      } else {
        const res = await quotationAPI.create(payload)
        setQuotations((prev) => [res.quotation, ...prev])
        showToast('Quotation created')
      }
      setShowForm(false)
      setEditItem(null)
    } catch (err) {
      showToast(err.message || 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await quotationAPI.delete(deleteItem.id)
      setQuotations((prev) => prev.filter((q) => q.id !== deleteItem.id))
      setDeleteItem(null)
      showToast('Quotation deleted')
    } catch {
      showToast('Delete failed', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const openEdit = async (qt) => {
    try {
      const res = await quotationAPI.get(qt.id)
      setEditItem(res.quotation)
      setShowForm(true)
    } catch {
      showToast('Failed to load quotation', 'error')
    }
  }

  const openView = async (qt) => {
    try {
      const res = await quotationAPI.get(qt.id)
      setViewItem(res.quotation)
    } catch {
      showToast('Failed to load quotation', 'error')
    }
  }

  const filtered = quotations.filter((q) => {
    const s = search.toLowerCase()
    const matchSearch = !s || (
      q.quotation_number.toLowerCase().includes(s) ||
      q.title.toLowerCase().includes(s) ||
      (q.customer?.name || q.customer_name || '').toLowerCase().includes(s)
    )
    const matchStatus = !statusFilter || q.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Quotations</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {quotations.length} quotation{quotations.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => { setEditItem(null); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> New Quotation
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              style={{ ...INPUT, paddingLeft: '2.25rem' }}
              placeholder="Search by number, title, or client…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            style={{ ...INPUT, width: '160px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>{search || statusFilter ? 'No quotations match your filters.' : 'No quotations yet — create your first one.'}</p>
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-xs text-slate-400 uppercase tracking-wide">
                    <th className="text-left px-4 py-3">Quotation #</th>
                    <th className="text-left px-4 py-3">Title</th>
                    <th className="text-left px-4 py-3">Client</th>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-left px-4 py-3">Valid Until</th>
                    <th className="text-right px-4 py-3">Total</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-center px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((q) => (
                    <tr key={q.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-indigo-300 text-xs">{q.quotation_number}</td>
                      <td className="px-4 py-3 text-white max-w-xs truncate">{q.title}</td>
                      <td className="px-4 py-3 text-slate-300">
                        {q.customer?.name || q.customer_name || <span className="text-slate-500 italic">—</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{q.issue_date}</td>
                      <td className="px-4 py-3 text-slate-300">{q.valid_until || <span className="text-slate-500">—</span>}</td>
                      <td className="px-4 py-3 text-right font-medium text-white">
                        {q.total > 0 ? `${currSym(q.currency)} ${fmt(q.total)}` : <span className="text-slate-500">—</span>}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={q.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openView(q)}
                            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => printQuotation(q, coSettings)}
                            className="p-1.5 rounded text-slate-400 hover:text-indigo-300 hover:bg-slate-600 transition-colors"
                            title="Print / PDF"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEdit(q)}
                            className="p-1.5 rounded text-slate-400 hover:text-yellow-300 hover:bg-slate-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteItem(q)}
                            className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-slate-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>

      {/* Modals */}
      {showForm && (
        <QuotationForm
          initial={editItem}
          customers={customers}
          paymentMethods={paymentMethods}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditItem(null) }}
          saving={saving}
        />
      )}

      {viewItem && (
        <QuotationView
          quotation={viewItem}
          coSettings={coSettings}
          onClose={() => setViewItem(null)}
          onEdit={(qt) => openEdit(qt)}
        />
      )}

      {deleteItem && (
        <DeleteConfirm
          quotation={deleteItem}
          onConfirm={handleDelete}
          onClose={() => setDeleteItem(null)}
          deleting={deleting}
        />
      )}

      <Toast toast={toast} />
    </AdminLayout>
  )
}
