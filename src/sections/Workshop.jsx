import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// API endpoint for workshop data
const WORKSHOP_API = 'https://jesseprojects.com/api/workshops.php'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

// Handmade rotation variations for cards
const getCardRotation = (index) => {
  const rotations = [-0.5, 0.5, -0.3, 0.4, -0.6, 0.3]
  return rotations[index % rotations.length]
}

function WorkshopSection() {
  const [workshops, setWorkshops] = useState([])
  const [categories, setCategories] = useState([])
  const [currentFilter, setCurrentFilter] = useState('all')
  const [selectedWorkshop, setSelectedWorkshop] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch workshops from API
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(WORKSHOP_API)
        if (!response.ok) throw new Error('Failed to fetch workshops')
        const data = await response.json()
        setWorkshops(data.workshops || [])
        setCategories(data.categories || [])
      } catch (err) {
        setError(err.message)
        // Fallback to demo data for development
        setWorkshops([
          {
            id: 'demo-1',
            title: 'CNC Signage',
            category: 'Signage',
            hero_image: '',
            short_description: 'Custom CNC-cut wood signs with gilding paste finish.',
            long_description: 'These handcrafted signs combine modern CNC precision with traditional finishing techniques. Each piece is cut from quality hardwood and finished with metallic gilding paste for a professional look.',
            difficulty: 'Intermediate',
            estimated_time: '4-6 hours',
            materials: ['Wood', 'Gilding Paste', 'Sandpaper', 'Wood Stain'],
            tools: ['CNC Machine', 'Orbital Sander', 'Brushes'],
            images: [],
            steps: [
              { step_number: 1, description: 'Design your sign in CAD software', image: '' },
              { step_number: 2, description: 'Cut the design on CNC machine', image: '' },
              { step_number: 3, description: 'Sand smooth and apply stain', image: '' },
              { step_number: 4, description: 'Apply gilding paste to carved areas', image: '' },
            ],
          },
          {
            id: 'demo-2',
            title: 'Metal Wall Art',
            category: 'Metal Work',
            hero_image: '',
            short_description: 'Plasma-cut steel wall decorations.',
            long_description: 'Modern geometric designs plasma-cut from steel plate and finished with high-temperature paint.',
            difficulty: 'Advanced',
            estimated_time: '6-8 hours',
            materials: ['Steel', 'Paint', 'Clear Coat'],
            tools: ['Plasma Cutter', 'Welder', 'Grinder'],
            images: [],
            steps: [
              { step_number: 1, description: 'Create design template', image: '' },
              { step_number: 2, description: 'Plasma cut the steel', image: '' },
              { step_number: 3, description: 'Clean and grind edges', image: '' },
              { step_number: 4, description: 'Paint and seal', image: '' },
            ],
          },
        ])
        setCategories([
          { name: 'Signage', count: 1 },
          { name: 'Metal Work', count: 1 },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkshops()
  }, [])

  // Filter workshops by category
  const filteredWorkshops = currentFilter === 'all'
    ? workshops
    : workshops.filter(w => w.category.toLowerCase() === currentFilter.toLowerCase())

  // Group by category for display
  const groupedWorkshops = filteredWorkshops.reduce((acc, workshop) => {
    if (!acc[workshop.category]) {
      acc[workshop.category] = []
    }
    acc[workshop.category].push(workshop)
    return acc
  }, {})

  // Open workshop modal
  const openWorkshop = async (workshopId) => {
    try {
      const response = await fetch(`${WORKSHOP_API}?id=${workshopId}`)
      if (!response.ok) throw new Error('Failed to fetch workshop')
      const data = await response.json()
      setSelectedWorkshop(data.workshop)
      setCurrentImageIndex(0)
    } catch (err) {
      // For demo, just show the workshop from local state
      const workshop = workshops.find(w => w.id === workshopId)
      if (workshop) {
        setSelectedWorkshop(workshop)
        setCurrentImageIndex(0)
      }
    }
  }

  // Close workshop modal
  const closeWorkshop = () => {
    setSelectedWorkshop(null)
    setCurrentImageIndex(0)
  }

  // Get all images for carousel (hero + additional images)
  const getCarouselImages = (workshop) => {
    if (!workshop) return []
    const images = []
    if (workshop.hero_image) {
      images.push({ path: workshop.hero_image, alt: workshop.title })
    }
    if (workshop.images && Array.isArray(workshop.images)) {
      images.push(...workshop.images.map(img => ({
        path: typeof img === 'string' ? img : img.path,
        alt: img.alt || workshop.title
      })))
    }
    return images
  }

  // Navigate carousel
  const goToPrevImage = () => {
    if (!selectedWorkshop) return
    const images = getCarouselImages(selectedWorkshop)
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNextImage = () => {
    if (!selectedWorkshop) return
    const images = getCarouselImages(selectedWorkshop)
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  // Difficulty indicator component
  const DifficultyIndicator = ({ difficulty }) => {
    if (!difficulty) return null

    const levels = {
      'beginner': { dots: 1, color: 'bg-green-500' },
      'intermediate': { dots: 2, color: 'bg-yellow-500' },
      'advanced': { dots: 3, color: 'bg-orange-500' },
      'expert': { dots: 4, color: 'bg-red-500' },
    }

    const level = levels[difficulty.toLowerCase()] || levels['intermediate']

    return (
      <div className="flex items-center gap-1">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i < level.dots ? level.color : 'bg-gray-300 dark:bg-gray-600'}`}
          />
        ))}
      </div>
    )
  }

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
            Workshop
          </h2>
          <p className="body-large text-acqua-navy/70 dark:text-acqua-cream/70 max-w-3xl mx-auto">
            Real projects, built by hand in my home workshop. These aren't perfect studio shots—they're authentic builds, sawdust and all.
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="section-content pt-0">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setCurrentFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
              currentFilter === 'all'
                ? 'bg-acqua-teal text-white shadow-lg'
                : 'bg-white dark:bg-acqua-navy-light text-acqua-navy dark:text-acqua-cream hover:bg-acqua-teal/10 shadow-md'
            }`}
          >
            All Projects
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setCurrentFilter(cat.name.toLowerCase())}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                currentFilter.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-acqua-teal text-white shadow-lg'
                  : 'bg-white dark:bg-acqua-navy-light text-acqua-navy dark:text-acqua-cream hover:bg-acqua-teal/10 shadow-md'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </section>

      {/* Workshop Grid */}
      <section className="section-content pt-0">
        {isLoading ? (
          <div className="text-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block w-12 h-12 border-4 border-acqua-teal border-t-transparent rounded-full"
            />
            <p className="mt-4 text-acqua-navy/70 dark:text-acqua-cream/70 font-medium">
              Loading workshop projects...
            </p>
          </div>
        ) : Object.keys(groupedWorkshops).length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔨</div>
            <p className="text-acqua-navy/70 dark:text-acqua-cream/70 text-lg font-medium mb-2">
              No projects found in this category
            </p>
            <p className="text-acqua-navy/50 dark:text-acqua-cream/50 text-sm">
              Check back soon—new builds are always in progress!
            </p>
          </motion.div>
        ) : (
          Object.entries(groupedWorkshops).map(([category, categoryWorkshops]) => (
            <div key={category} className="mb-16">
              <h3 className="heading-3 text-acqua-navy dark:text-acqua-cream mb-8 flex items-center gap-3">
                <span className="inline-block w-12 h-0.5 bg-acqua-teal" />
                {category}
                <span className="inline-block flex-1 h-0.5 bg-acqua-teal/20" />
              </h3>
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {categoryWorkshops.map((workshop, index) => (
                  <motion.article
                    key={workshop.id}
                    variants={item}
                    onClick={() => openWorkshop(workshop.id)}
                    style={{ rotate: `${getCardRotation(index)}deg` }}
                    whileHover={{
                      rotate: 0,
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    className="card cursor-pointer group relative"
                  >
                    {/* Handmade border effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-acqua-teal/20 to-acqua-orange/20 rounded-lg blur-sm group-hover:blur-md transition-all" />

                    <div className="relative bg-white dark:bg-acqua-navy-light rounded-lg overflow-hidden shadow-xl">
                      {/* Image */}
                      <div className="aspect-[4/3] bg-gradient-to-br from-acqua-teal/20 to-acqua-navy/20 relative overflow-hidden">
                        {workshop.hero_image ? (
                          <img
                            src={workshop.hero_image}
                            alt={workshop.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                            🔨
                          </div>
                        )}
                        {/* Title overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                          <h4 className="text-white font-bold text-lg group-hover:text-acqua-teal transition-colors">
                            {workshop.title}
                          </h4>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        {workshop.short_description && (
                          <p className="text-sm text-acqua-navy/70 dark:text-acqua-cream/70 line-clamp-2 mb-4">
                            {workshop.short_description}
                          </p>
                        )}

                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          {workshop.difficulty && (
                            <div className="flex items-center gap-2">
                              <DifficultyIndicator difficulty={workshop.difficulty} />
                              <span className="text-xs text-acqua-navy/60 dark:text-acqua-cream/60 capitalize">
                                {workshop.difficulty}
                              </span>
                            </div>
                          )}
                          {workshop.estimated_time && (
                            <span className="px-3 py-1 text-xs rounded-full bg-acqua-navy/10 dark:bg-white/10 text-acqua-navy/70 dark:text-acqua-cream/70 font-medium">
                              ⏱️ {workshop.estimated_time}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          ))
        )}
      </section>

      {/* Workshop Modal */}
      <AnimatePresence>
        {selectedWorkshop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeWorkshop}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-acqua-navy-light rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-acqua-navy-light">
                <div>
                  <h2 className="heading-3 text-acqua-navy dark:text-acqua-cream">
                    {selectedWorkshop.title}
                  </h2>
                  {selectedWorkshop.category && (
                    <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-acqua-teal/10 text-acqua-teal dark:text-acqua-orange font-medium">
                      {selectedWorkshop.category}
                    </span>
                  )}
                </div>
                <button
                  onClick={closeWorkshop}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-acqua-navy dark:text-acqua-cream">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Image Carousel */}
                {(() => {
                  const carouselImages = getCarouselImages(selectedWorkshop)
                  return carouselImages.length > 0 && (
                    <div className="mb-8 relative">
                      <div className="aspect-[16/10] bg-gradient-to-br from-acqua-teal/10 to-acqua-navy/10 rounded-xl overflow-hidden relative">
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={currentImageIndex}
                            src={carouselImages[currentImageIndex].path}
                            alt={carouselImages[currentImageIndex].alt}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full object-contain"
                          />
                        </AnimatePresence>

                        {/* Carousel Controls (only show if multiple images) */}
                        {carouselImages.length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                goToPrevImage()
                              }}
                              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                              aria-label="Previous image"
                            >
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="15,18 9,12 15,6" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                goToNextImage()
                              }}
                              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                              aria-label="Next image"
                            >
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9,18 15,12 9,6" />
                              </svg>
                            </button>

                            {/* Image indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                              {carouselImages.map((_, i) => (
                                <button
                                  key={i}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setCurrentImageIndex(i)
                                  }}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    i === currentImageIndex
                                      ? 'bg-white scale-125'
                                      : 'bg-white/50 hover:bg-white/75'
                                  }`}
                                  aria-label={`Go to image ${i + 1}`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      {carouselImages.length > 1 && (
                        <p className="text-center text-sm text-acqua-navy/50 dark:text-acqua-cream/50 mt-2">
                          {currentImageIndex + 1} / {carouselImages.length}
                        </p>
                      )}
                    </div>
                  )
                })()}

                {/* Description */}
                {(selectedWorkshop.long_description || selectedWorkshop.short_description) && (
                  <div className="mb-6">
                    <p className="text-acqua-navy/80 dark:text-acqua-cream/80 leading-relaxed">
                      {selectedWorkshop.long_description || selectedWorkshop.short_description}
                    </p>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  {selectedWorkshop.difficulty && (
                    <div>
                      <p className="text-sm font-medium text-acqua-navy dark:text-acqua-cream mb-2">Difficulty</p>
                      <div className="flex items-center gap-3">
                        <DifficultyIndicator difficulty={selectedWorkshop.difficulty} />
                        <span className="text-acqua-navy/70 dark:text-acqua-cream/70 capitalize">
                          {selectedWorkshop.difficulty}
                        </span>
                      </div>
                    </div>
                  )}
                  {selectedWorkshop.estimated_time && (
                    <div>
                      <p className="text-sm font-medium text-acqua-navy dark:text-acqua-cream mb-2">Estimated Time</p>
                      <p className="text-acqua-navy/70 dark:text-acqua-cream/70">
                        ⏱️ {selectedWorkshop.estimated_time}
                      </p>
                    </div>
                  )}
                </div>

                {/* Materials & Tools */}
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  {selectedWorkshop.materials && selectedWorkshop.materials.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-acqua-navy dark:text-acqua-cream mb-3">Materials</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedWorkshop.materials.map((material, i) => (
                          <span key={i} className="px-3 py-1.5 text-sm rounded-full bg-acqua-teal/10 text-acqua-teal dark:text-acqua-orange border border-acqua-teal/20">
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedWorkshop.tools && selectedWorkshop.tools.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-acqua-navy dark:text-acqua-cream mb-3">Tools</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedWorkshop.tools.map((tool, i) => (
                          <span key={i} className="px-3 py-1.5 text-sm rounded-full bg-acqua-navy/10 dark:bg-white/10 text-acqua-navy/70 dark:text-acqua-cream/70 border border-acqua-navy/20 dark:border-white/20">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Step-by-Step Instructions */}
                {selectedWorkshop.steps && selectedWorkshop.steps.length > 0 && (
                  <div>
                    <h3 className="heading-4 text-acqua-navy dark:text-acqua-cream mb-6 flex items-center gap-3">
                      <span className="inline-block w-8 h-0.5 bg-acqua-teal" />
                      Build Process
                    </h3>
                    <div className="space-y-6">
                      {selectedWorkshop.steps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="flex gap-4 group"
                        >
                          {/* Step number */}
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-acqua-teal to-acqua-orange flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                              {step.step_number || i + 1}
                            </div>
                          </div>

                          {/* Step content */}
                          <div className="flex-1">
                            <div className="bg-gray-50 dark:bg-acqua-navy/30 rounded-lg p-4 group-hover:bg-gray-100 dark:group-hover:bg-acqua-navy/40 transition-colors">
                              <p className="text-acqua-navy dark:text-acqua-cream leading-relaxed">
                                {step.description}
                              </p>
                              {step.image && (
                                <div className="mt-3 aspect-video bg-gradient-to-br from-acqua-teal/10 to-acqua-navy/10 rounded-lg overflow-hidden">
                                  <img
                                    src={step.image}
                                    alt={`Step ${step.step_number || i + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty state for no steps */}
                {(!selectedWorkshop.steps || selectedWorkshop.steps.length === 0) && (
                  <div className="text-center py-8 bg-gray-50 dark:bg-acqua-navy/30 rounded-lg">
                    <p className="text-acqua-navy/50 dark:text-acqua-cream/50 text-sm">
                      Build instructions coming soon!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default WorkshopSection
