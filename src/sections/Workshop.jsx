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

function WorkshopSection() {
  const [workshops, setWorkshops] = useState([])
  const [categories, setCategories] = useState([])
  const [currentFilter, setCurrentFilter] = useState('all')
  const [selectedWorkshop, setSelectedWorkshop] = useState(null)
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
            materials: ['Wood', 'Gilding Paste'],
            tools: ['CNC Machine', 'Orbital Sander'],
          },
          {
            id: 'demo-2',
            title: 'Metal Wall Art',
            category: 'Metal Work',
            hero_image: '',
            short_description: 'Plasma-cut steel wall decorations.',
            materials: ['Steel', 'Paint'],
            tools: ['Plasma Cutter', 'Welder'],
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
    } catch (err) {
      // For demo, just show the workshop from local state
      const workshop = workshops.find(w => w.id === workshopId)
      if (workshop) setSelectedWorkshop(workshop)
    }
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
            Creative projects from the workshop—woodworking, metalwork, signage, and more.
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="section-content pt-0">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setCurrentFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentFilter === 'all'
                ? 'bg-acqua-teal text-white'
                : 'bg-white dark:bg-acqua-navy-light text-acqua-navy dark:text-acqua-cream hover:bg-acqua-teal/10'
            }`}
          >
            All Projects
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setCurrentFilter(cat.name.toLowerCase())}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                currentFilter.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-acqua-teal text-white'
                  : 'bg-white dark:bg-acqua-navy-light text-acqua-navy dark:text-acqua-cream hover:bg-acqua-teal/10'
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
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-acqua-teal border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-acqua-navy/70 dark:text-acqua-cream/70">Loading projects...</p>
          </div>
        ) : Object.keys(groupedWorkshops).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-acqua-navy/70 dark:text-acqua-cream/70">No projects found.</p>
          </div>
        ) : (
          Object.entries(groupedWorkshops).map(([category, categoryWorkshops]) => (
            <div key={category} className="mb-12">
              <h3 className="heading-3 text-acqua-navy dark:text-acqua-cream mb-6">
                {category}
              </h3>
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {categoryWorkshops.map((workshop) => (
                  <motion.article
                    key={workshop.id}
                    variants={item}
                    onClick={() => openWorkshop(workshop.id)}
                    className="card cursor-pointer group"
                  >
                    {/* Image */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-acqua-teal to-acqua-navy relative overflow-hidden">
                      {workshop.hero_image && (
                        <img
                          src={workshop.hero_image}
                          alt={workshop.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      {/* Title overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <h4 className="text-white font-bold text-lg">{workshop.title}</h4>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {workshop.short_description && (
                        <p className="text-sm text-acqua-navy/70 dark:text-acqua-cream/70 line-clamp-2">
                          {workshop.short_description}
                        </p>
                      )}
                      {(workshop.difficulty || workshop.estimated_time) && (
                        <div className="flex gap-2 mt-3">
                          {workshop.difficulty && (
                            <span className="px-2 py-1 text-xs rounded bg-acqua-teal/10 text-acqua-teal dark:text-acqua-orange">
                              {workshop.difficulty}
                            </span>
                          )}
                          {workshop.estimated_time && (
                            <span className="px-2 py-1 text-xs rounded bg-acqua-navy/10 dark:bg-white/10 text-acqua-navy/70 dark:text-acqua-cream/70">
                              {workshop.estimated_time}
                            </span>
                          )}
                        </div>
                      )}
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedWorkshop(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-acqua-navy-light rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="heading-3 text-acqua-navy dark:text-acqua-cream">
                  {selectedWorkshop.title}
                </h2>
                <button
                  onClick={() => setSelectedWorkshop(null)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {selectedWorkshop.short_description && (
                  <p className="text-acqua-navy/80 dark:text-acqua-cream/80 mb-6">
                    {selectedWorkshop.short_description}
                  </p>
                )}

                {/* Details */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {selectedWorkshop.difficulty && (
                    <div>
                      <p className="text-sm font-medium text-acqua-navy dark:text-acqua-cream">Difficulty</p>
                      <p className="text-acqua-navy/70 dark:text-acqua-cream/70">{selectedWorkshop.difficulty}</p>
                    </div>
                  )}
                  {selectedWorkshop.estimated_time && (
                    <div>
                      <p className="text-sm font-medium text-acqua-navy dark:text-acqua-cream">Time</p>
                      <p className="text-acqua-navy/70 dark:text-acqua-cream/70">{selectedWorkshop.estimated_time}</p>
                    </div>
                  )}
                </div>

                {/* Materials & Tools */}
                {selectedWorkshop.materials && selectedWorkshop.materials.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-acqua-navy dark:text-acqua-cream mb-2">Materials</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedWorkshop.materials.map((material, i) => (
                        <span key={i} className="px-3 py-1 text-sm rounded-full bg-acqua-teal/10 text-acqua-teal dark:text-acqua-orange">
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedWorkshop.tools && selectedWorkshop.tools.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-acqua-navy dark:text-acqua-cream mb-2">Tools</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedWorkshop.tools.map((tool, i) => (
                        <span key={i} className="px-3 py-1 text-sm rounded-full bg-acqua-navy/10 dark:bg-white/10 text-acqua-navy/70 dark:text-acqua-cream/70">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images placeholder */}
                {selectedWorkshop.images && selectedWorkshop.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-6">
                    {selectedWorkshop.images.slice(0, 6).map((img, i) => (
                      <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <img src={img.path} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    ))}
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
