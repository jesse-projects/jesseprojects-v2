import { motion, AnimatePresence } from 'framer-motion'

function Navigation({ sections, currentSection, onSectionChange, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-acqua-navy/90 backdrop-blur-md shadow-md"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <button
                onClick={() => {
                  onSectionChange(0)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="text-xl font-bold text-acqua-teal dark:text-acqua-orange"
              >
                JesseProjects
              </button>

              {/* Section links */}
              <div className="hidden md:flex items-center space-x-1">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => onSectionChange(index)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentSection === index
                        ? 'bg-acqua-teal/10 text-acqua-teal dark:bg-acqua-orange/10 dark:text-acqua-orange'
                        : 'text-acqua-navy/70 dark:text-acqua-cream/70 hover:text-acqua-teal dark:hover:text-acqua-orange'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-lg text-acqua-navy dark:text-acqua-cream"
                aria-label="Open menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

export default Navigation
