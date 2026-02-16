import { lazy, Suspense, Component } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Admin pages
const Admin = lazy(() => import('./pages/Admin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminEnquiries = lazy(() => import('./pages/AdminEnquiries'))

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
    <div className="text-center">
      <div className="spinner mx-auto mb-4"></div>
      <p className="text-slate-500 dark:text-slate-400">Loading...</p>
    </div>
  </div>
)

// Error Boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We&apos;re sorry for the inconvenience. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Layout wrapper
const Layout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
)

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Admin routes - no navbar/footer */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/enquiries/:serviceType" element={
                <ProtectedRoute><AdminEnquiries /></ProtectedRoute>
              } />

              {/* Public routes - with navbar/footer */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/services" element={<Layout><Services /></Layout>} />
              <Route path="/services/:serviceId" element={<Layout><ServiceDetail /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </Suspense>
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  )
}

export default App
