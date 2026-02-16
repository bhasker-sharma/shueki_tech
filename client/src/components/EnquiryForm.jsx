import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { submitEnquiry } from '../utils/api'

const EnquiryForm = ({ serviceType, className = '' }) => {
  const [status, setStatus] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      setStatus(null)
      const response = await submitEnquiry({
        ...data,
        service_type: serviceType,
      })
      setStatus('success')
      setStatusMessage(response.message || 'Enquiry submitted successfully!')
      reset()
    } catch (err) {
      setStatus('error')
      setStatusMessage(err.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-4 ${className}`}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            {...register('full_name', { required: 'Name is required' })}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Your full name"
          />
          {errors.full_name && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Email *
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
            })}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="you@company.com"
          />
          {errors.email && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Phone
          </label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="+91-XXXX-XXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Company
          </label>
          <input
            type="text"
            {...register('company')}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Your company name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
          Message *
        </label>
        <textarea
          rows={4}
          {...register('message', {
            required: 'Message is required',
            minLength: { value: 10, message: 'Message must be at least 10 characters' },
          })}
          className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
          placeholder="Tell us about your project requirements..."
        />
        {errors.message && (
          <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.message.message}</p>
        )}
      </div>

      {status && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
            status === 'success'
              ? 'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400'
          }`}
        >
          {status === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {statusMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          'Submitting...'
        ) : (
          <>
            <Send size={18} />
            Send Enquiry
          </>
        )}
      </button>
    </form>
  )
}

export default EnquiryForm
