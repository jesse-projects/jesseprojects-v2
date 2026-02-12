import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'

const IMAGE_BASE_URL = '/images/photography'
const FLIP_INTERVAL_MIN = 10000
const FLIP_INTERVAL_MAX = 20000

const demoImages = {
  weddings: [
    { src: 'https://picsum.photos/seed/wedding-1/600/800', alt: 'Wedding ceremony moment', category: 'weddings' },
    { src: 'https://picsum.photos/seed/wedding-2/600/800', alt: 'First dance', category: 'weddings' },
    { src: 'https://picsum.photos/seed/wedding-3/600/800', alt: 'Bridal portrait', category: 'weddings' },
    { src: 'https://picsum.photos/seed/wedding-4/600/800', alt: 'Reception details', category: 'weddings' },
    { src: 'https://picsum.photos/seed/wedding-5/600/800', alt: 'Couple portrait', category: 'weddings' },
    { src: 'https://picsum.photos/seed/wedding-6/600/800', alt: 'Wedding rings', category: 'weddings' },
    { src: 'https://picsum.photos/seed/wedding-7/600/800', alt: 'Getting ready', category: 'weddings' },
    { src: 'https://picsum.photos/seed/wedding-8/600/800', alt: 'Ceremony venue', category: 'weddings' },
  ],
  portraits: [
    { src: 'https://picsum.photos/seed/portrait-1/600/800', alt: 'Professional headshot', category: 'portraits' },
    { src: 'https://picsum.photos/seed/portrait-2/600/800', alt: 'Studio portrait', category: 'portraits' },
    { src: 'https://picsum.photos/seed/portrait-3/600/800', alt: 'Environmental portrait', category: 'portraits' },
    { src: 'https://picsum.photos/seed/portrait-4/600/800', alt: 'Candid moment', category: 'portraits' },
    { src: 'https://picsum.photos/seed/portrait-5/600/800', alt: 'Black and white portrait', category: 'portraits' },
    { src: 'https://picsum.photos/seed/portrait-6/600/800', alt: 'Outdoor portrait', category: 'portraits' },
    { src: 'https://picsum.photos/seed/portrait-7/600/800', alt: 'Close-up portrait', category: 'portraits' },
    { src: 'https://picsum.photos/seed/portrait-8/600/800', alt: 'Family portrait', category: 'portraits' },
  ],
  events: [
    { src: 'https://picsum.photos/seed/event-1/600/800', alt: 'Corporate event', category: 'events' },
    { src: 'https://picsum.photos/seed/event-2/600/800', alt: 'Conference keynote', category: 'events' },
    { src: 'https://picsum.photos/seed/event-3/600/800', alt: 'Product launch', category: 'events' },
    { src: 'https://picsum.photos/seed/event-4/600/800', alt: 'Networking event', category: 'events' },
    { src: 'https://picsum.photos/seed/event-5/600/800', alt: 'Award ceremony', category: 'events' },
    { src: 'https://picsum.photos/seed/event-6/600/800', alt: 'Event details', category: 'events' },
    { src: 'https://picsum.photos/seed/event-7/600/800', alt: 'Attendee candid', category: 'events' },
    { src: 'https://picsum.photos/seed/event-8/600/800', alt: 'Event venue', category: 'events' },
  ],
  commercial: [
    { src: 'https://picsum.photos/seed/commercial-1/600/800', alt: 'Product photography', category: 'commercial' },
    { src: 'https://picsum.photos/seed/commercial-2/600/800', alt: 'Architectural detail', category: 'commercial' },
    { src: 'https://picsum.photos/seed/commercial-3/600/800', alt: 'Interior design', category: 'commercial' },
    { src: 'https://picsum.photos/seed/commercial-4/600/800', alt: 'Brand storytelling', category: 'commercial' },
    { src: 'https://picsum.photos/seed/commercial-5/600/800', alt: 'Commercial space', category: 'commercial' },
    { src: 'https://picsum.photos/seed/commercial-6/600/800', alt: 'Product detail', category: 'commercial' },
    { src: 'https://picsum.photos/seed/commercial-7/600/800', alt: 'Construction project', category: 'commercial' },
    { src: 'https://picsum.photos/seed/commercial-8/600/800', alt: 'Workspace photography', category: 'commercial' },
  ],
}

function FlipTile({ images, index }) {
  const controls = useAnimation()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [nextImageIndex, setNextImageIndex] = useState(1)
  const isFlippingRef = useRef(false)
  const intervalRef = useRef(null)

  const currentImage = images[currentImageIndex]
  const nextImage = images[nextImageIndex]

  const performFlip = useCallback(async () => {
    if (isFlippingRef.current) return
    isFlippingRef.current = true

    await controls.start({
      rotateX: 90,
      transition: { duration: 0.3, ease: [0.4, 0, 1, 1] }
    })

    setCurrentImageIndex(nextImageIndex)
    setNextImageIndex((nextImageIndex + 1) % images.length)

    controls.set({ rotateX: -90 })

    await controls.start({
      rotateX: 0,
      transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
    })

    isFlippingRef.current = false
  }, [controls, images.length, nextImageIndex])

  useEffect(() => {
    const initialDelay = index * 150 + Math.random() * 500

    const startTimer = setTimeout(() => {
      controls.set({ rotateX: -90 })
      controls.start({
        rotateX: 0,
        transition: { duration: 0.5, ease: [0.2, 0.8, 0.3, 1] }
      })

      const scheduleNextFlip = () => {
        const delay = FLIP_INTERVAL_MIN + Math.random() * (FLIP_INTERVAL_MAX - FLIP_INTERVAL_MIN)
        intervalRef.current = setTimeout(() => {
          performFlip().then(() => {
            scheduleNextFlip()
          })
        }, delay)
      }

      const firstFlipDelay = FLIP_INTERVAL_MIN + Math.random() * (FLIP_INTERVAL_MAX - FLIP_INTERVAL_MIN)
      setTimeout(() => {
        performFlip().then(() => {
          scheduleNextFlip()
        })
      }, firstFlipDelay)
    }, initialDelay)

    return () => {
      clearTimeout(startTimer)
      if (intervalRef.current) clearTimeout(intervalRef.current)
    }
  }, [controls, index, performFlip])

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-lg shadow-lg"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={controls}
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center'
        }}
      >
        <div className="absolute inset-0 backface-hidden">
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <span className="text-xs text-white/90 font-medium uppercase tracking-wide">
              {currentImage.category}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function PhotographySection() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const allImages = useMemo(() => {
    if (selectedCategory === 'all') {
      return Object.values(demoImages).flat()
    }
    return demoImages[selectedCategory] || []
  }, [selectedCategory])

  const displayImages = useMemo(() => {
    const shuffled = [...allImages].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 24)
  }, [allImages])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [selectedCategory])

  return (
    <section id="photography" className="bg-acqua-cream dark:bg-acqua-navy py-24">
      <div className="section-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-1 text-acqua-navy dark:text-acqua-cream mb-4">
            Photography
          </h2>
          <p className="body-large text-acqua-navy/70 dark:text-acqua-cream/70 max-w-2xl mx-auto">
            Capturing moments that matter, from intimate celebrations to commercial storytelling.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {['all', 'weddings', 'portraits', 'events', 'commercial'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-6 py-2 rounded-full font-medium transition-all duration-300
                ${selectedCategory === category
                  ? 'bg-acqua-teal text-white shadow-lg scale-105'
                  : 'bg-white/50 dark:bg-acqua-navy-light text-acqua-navy dark:text-acqua-cream hover:bg-acqua-teal/20 dark:hover:bg-acqua-teal/20'
                }
              `}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {displayImages.map((image, index) => (
              <div
                key={`${image.category}-${index}`}
                className="aspect-[3/4] w-full"
              >
                <FlipTile images={allImages} index={index} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-20"
        >
          <h3 className="heading-3 text-acqua-navy dark:text-acqua-cream mb-4">
            Interested in booking?
          </h3>
          <p className="body-large text-acqua-navy/70 dark:text-acqua-cream/70 mb-8 max-w-xl mx-auto">
            Whether it's a wedding, portrait session, or commercial project, let's create something memorable together.
          </p>
          <a
            href="#about"
            className="btn-primary inline-flex items-center gap-2 bg-acqua-teal hover:bg-acqua-teal-dark text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Get in Touch
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default PhotographySection
