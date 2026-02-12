import { motion } from 'framer-motion'

const services = [
  {
    title: 'Tech Stack Clarity',
    description: 'Understand what you have, what you need, and what you can let go of.',
    features: [
      'Full inventory of your current tools',
      'Gap analysis and overlap identification',
      'Plain-English recommendations',
      'Roadmap you can actually follow',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Tool Selection',
    description: 'Find the right tool for your team—not the one with the best sales pitch.',
    features: [
      'Requirements gathering with your team',
      'Vendor-neutral evaluation',
      'Demo coordination and scoring',
      'Implementation planning',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: 'Integration & Training',
    description: 'Get your systems talking to each other—and your team comfortable using them.',
    features: [
      'Data flow design',
      'Custom integrations',
      'Team training sessions',
      'Documentation your people will use',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
]

const fears = [
  {
    fear: "I don't understand what we already have.",
    response: "That's exactly where we start. No judgment—just clarity.",
  },
  {
    fear: "Every vendor says they're the solution.",
    response: "I don't sell software. I help you figure out what actually fits.",
  },
  {
    fear: "My team won't use another new tool.",
    response: "Change management matters more than features. We'll plan for both.",
  },
  {
    fear: "I'm afraid of making an expensive mistake.",
    response: "That fear is valid. Let's make a decision you can defend.",
  },
]

const approach = [
  {
    title: 'Listen first',
    description: 'Before any recommendations, I need to understand how your team actually works—not how a process doc says they should.',
  },
  {
    title: 'Translate',
    description: 'I bridge the gap between what field crews need and what executives are asking for. Both matter.',
  },
  {
    title: 'Simplify',
    description: "More tools isn't the answer. Sometimes the best recommendation is to stop using something.",
  },
  {
    title: 'Empower',
    description: "Success means your team can run it without me. I build solutions, not dependencies.",
  },
]

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

function ConsultingSection() {
  return (
    <div className="bg-acqua-cream dark:bg-acqua-navy">
      {/* Hero Statement */}
      <section className="section-content text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-1 text-acqua-navy dark:text-acqua-cream mb-6">
            Technology decisions shouldn't feel like gambling.
          </h2>
          <p className="body-large text-acqua-navy/70 dark:text-acqua-cream/70 max-w-3xl mx-auto">
            I help construction teams understand their tech stack, find the right tools,
            and make confident decisions—without the fear.
          </p>
        </motion.div>
      </section>

      {/* Common Fears - with hub connector background */}
      <section className="section-content relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-25 dark:opacity-15 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/consulting/hub-connector.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/70 dark:from-acqua-navy-light/80 dark:via-acqua-navy-light/60 dark:to-acqua-navy-light/80" />

        <div className="relative max-w-4xl mx-auto">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="heading-2 text-center mb-4 text-acqua-navy dark:text-acqua-cream"
          >
            Sound familiar?
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-acqua-navy/60 dark:text-acqua-cream/60 mb-10"
          >
            These aren't failures. They're starting points.
          </motion.p>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {fears.map((fearItem, index) => (
              <motion.div
                key={index}
                variants={item}
                className="grid md:grid-cols-2 gap-4 p-5 rounded-xl bg-white/70 dark:bg-acqua-navy/70 backdrop-blur-sm shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 mt-1 text-acqua-orange">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <p className="text-lg italic text-acqua-navy dark:text-acqua-cream">"{fearItem.fear}"</p>
                </div>
                <div className="flex items-start gap-3 md:border-l md:border-acqua-navy/10 dark:md:border-acqua-cream/10 md:pl-4">
                  <span className="flex-shrink-0 w-6 h-6 mt-1 text-acqua-teal">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <p className="text-acqua-navy/80 dark:text-acqua-cream/80">{fearItem.response}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* My Approach - with chaos-to-order image */}
      <section className="section-content bg-acqua-cream dark:bg-acqua-navy">
        <div className="max-w-6xl mx-auto">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="heading-2 text-center mb-12 text-acqua-navy dark:text-acqua-cream"
          >
            How I Work
          </motion.h3>

          {/* Chaos to Order image with overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden mb-12 shadow-xl"
          >
            <img
              src="/images/consulting/chaos-to-order.jpg"
              alt="Complexity becoming clarity"
              className="w-full h-48 md:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-acqua-navy/80 via-acqua-navy/40 to-transparent flex items-center">
              <p className="text-white text-xl md:text-2xl font-light px-8 max-w-md">
                From tangled complexity to <span className="text-acqua-orange font-medium">clear direction</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {approach.map((step, index) => (
              <motion.div
                key={step.title}
                variants={item}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-acqua-teal/10 dark:bg-acqua-orange/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-acqua-teal dark:text-acqua-orange">{index + 1}</span>
                </div>
                <h4 className="heading-3 text-acqua-navy dark:text-acqua-cream mb-2">
                  {step.title}
                </h4>
                <p className="text-acqua-navy/70 dark:text-acqua-cream/70">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Grid - with bridge image header */}
      <section className="section-content bg-white dark:bg-acqua-navy-light">
        {/* Bridge image as section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden mb-12 shadow-xl"
        >
          <img
            src="/images/consulting/bridge-sunrise.jpg"
            alt="Bridging construction and technology"
            className="w-full h-40 md:h-56 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-acqua-navy-light/90 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="heading-2 text-white drop-shadow-lg">
              Services
            </h3>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={item}
              className="card p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-12 h-12 mb-4 rounded-lg bg-acqua-teal/10 dark:bg-acqua-orange/10 flex items-center justify-center text-acqua-teal dark:text-acqua-orange">
                {service.icon}
              </div>
              <h4 className="heading-3 text-acqua-navy dark:text-acqua-cream mb-3">
                {service.title}
              </h4>
              <p className="text-acqua-navy/80 dark:text-acqua-cream/80 mb-4">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-acqua-navy/70 dark:text-acqua-cream/70">
                    <svg className="w-4 h-4 text-acqua-teal dark:text-acqua-orange flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Experience Badge */}
      <section className="section-content bg-acqua-navy dark:bg-acqua-navy-light text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <p className="text-6xl font-bold text-acqua-orange mb-2">25+</p>
            <p className="text-xl text-white/80 mb-6">years in construction technology</p>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              I've been on both sides—field operations and the executive table.
              I know why tools fail and what it takes to make them stick.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA - with team handshake background */}
      <section className="section-content relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-15 dark:opacity-10 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/consulting/team-handshake.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-acqua-cream/95 via-acqua-cream/85 to-acqua-cream/95 dark:from-acqua-navy/95 dark:via-acqua-navy/85 dark:to-acqua-navy/95" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative text-center"
        >
          <h3 className="heading-2 text-acqua-navy dark:text-acqua-cream mb-4">
            Let's have a conversation
          </h3>
          <p className="body-large text-acqua-navy/70 dark:text-acqua-cream/70 mb-8 max-w-2xl mx-auto">
            No sales pitch. Just a 30-minute chat about where you are and where you want to be.
          </p>
          <a
            href="https://cal.com/thejessejones"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            Schedule a Call
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </section>
    </div>
  )
}

export default ConsultingSection
