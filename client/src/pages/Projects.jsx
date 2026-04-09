import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Users, Calendar, Loader2, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import { projectAPI, STORAGE_URL } from '../utils/api'
import { SERVICE_TYPE_LABELS } from '../utils/constants'

const SERVICE_FILTERS = [
  { key: 'all', label: 'All Projects' },
  { key: 'web-development', label: 'Web Dev' },
  { key: 'machine-integration', label: 'Automation' },
  { key: 'ai-pipelines', label: 'AI Pipelines' },
  { key: 'pcb-designing', label: 'PCB Design' },
  { key: 'app-development', label: 'App Dev' },
  { key: 'rd-consultancy', label: 'R&D' },
]

const MotionLink = motion(Link)

const ProjectCard = ({ project, index }) => {
  const firstImage = project.images?.[0]

  return (
    <MotionLink
      to={`/projects/${project.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="card flex flex-col overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-pointer"
    >
      {/* Visual banner */}
      <div className={`h-40 rounded-lg bg-gradient-to-br ${project.gradient || 'from-blue-500 to-cyan-500'} mb-5 flex items-center justify-center relative overflow-hidden`}>
        {firstImage ? (
          <img
            src={`${STORAGE_URL}/${firstImage}`}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-black/10" />
            <span className="relative text-white font-display font-bold text-lg px-4 text-center leading-tight">
              {project.title}
            </span>
          </>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs bg-primary/10 dark:bg-primary/20 text-accent px-2 py-1 rounded font-medium">
          {SERVICE_TYPE_LABELS[project.service_type] || project.service_type}
        </span>
        <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
          <Calendar size={11} />
          {project.year}
        </span>
        <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
          <Users size={11} />
          {project.client}
        </span>
      </div>

      <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1">
        Industry
      </div>
      <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-4">
        {project.industry}
      </p>

      <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1">
        Problem
      </div>
      <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 leading-relaxed">
        {project.problem}
      </p>

      {/* Result */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-lg p-3 mb-4 mt-auto">
        <div className="flex items-center gap-1.5 mb-1">
          <TrendingUp size={13} className="text-green-600 dark:text-green-400" />
          <span className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider">
            Outcome
          </span>
        </div>
        <p className="text-sm text-green-800 dark:text-green-300 font-medium leading-relaxed">
          {project.result}
        </p>
      </div>

      {/* Tech */}
      {project.tech?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 px-2 py-0.5 rounded"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      {/* View details cue */}
      <div className="mt-3 flex items-center gap-1 text-xs text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        View details <ArrowRight size={12} />
      </div>
    </MotionLink>
  )
}

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    projectAPI.getPublic()
      .then((data) => setProjects(data.projects || []))
      .catch(() => setError('Failed to load projects. Please try again later.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.service_type === activeFilter)

  return (
    <div className="min-h-screen">
      <Hero
        title="Our Work"
        subtitle="Projects & Portfolio"
        description="Real problems solved. Measurable outcomes delivered."
      />

      <section className="section-padding bg-white dark:bg-slate-950">
        <div className="container-custom">

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {SERVICE_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === f.key
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:text-accent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 size={36} className="animate-spin text-accent" />
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex items-center justify-center gap-3 text-gray-500 dark:text-slate-400 py-20">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-slate-400">
                No projects published yet. Check back soon.
              </p>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && filtered.length > 0 && (
            <>
              <p className="text-sm text-gray-500 dark:text-slate-400 text-center mb-8">
                Showing {filtered.length} project{filtered.length !== 1 ? 's' : ''}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            </>
          )}

          {/* No results for filter */}
          {!loading && !error && projects.length > 0 && filtered.length === 0 && (
            <p className="text-center text-gray-500 dark:text-slate-400 py-20">
              No projects in this category yet.
            </p>
          )}

          {/* CTA */}
          {!loading && (
            <div className="text-center mt-16">
              <p className="text-gray-600 dark:text-slate-400 mb-4">Have a project in mind?</p>
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                Let&apos;s Talk
                <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Projects
