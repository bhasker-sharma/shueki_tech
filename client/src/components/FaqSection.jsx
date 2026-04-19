import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { faqAPI } from '../utils/api'

export default function FaqSection({ page, subtitle = 'Quick answers to the questions we hear most often' }) {
  const [faqs, setFaqs] = useState([])
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    if (!page) return
    faqAPI.getPublic(page)
      .then((data) => setFaqs(data.faqs || []))
      .catch(() => {})
  }, [page])

  if (faqs.length === 0) return null

  return (
    <section className="section-padding bg-gray-50 dark:bg-slate-950">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            {subtitle}
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
  )
}
