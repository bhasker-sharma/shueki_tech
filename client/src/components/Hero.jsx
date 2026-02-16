import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

const Hero = ({
  title,
  subtitle,
  description,
  ctaText,
  ctaLink,
  children,
  className = ''
}) => {
  return (
    <section className={`relative min-h-[60vh] flex items-center hero-gradient pt-24 pb-8 ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {subtitle && (
              <div className="inline-block mb-4 px-4 py-2 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-full">
                <span className="text-accent text-sm font-semibold">{subtitle}</span>
              </div>
            )}

            <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6 text-shadow">
              {title}
            </h1>

            {description && (
              <p className="text-lg md:text-xl text-gray-600 dark:text-slate-300 mb-8 max-w-2xl">
                {description}
              </p>
            )}

            {ctaText && ctaLink && (
              <a href={ctaLink} className="btn-primary inline-block">
                {ctaText}
              </a>
            )}
          </motion.div>

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  ctaText: PropTypes.string,
  ctaLink: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
}

export default Hero
