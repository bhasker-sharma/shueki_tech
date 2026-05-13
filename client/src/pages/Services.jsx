import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Monitor, LayoutDashboard, Cpu, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react'
import Hero from '../components/Hero'
import { SERVICES } from '../utils/constants'

const iconMap = { Monitor, LayoutDashboard, Cpu }

const WHERE_EDGE_FITS = [
  'PLC connectivity and machine data collection',
  'MQTT and OPC-UA device integration',
  'IoT sensor pipeline development',
  'Gateway software and middleware',
  'Hardware-to-cloud data flows',
  'Serial and industrial bus interfaces',
]

const USE_CASES = [
  {
    title: 'Machine Monitoring System',
    desc: 'A desktop or web interface that pulls live data from PLCs or sensors. Displays real-time readings, logs history, and sends alerts when parameters go out of range.',
  },
  {
    title: 'Device Management Dashboard',
    desc: 'A web portal for managing deployed devices at scale: status overview, remote configuration, alert handling, and data export.',
  },
  {
    title: 'Operator Control Interface',
    desc: 'A purpose-built desktop or touchscreen interface for machine operators. Designed around operational context — fast, clear, and reliable.',
  },
  {
    title: 'Sensor Data Pipeline with Visualization',
    desc: 'End-to-end: edge data collection from sensors, transmission to a backend, and a web or desktop front end for viewing, filtering, and acting on that data.',
  },
  {
    title: 'Connected Product Software',
    desc: 'Software that ships alongside a hardware product: desktop configuration tool, cloud dashboard, or interface for field technicians.',
  },
  {
    title: 'Internal Operational Tool',
    desc: 'Custom software to replace spreadsheets, paper logs, or legacy systems in an operation involving physical assets or hardware-connected processes.',
  },
]

const ENGAGEMENT_STEPS = [
  {
    step: '01',
    title: 'Discovery',
    desc: 'A structured technical conversation about your system, users, deployment environment, data sources, hardware context, and goals. This is where we learn what you are actually building.',
  },
  {
    step: '02',
    title: 'Architecture document',
    desc: 'A written plan: what we will build, how it connects to your systems or hardware, the technology stack, milestones, and dependencies. You review and approve before development starts.',
  },
  {
    step: '03',
    title: 'Sprint delivery',
    desc: 'Development in short, reviewable cycles. You see working software early and often. Nothing is final until you have seen it.',
  },
  {
    step: '04',
    title: 'Integration and testing',
    desc: 'For hardware-connected systems, we test against real data sources where possible and document protocols, edge cases, and configuration requirements.',
  },
  {
    step: '05',
    title: 'Handover',
    desc: 'Delivered software, source code, deployment documentation, and a technical handover session. You own everything with no ongoing dependency on us unless you choose it.',
  },
  {
    step: '06',
    title: 'Post-deployment support',
    desc: 'A defined support window for bug fixes and questions. Ongoing maintenance available for systems that require it.',
  },
]

const DELIVERY_AREAS = [
  'Manufacturing and industrial operations',
  'IoT and connected product companies',
  'Internal enterprise tools for field-connected teams',
  'Monitoring and control systems for infrastructure operators',
  'Startups building connected hardware products',
  'Operations teams replacing manual processes with software',
]

const Services = () => {
  return (
    <>
      <Helmet>
        <title>What We Build | Desktop Apps, Web Dashboards & Edge Integration — Shueki Tech</title>
        <meta name="description" content="Shueki Tech builds desktop applications, web dashboards, and control interfaces for companies working with devices, machines, sensors, and operational systems." />
        <link rel="canonical" href="https://shuekitech.com/what-we-build" />
      </Helmet>
      <div className="min-h-screen">

        <Hero
          title="Software for Connected Products and Operations"
          subtitle="What We Build"
          description="We build software that works in the real world — where screens connect to devices, machines, sensors, and operational environments."
        />

        {/* ── Overview ──────────────────────────────────────────── */}
        <section className="section-padding bg-white dark:bg-slate-950">
          <div className="container-custom max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400 leading-relaxed">
                Shueki Tech builds desktop applications, web dashboards, and control interfaces for companies working with devices, machines, sensors, and operational systems. Our work sits at the boundary between software and hardware — and we understand both sides. Whether you are building a connected product, managing deployed equipment, or running operations that depend on real-time data — we build the software that makes it usable, visible, and controllable.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Three Services ────────────────────────────────────── */}
        <section className="section-padding bg-gray-50 dark:bg-slate-900">
          <div className="container-custom">
            <div className="space-y-12">
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
                    className={`card group ${!isEven ? 'bg-white dark:bg-slate-800/40' : ''}`}
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                        {Icon && <Icon className="text-white" size={28} />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                              {service.title}
                            </h2>
                            <p className="text-sm text-accent font-medium mt-0.5">{service.tagline}</p>
                          </div>
                          <Link
                            to={`/what-we-build/${service.id}`}
                            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-accent border border-accent/30 px-3 py-1.5 rounded-lg hover:bg-accent/10 transition-colors flex-shrink-0"
                          >
                            Full detail
                            <ExternalLink size={12} />
                          </Link>
                        </div>

                        <p className="text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
                          {service.overview}
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                              Capabilities
                            </h4>
                            <ul className="space-y-2">
                              {service.features.map((f) => (
                                <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                                  <CheckCircle className="text-accent flex-shrink-0 mt-0.5" size={14} />
                                  {f}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                              Built for
                            </h4>
                            <ul className="space-y-2">
                              {service.useCases.map((uc) => (
                                <li key={uc} className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                                  <ArrowRight className="text-accent flex-shrink-0 mt-0.5" size={14} />
                                  {uc}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
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
                          <Link
                            to={`/what-we-build/${service.id}`}
                            className="sm:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-accent border border-accent/30 px-3 py-1.5 rounded-lg hover:bg-accent/10 transition-colors"
                          >
                            Full detail
                            <ExternalLink size={12} />
                          </Link>
                          <Link
                            to={`/what-we-build/${service.id}`}
                            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
                          >
                            Discuss this with us
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Where Edge Integration Fits ───────────────────────── */}
        <section className="section-padding bg-white dark:bg-slate-950">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                  When you need more than a screen
                </h2>
                <p className="text-gray-600 dark:text-slate-400 mb-4 leading-relaxed">
                  Some projects are purely software. You need a dashboard — we build it. But many of our clients are building systems where the software connects to something physical: a machine on the factory floor, a sensor in the field, a gateway in a cabinet.
                </p>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                  We do not treat hardware integration as an add-on or a separate engagement. We treat it as part of software architecture. We ask about it early, plan for it in the design phase, and handle the integration as part of the same delivery. That means fewer surprises when the system goes live.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="card"
              >
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Cpu className="text-accent" size={20} />
                  Edge integration covers
                </h3>
                <ul className="space-y-3">
                  {WHERE_EDGE_FITS.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-400">
                      <CheckCircle className="text-accent flex-shrink-0" size={14} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Delivery Areas ────────────────────────────────────── */}
        <section className="section-padding bg-gray-50 dark:bg-slate-900">
          <div className="container-custom">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Where we work
              </h2>
              <p className="text-gray-600 dark:text-slate-400 max-w-xl mx-auto">
                Industries and contexts where we consistently deliver.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {DELIVERY_AREAS.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700"
                >
                  <CheckCircle className="text-accent flex-shrink-0" size={16} />
                  <p className="text-sm text-gray-700 dark:text-slate-300">{area}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Typical Use Cases ─────────────────────────────────── */}
        <section className="section-padding bg-white dark:bg-slate-950">
          <div className="container-custom">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Typical use cases
              </h2>
              <p className="text-gray-600 dark:text-slate-400 max-w-xl mx-auto">
                Examples of the systems we have built or are asked to build.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {USE_CASES.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  viewport={{ once: true }}
                  className="card"
                >
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Engagement Approach ───────────────────────────────── */}
        <section className="section-padding bg-gray-50 dark:bg-slate-900">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                How a project works with us
              </h2>
              <p className="text-gray-600 dark:text-slate-400 max-w-xl mx-auto">
                A process built for remote collaboration and technical precision.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ENGAGEMENT_STEPS.map((item, index) => (
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

        {/* ── CTA ───────────────────────────────────────────────── */}
        <section className="section-padding bg-gradient-to-r from-primary to-accent">
          <div className="container-custom text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Ready to discuss your system?
            </h2>
            <p className="text-base sm:text-lg text-slate-100 mb-8 max-w-2xl mx-auto">
              Tell us what you are building — the software layer, the hardware context, and where you are in the process. We will tell you honestly whether and how we can help.
            </p>
            <Link
              to="/contact"
              className="bg-white text-primary hover:bg-slate-100 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Start the Conversation
            </Link>
          </div>
        </section>

      </div>
    </>
  )
}

export default Services
