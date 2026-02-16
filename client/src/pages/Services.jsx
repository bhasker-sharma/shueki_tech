import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, Cog, Brain, CircuitBoard, Smartphone, Lightbulb, ArrowRight } from 'lucide-react'
import Hero from '../components/Hero'
import { SERVICES } from '../utils/constants'

const iconMap = { Globe, Cog, Brain, CircuitBoard, Smartphone, Lightbulb }

const Services = () => {
  return (
    <div className="min-h-screen">
      <Hero
        title="Our Services"
        subtitle="What We Offer"
        description="Six core engineering services to take your ideas from concept to reality. Click any service to learn more and get in touch."
      />

      {/* Services Grid */}
      <section className="section-padding bg-white dark:bg-slate-950">
        <div className="container-custom">
          <div className="space-y-8">
            {SERVICES.map((service, index) => {
              const Icon = iconMap[service.icon]
              const isEven = index % 2 === 0

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/services/${service.id}`}
                    className={`block card-hover group ${
                      !isEven ? 'bg-gray-50 dark:bg-slate-800/30' : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                        {Icon && <Icon className="text-white" size={28} />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-accent transition-colors">
                              {service.title}
                            </h2>
                            <p className="text-gray-600 dark:text-slate-400 mb-4">
                              {service.description}
                            </p>
                          </div>
                          <ArrowRight
                            size={20}
                            className="text-gray-400 dark:text-slate-500 group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0 mt-2 hidden sm:block"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {service.features.slice(0, 3).map((f) => (
                            <span key={f} className="text-xs text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded">
                              {f}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {service.tech.map((t) => (
                            <span
                              key={t}
                              className="text-xs text-accent/70 border border-accent/20 px-2 py-0.5 rounded"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-primary to-accent">
        <div className="container-custom text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Not Sure Which Service You Need?
          </h2>
          <p className="text-base sm:text-lg text-slate-100 mb-8 max-w-2xl mx-auto">
            Contact us and we&apos;ll help you figure out the best approach for your project.
          </p>
          <Link
            to="/contact"
            className="bg-white text-primary hover:bg-slate-100 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Get Free Consultation
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Services
