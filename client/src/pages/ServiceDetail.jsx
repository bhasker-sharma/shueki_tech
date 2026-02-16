import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, Cog, Brain, CircuitBoard, Smartphone, Lightbulb, CheckCircle, ArrowRight } from 'lucide-react'
import Hero from '../components/Hero'
import EnquiryForm from '../components/EnquiryForm'
import { SERVICES } from '../utils/constants'

const iconMap = { Globe, Cog, Brain, CircuitBoard, Smartphone, Lightbulb }

// Extended content for each service
const serviceContent = {
  'web-development': {
    heroSubtitle: 'Web Solutions',
    heroDescription: 'Custom web applications built with modern frameworks, designed for performance, scalability, and exceptional user experience.',
    overview: 'We build full-stack web applications that power businesses. From e-commerce platforms handling thousands of transactions to custom admin dashboards and client portals, our team delivers production-ready solutions using industry-leading technologies.',
    process: [
      { title: 'Requirements Analysis', desc: 'We start by understanding your business goals, target users, and technical requirements to create a detailed project roadmap.' },
      { title: 'UI/UX Design', desc: 'Our design process focuses on intuitive interfaces and seamless user experiences that drive engagement and conversions.' },
      { title: 'Development & Testing', desc: 'Agile development with continuous integration, automated testing, and regular demos to ensure quality at every stage.' },
      { title: 'Deployment & Support', desc: 'Cloud deployment with monitoring, performance optimization, and ongoing maintenance support.' },
    ],
    useCases: [
      'SaaS platforms and web applications',
      'E-commerce stores with payment gateways',
      'Customer portals and dashboards',
      'Content management systems',
      'API development and integrations',
      'Progressive Web Apps (PWA)',
    ],
  },
  'machine-integration': {
    heroSubtitle: 'Industrial Automation',
    heroDescription: 'End-to-end industrial automation solutions from PLC programming to robotic cell integration for smart manufacturing.',
    overview: 'We specialize in connecting the physical world with digital systems. Our automation solutions span from simple PLC-based control systems to complex multi-robot manufacturing cells with real-time monitoring and data analytics.',
    process: [
      { title: 'System Assessment', desc: 'Evaluate existing infrastructure, identify automation opportunities, and define performance targets.' },
      { title: 'Architecture Design', desc: 'Design control system architecture, communication protocols, and integration points with existing systems.' },
      { title: 'Implementation', desc: 'PLC/SCADA programming, HMI development, robotic integration, and sensor deployment.' },
      { title: 'Commissioning', desc: 'System testing, operator training, documentation, and production handover with support.' },
    ],
    useCases: [
      'PLC and SCADA system programming',
      'Robotic cell integration and commissioning',
      'IoT-enabled machine monitoring dashboards',
      'Conveyor and material handling automation',
      'Quality inspection systems',
      'Production data analytics and OEE tracking',
    ],
  },
  'ai-pipelines': {
    heroSubtitle: 'Artificial Intelligence',
    heroDescription: 'Custom AI solutions from ML model training to production-ready data pipelines that transform your business with intelligent automation.',
    overview: 'We build end-to-end AI solutions that solve real business problems. From training custom machine learning models to deploying production data pipelines, our team combines deep technical expertise with practical business understanding.',
    process: [
      { title: 'Data Assessment', desc: 'Evaluate your data sources, quality, and volume to determine the best AI approach for your use case.' },
      { title: 'Model Development', desc: 'Train and validate custom ML models using your data, with iterative refinement for optimal performance.' },
      { title: 'Pipeline Architecture', desc: 'Design scalable data pipelines for ingestion, processing, model inference, and result delivery.' },
      { title: 'Deployment & Monitoring', desc: 'Deploy models to production with monitoring, retraining schedules, and performance dashboards.' },
    ],
    useCases: [
      'Custom ML model training and deployment',
      'Natural language processing (chatbots, text analysis)',
      'Computer vision (object detection, quality inspection)',
      'Predictive analytics and forecasting',
      'AI-powered workflow automation',
      'Document processing and data extraction',
    ],
  },
  'pcb-designing': {
    heroSubtitle: 'Electronics Design',
    heroDescription: 'Professional PCB design services from concept to manufacturing-ready outputs, with expertise in multi-layer boards and high-speed design.',
    overview: 'Our PCB design team brings decades of combined experience in electronics design. We handle everything from simple 2-layer boards to complex 8-layer designs with high-speed signals, mixed analog-digital circuits, and power electronics.',
    process: [
      { title: 'Schematic Design', desc: 'Component selection, schematic capture, and design review with simulation where needed.' },
      { title: 'PCB Layout', desc: 'Component placement, routing, impedance control, DFM analysis, and design rule checks.' },
      { title: 'Prototyping', desc: 'Manufacturing file generation, prototype ordering, assembly coordination, and initial testing.' },
      { title: 'Production Support', desc: 'BOM optimization, manufacturer liaison, production testing, and design-for-manufacturing refinement.' },
    ],
    useCases: [
      'IoT device hardware design',
      'Sensor interface and signal conditioning boards',
      'Power supply and motor driver boards',
      'Communication modules (WiFi, BLE, LoRa)',
      'Medical and industrial-grade electronics',
      'Prototype to production transition',
    ],
  },
  'app-development': {
    heroSubtitle: 'Mobile Solutions',
    heroDescription: 'Cross-platform mobile apps for iOS and Android, built with a single codebase for faster time-to-market without compromising on native performance.',
    overview: 'We build high-quality cross-platform mobile applications that run seamlessly on both iOS and Android from a single codebase. Using React Native and Flutter, we deliver native-like performance with significantly reduced development time and cost. From consumer-facing apps to enterprise mobility solutions, our team handles the full lifecycle from design to App Store deployment.',
    process: [
      { title: 'Discovery & Design', desc: 'Define user flows, wireframes, and UI/UX design tailored for mobile. We focus on intuitive touch interactions and platform-specific guidelines.' },
      { title: 'Development', desc: 'Build the app with shared business logic and platform-specific optimizations. Continuous testing on real devices ensures quality.' },
      { title: 'Testing & QA', desc: 'Comprehensive testing across devices, OS versions, screen sizes, and network conditions. Performance profiling and crash-free validation.' },
      { title: 'Launch & Support', desc: 'App Store and Play Store submission, release management, crash monitoring, and ongoing updates with user feedback integration.' },
    ],
    useCases: [
      'Business apps with real-time dashboards',
      'E-commerce and marketplace apps',
      'IoT device companion apps',
      'On-demand service apps (delivery, booking)',
      'Social and community platforms',
      'Field service and workforce management apps',
    ],
  },
  'rd-consultancy': {
    heroSubtitle: 'Research & Development',
    heroDescription: 'Strategic technical consulting to help you evaluate technologies, build prototypes, and make informed decisions for your next project.',
    overview: 'Our R&D consultancy helps businesses navigate complex technical decisions. Whether you need a feasibility study for a new product, an architecture review of an existing system, or a proof-of-concept to validate an idea, we provide the expertise and objectivity to guide your technology strategy.',
    process: [
      { title: 'Discovery Workshop', desc: 'Deep-dive session to understand your goals, constraints, market context, and technical requirements.' },
      { title: 'Research & Analysis', desc: 'Technology evaluation, competitive analysis, and feasibility assessment with detailed recommendations.' },
      { title: 'Proof of Concept', desc: 'Build working prototypes to validate key assumptions and reduce technical risk before full development.' },
      { title: 'Roadmap & Handoff', desc: 'Detailed implementation roadmap, architecture documentation, and team knowledge transfer.' },
    ],
    useCases: [
      'New product feasibility studies',
      'Technology stack evaluation and selection',
      'Architecture review and optimization',
      'Proof of concept development',
      'Innovation roadmap planning',
      'Technical due diligence for investments',
    ],
  },
}

const ServiceDetail = () => {
  const { serviceId } = useParams()
  const service = SERVICES.find((s) => s.id === serviceId)
  const content = serviceContent[serviceId]

  if (!service || !content) {
    return <Navigate to="/services" replace />
  }

  const Icon = iconMap[service.icon]

  // Find other services for the "Explore Other Services" section
  const otherServices = SERVICES.filter((s) => s.id !== serviceId)

  return (
    <div className="min-h-screen">
      <Hero
        title={service.title}
        subtitle={content.heroSubtitle}
        description={content.heroDescription}
      />

      {/* Overview */}
      <section className="section-padding bg-white dark:bg-slate-950">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  {Icon && <Icon className="text-white" size={28} />}
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
                  Overview
                </h2>
              </div>
              <p className="text-gray-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed mb-6">
                {content.overview}
              </p>
              <div>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3">Technologies we use:</h3>
                <div className="flex flex-wrap gap-2">
                  {service.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Key capabilities:</h3>
              <ul className="space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-gray-700 dark:text-slate-300">
                    <CheckCircle className="text-accent flex-shrink-0 mt-0.5" size={18} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section-padding bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Use Cases
            </h2>
            <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Common applications where our {service.title.toLowerCase()} expertise delivers results
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg p-4"
              >
                <CheckCircle className="text-accent flex-shrink-0 mt-0.5" size={16} />
                <span className="text-gray-700 dark:text-slate-300 text-sm">{useCase}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-white dark:bg-slate-950">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Our Process
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="text-4xl font-display font-bold gradient-text mb-3">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="section-padding bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
        <div className="container-custom max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
                Interested in {service.title}?
              </h2>
              <p className="text-gray-600 dark:text-slate-400 text-sm">
                Tell us about your project and we&apos;ll get back to you within 24 hours.
              </p>
            </div>
            <EnquiryForm serviceType={service.id} />
          </motion.div>
        </div>
      </section>

      {/* Other Services */}
      <section className="section-padding bg-white dark:bg-slate-950">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white">
              Explore Other Services
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherServices.map((s) => {
              const SIcon = iconMap[s.icon]
              return (
                <Link
                  key={s.id}
                  to={`/services/${s.id}`}
                  className="card-hover flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 dark:from-primary/30 to-accent/20 dark:to-accent/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    {SIcon && <SIcon size={18} className="text-accent" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{s.title}</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-400 dark:text-slate-500 group-hover:text-accent transition-colors flex-shrink-0" />
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServiceDetail
