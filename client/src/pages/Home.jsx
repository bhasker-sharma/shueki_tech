import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Globe, Cog, Brain, CircuitBoard, Smartphone, Lightbulb } from 'lucide-react'
import { SERVICES, COMPANY_INFO } from '../utils/constants'

const iconMap = { Globe, Cog, Brain, CircuitBoard, Smartphone, Lightbulb }

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center hero-gradient pt-20 pb-8">
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block mb-6 px-4 py-2 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-full">
                <span className="text-accent text-sm font-semibold">
                  Precision Engineering for Global Clients
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {COMPANY_INFO.tagline}
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                From web applications to industrial automation, AI pipelines to PCB design
                — we deliver end-to-end engineering solutions.
              </p>

              <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-10 text-gray-600 dark:text-slate-300 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-accent flex-shrink-0" size={18} />
                  <span>{COMPANY_INFO.stats.projects} Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-accent flex-shrink-0" size={18} />
                  <span>{COMPANY_INFO.stats.clients} Clients</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-accent flex-shrink-0" size={18} />
                  <span>{COMPANY_INFO.stats.experience} Years</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/services" className="btn-primary">
                  Explore Services
                </Link>
                <Link to="/contact" className="btn-secondary">
                  Get in Touch
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center">
            <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-gray-50 dark:bg-slate-950">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              What We Do
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Six core services to take your ideas from concept to reality
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, index) => {
              const Icon = iconMap[service.icon]
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/services/${service.id}`} className="block card-hover group">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                      {Icon && <Icon className="text-white" size={24} />}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.tech.slice(0, 3).map((t) => (
                        <span key={t} className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 px-2 py-1 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="btn-primary inline-flex items-center gap-2">
              View All Services
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Shueki Tech?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: COMPANY_INFO.stats.projects, label: 'Projects Delivered' },
              { value: COMPANY_INFO.stats.clients, label: 'Happy Clients' },
              { value: COMPANY_INFO.stats.experience, label: 'Years Experience' },
              { value: '6', label: 'Core Services' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center card"
              >
                <div className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-600 dark:text-slate-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-accent">
        <div className="container-custom text-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Ready to Build Your Next Project?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-100 mb-8 max-w-2xl mx-auto">
            Tell us about your requirements and we&apos;ll get back to you within 24 hours
          </p>
          <Link
            to="/contact"
            className="bg-white text-primary hover:bg-slate-100 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 transform hover:scale-105 inline-block text-sm sm:text-base"
          >
            Get Free Consultation
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
