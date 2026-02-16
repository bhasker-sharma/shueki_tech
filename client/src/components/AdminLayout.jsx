import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Globe,
  Cog,
  Brain,
  CircuitBoard,
  Smartphone,
  Lightbulb,
  Mail,
  ChevronDown,
  Inbox,
} from 'lucide-react'
import { getUser, logout } from '../utils/auth'
import { adminAPI } from '../utils/api'

const AdminLayout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [enquiriesOpen, setEnquiriesOpen] = useState(true)
  const user = getUser()

  const handleLogout = async () => {
    try {
      await adminAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      logout()
      navigate('/admin')
    }
  }

  const enquiryLinks = [
    { name: 'Website Development', path: '/admin/enquiries/web-development', icon: Globe },
    { name: 'Machine Integration', path: '/admin/enquiries/machine-integration', icon: Cog },
    { name: 'AI Pipelines', path: '/admin/enquiries/ai-pipelines', icon: Brain },
    { name: 'PCB Designing', path: '/admin/enquiries/pcb-designing', icon: CircuitBoard },
    { name: 'App Development', path: '/admin/enquiries/app-development', icon: Smartphone },
    { name: 'R&D Consultancy', path: '/admin/enquiries/rd-consultancy', icon: Lightbulb },
    { name: 'General Enquiry', path: '/admin/enquiries/general', icon: Mail },
  ]

  const isActive = (path) => location.pathname === path
  const isEnquiriesActive = location.pathname.startsWith('/admin/enquiries')

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full w-64 bg-slate-800 border-r border-slate-700 z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Shueki Tech Admin</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-slate-400 mt-1">{user?.name}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {/* Dashboard */}
            <Link
              to="/admin/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/dashboard')
                  ? 'bg-primary text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>

            {/* Enquiries (collapsible) */}
            <div>
              <button
                onClick={() => setEnquiriesOpen(!enquiriesOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  isEnquiriesActive
                    ? 'bg-primary/20 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Inbox className="w-5 h-5" />
                  <span className="font-medium">Enquiries</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${enquiriesOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {enquiriesOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {enquiryLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                          isActive(link.path)
                            ? 'bg-primary text-white'
                            : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-slate-800 border-b border-slate-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-300 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="lg:hidden" />
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                View Website
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
