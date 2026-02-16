import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { NAVIGATION_LINKS, COMPANY_INFO, SERVICES } from '../utils/constants'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
      <div className="container-custom py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl">S</span>
              </div>
              <span className="text-xl md:text-2xl font-display font-bold text-gray-900 dark:text-white">
                Shueki Tech
              </span>
            </div>
            <p className="text-gray-500 dark:text-slate-400 text-xs md:text-sm">
              {COMPANY_INFO.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">Quick Links</h3>
            <ul className="space-y-1.5 md:space-y-2">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-500 dark:text-slate-400 hover:text-accent transition-colors text-xs md:text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">Services</h3>
            <ul className="space-y-1.5 md:space-y-2">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services/${service.id}`}
                    className="text-gray-500 dark:text-slate-400 hover:text-accent transition-colors text-xs md:text-sm"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">Contact</h3>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-500 dark:text-slate-400">
              <li>{COMPANY_INFO.address}</li>
              <li className="hidden md:block">{COMPANY_INFO.timezone}</li>
              <li>
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="hover:text-accent transition-colors break-all flex items-center gap-1"
                >
                  <Mail size={12} />
                  {COMPANY_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 dark:text-slate-400 text-sm">
              &copy; {currentYear} Shueki Tech. All rights reserved.
            </p>
            <Link
              to="/admin"
              className="text-gray-400 dark:text-slate-500 hover:text-accent transition-colors text-xs"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
