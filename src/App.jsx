import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

// Components
import Carousel from './components/Carousel'
import Navigation from './components/Navigation'
import ThemeToggle from './components/ThemeToggle'

// Sections
import ConsultingSection from './sections/Consulting'
import PhotographySection from './sections/Photography'
import WorkshopSection from './sections/Workshop'
import AboutSection from './sections/About'

const sections = [
  { id: 'consulting', title: 'Consulting', component: ConsultingSection },
  { id: 'photography', title: 'Photography', component: PhotographySection },
  { id: 'workshop', title: 'Workshop', component: WorkshopSection },
  { id: 'about', title: 'About', component: AboutSection },
]

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  // Get current section from hash, default to consulting
  const getCurrentSection = useCallback(() => {
    const hash = location.hash.replace('#', '').split('/')[0]
    const sectionIndex = sections.findIndex(s => s.id === hash)
    return sectionIndex >= 0 ? sectionIndex : 0
  }, [location.hash])

  const [currentSlide, setCurrentSlide] = useState(getCurrentSection())
  const [hasScrolledPast, setHasScrolledPast] = useState(false)

  // Update slide when hash changes
  useEffect(() => {
    setCurrentSlide(getCurrentSection())
  }, [getCurrentSection])

  // Handle slide change
  const handleSlideChange = (index) => {
    setCurrentSlide(index)
    navigate(`#${sections[index].id}`)
  }

  // Handle scroll to detect when user scrolls past carousel
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const threshold = window.innerHeight * 0.8
      setHasScrolledPast(scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const CurrentSection = sections[currentSlide].component

  return (
    <div className="min-h-screen">
      {/* Skip to content link */}
      <a href="#content" className="skip-link">
        Skip to main content
      </a>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Navigation */}
      <Navigation
        sections={sections}
        currentSection={currentSlide}
        onSectionChange={handleSlideChange}
        visible={hasScrolledPast}
      />

      {/* Hero Carousel */}
      <Carousel
        sections={sections}
        currentSlide={currentSlide}
        onSlideChange={handleSlideChange}
        isPaused={hasScrolledPast}
      />

      {/* Content Sections */}
      <main id="content" className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentSection />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-acqua-navy dark:bg-acqua-navy-light text-acqua-cream py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm opacity-80">
            &copy; {new Date().getFullYear()} JesseProjects. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
