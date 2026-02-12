import { motion } from 'framer-motion'

const philosophyQuotes = [
  "Solution statements end discussion. Problem statements start it.",
  "If you can't write the problem down clearly, no tool will fix it.",
  "Real systems beat perfect diagrams.",
  "If the field won't use it, it's broken.",
]

function AboutSection() {
  return (
    <div className="bg-acqua-cream dark:bg-acqua-navy">
      {/* Bio Section */}
      <section className="section-content">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 items-start"
          >
            {/* Profile Image Placeholder */}
            <div className="md:col-span-1">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-acqua-teal to-acqua-navy overflow-hidden">
                {/* Profile image would go here */}
              </div>
            </div>

            {/* Bio Text */}
            <div className="md:col-span-2">
              <h2 className="heading-1 text-acqua-navy dark:text-acqua-cream mb-6">
                Jesse Jones
              </h2>
              <div className="space-y-4 text-acqua-navy/80 dark:text-acqua-cream/80">
                <p className="body-large">
                  24 years in construction technology. I help construction teams make safer technology decisions by translating between how work happens and how tools work.
                </p>
                <p>
                  I'm not a vendor—I'm a working operator who's been on both sides of the fence. I've watched too many projects fail because someone bought software before understanding the problem.
                </p>
                <p>
                  My role is simple: I'm the person who makes tools actually work together. Field credibility, executive translation, technical implementation.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-content bg-acqua-navy dark:bg-acqua-navy-light text-white">
        <div className="max-w-4xl mx-auto">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="heading-2 text-center mb-12"
          >
            Philosophy
          </motion.h3>
          <div className="grid md:grid-cols-2 gap-6">
            {philosophyQuotes.map((quote, index) => (
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-white/10 border-l-4 border-acqua-orange"
              >
                <p className="text-lg italic text-white/90">"{quote}"</p>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-content" id="contact">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="heading-2 text-acqua-navy dark:text-acqua-cream mb-4">
              Get In Touch
            </h3>
            <p className="text-acqua-navy/70 dark:text-acqua-cream/70">
              Have a project in mind? Let's talk.
            </p>
          </motion.div>

          {/* Contact Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-4 mb-12"
          >
            <a
              href="mailto:jesse@jesseprojects.com"
              className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-acqua-navy-light hover:shadow-lg transition-shadow"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-acqua-teal/10">
                <svg className="w-5 h-5 text-acqua-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m2 4 10 8 10-8" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-acqua-navy dark:text-acqua-cream">Email</p>
                <p className="text-sm text-acqua-navy/70 dark:text-acqua-cream/70">jesse@jesseprojects.com</p>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/jessemjones/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-acqua-navy-light hover:shadow-lg transition-shadow"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-acqua-teal/10">
                <svg className="w-5 h-5 text-acqua-teal" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-acqua-navy dark:text-acqua-cream">LinkedIn</p>
                <p className="text-sm text-acqua-navy/70 dark:text-acqua-cream/70">Connect with me</p>
              </div>
            </a>

            <a
              href="https://cal.com/thejessejones"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-acqua-navy-light hover:shadow-lg transition-shadow"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-acqua-orange/10">
                <svg className="w-5 h-5 text-acqua-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-acqua-navy dark:text-acqua-cream">Schedule a Call</p>
                <p className="text-sm text-acqua-navy/70 dark:text-acqua-cream/70">Free 30-min consultation</p>
              </div>
            </a>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              // Form submission would go here
              alert('Form submission - would integrate with contact API')
            }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-acqua-navy dark:text-acqua-cream mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-acqua-navy-light text-acqua-navy dark:text-acqua-cream focus:ring-2 focus:ring-acqua-teal focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-acqua-navy dark:text-acqua-cream mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-acqua-navy-light text-acqua-navy dark:text-acqua-cream focus:ring-2 focus:ring-acqua-teal focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-acqua-navy dark:text-acqua-cream mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-acqua-navy-light text-acqua-navy dark:text-acqua-cream focus:ring-2 focus:ring-acqua-teal focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-acqua-navy dark:text-acqua-cream mb-1">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-acqua-navy-light text-acqua-navy dark:text-acqua-cream focus:ring-2 focus:ring-acqua-teal focus:border-transparent resize-none"
              />
            </div>
            <button type="submit" className="btn-primary w-full sm:w-auto">
              Send Message
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  )
}

export default AboutSection
