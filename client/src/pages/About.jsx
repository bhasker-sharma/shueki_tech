import { motion } from 'framer-motion'
import { Users, Target, Globe2, Award, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'

const About = () => {
  const teams = [
    {
      name: 'Software Engineering',
      role: 'Full-Stack & Cloud',
      expertise: 'React, Node.js, Laravel, Python, AWS',
    },
    {
      name: 'Hardware & Embedded',
      role: 'PCB & Electronics',
      expertise: 'KiCAD, Altium, Circuit Design, Firmware',
    },
    {
      name: 'Automation & AI',
      role: 'ML & Robotics',
      expertise: 'ROS2, TensorFlow, PLC/SCADA, Computer Vision',
    },
  ]

  return (
    <div className="min-h-screen">
      <Hero
        title="About Shueki Tech"
        subtitle="Who We Are"
        description="A multidisciplinary engineering team delivering innovative solutions across software, hardware, and automation."
      />

      {/* Mission & Vision */}
      <section className="section-padding bg-white dark:bg-slate-950">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card"
            >
              <Target className="text-accent mb-4" size={40} />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-slate-400">
                To bridge the gap between innovative ideas and production-ready solutions. We combine technical excellence with agile delivery to help businesses build, automate, and scale their technology infrastructure.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card"
            >
              <Globe2 className="text-accent mb-4" size={40} />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Global Reach</h2>
              <p className="text-gray-600 dark:text-slate-400">
                Based in Bangalore, India&apos;s technology capital, we serve clients globally. Our IST timezone provides strategic overlap with US and EU business hours for real-time collaboration.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Our Expert Teams
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Specialized engineering teams with deep domain expertise
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {teams.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-accent font-semibold text-sm mb-2">{member.role}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">{member.expertise}</p>
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
              How We Work
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Discovery', desc: 'Understand requirements, scope, and goals' },
              { step: '02', title: 'Proposal', desc: 'Technical approach with clear milestones' },
              { step: '03', title: 'Development', desc: 'Agile sprints with regular updates' },
              { step: '04', title: 'Delivery', desc: 'Testing, deployment, and handover' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="text-4xl font-display font-bold gradient-text mb-3">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
        <div className="container-custom">
          <div className="text-center mb-12">
            <Award className="text-accent mx-auto mb-4" size={40} />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Technical Excellence',
              'Transparent Communication',
              'On-Time Delivery',
              'Client-First Approach',
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <Shield className="text-accent mx-auto mb-3" size={28} />
                <p className="text-gray-900 dark:text-white font-semibold">{value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-primary to-accent">
        <div className="container-custom text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Let&apos;s Work Together
          </h2>
          <p className="text-base sm:text-lg text-slate-100 mb-8 max-w-2xl mx-auto">
            Have a project in mind? We&apos;d love to discuss how we can help.
          </p>
          <Link
            to="/contact"
            className="bg-white text-primary hover:bg-slate-100 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About
