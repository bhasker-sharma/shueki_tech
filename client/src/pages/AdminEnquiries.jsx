import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Eye, Trash2, X, MessageSquare, Send } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { adminAPI } from '../utils/api'
import { SERVICE_TYPE_LABELS } from '../utils/constants'

const AdminEnquiries = () => {
  const { serviceType } = useParams()
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [comment, setComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    loadEnquiries()
  }, [serviceType, statusFilter])

  const loadEnquiries = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getEnquiries(serviceType, statusFilter || undefined)
      setEnquiries(response.data?.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminAPI.updateEnquiryStatus(id, newStatus)
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      )
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }))
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return
    try {
      await adminAPI.deleteEnquiry(id)
      setEnquiries((prev) => prev.filter((e) => e.id !== id))
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null)
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }

  const handleAddComment = async () => {
    if (!comment.trim() || !selectedEnquiry) return
    try {
      setSubmittingComment(true)
      const response = await adminAPI.addEnquiryComment(selectedEnquiry.id, comment)
      setSelectedEnquiry((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), response.data],
      }))
      setComment('')
    } catch (err) {
      alert('Failed to add comment: ' + err.message)
    } finally {
      setSubmittingComment(false)
    }
  }

  const title = SERVICE_TYPE_LABELS[serviceType] || 'All Enquiries'

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-slate-400 text-sm mt-1">
              {enquiries.length} enquir{enquiries.length === 1 ? 'y' : 'ies'}
            </p>
          </div>

          <div className="flex gap-2">
            {['', 'new', 'read', 'closed'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  statusFilter === s
                    ? 'bg-primary text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-12">Loading...</div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
            <p className="text-red-300">{error}</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center text-slate-500 py-12">No enquiries found</div>
        ) : (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium hidden md:table-cell">Email</th>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium hidden lg:table-cell">Company</th>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium hidden sm:table-cell">Date</th>
                    <th className="text-right py-3 px-4 text-slate-400 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-4 text-white text-sm">{enquiry.full_name}</td>
                      <td className="py-3 px-4 text-slate-400 text-sm hidden md:table-cell">{enquiry.email}</td>
                      <td className="py-3 px-4 text-slate-400 text-sm hidden lg:table-cell">{enquiry.company || '-'}</td>
                      <td className="py-3 px-4">
                        <select
                          value={enquiry.status}
                          onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                          className={`text-xs rounded-lg px-2 py-1 border-0 cursor-pointer ${
                            enquiry.status === 'new'
                              ? 'bg-green-500/20 text-green-400'
                              : enquiry.status === 'read'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-slate-500/20 text-slate-400'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-xs hidden sm:table-cell">
                        {new Date(enquiry.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedEnquiry(enquiry)}
                            className="text-slate-400 hover:text-white transition-colors"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(enquiry.id)}
                            className="text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
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

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Enquiry Details</h2>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500 text-xs mb-1">Name</p>
                  <p className="text-white">{selectedEnquiry.full_name}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-1">Email</p>
                  <p className="text-white">{selectedEnquiry.email}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-1">Phone</p>
                  <p className="text-white">{selectedEnquiry.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-1">Company</p>
                  <p className="text-white">{selectedEnquiry.company || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-1">Service</p>
                  <p className="text-white">
                    {SERVICE_TYPE_LABELS[selectedEnquiry.service_type] || selectedEnquiry.service_type}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-1">Status</p>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                    className={`text-xs rounded-lg px-2 py-1 border-0 cursor-pointer ${
                      selectedEnquiry.status === 'new'
                        ? 'bg-green-500/20 text-green-400'
                        : selectedEnquiry.status === 'read'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <p className="text-slate-500 text-xs mb-1">Message</p>
                <p className="text-slate-300 text-sm bg-slate-900 rounded-lg p-4">
                  {selectedEnquiry.message}
                </p>
              </div>

              <div className="text-xs text-slate-500">
                Submitted: {new Date(selectedEnquiry.created_at).toLocaleString()}
                {selectedEnquiry.ip_address && ` | IP: ${selectedEnquiry.ip_address}`}
              </div>

              {/* Comments */}
              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare size={16} />
                  Comments
                </h3>

                {selectedEnquiry.comments?.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {selectedEnquiry.comments.map((c) => (
                      <div key={c.id} className="bg-slate-900 rounded-lg p-3">
                        <p className="text-slate-300 text-sm">{c.comment}</p>
                        <p className="text-slate-500 text-xs mt-2">
                          {c.user?.name || 'Admin'} - {new Date(c.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm mb-4">No comments yet</p>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={submittingComment || !comment.trim()}
                    className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminEnquiries
