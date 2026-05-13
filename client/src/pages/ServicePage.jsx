import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Monitor, LayoutDashboard, Cpu, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { SERVICES } from '../utils/constants'
import EnquiryForm from '../components/EnquiryForm'

const iconMap = { Monitor, LayoutDashboard, Cpu }

const ServicePage = () => {
  const { serviceId } = useParams()
  const service = SERVICES.find((s) => s.id === serviceId)

  if (!service) return <Navigate to="/what-we-build" replace />

  const Icon = iconMap[service.icon]
  const otherServices = SERVICES.filter((s) => s.id !== service.id)

  return (
    <>
      <Helmet>
        <title>{service.meta.title}</title>
        <meta name="description" content={service.meta.description} />
        <link rel="canonical" href={`https://shuekitech.com/what-we-build/${service.id}`} />
      </Helmet>
      <div className="min-h-screen">

        {/* ── Hero ────────────────────────────────────────────── */}
        <section className="hero-gradient pt-32 pb-16">
          <div className="container-custom">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <Link
                to="/what-we-build"
                className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-accent transition-colors"
              >
                <ArrowLeft size={14} />
                What We Build
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                  {Icon && <Icon className="text-white" size={28} />}
                </div>
                <div>
                  <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-1">
                    {service.tagline}
                  </p>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">
                    {service.title}
                  </h1>
                </div>
              </div>

              <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 leading-relaxed">
                {service.overview}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Capabilities + Use Cases ────────────────────────── */}
        <section className="section-padding bg-white dark:bg-slate-950">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12">

              {/* Capabilities */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-6">
                  What this covers
                </h2>
                <ul className="space-y-4">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="text-accent flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-gray-700 dark:text-slate-300">{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Built for */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-6">
                  Built for
                </h2>
                <ul className="space-y-4">
                  {service.useCases.map((uc, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <ArrowRight className="text-accent flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-gray-700 dark:text-slate-300">{uc}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Process Steps ───────────────────────────────────── */}
        <section className="section-padding bg-gray-50 dark:bg-slate-900">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                How we deliver this
              </h2>
              <p className="text-gray-600 dark:text-slate-400 max-w-xl mx-auto">
                A clear process, documented at every stage, designed for remote collaboration.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.processSteps.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="card"
                >
                  <div className="text-3xl font-display font-bold gradient-text mb-3">{item.step}</div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tech Stack ──────────────────────────────────────── */}
        <section className="py-12 bg-white dark:bg-slate-950 border-y border-gray-100 dark:border-slate-800">
          <div className="container-custom">
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider flex-shrink-0">
                Technology stack
              </p>
              <div className="flex flex-wrap gap-2">
                {service.tech.map((t) => (
                  <span
                    key={t}
                    className="text-sm text-accent/80 border border-accent/25 px-3 py-1 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Enquiry Form + Other Services ───────────────────── */}
        <section className="section-padding bg-gray-50 dark:bg-slate-900">
          <div className="container-custom">
            <div className="grid lg:grid-cols-5 gap-12">

              {/* Enquiry Form — takes up more space */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="lg:col-span-3"
              >
                <div className="card">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
                    Discuss your {service.title.toLowerCase()} project
                  </h2>
                  <p className="text-gray-600 dark:text-slate-400 text-sm mb-6">
                    Tell us what you are building and we will get back to you within one business day.
                    No sales pitch — just an honest conversation about your system.
                  </p>
                  <EnquiryForm serviceType={service.id} />
                </div>
              </motion.div>

              {/* Other services sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="lg:col-span-2 space-y-4"
              >
                <p className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Also part of what we build
                </p>
                {otherServices.map((s) => {
                  const OtherIcon = iconMap[s.icon]
                  return (
                    <Link
                      key={s.id}
                      to={`/what-we-build/${s.id}`}
                      className="card flex items-start gap-4 group hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 block"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        {OtherIcon && <OtherIcon className="text-accent" size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-accent transition-colors mb-1">
                          {s.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {s.tagline}
                        </p>
                      </div>
                      <ArrowRight size={14} className="text-gray-400 group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
                    </Link>
                  )
                })}

                <div className="card bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 border-accent/20">
                  <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed mb-3">
                    Not sure which service fits? Start with a discovery conversation and we will help you figure it out.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
                  >
                    Talk to us
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

      </div>
    </>
  )
}

export default ServicePage
