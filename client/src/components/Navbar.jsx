import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, Globe, Cog, Brain, CircuitBoard, Smartphone, Lightbulb, Sun, Moon } from 'lucide-react'
import { SERVICES } from '../utils/constants'
import { useTheme } from '../utils/theme'

const iconMap = { Globe, Cog, Brain, CircuitBoard, Smartphone, Lightbulb }

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const dropdownRef = useRef(null)
  const timeoutRef = useRef(null)
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setServicesOpen(false)
    setMobileServicesOpen(false)
  }, [location])

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current)
    setServicesOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setServicesOpen(false), 150)
  }

  const isServicesActive = location.pathname.startsWith('/services')

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-display font-bold text-gray-900 dark:text-white">Shueki Tech</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-accent ${
                location.pathname === '/' ? 'text-accent' : 'text-gray-600 dark:text-slate-300'
              }`}
            >
              Home
            </Link>

            {/* Services Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/services"
                className={`text-sm font-medium transition-colors hover:text-accent flex items-center gap-1 ${
                  isServicesActive ? 'text-accent' : 'text-gray-600 dark:text-slate-300'
                }`}
              >
                Services
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                />
              </Link>

              {servicesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                  {SERVICES.map((service) => {
                    const Icon = iconMap[service.icon]
                    return (
                      <Link
                        key={service.id}
                        to={`/services/${service.id}`}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${
                          location.pathname === `/services/${service.id}`
                            ? 'bg-primary/10 text-accent'
                            : 'text-gray-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          {Icon && <Icon size={16} className="text-accent" />}
                        </div>
                        <p className="text-sm font-medium">{service.title}</p>
                      </Link>
                    )
                  })}
                  <div className="border-t border-gray-200 dark:border-slate-700 mt-1 pt-1">
                    <Link
                      to="/services"
                      className="block px-4 py-2.5 text-xs text-gray-500 dark:text-slate-400 hover:text-accent transition-colors"
                    >
                      View All Services &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-accent ${
                location.pathname === '/about' ? 'text-accent' : 'text-gray-600 dark:text-slate-300'
              }`}
            >
              About
            </Link>

            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors hover:text-accent ${
                location.pathname === '/contact' ? 'text-accent' : 'text-gray-600 dark:text-slate-300'
              }`}
            >
              Contact
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:text-accent hover:border-accent transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <Link to="/contact" className="btn-primary">
              Get Started
            </Link>
          </div>

          {/* Mobile: Theme Toggle + Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:text-accent transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              className="text-gray-900 dark:text-white p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-lg mt-2 border border-gray-200 dark:border-slate-800">
            <Link
              to="/"
              className={`block px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 ${
                location.pathname === '/' ? 'text-accent border-l-4 border-accent' : 'text-gray-700 dark:text-slate-300'
              }`}
            >
              Home
            </Link>

            {/* Mobile Services Accordion */}
            <button
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 ${
                isServicesActive ? 'text-accent border-l-4 border-accent' : 'text-gray-700 dark:text-slate-300'
              }`}
            >
              Services
              <ChevronDown
                size={16}
                className={`transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {mobileServicesOpen && (
              <div className="bg-gray-50 dark:bg-slate-800/50">
                {SERVICES.map((service) => {
                  const Icon = iconMap[service.icon]
                  return (
                    <Link
                      key={service.id}
                      to={`/services/${service.id}`}
                      className="flex items-center gap-3 px-6 py-2.5 text-sm text-gray-600 dark:text-slate-400 hover:text-accent hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {Icon && <Icon size={14} />}
                      {service.title}
                    </Link>
                  )
                })}
                <Link
                  to="/services"
                  className="block px-6 py-2.5 text-xs text-gray-500 dark:text-slate-500 hover:text-accent transition-colors"
                >
                  View All &rarr;
                </Link>
              </div>
            )}

            <Link
              to="/about"
              className={`block px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 ${
                location.pathname === '/about' ? 'text-accent border-l-4 border-accent' : 'text-gray-700 dark:text-slate-300'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`block px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 ${
                location.pathname === '/contact' ? 'text-accent border-l-4 border-accent' : 'text-gray-700 dark:text-slate-300'
              }`}
            >
              Contact
            </Link>

            <div className="px-4 pt-4">
              <Link to="/contact" className="btn-primary w-full block text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
