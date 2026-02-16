import { motion } from 'framer-motion'
import { Mail, MapPin, Clock, Phone } from 'lucide-react'
import Hero from '../components/Hero'
import EnquiryForm from '../components/EnquiryForm'
import { COMPANY_INFO } from '../utils/constants'

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Hero
        title="Get in Touch"
        subtitle="Contact Us"
        description="Have a project idea or need a consultation? We'd love to hear from you."
      />

      <section className="section-padding bg-white dark:bg-slate-950">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-6">
                Let&apos;s Build Something Amazing
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mb-8">
                Fill out the form and our team will get back to you within 24 hours. We&apos;re here to help with any of our services.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-semibold mb-1">Email</h3>
                    <a
                      href={`mailto:${COMPANY_INFO.email}`}
                      className="text-gray-600 dark:text-slate-400 hover:text-accent transition-colors"
                    >
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-semibold mb-1">Phone</h3>
                    <p className="text-gray-600 dark:text-slate-400">{COMPANY_INFO.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-semibold mb-1">Location</h3>
                    <p className="text-gray-600 dark:text-slate-400">{COMPANY_INFO.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-semibold mb-1">Business Hours</h3>
                    <p className="text-gray-600 dark:text-slate-400">Mon - Fri, 9 AM - 6 PM {COMPANY_INFO.timezone}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Send us a message</h3>
              <p className="text-gray-600 dark:text-slate-400 text-sm mb-6">
                Tell us about your project and we&apos;ll get back to you shortly.
              </p>
              <EnquiryForm serviceType="general" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
