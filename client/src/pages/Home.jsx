import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Globe, Cog, Brain, CircuitBoard, Smartphone, Lightbulb, TrendingUp, Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { SERVICES, COMPANY_INFO, SERVICE_TYPE_LABELS } from '../utils/constants'
import { projectAPI, testimonialAPI, faqAPI, STORAGE_URL } from '../utils/api'

const iconMap = { Globe, Cog, Brain, CircuitBoard, Smartphone, Lightbulb }

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [faqs, setFaqs] = useState([])
  const [openFaq, setOpenFaq] = useState(null)
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
      .catch(() => { /* silently skip if API unavailable */ })
  }, [])

  useEffect(() => {
    testimonialAPI.getPublic()
      .then((data) => setTestimonials(data.testimonials || []))
      .catch(() => { /* silently skip if API unavailable */ })
  }, [])

  useEffect(() => {
    faqAPI.getPublic('home')
      .then((data) => setFaqs(data.faqs || []))
      .catch(() => { /* silently skip if API unavailable */ })
  }, [])

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

      {/* Testimonials — only rendered when data is available from the DB */}
      {testimonials.length > 0 && <section className="section-padding bg-white dark:bg-slate-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Real feedback from the teams we&apos;ve worked with
            </p>
          </div>

          {/* Slider wrapper */}
          <div className="relative">
            {/* Prev button */}
            <button
              onClick={prevTestimonial}
              disabled={testimonialIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:text-accent dark:hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-default"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Track — w-full is critical so translateX % is relative to the container */}
            <div className="overflow-hidden">
              <div
                className="flex w-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${testimonialIndex * (100 / itemsPerView)}%)` }}
              >
                {testimonials.map((t, index) => (
                  <div
                    key={index}
                    className="w-full lg:w-1/3 flex-shrink-0 px-3"
                  >
                    <div className="card flex flex-col gap-4 h-full">
                      {/* Stars */}
                      <div className="flex gap-1">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed flex-1">
                        &ldquo;{t.text}&rdquo;
                      </p>

                      {/* Author */}
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

            {/* Next button */}
            <button
              onClick={nextTestimonial}
              disabled={testimonialIndex === maxIndex}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:text-accent dark:hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-default"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>

            {/* Dot indicators — count changes with itemsPerView */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === testimonialIndex
                      ? 'bg-accent w-5'
                      : 'bg-gray-300 dark:bg-slate-600 w-2'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>}

      {/* Featured Projects — only rendered when there are published+featured projects */}
      {featuredProjects.length > 0 && (
        <section className="section-padding bg-gray-50 dark:bg-slate-950">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Featured Projects
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                A snapshot of problems we&apos;ve solved across industries
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
                    {/* Banner */}
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

      {/* FAQ Preview — only rendered when FAQs with page=home exist in the DB */}
      {faqs.length > 0 && (
        <section className="section-padding bg-gray-50 dark:bg-slate-950">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                Quick answers to the questions we hear most often
              </p>
            </div>

            <div className="max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-slate-700">
              {faqs.map((faq, index) => (
                <div key={faq.id} className="py-4">
                  <button
                    className="w-full flex items-center justify-between gap-4 text-left group"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                      {faq.question}
                    </span>
                    {openFaq === index
                      ? <ChevronUp size={18} className="text-accent flex-shrink-0" />
                      : <ChevronDown size={18} className="text-gray-400 dark:text-slate-500 flex-shrink-0" />
                    }
                  </button>
                  {openFaq === index && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 text-sm text-gray-600 dark:text-slate-400 leading-relaxed"
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
