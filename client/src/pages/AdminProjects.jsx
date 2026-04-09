import { useState, useEffect, useRef, useCallback } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import AdminLayout from '../components/AdminLayout'
import { projectAPI, STORAGE_URL } from '../utils/api'
import { SERVICE_TYPE_LABELS } from '../utils/constants'
import {
  Plus, Edit2, Trash2, X, Upload, CheckCircle, AlertCircle,
  Loader2, ImageOff, Crop,
} from 'lucide-react'

// ─── Config ───────────────────────────────────────────────────────────────────

// Crop aspect ratio enforced on all project images (width:height = 16:9)
const CROP_ASPECT = 16 / 9

const GRADIENT_OPTIONS = [
  { value: 'from-blue-500 to-cyan-500', label: 'Blue → Cyan' },
  { value: 'from-purple-500 to-pink-500', label: 'Purple → Pink' },
  { value: 'from-orange-500 to-red-500', label: 'Orange → Red' },
  { value: 'from-green-500 to-teal-500', label: 'Green → Teal' },
  { value: 'from-yellow-500 to-orange-500', label: 'Yellow → Orange' },
  { value: 'from-indigo-500 to-purple-500', label: 'Indigo → Purple' },
  { value: 'from-rose-500 to-pink-500', label: 'Rose → Pink' },
  { value: 'from-sky-500 to-blue-600', label: 'Sky → Blue' },
  { value: 'from-emerald-500 to-cyan-500', label: 'Emerald → Cyan' },
  { value: 'from-lime-500 to-green-600', label: 'Lime → Green' },
]

const SERVICE_OPTIONS = Object.entries(SERVICE_TYPE_LABELS)
  .filter(([k]) => k !== 'general')
  .map(([value, label]) => ({ value, label }))

const EMPTY_FORM = {
  title: '', client: '', industry: '',
  service_type: 'web-development', problem: '', result: '', tech: '',
  year: new Date().getFullYear(), featured: false,
  status: 'published', gradient: 'from-blue-500 to-cyan-500', sort_order: 0, link: '',
}

// ─── Crop Modal ───────────────────────────────────────────────────────────────

const CropModal = ({ file, queuePosition, queueTotal, onConfirm, onCancel }) => {
  const [imgSrc, setImgSrc] = useState('')
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState(null)
  const [processing, setProcessing] = useState(false)
  const imgRef = useRef(null)

  // Load file as data URL
  useEffect(() => {
    const reader = new FileReader()
    reader.onload = () => setImgSrc(reader.result)
    reader.readAsDataURL(file)
    return () => { setImgSrc(''); setCrop(undefined); setCompletedCrop(null) }
  }, [file])

  // Set initial centred crop when image loads
  const onImageLoad = useCallback((e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget
    const initial = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, CROP_ASPECT, naturalWidth, naturalHeight),
      naturalWidth,
      naturalHeight,
    )
    setCrop(initial)
  }, [])

  const handleConfirm = () => {
    if (!imgRef.current || !completedCrop) return
    setProcessing(true)

    const image = imgRef.current
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    const canvas = document.createElement('canvas')
    canvas.width = Math.round(completedCrop.width * scaleX)
    canvas.height = Math.round(completedCrop.height * scaleY)

    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(
      image,
      completedCrop.x * scaleX, completedCrop.y * scaleY,
      completedCrop.width * scaleX, completedCrop.height * scaleY,
      0, 0,
      canvas.width, canvas.height,
    )

    canvas.toBlob((blob) => {
      if (!blob) { setProcessing(false); return }
      const croppedFile = new File([blob], file.name, { type: 'image/jpeg' })
      const previewUrl = URL.createObjectURL(blob)
      onConfirm(croppedFile, previewUrl)
      setProcessing(false)
    }, 'image/jpeg', 0.93)
  }

  const canConfirm = !!completedCrop && completedCrop.width > 10 && completedCrop.height > 10

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
      <div className="bg-slate-800 border border-slate-600 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Crop size={18} className="text-accent" />
            <span className="text-white font-semibold">Crop Image</span>
            {queueTotal > 1 && (
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                {queuePosition} / {queueTotal}
              </span>
            )}
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Crop area */}
        <div className="p-5">
          <p className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
            <span className="bg-accent/20 text-accent px-2 py-0.5 rounded font-mono text-xs">16 : 9</span>
            Drag the corners or sides to adjust. Aspect ratio is locked.
          </p>

          <div className="flex justify-center bg-slate-900 rounded-lg overflow-hidden max-h-[60vh]">
            {imgSrc ? (
              <ReactCrop
                crop={crop}
                onChange={(_, pct) => setCrop(pct)}
                onComplete={(px) => setCompletedCrop(px)}
                aspect={CROP_ASPECT}
                minWidth={80}
                className="max-h-[55vh]"
              >
                <img
                  ref={imgRef}
                  src={imgSrc}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  className="max-h-[55vh] object-contain"
                  style={{ display: 'block' }}
                />
              </ReactCrop>
            ) : (
              <div className="flex items-center justify-center h-48 w-full">
                <Loader2 size={28} className="animate-spin text-slate-500" />
              </div>
            )}
          </div>

          {completedCrop && (
            <p className="text-xs text-slate-500 mt-2 text-right">
              Output: {Math.round(completedCrop.width * (imgRef.current?.naturalWidth / imgRef.current?.width || 1))}
              {' × '}
              {Math.round(completedCrop.height * (imgRef.current?.naturalHeight / imgRef.current?.height || 1))} px
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-700">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel All
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm || processing}
            className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {processing && <Loader2 size={13} className="animate-spin" />}
            {processing ? 'Processing…' : (queueTotal > 1 ? 'Crop & Next' : 'Crop & Add')}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Project Form Modal ───────────────────────────────────────────────────────

const ProjectForm = ({ project, onClose, onSave }) => {
  const [form, setForm] = useState(() =>
    project ? {
      title: project.title || '',
      client: project.client || '',
      industry: project.industry || '',
      service_type: project.service_type || 'web-development',
      problem: project.problem || '',
      result: project.result || '',
      tech: Array.isArray(project.tech) ? project.tech.join(', ') : (project.tech || ''),
      year: project.year || new Date().getFullYear(),
      featured: project.featured || false,
      status: project.status || 'published',
      gradient: project.gradient || 'from-blue-500 to-cyan-500',
      sort_order: project.sort_order || 0,
      link: project.link || '',
    } : { ...EMPTY_FORM }
  )

  // Existing DB image paths (relative, e.g. "projects/1/img.jpg")
  const [existingImages, setExistingImages] = useState(project?.images || [])
  // Cropped File objects ready to upload
  const [newFiles, setNewFiles] = useState([])
  // Blob preview URLs for newFiles
  const [newPreviews, setNewPreviews] = useState([])
  // Files waiting to be cropped
  const [cropQueue, setCropQueue] = useState([])

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const totalImages = existingImages.length + newFiles.length
  const activeCropFile = cropQueue[0] || null

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  // When user picks files, push them into the crop queue (up to remaining slots)
  const handleFilePick = (e) => {
    const files = Array.from(e.target.files)
    const slots = 5 - totalImages - cropQueue.length
    if (slots <= 0) return
    setCropQueue((q) => [...q, ...files.slice(0, slots)])
    e.target.value = ''
  }

  // Called when user finishes cropping one image
  const handleCropConfirm = (croppedFile, previewUrl) => {
    setNewFiles((prev) => [...prev, croppedFile])
    setNewPreviews((prev) => [...prev, previewUrl])
    setCropQueue((q) => q.slice(1)) // advance queue
  }

  const handleCropCancel = () => setCropQueue([])

  const removeExisting = (idx) =>
    setExistingImages((prev) => prev.filter((_, i) => i !== idx))

  const removeNew = (idx) => {
    URL.revokeObjectURL(newPreviews[idx])
    setNewFiles((prev) => prev.filter((_, i) => i !== idx))
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cropQueue.length > 0) return // still cropping
    setError('')
    setSaving(true)

    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)))
      fd.append('existing_images', JSON.stringify(existingImages))
      newFiles.forEach((f) => fd.append('images[]', f))

      const result = project?.id
        ? await projectAPI.update(project.id, fd)
        : await projectAPI.create(fd)

      onSave(result.project)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Crop modal (on top of the form) */}
      {activeCropFile && (
        <CropModal
          file={activeCropFile}
          queuePosition={newFiles.length + existingImages.length + 1}
          queueTotal={newFiles.length + existingImages.length + cropQueue.length}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto py-6 px-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-3xl shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-bold text-white">
              {project ? 'Edit Project' : 'Add New Project'}
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-3">
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Title + Client */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Project Title <span className="text-red-400">*</span>
                </label>
                <input name="title" value={form.title} onChange={handleFieldChange} required
                  placeholder="e.g. E-Commerce Platform"
                  className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Client Name</label>
                <input name="client" value={form.client} onChange={handleFieldChange}
                  placeholder="Leave blank to hide"
                  className="input-field" />
              </div>
            </div>

            {/* Industry + Service + Year */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Industry <span className="text-red-400">*</span>
                </label>
                <input name="industry" value={form.industry} onChange={handleFieldChange} required
                  placeholder="e.g. Retail, SaaS"
                  className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Service Type <span className="text-red-400">*</span>
                </label>
                <select name="service_type" value={form.service_type} onChange={handleFieldChange}
                  className="input-field">
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Year</label>
                <input name="year" type="number" value={form.year} onChange={handleFieldChange}
                  min="2000" max="2100" className="input-field" />
              </div>
            </div>

            {/* Problem */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Problem / Challenge <span className="text-red-400">*</span>
              </label>
              <textarea name="problem" value={form.problem} onChange={handleFieldChange} required rows={3}
                placeholder="Describe the client's problem..."
                className="input-field resize-none" />
            </div>

            {/* Result */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Result / Outcome <span className="text-red-400">*</span>
              </label>
              <textarea name="result" value={form.result} onChange={handleFieldChange} required rows={3}
                placeholder="Describe the measurable outcome..."
                className="input-field resize-none" />
            </div>

            {/* Tech */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Tech Stack</label>
              <input name="tech" value={form.tech} onChange={handleFieldChange}
                placeholder="React, Laravel, AWS  (comma-separated)"
                className="input-field" />
            </div>

            {/* Live link */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Live Project URL
                <span className="text-slate-500 font-normal ml-2">(optional)</span>
              </label>
              <input name="link" type="url" value={form.link} onChange={handleFieldChange}
                placeholder="https://example.com"
                className="input-field" />
              <p className="text-xs text-slate-500 mt-1">If filled, a &quot;View Live &quot; button appears on the project page.</p>
            </div>

            {/* Gradient + Status + Sort */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Card Colour</label>
                <select name="gradient" value={form.gradient} onChange={handleFieldChange} className="input-field">
                  {GRADIENT_OPTIONS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
                <div className={`mt-2 h-5 rounded bg-gradient-to-r ${form.gradient}`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleFieldChange} className="input-field">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Sort Order</label>
                <input name="sort_order" type="number" value={form.sort_order}
                  onChange={handleFieldChange} min="0" className="input-field" />
              </div>
            </div>

            {/* Featured */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" name="featured" checked={form.featured}
                onChange={handleFieldChange} className="w-4 h-4 accent-primary" />
              <div>
                <span className="text-sm font-medium text-slate-300">Featured on homepage</span>
                <p className="text-xs text-slate-500">Shows in the "Featured Projects" section on the home page</p>
              </div>
            </label>

            {/* Images */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="text-sm font-medium text-slate-300">
                    Project Images
                    <span className="text-slate-500 font-normal ml-1">(up to 5 · 16:9 cropped)</span>
                  </label>
                </div>
                <span className="text-xs text-slate-500">{totalImages} / 5</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Existing images from DB */}
                {existingImages.map((path, idx) => (
                  <div key={path} className="relative w-28 h-16 rounded-lg overflow-hidden border border-slate-600 group">
                    <img src={`${STORAGE_URL}/${path}`} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExisting(idx)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                ))}

                {/* New cropped image previews */}
                {newPreviews.map((preview, idx) => (
                  <div key={preview} className="relative w-28 h-16 rounded-lg overflow-hidden border border-green-700 group">
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 inset-x-0 bg-green-600/80 text-center text-white text-xs py-0.5">
                      New
                    </div>
                    <button type="button" onClick={() => removeNew(idx)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                ))}

                {/* Pending crop queue placeholders */}
                {cropQueue.map((f, idx) => (
                  <div key={f.name + idx}
                    className="relative w-28 h-16 rounded-lg border border-yellow-600 border-dashed flex items-center justify-center bg-yellow-900/10">
                    <Crop size={18} className="text-yellow-500 animate-pulse" />
                  </div>
                ))}

                {/* Add button */}
                {totalImages + cropQueue.length < 5 && (
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="w-28 h-16 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-primary hover:text-primary transition-colors">
                    <Upload size={16} />
                    <span className="text-xs">Add</span>
                  </button>
                )}
              </div>

              <input ref={fileInputRef} type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                multiple onChange={handleFilePick} className="hidden" />
              <p className="text-xs text-slate-500 mt-2">
                JPG, PNG, WebP · Max 5 MB each · Images will be cropped to 16:9 before uploading
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-700">
              <button type="button" onClick={onClose} disabled={saving}
                className="px-5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={saving || cropQueue.length > 0}
                className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {cropQueue.length > 0
                  ? `Cropping ${cropQueue.length} image…`
                  : saving
                    ? 'Saving…'
                    : project ? 'Update Project' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Inject shared input style */}
      <style>{`
        .input-field {
          width: 100%;
          background: rgb(15 23 42);
          border: 1px solid rgb(71 85 105);
          color: white;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input-field:focus { border-color: var(--color-primary, #6366f1); }
        .input-field::placeholder { color: rgb(100 116 139); }
        .input-field option { background: rgb(30 41 59); }
      `}</style>
    </>
  )
}

// ─── Project Card ─────────────────────────────────────────────────────────────

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const firstImage = project.images?.[0]
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <div className={`relative bg-gradient-to-br ${project.gradient || 'from-blue-500 to-cyan-500'}`}
        style={{ aspectRatio: '16/9' }}>
        {firstImage ? (
          <img src={`${STORAGE_URL}/${firstImage}`} alt={project.title}
            className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center px-4 text-center">
            <span className="text-white font-semibold text-sm leading-tight line-clamp-2">
              {project.title}
            </span>
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {project.featured && (
            <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">
              Featured
            </span>
          )}
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${project.status === 'published'
              ? 'bg-green-600 text-white'
              : 'bg-slate-600 text-slate-200'
            }`}>
            {project.status}
          </span>
        </div>
        {project.images?.length > 1 && (
          <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded">
            +{project.images.length - 1} more
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2">
          {project.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
          <span>{project.industry}</span>
          <span>·</span>
          <span>{project.client}</span>
          <span>·</span>
          <span>{project.year}</span>
        </div>
        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
          {SERVICE_TYPE_LABELS[project.service_type] || project.service_type}
        </span>
        {project.tech?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {project.tech.slice(0, 3).map((t) => (
              <span key={t} className="text-xs bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded">{t}</span>
            ))}
            {project.tech.length > 3 && (
              <span className="text-xs text-slate-500">+{project.tech.length - 3}</span>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pb-4 flex gap-2">
        <button onClick={() => onEdit(project)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded-lg transition-colors">
          <Edit2 size={13} /> Edit
        </button>
        <button onClick={() => onDelete(project.id)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-900/30 hover:bg-red-900/60 text-red-400 hover:text-red-300 text-xs font-medium rounded-lg transition-colors border border-red-800/40">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const AdminProjects = ({ openCreate = false }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(openCreate)
  const [editProject, setEditProject] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    projectAPI.getAll()
      .then((data) => setProjects(data.projects || []))
      .catch((err) => showToast('error', err.message))
      .finally(() => setLoading(false))
  }, [])

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSave = (saved) => {
    setProjects((prev) => {
      const exists = prev.find((p) => p.id === saved.id)
      return exists ? prev.map((p) => p.id === saved.id ? saved : p) : [saved, ...prev]
    })
    setShowForm(false)
    setEditProject(null)
    showToast('success', editProject ? 'Project updated' : 'Project created')
  }

  const handleDeleteConfirm = async () => {
    setDeleting(true)
    try {
      await projectAPI.delete(deleteId)
      setProjects((prev) => prev.filter((p) => p.id !== deleteId))
      setDeleteId(null)
      showToast('success', 'Project deleted')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminLayout>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${toast.type === 'success'
            ? 'bg-green-800 border border-green-600 text-green-100'
            : 'bg-red-900 border border-red-700 text-red-100'
          }`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Project form */}
      {showForm && (
        <ProjectForm
          project={editProject}
          onClose={() => { setShowForm(false); setEditProject(null) }}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-900/40 rounded-full flex items-center justify-center">
                <Trash2 size={18} className="text-red-400" />
              </div>
              <h3 className="text-white font-semibold">Delete Project</h3>
            </div>
            <p className="text-slate-400 text-sm mb-5">
              This will permanently delete the project and all its uploaded images. Cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} disabled={deleting}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors">
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} disabled={deleting}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-red-700 hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                {deleting && <Loader2 size={14} className="animate-spin" />}
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {loading ? 'Loading…' : `${projects.length} project${projects.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => { setEditProject(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-slate-400" />
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageOff size={28} className="text-slate-500" />
          </div>
          <h3 className="text-white font-semibold mb-2">No projects yet</h3>
          <p className="text-slate-400 text-sm mb-6">Add your first project to showcase it on the website.</p>
          <button
            onClick={() => { setEditProject(null); setShowForm(true) }}
            className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Add First Project
          </button>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={(p) => { setEditProject(p); setShowForm(true) }}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminProjects
