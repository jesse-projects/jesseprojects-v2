import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const slideContent = [
  {
    id: 'consulting',
    title: 'Technology Should Work For You',
    subtitle: 'Not the other way around.',
    description: 'I help construction teams understand their tech stack, find the right tools, and make confident decisions—without the fear.',
    cta: 'Learn More',
    gradient: 'from-acqua-navy via-acqua-navy-light to-acqua-teal',
    image: '/images/consulting/hero-line-art.jpg',
    imagePosition: 'center bottom', // Position the line art figures
  },
  {
    id: 'photography',
    title: 'Photography',
    subtitle: 'Capturing your most precious moments',
    description: 'With artistry and care.',
    cta: 'View Gallery',
    gradient: 'from-acqua-teal via-acqua-teal-dark to-acqua-navy',
    image: '/images/photography-hero.jpg',
  },
  {
    id: 'workshop',
    title: 'Workshop',
    subtitle: 'Projects and builds from my home shop',
    description: 'Woodworking, metalwork, signage, and creative experiments.',
    cta: 'See Projects',
    gradient: 'from-acqua-orange via-acqua-teal to-acqua-navy',
    image: '/images/workshop-hero.jpg',
  },
  {
    id: 'about',
    title: 'About',
    subtitle: 'The story behind JesseProjects',
    description: '24 years translating between how work happens and how tools work.',
    cta: 'Get in Touch',
    gradient: 'from-acqua-navy-light via-acqua-navy to-acqua-teal',
    image: '/images/about-hero.png',
  },
]

// Smoother slide transition variants
const slideVariants = {
  enter: {
    opacity: 0,
    scale: 1.02,
  },
  center: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth feel
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
}

const contentVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: delay,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

function Carousel({ sections, currentSlide, onSlideChange, isPaused }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const autoplayDelay = 7000

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          onSlideChange((currentSlide - 1 + sections.length) % sections.length)
          break
        case 'ArrowRight':
          e.preventDefault()
          onSlideChange((currentSlide + 1) % sections.length)
          break
        case ' ':
          e.preventDefault()
          setIsPlaying(!isPlaying)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide, isPlaying, onSlideChange, sections.length])

  // Autoplay
  useEffect(() => {
    if (!isPlaying || isPaused) return

    const interval = setInterval(() => {
      onSlideChange((currentSlide + 1) % sections.length)
    }, autoplayDelay)

    return () => clearInterval(interval)
  }, [currentSlide, isPlaying, isPaused, onSlideChange, sections.length])

  const goToPrev = useCallback(() => {
    onSlideChange((currentSlide - 1 + sections.length) % sections.length)
  }, [currentSlide, onSlideChange, sections.length])

  const goToNext = useCallback(() => {
    onSlideChange((currentSlide + 1) % sections.length)
  }, [currentSlide, onSlideChange, sections.length])

  return (
    <section className="carousel-container" aria-label="Hero carousel">
      {/* Slides */}
      <AnimatePresence mode="wait">
        {slideContent.map((slide, index) => (
          index === currentSlide && (
            <motion.article
              key={slide.id}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex items-center justify-center overflow-hidden"
            >
              {/* Background - Image or Gradient */}
              {slide.image ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover"
                    style={{
                      backgroundImage: `url(${slide.image})`,
                      backgroundPosition: slide.imagePosition || 'center center'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </>
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
              )}

              {/* Content */}
              <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
                <motion.h1
                  custom={0.2}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="heading-1 mb-4"
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  custom={0.35}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-2xl md:text-3xl font-light mb-4 text-white/90"
                >
                  {slide.subtitle}
                </motion.p>
                <motion.p
                  custom={0.5}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="body-large text-white/80 mb-8 max-w-2xl mx-auto"
                >
                  {slide.description}
                </motion.p>
                <motion.button
                  custom={0.65}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => {
                    const element = document.getElementById('content')
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="btn-secondary"
                >
                  {slide.cta}
                </motion.button>
              </div>
            </motion.article>
          )
        ))}
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-10">
        {/* Prev Button */}
        <button
          onClick={goToPrev}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
          aria-label="Previous slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>

        {/* Indicators */}
        <div className="flex space-x-2" role="tablist">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => onSlideChange(index)}
              role="tab"
              aria-selected={index === currentSlide}
              aria-label={`Go to ${section.title}`}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
          aria-label="Next slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-white/60"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Carousel
