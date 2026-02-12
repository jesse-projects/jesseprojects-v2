import { motion } from 'framer-motion'

const categories = [
  {
    id: 'weddings',
    title: 'Weddings',
    description: 'Capturing your special day with elegance and authenticity.',
    image: '/images/wedding-placeholder.jpg',
  },
  {
    id: 'portraits',
    title: 'Portraits',
    description: 'Professional headshots and personal portraits.',
    image: '/images/portrait-placeholder.jpg',
  },
  {
    id: 'events',
    title: 'Events',
    description: 'Corporate events, concerts, and special occasions.',
    image: '/images/event-placeholder.jpg',
  },
  {
    id: 'commercial',
    title: 'Commercial',
    description: 'Product photography and commercial campaigns.',
    image: '/images/commercial-placeholder.jpg',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
}

function PhotographySection() {
  return (
    <div className="bg-acqua-cream dark:bg-acqua-navy min-h-screen">
      {/* Header */}
      <section className="section-content text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-1 text-acqua-navy dark:text-acqua-cream mb-6">
            Photography
          </h2>
          <p className="body-large text-acqua-navy/70 dark:text-acqua-cream/70 max-w-3xl mx-auto">
            Capturing moments with intention and artistry. Every shot tells a story.
          </p>
        </motion.div>
      </section>

      {/* Category Grid */}
      <section className="section-content">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          {categories.map((category) => (
            <motion.article
              key={category.id}
              variants={item}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-acqua-navy cursor-pointer"
            >
              {/* Placeholder gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-acqua-teal to-acqua-navy" />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <h3 className="heading-2 mb-2">{category.title}</h3>
                <p className="text-white/80 text-center max-w-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  {category.description}
                </p>
              </div>

              {/* View Gallery button */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm text-white">
                  View Gallery
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Contact CTA */}
      <section className="section-content text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h3 className="heading-3 text-acqua-navy dark:text-acqua-cream mb-4">
            Interested in booking a session?
          </h3>
          <p className="text-acqua-navy/70 dark:text-acqua-cream/70 mb-6">
            Let's discuss your photography needs and create something memorable.
          </p>
          <a
            href="#about"
            className="btn-primary"
          >
            Get in Touch
          </a>
        </motion.div>
      </section>
    </div>
  )
}

export default PhotographySection
