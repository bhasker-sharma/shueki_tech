import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Inbox, TrendingUp, Clock } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { adminAPI } from '../utils/api'
import { SERVICE_TYPE_LABELS } from '../utils/constants'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getStats()
      setStats(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading dashboard...</div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
          <p className="text-red-300">Error loading dashboard: {error}</p>
        </div>
      </AdminLayout>
    )
  }

  const serviceTypes = [
    'web-development',
    'machine-integration',
    'ai-pipelines',
    'pcb-designing',
    'app-development',
    'rd-consultancy',
    'general',
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Overview of all enquiries</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total Enquiries</p>
                <p className="text-3xl font-bold mt-2">{stats?.total || 0}</p>
              </div>
              <Inbox className="w-12 h-12 opacity-50" />
            </div>
          </div>

          <div className="bg-green-500/10 text-green-400 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">New (Unread)</p>
                <p className="text-3xl font-bold mt-2">{stats?.new || 0}</p>
              </div>
              <TrendingUp className="w-12 h-12 opacity-50" />
            </div>
          </div>

          <div className="bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Today</p>
                <p className="text-3xl font-bold mt-2">{stats?.today || 0}</p>
              </div>
              <Clock className="w-12 h-12 opacity-50" />
            </div>
          </div>
        </div>

        {/* Per-Service Stats */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Enquiries by Service</h2>
          </div>
          <div className="divide-y divide-slate-700">
            {serviceTypes.map((type) => {
              const data = stats?.by_service?.[type]
              return (
                <Link
                  key={type}
                  to={`/admin/enquiries/${type}`}
                  className="flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors"
                >
                  <span className="text-slate-300 font-medium">
                    {SERVICE_TYPE_LABELS[type]}
                  </span>
                  <div className="flex items-center gap-4">
                    {data?.new > 0 && (
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                        {data.new} new
                      </span>
                    )}
                    <span className="text-slate-400 text-sm">{data?.total || 0} total</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Recent Enquiries</h2>
          </div>
          <div className="divide-y divide-slate-700">
            {stats?.recent?.length > 0 ? (
              stats.recent.map((enquiry) => (
                <Link
                  key={enquiry.id}
                  to={`/admin/enquiries/${enquiry.service_type}`}
                  className="block p-4 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{enquiry.full_name}</h3>
                      <p className="text-sm text-slate-400 mt-1">{enquiry.email}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                          {SERVICE_TYPE_LABELS[enquiry.service_type] || enquiry.service_type}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        enquiry.status === 'new'
                          ? 'bg-green-500/20 text-green-400'
                          : enquiry.status === 'read'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}
                    >
                      {enquiry.status}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">No enquiries yet</div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
