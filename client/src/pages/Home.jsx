import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  ArrowRight, Monitor, LayoutDashboard, Cpu, CheckCircle,
  TrendingUp, Star, ChevronLeft, ChevronRight, Layers, Globe2, FileText,
} from 'lucide-react'
import { SERVICES, COMPANY_INFO, SERVICE_TYPE_LABELS } from '../utils/constants'
import { projectAPI, testimonialAPI, STORAGE_URL } from '../utils/api'
import FaqSection from '../components/FaqSection'

const iconMap = { Monitor, LayoutDashboard, Cpu }

const USE_CASES = [
  'Machine monitoring and alerting systems',
  'Operator dashboards and control panels',
  'Device and fleet management software',
  'Sensor data collection and visualization',
  'Edge-to-cloud data pipelines with usable front ends',
  'Internal operational tools for connected environments',
  'Real-time monitoring for field or industrial systems',
  'Software for connected products in development or production',
]

const DIFFERENTIATORS = [
  {
    icon: Layers,
    title: 'Systems perspective',
    desc: 'We think about your full stack — software, communication layer, hardware context — not just the screens we deliver.',
  },
  {
    icon: Cpu,
    title: 'Operational awareness',
    desc: 'Industrial and operational software has different reliability requirements than consumer apps. We know the difference.',
  },
  {
    icon: Globe2,
    title: 'Remote-capable',
    desc: 'We have delivered hardware-integrated systems to clients who never visited our office. We know what documentation and communication that requires.',
  },
]

const PROCESS_STEPS = [
  { step: '01', title: 'Discovery', desc: 'A technical conversation about your product, environment, constraints, and goals. No assumptions, no templates.' },
  { step: '02', title: 'Architecture document', desc: 'A written plan — what we will build, how it connects, the technology stack, milestones, and what we need from you. You approve it before we write code.' },
  { step: '03', title: 'Sprint delivery', desc: 'Work progresses in short cycles with regular demos. You see working software before it ships.' },
  { step: '04', title: 'Handover with documentation', desc: 'Working software, source code, and deployment documentation. You own everything, fully.' },
  { step: '05', title: 'Post-deployment support', desc: 'We stay available after launch for the period that matters. Ongoing maintenance available if the system requires it.' },
]

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(mq.matches)
    const handler = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const itemsPerView = isDesktop ? 3 : 1
  const maxIndex = Math.max(0, testimonials.length - itemsPerView)

  useEffect(() => {
    setTestimonialIndex(i => Math.min(i, maxIndex))
  }, [maxIndex])

  const prevTestimonial = () => setTestimonialIndex(i => Math.max(0, i - 1))
  const nextTestimonial = () => setTestimonialIndex(i => Math.min(maxIndex, i + 1))

  useEffect(() => {
    projectAPI.getPublic()
      .then((data) => {
        const featured = (data.projects || []).filter((p) => p.featured).slice(0, 4)
        setFeaturedProjects(featured)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    testimonialAPI.getPublic()
      .then((data) => setTestimonials(data.testimonials || []))
      .catch(() => {})
  }, [])

  return (
    <>
      <Helmet>
        <title>Shueki Tech | Software for Connected Products and Operations</title>
        <meta name="description" content="Shueki Tech builds desktop applications, web dashboards, and control interfaces for companies working with devices, machines, sensors, and operational systems. Based in Punjab, India — serving global clients." />
        <link rel="canonical" href="https://shuekitech.com/" />
      </Helmet>
      <div className="min-h-screen">

        {/* ── Hero ──────────────────────────────────────────────── */}
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
                    Specialized. Technical. Connected.
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  Software That Works with Devices, Machines, and Edge Systems
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
                  We design and build desktop applications, web dashboards, and control interfaces — for companies whose software needs to connect with hardware, sensors, devices, or operational environments.
                </p>

                <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-10 text-gray-600 dark:text-slate-300 text-sm sm:text-base">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-accent flex-shrink-0" size={18} />
                    <span>{COMPANY_INFO.stats.projects} Projects Delivered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-accent flex-shrink-0" size={18} />
                    <span>{COMPANY_INFO.stats.clients} Clients</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-accent flex-shrink-0" size={18} />
                    <span>{COMPANY_INFO.stats.experience} Years Experience</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/contact" className="btn-primary">
                    Discuss Your System
                  </Link>
                  <Link to="/projects" className="btn-secondary">
                    See Our Work
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

        {/* ── Trust Band ────────────────────────────────────────── */}
        <section className="py-12 bg-white dark:bg-slate-900 border-y border-gray-100 dark:border-slate-800">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <p className="text-lg sm:text-xl font-display font-semibold text-gray-900 dark:text-white mb-3">
                  We go further than the screen.
                </p>
                <p className="text-gray-600 dark:text-slate-400 text-base max-w-2xl mx-auto">
                  Most software vendors deliver polished interfaces and stop there. We build software that integrates with the real world — industrial equipment, sensor networks, IoT gateways, and operational environments where reliability and precision matter. That combination of software craft and hardware understanding is what makes us different.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── What We Build ─────────────────────────────────────── */}
        <section className="section-padding bg-gray-50 dark:bg-slate-950">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                What We Build
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                Three focused deliverables. One connected offer.
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
                    <Link to="/what-we-build" className="block card-hover group h-full">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                        {Icon && <Icon className="text-white" size={24} />}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-accent transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 leading-relaxed">
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

            <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-8 max-w-xl mx-auto">
              These are not three separate products. They are three forms of the same work: software that sits close to real-world systems and makes them usable, visible, and controllable.
            </p>

            <div className="text-center mt-8">
              <Link to="/what-we-build" className="btn-primary inline-flex items-center gap-2">
                See Full Detail
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── How We Help ───────────────────────────────────────── */}
        <section className="section-padding bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                What we get called for
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                We work with teams building systems that have both a software side and a real-world side.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {USE_CASES.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700"
                >
                  <CheckCircle className="text-accent flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-gray-700 dark:text-slate-300">{useCase}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Differentiator ────────────────────────────────────── */}
        <section className="section-padding bg-gray-50 dark:bg-slate-950">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-6">
                Software depth. Systems thinking. Hardware awareness.
              </h2>
              <p className="text-gray-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
                Many teams can build a clean interface. Fewer understand what happens when that interface connects to a PLC, a sensor array, a CAN bus, or a field gateway. We have worked at both ends — software interfaces and the hardware environments they connect to. That means we do not design in a vacuum. Before writing a line of code, we ask about your deployment environment, data formats, hardware constraints, and operational requirements.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {DIFFERENTIATORS.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="card text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="text-accent" size={24} />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Remote Delivery ───────────────────────────────────── */}
        <section className="section-padding bg-white dark:bg-slate-900">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                  Built to work with you, wherever you are
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Our delivery process is designed for remote collaboration — clear, documented, and predictable from start to finish.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PROCESS_STEPS.map((item, index) => (
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

                {/* Location note in last cell */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="card flex items-start gap-3 sm:col-span-2 lg:col-span-1"
                >
                  <FileText className="text-accent flex-shrink-0 mt-1" size={20} />
                  <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                    Based in Punjab, India. Our working hours overlap with EU afternoons and US mornings. Most client collaboration happens async — which, for technical projects, we have found works well.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Featured Projects ─────────────────────────────────── */}
        {featuredProjects.length > 0 && (
          <section className="section-padding bg-gray-50 dark:bg-slate-950">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                  Featured Projects
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Real systems built for real operational environments
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProjects.map((project, index) => {
                  const firstImage = project.images?.[0]
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Link to={`/projects/${project.id}`} className="card flex flex-col group hover:-translate-y-1 hover:shadow-xl transition-all duration-200 block h-full">
                        <div className={`h-28 rounded-lg bg-gradient-to-br ${project.gradient || 'from-blue-500 to-cyan-500'} mb-4 flex items-center justify-center relative overflow-hidden`}>
                          {firstImage ? (
                            <img src={`${STORAGE_URL}/${firstImage}`} alt={project.title} className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-black/10" />
                              <span className="relative text-white font-semibold text-sm px-3 text-center leading-tight">
                                {project.title}
                              </span>
                            </>
                          )}
                        </div>

                        <span className="text-xs bg-primary/10 dark:bg-primary/20 text-accent px-2 py-1 rounded font-medium self-start mb-3">
                          {SERVICE_TYPE_LABELS[project.service_type] || project.service_type}
                        </span>

                        <p className="text-xs text-gray-500 dark:text-slate-500 mb-1 font-medium uppercase tracking-wide line-clamp-1">
                          {project.industry}
                        </p>

                        <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 leading-relaxed line-clamp-3">
                          {project.problem}
                        </p>

                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-lg p-2.5 mt-auto">
                          <div className="flex items-center gap-1 mb-1">
                            <TrendingUp size={11} className="text-green-600 dark:text-green-400" />
                            <span className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider">
                              Outcome
                            </span>
                          </div>
                          <p className="text-xs text-green-800 dark:text-green-300 font-medium leading-relaxed line-clamp-2">
                            {project.result}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              <div className="text-center mt-10">
                <Link to="/projects" className="btn-primary inline-flex items-center gap-2">
                  View All Projects
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Testimonials ──────────────────────────────────────── */}
        {testimonials.length > 0 && (
          <section className="section-padding bg-white dark:bg-slate-900">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                  What Our Clients Say
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Real feedback from the teams we have worked with
                </p>
              </div>

              <div className="relative">
                <button
                  onClick={prevTestimonial}
                  disabled={testimonialIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:text-accent dark:hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-default"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="overflow-hidden">
                  <div
                    className="flex w-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${testimonialIndex * (100 / itemsPerView)}%)` }}
                  >
                    {testimonials.map((t, index) => (
                      <div key={index} className="w-full lg:w-1/3 flex-shrink-0 px-3">
                        <div className="card flex flex-col gap-4 h-full">
                          <div className="flex gap-1">
                            {Array.from({ length: t.rating }).map((_, i) => (
                              <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed flex-1">
                            &ldquo;{t.text}&rdquo;
                          </p>
                          <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-slate-700">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center flex-shrink-0`}>
                              <span className="text-white text-xs font-bold">{t.initials}</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                              <p className="text-xs text-gray-500 dark:text-slate-400">{t.role}, {t.company}</p>
                            </div>
                            <span className="ml-auto text-xs bg-primary/10 dark:bg-primary/20 text-accent px-2 py-1 rounded font-medium whitespace-nowrap">
                              {t.service}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={nextTestimonial}
                  disabled={testimonialIndex === maxIndex}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:text-accent dark:hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-default"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={18} />
                </button>

                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTestimonialIndex(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === testimonialIndex ? 'bg-accent w-5' : 'bg-gray-300 dark:bg-slate-600 w-2'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <FaqSection page="home" />

        {/* ── Final CTA ─────────────────────────────────────────── */}
        <section className="section-padding bg-gradient-to-r from-primary to-accent">
          <div className="container-custom text-center px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Building a connected product or operational system?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-100 mb-4 max-w-2xl mx-auto">
              If you are working on a desktop tool, a monitoring dashboard, or software that needs to communicate with hardware — let us have a technical conversation. No sales pitch. Just an honest discussion about your system.
            </p>
            <p className="text-slate-200 text-sm mb-8">
              Or email us at {COMPANY_INFO.email} — we respond within one business day.
            </p>
            <Link
              to="/contact"
              className="bg-white text-primary hover:bg-slate-100 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 transform hover:scale-105 inline-block text-sm sm:text-base"
            >
              Start the Conversation
            </Link>
          </div>
        </section>

      </div>
    </>
  )
}

export default Home
