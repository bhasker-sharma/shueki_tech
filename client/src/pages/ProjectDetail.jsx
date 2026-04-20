import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  ArrowLeft, TrendingUp, Users, Calendar,
  Layers, Tag, Loader2, AlertCircle, ChevronLeft, ChevronRight, ExternalLink,
} from 'lucide-react'
import { projectAPI, STORAGE_URL } from '../utils/api'
import { SERVICE_TYPE_LABELS } from '../utils/constants'

const ProjectDetail = () => {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    setLoading(true)
    projectAPI.getById(id)
      .then((data) => { setProject(data.project); setActiveImg(0) })
      .catch(() => setError('Project not found or no longer available.'))
      .finally(() => setLoading(false))
  }, [id])

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 size={36} className="animate-spin text-accent" />
      </div>
    )
  }

  // Error / not found
  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 px-4 text-center">
        <AlertCircle size={40} className="text-gray-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Project Not Found</h2>
        <p className="text-gray-500 dark:text-slate-400 mb-6">{error}</p>
        <Link to="/projects" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Projects
        </Link>
      </div>
    )
  }

  const images = project.images || []
  const hasImgs = images.length > 0
  // Only show client if explicitly set (not null/empty/Anonymous)
  const showClient = project.client && project.client.trim() !== '' && project.client.toLowerCase() !== 'anonymous'

  const prevImg = () => setActiveImg((i) => (i - 1 + images.length) % images.length)
  const nextImg = () => setActiveImg((i) => (i + 1) % images.length)

  const metaDesc = project.problem?.length > 155
    ? project.problem.slice(0, 152) + '...'
    : project.problem

  return (
    <>
      <Helmet>
        <title>{project.title} | Shueki Tech Projects</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={`https://shuekitech.com/projects/${id}`} />
      </Helmet>
      <div className="min-h-screen bg-white dark:bg-slate-950">

      {/* ── Top bar ── */}
      <div className="pt-24 pb-8 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="container-custom">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400 hover:text-accent transition-colors mb-6"
          >
            <ChevronLeft size={16} /> Back to Projects
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-medium bg-primary/10 dark:bg-primary/20 text-accent px-3 py-1 rounded-full">
              {SERVICE_TYPE_LABELS[project.service_type] || project.service_type}
            </span>
            <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
              <Calendar size={12} /> {project.year}
            </span>
            {showClient && (
              <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
                <Users size={12} /> {project.client}
              </span>
            )}
            <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
              <Tag size={12} /> {project.industry}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white leading-tight max-w-3xl">
            {project.title}
          </h1>
        </div>
      </div>

      <div className="container-custom section-padding">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* ── Left: images + content ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Image gallery */}
            {hasImgs ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Main image */}
                <div
                  className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${project.gradient || 'from-blue-500 to-cyan-500'}`}
                  style={{ aspectRatio: '16/9' }}
                >
                  <img
                    key={activeImg}
                    src={`${STORAGE_URL}/${images[activeImg]}`}
                    alt={`${project.title} — image ${activeImg + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Nav arrows — only when multiple images */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImg}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={nextImg}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                      <span className="absolute bottom-3 right-3 text-xs bg-black/60 text-white px-2 py-1 rounded-full">
                        {activeImg + 1} / {images.length}
                      </span>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 mt-3">
                    {images.map((path, idx) => (
                      <button
                        key={path}
                        onClick={() => setActiveImg(idx)}
                        className={`flex-shrink-0 w-16 h-10 rounded-lg overflow-hidden border-2 transition-all ${idx === activeImg
                            ? 'border-accent scale-105'
                            : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                      >
                        <img
                          src={`${STORAGE_URL}/${path}`}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              /* Gradient placeholder when no images uploaded */
              <div
                className={`rounded-2xl bg-gradient-to-br ${project.gradient || 'from-blue-500 to-cyan-500'} flex items-center justify-center`}
                style={{ aspectRatio: '16/9' }}
              >
                <span className="text-white font-display font-bold text-xl px-6 text-center leading-snug">
                  {project.title}
                </span>
              </div>
            )}

            {/* Problem */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-red-500 rounded-full inline-block" />
                The Challenge
              </h2>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                {project.problem}
              </p>
            </motion.div>

            {/* Result */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
                The Outcome
              </h2>
              <p className="text-green-700 dark:text-green-300 leading-relaxed font-medium">
                {project.result}
              </p>
            </motion.div>
          </div>

          {/* ── Right: details sidebar ── */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-5"
          >
            {/* Details card */}
            <div className="card space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Project Details
              </h3>

              <div className="space-y-3 text-sm">
                {showClient && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-slate-500">Client</span>
                    <span className="font-medium text-gray-900 dark:text-white">{project.client}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-slate-500">Industry</span>
                  <span className="font-medium text-gray-900 dark:text-white">{project.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-slate-500">Year</span>
                  <span className="font-medium text-gray-900 dark:text-white">{project.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-slate-500">Service</span>
                  <span className="font-medium text-gray-900 dark:text-white text-right">
                    {SERVICE_TYPE_LABELS[project.service_type] || project.service_type}
                  </span>
                </div>
              </div>
            </div>

            {/* Live project link */}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-accent text-accent hover:bg-accent hover:text-white font-medium text-sm transition-all duration-200"
              >
                <ExternalLink size={15} />
                View Live
              </a>
            )}

            {/* Tech stack */}
            {project.tech?.length > 0 && (
              <div className="card">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Layers size={14} /> Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-3 py-1 rounded-full font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="card bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 dark:border-primary/30">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Have a similar project?
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                We&apos;d love to hear about your requirements.
              </p>
              <Link to="/contact" className="btn-primary w-full text-center block text-sm">
                Get in Touch
              </Link>
            </div>

            {/* Back link */}
            <Link
              to="/projects"
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-accent transition-colors"
            >
              <ArrowLeft size={14} /> All Projects
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
    </>
  )
}

export default ProjectDetail
