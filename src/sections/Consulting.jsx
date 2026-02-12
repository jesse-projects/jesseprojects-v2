import { motion } from 'framer-motion'

const fears = [
  {
    fear: 'We just spent $200K on an ERP and nobody uses it.',
    response:
      'That is not a software problem. That is a change management problem, and it is fixable without starting over.',
  },
  {
    fear: 'Our field teams refuse to use the new app.',
    response:
      'They are not being difficult. Nobody asked them what they needed before choosing the tool. We fix that.',
  },
  {
    fear: 'I have 14 systems and none of them talk to each other.',
    response:
      'You do not need one system to rule them all. You need a strategy for how data flows between the ones that matter.',
  },
  {
    fear: 'Every vendor says they are the solution.',
    response:
      'Of course they do. I do not sell software. I help you cut through the noise and find what actually fits your operation.',
  },
  {
    fear: 'We are making million-dollar technology decisions based on a demo.',
    response:
      'A demo shows you the best-case scenario. I help you stress-test it against your worst Tuesday.',
  },
]

const approach = [
  {
    step: 'Listen',
    title: 'Understand the real operation',
    description:
      'Before any recommendations, I spend time with the people who actually do the work. Not just the executives who approved the budget. The project managers who run the jobs. The superintendents in the field. The accounting team closing the month. Every one of them knows something the others do not.',
  },
  {
    step: 'Assess',
    title: 'Map what you have to what you need',
    description:
      'Most companies do not have a technology problem. They have a visibility problem. I inventory your current systems, identify where data breaks down, and find the gaps between what leadership needs to see and what the tools actually produce. Sometimes the answer is better configuration, not more software.',
  },
  {
    step: 'Translate',
    title: 'Bridge the language gap',
    description:
      'When your CFO says "we need better WIP visibility" and your PM says "I need less data entry," they are describing the same problem from different sides of the building. I translate between construction operations and technology so the solution serves both.',
  },
  {
    step: 'Implement',
    title: 'Build it so it sticks',
    description:
      'A plan nobody follows is just a PDF. I work with your team to implement changes at a pace they can absorb, with training designed for how construction people actually learn: hands-on, role-specific, and tied to the work they do every day.',
  },
  {
    step: 'Empower',
    title: 'Leave you stronger than I found you',
    description:
      'Success means your team runs it without me. I build internal capability, not consulting dependency. When I leave, your people own the systems, understand the data flows, and can make the next technology decision with confidence.',
  },
]

const outcomes = [
  {
    before: 'Your superintendent carries a clipboard AND a tablet because neither system has everything.',
    after: 'One device, one workflow, all the information they need on the jobsite.',
  },
  {
    before: 'Your CFO calls three people to get a WIP report that is already two weeks old.',
    after: 'The report builds itself from data your teams are already entering.',
  },
  {
    before: 'Your PM exports data to Excel to make two systems talk to each other.',
    after: 'The systems share data automatically. The PM manages projects instead of spreadsheets.',
  },
  {
    before: 'Your VP of operations finds out about a cost overrun from the monthly close, not the field.',
    after: 'Cost data flows from the field to the forecast in real time. No surprises at month-end.',
  },
]

const credentials = [
  { value: '24+', label: 'Years in Construction Technology' },
  { value: 'Both Sides', label: 'Field Operations to Executive Suite' },
  { value: 'Zero', label: 'Vendor Affiliations or Software to Sell' },
  { value: '$10M+', label: 'In Failed Implementations Witnessed and Recovered' },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function ConsultingSection() {
  return (
    <div className="bg-acqua-cream dark:bg-acqua-navy">

      {/* ============================================ */}
      {/* SECTION 1: OPENING STATEMENT                 */}
      {/* ============================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-acqua-navy via-acqua-navy-light to-acqua-teal-dark" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.05) 35px, rgba(255,255,255,0.05) 70px)',
          }}
        />
        <div className="relative section-content py-24 md:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center"
          >
            <p className="text-acqua-orange font-semibold tracking-wider uppercase text-sm mb-6">
              Construction Technology Consulting
            </p>
            <h2 className="heading-1 text-white mb-8 leading-tight">
              You do not need more software.{' '}
              <span className="text-acqua-orange">You need someone who speaks both languages.</span>
            </h2>
            <p className="body-large text-white/80 max-w-3xl mx-auto mb-4">
              Construction runs on relationships, field knowledge, and hard-earned trust.
              Technology should serve that reality, not replace it. But somewhere between
              the vendor demos and the executive pressure, the people who actually do the
              work get left out of the conversation.
            </p>
            <p className="body-large text-white/60 max-w-3xl mx-auto">
              That is where I come in.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 2: THE PROBLEM SPACE                 */}
      {/* ============================================ */}
      <section className="section-content py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="heading-2 text-acqua-navy dark:text-acqua-cream mb-8">
              The industry has a pattern, and it is expensive.
            </h3>
            <div className="space-y-6 text-acqua-navy/80 dark:text-acqua-cream/80">
              <p className="body-large">
                A mid-market contractor, say $10 million to $100 million in annual revenue, hits a growth
                ceiling. The systems that got them here cannot get them there. The estimating spreadsheet
                is a liability. The project management tool is really just shared folders. The accounting
                software cannot produce the reports the bank is asking for.
              </p>
              <p className="body-large">
                So leadership makes a decision: time to modernize. They attend a conference. They sit
                through demos. Every vendor in the room has a slide that says "seamless integration" and
                a case study from a company twice their size. They pick the one with the best pitch, write
                a six-figure check, and announce the rollout at an all-hands meeting.
              </p>
              <p className="body-large">
                Six months later, the field teams are still using the old clipboard. The office staff
                is double-entering data. The executives cannot get the dashboard they were promised because
                nobody is entering data the way the system expects. The vendor says it is a training problem.
                The team says the tool does not fit how they work. Both are partially right. Neither is
                the whole story.
              </p>
              <p className="body-large font-medium text-acqua-navy dark:text-acqua-cream">
                The problem is not the technology. The problem is that nobody translated between what the
                business needed and what the technology required. Nobody asked the superintendent how he
                actually tracks daily production. Nobody mapped the data flow from the field to the
                financial statement. Nobody planned for the human side of change.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 3: SOUND FAMILIAR? (FEARS)           */}
      {/* ============================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white dark:from-acqua-navy-light dark:via-acqua-navy dark:to-acqua-navy-light" />
        <div className="relative section-content py-20 md:py-28">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <h3 className="heading-2 text-acqua-navy dark:text-acqua-cream mb-4">
                Sound familiar?
              </h3>
              <p className="body-large text-acqua-navy/60 dark:text-acqua-cream/60">
                These are not failures. They are the starting point of every engagement I take on.
              </p>
            </motion.div>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-5"
            >
              {fears.map((fearItem, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="grid md:grid-cols-2 gap-4 md:gap-6 p-6 rounded-xl bg-white/80 dark:bg-acqua-navy/60 backdrop-blur-sm shadow-sm border border-acqua-navy/5 dark:border-acqua-cream/5"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 mt-0.5 rounded-full bg-acqua-orange/10 dark:bg-acqua-orange/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-acqua-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <p className="text-lg italic text-acqua-navy dark:text-acqua-cream leading-relaxed">
                      &ldquo;{fearItem.fear}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-start gap-4 md:border-l md:border-acqua-navy/10 dark:md:border-acqua-cream/10 md:pl-6">
                    <span className="flex-shrink-0 w-8 h-8 mt-0.5 rounded-full bg-acqua-teal/10 dark:bg-acqua-teal/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-acqua-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <p className="text-acqua-navy/80 dark:text-acqua-cream/80 leading-relaxed">
                      {fearItem.response}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 4: WHO JESSE IS (THE TRANSLATOR)     */}
      {/* ============================================ */}
      <section className="section-content py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h3 className="heading-2 text-acqua-navy dark:text-acqua-cream mb-8">
              The person between the technology and the work.
            </h3>
            <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
              <div className="lg:col-span-3 space-y-6 text-acqua-navy/80 dark:text-acqua-cream/80">
                <p className="body-large">
                  I have been the field engineer who had to use the tool that corporate picked without
                  asking. I have been the project manager who had to produce reports from systems that
                  did not talk to each other. I have been the VP who had to justify a seven-figure
                  technology investment to a board that wanted certainty. And I have been the solutions
                  architect who had to make all of it work after the contract was signed.
                </p>
                <p className="body-large">
                  Twenty-four years across construction operations and technology gave me something
                  that most consultants and most vendors do not have: fluency in both languages. I
                  understand what a CFO means when they say "we need better visibility into our WIP."
                  And I understand what a superintendent means when they say "this app does not work."
                  More importantly, I understand that those two statements are usually about the same
                  underlying problem.
                </p>
                <p className="body-large">
                  I do not represent any software vendor. I do not earn commissions on tool selections.
                  I do not have a product to upsell. My only job is to help you make technology decisions
                  you can defend with confidence, and to make sure those decisions actually improve the
                  work your people do every day.
                </p>
              </div>
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {credentials.map((cred, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="p-5 rounded-xl bg-gradient-to-br from-acqua-navy/5 to-acqua-teal/5 dark:from-acqua-cream/5 dark:to-acqua-teal/10 border border-acqua-navy/5 dark:border-acqua-cream/5"
                    >
                      <p className="text-2xl md:text-3xl font-bold text-acqua-teal dark:text-acqua-orange mb-1">
                        {cred.value}
                      </p>
                      <p className="text-sm text-acqua-navy/70 dark:text-acqua-cream/70 font-medium">
                        {cred.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 5: HOW HE WORKS (THE APPROACH)       */}
      {/* ============================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-acqua-navy via-acqua-navy-light to-acqua-teal-dark" />
        <div className="relative section-content py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-14"
            >
              <h3 className="heading-2 text-white mb-4">
                How I work
              </h3>
              <p className="body-large text-white/70 max-w-3xl">
                Not a rigid process. Not a framework with a trademark symbol. Just the way
                complex problems actually get solved when you respect the people involved.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {approach.map((phase, index) => (
                <motion.div
                  key={phase.step}
                  variants={item}
                  className="grid md:grid-cols-12 gap-4 md:gap-6 group"
                >
                  <div className="md:col-span-3 flex md:flex-col items-center md:items-end gap-3 md:gap-1 md:text-right md:pt-1">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-acqua-orange/20 text-acqua-orange font-bold text-lg flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-acqua-orange font-semibold text-lg uppercase tracking-wide">
                        {phase.step}
                      </p>
                      <p className="text-white font-medium text-sm md:text-base">
                        {phase.title}
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-9 md:border-l md:border-white/10 md:pl-6">
                    <p className="text-white/75 leading-relaxed">
                      {phase.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 6: WHAT CHANGES (OUTCOMES)            */}
      {/* ============================================ */}
      <section className="section-content py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <h3 className="heading-2 text-acqua-navy dark:text-acqua-cream mb-4">
              What actually changes.
            </h3>
            <p className="body-large text-acqua-navy/70 dark:text-acqua-cream/70 max-w-3xl">
              Not buzzwords. Not "digital transformation." Real differences in how your people
              spend their time and how your business sees its own data.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {outcomes.map((outcome, index) => (
              <motion.div
                key={index}
                variants={item}
                className="grid md:grid-cols-2 gap-0 rounded-xl overflow-hidden shadow-sm"
              >
                <div className="p-6 bg-acqua-navy/5 dark:bg-white/5 border-l-4 border-acqua-orange/40">
                  <p className="text-xs font-semibold uppercase tracking-wider text-acqua-orange/70 dark:text-acqua-orange/60 mb-2">
                    Before
                  </p>
                  <p className="text-acqua-navy/80 dark:text-acqua-cream/80 leading-relaxed">
                    {outcome.before}
                  </p>
                </div>
                <div className="p-6 bg-acqua-teal/5 dark:bg-acqua-teal/10 border-l-4 md:border-l-0 md:border-r-4 border-acqua-teal/40">
                  <p className="text-xs font-semibold uppercase tracking-wider text-acqua-teal/70 mb-2">
                    After
                  </p>
                  <p className="text-acqua-navy/80 dark:text-acqua-cream/80 leading-relaxed">
                    {outcome.after}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 7: ARENAS (SERVICE AREAS)             */}
      {/* ============================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white dark:from-acqua-navy-light dark:via-acqua-navy dark:to-acqua-navy-light" />
        <div className="relative section-content py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-14"
            >
              <h3 className="heading-2 text-acqua-navy dark:text-acqua-cream mb-4">
                Where I operate.
              </h3>
              <p className="body-large text-acqua-navy/70 dark:text-acqua-cream/70 max-w-3xl">
                I do not name specific tools on purpose. The products change every few years. The
                problems do not. These are the arenas where I help contractors make better decisions.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                {
                  title: 'ERP and Financial Systems',
                  description:
                    'Job costing, general ledger, payroll, accounts payable, WIP reporting. The financial backbone of a contractor and the system most likely to be underutilized or outgrown.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                  ),
                },
                {
                  title: 'Project Management Platforms',
                  description:
                    'Scheduling, budgeting, change orders, submittals, RFIs. The operational hub that connects the office to the field and the estimate to the final cost.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
                    </svg>
                  ),
                },
                {
                  title: 'Field Data Collection',
                  description:
                    'Daily reports, time tracking, safety observations, quality inspections. Where the real data lives and where most technology initiatives succeed or die.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                  ),
                },
                {
                  title: 'Document Management',
                  description:
                    'Plans, specifications, contracts, correspondence. The paper trail that keeps projects on track and protects you when things go sideways.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  ),
                },
                {
                  title: 'Integration and Data Flow',
                  description:
                    'APIs, custom connectors, automated workflows, reporting pipelines. The invisible plumbing that determines whether your systems work together or against each other.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  ),
                },
                {
                  title: 'Change Management',
                  description:
                    'Adoption planning, stakeholder alignment, role-based training, phased rollouts. The human infrastructure that makes technology investments actually pay off.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  ),
                },
              ].map((arena) => (
                <motion.div
                  key={arena.title}
                  variants={item}
                  className="p-6 rounded-xl bg-white/80 dark:bg-acqua-navy/60 backdrop-blur-sm border border-acqua-navy/5 dark:border-acqua-cream/5 shadow-sm"
                >
                  <div className="w-10 h-10 mb-4 rounded-lg bg-acqua-teal/10 dark:bg-acqua-orange/15 flex items-center justify-center text-acqua-teal dark:text-acqua-orange">
                    {arena.icon}
                  </div>
                  <h4 className="heading-3 text-acqua-navy dark:text-acqua-cream mb-3 text-lg">
                    {arena.title}
                  </h4>
                  <p className="text-acqua-navy/70 dark:text-acqua-cream/70 text-sm leading-relaxed">
                    {arena.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 8: EXPERIENCE BADGE                   */}
      {/* ============================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-acqua-navy dark:bg-acqua-navy-light" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 50%, rgba(3,101,100,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(247,148,31,0.2) 0%, transparent 50%)',
          }}
        />
        <div className="relative section-content py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <p className="text-6xl md:text-7xl font-bold text-acqua-orange mb-3">24+</p>
            <p className="text-xl md:text-2xl text-white/80 mb-8 font-light">
              years in construction technology
            </p>
            <div className="w-16 h-px bg-acqua-orange/40 mx-auto mb-8" />
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-6 leading-relaxed">
              I have been on both sides of every table in this industry. The field trailer and the
              boardroom. The vendor pitch and the user complaint. The go-live celebration and the
              post-mortem after it fell apart.
            </p>
            <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              That breadth is not common. Most technology consultants have never poured concrete.
              Most construction operators have never written an API integration. I have done both,
              and that is why I can translate between worlds that usually talk past each other.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 9: THE CONVERSATION (CTA)             */}
      {/* ============================================ */}
      <section className="section-content py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h3 className="heading-2 text-acqua-navy dark:text-acqua-cream mb-6">
            Let&apos;s have a conversation.
          </h3>
          <p className="body-large text-acqua-navy/70 dark:text-acqua-cream/70 mb-4">
            No sales pitch. No slide deck. No pressure to sign anything.
          </p>
          <p className="body-large text-acqua-navy/70 dark:text-acqua-cream/70 mb-10">
            Just tell me where it hurts. We will figure out together whether I am the right person
            to help, and if I am not, I will tell you that too. Thirty minutes, a straightforward
            conversation, and you will walk away with at least one thing you had not considered.
          </p>
          <a
            href="https://cal.com/thejessejones"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-3 text-lg px-8 py-4"
          >
            Schedule a Conversation
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </a>
          <p className="mt-6 text-sm text-acqua-navy/50 dark:text-acqua-cream/50">
            Prefer email? Reach out at{' '}
            <a
              href="mailto:jesse@jesseprojects.com"
              className="underline underline-offset-2 hover:text-acqua-teal dark:hover:text-acqua-orange transition-colors"
            >
              jesse@jesseprojects.com
            </a>
          </p>
        </motion.div>
      </section>

    </div>
  )
}

export default ConsultingSection
