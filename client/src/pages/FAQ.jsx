import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, ArrowRight, MessageCircle } from 'lucide-react'
import { FAQ_DATA } from '../utils/constants'

const FAQ = () => {
  const [openItem, setOpenItem] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...FAQ_DATA.map((c) => c.category)]

  const visibleSections =
    activeCategory === 'All'
      ? FAQ_DATA
      : FAQ_DATA.filter((c) => c.category === activeCategory)

  const toggle = (key) => setOpenItem(openItem === key ? null : key)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient pt-32 pb-16 text-center">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block mb-6 px-4 py-2 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-full">
              <span className="text-accent text-sm font-semibold">Got Questions?</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to know before working with us — from pricing and timelines to tech stack and support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-20 z-30">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:border-accent hover:text-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="section-padding bg-white dark:bg-slate-950">
        <div className="container-custom max-w-3xl">
          {visibleSections.map((section, sIdx) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: sIdx * 0.05 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-gradient-to-b from-primary to-accent rounded-full inline-block" />
                {section.category}
              </h2>

              <div className="divide-y divide-gray-100 dark:divide-slate-800 border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden">
                {section.items.map((item, iIdx) => {
                  const key = `${sIdx}-${iIdx}`
                  const isOpen = openItem === key
                  return (
                    <div key={iIdx} className="bg-white dark:bg-slate-900">
                      <button
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left group hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors"
                        onClick={() => toggle(key)}
                      >
                        <span className={`text-sm sm:text-base font-semibold transition-colors ${isOpen ? 'text-accent' : 'text-gray-900 dark:text-white group-hover:text-accent'}`}>
                          {item.question}
                        </span>
                        {isOpen
                          ? <ChevronUp size={18} className="text-accent flex-shrink-0" />
                          : <ChevronDown size={18} className="text-gray-400 dark:text-slate-500 flex-shrink-0" />
                        }
                      </button>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="px-5 pb-5"
                        >
                          <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Still have questions? */}
      <section className="section-padding bg-gray-50 dark:bg-slate-900">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center card">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="text-white" size={26} />
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm sm:text-base mb-6">
              Can&apos;t find what you&apos;re looking for? Drop us a message and we&apos;ll get back to you within 24 hours.
            </p>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Contact Us
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FAQ
