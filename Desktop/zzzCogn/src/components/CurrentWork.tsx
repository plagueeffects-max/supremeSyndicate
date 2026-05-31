import { motion } from 'framer-motion'
import { fadeUp, slideLeft, slideRight, staggerContainer, staggerItem, viewport } from '../animations/variants'
import { track } from '../lib/analytics'

export default function CurrentWork() {
  return (
    <section className="section" id="current-work" aria-labelledby="work-title">
      <div className="wrap">
        <motion.div
          className="section-heading"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <span className="section-kicker">Current work</span>
          <h2 id="work-title">Current work</h2>
        </motion.div>

        <div className="work-layout">
          {/* Featured: IDmgmt */}
          <motion.article
            className="feature-project"
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            animate={{
              boxShadow: [
                '0 28px 70px rgba(7, 19, 33, 0.22)',
                '0 28px 70px rgba(40, 95, 150, 0.32)',
                '0 28px 70px rgba(7, 19, 33, 0.22)',
              ],
            }}
            transition={{
              boxShadow: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 0.6 },
              x: { duration: 0.6 },
            }}
          >
            <h3>IDmgmt</h3>
            <p className="dek">Patient-controlled identity for healthcare and beyond.</p>
            <div className="body">
              <p>IDmgmt is a portable identity platform incubated at Cogn8 Systems and now operating as an independent company. It addresses one of healthcare's quietest structural problems: the fragmentation of patient identity across provider systems, and the cost — operational, clinical, and human — that fragmentation generates.</p>
              <p>The platform is in active pilot conversation with hospital systems in Arkansas, with regulatory tailwinds from Cures Act and TEFCA mandates. Cogn8 Systems remains responsible for the underlying platform architecture and the studio's continuing technical partnership with IDmgmt, Inc.</p>
            </div>
            <a
              className="text-link"
              href="https://md.myidmgmt.com/"
              data-event="outbound_idmgmt"
              rel="noopener"
              onClick={() => track('outbound_idmgmt')}
            >
              Read more about IDmgmt <span aria-hidden="true">→</span> md.myidmgmt.com
            </a>
          </motion.article>

          {/* Snapshots */}
          <motion.aside
            className="snapshots"
            aria-label="Also in progress"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.article className="snapshot" variants={staggerItem}>
              <h3>Consumer marketplace platform</h3>
              <p className="meta">Florida</p>
              <p>Co-build partnership with a domain expert founder. Vetted-provider gig marketplace serving a vertical with strong unmet demand and underemployed skilled labor. Cogn8 Systems is providing platform architecture, identity infrastructure, and MVP build. Currently in pilot planning for a Gulf-coast metro launch.</p>
            </motion.article>

            <motion.article className="snapshot" variants={staggerItem}>
              <h3>Naturalist content &amp; commerce platform</h3>
              <p className="meta">Florida</p>
              <p>Co-build engagement with a domain expert in regional ecology and nature photography. A consumer-facing platform combining educational content, regional species discovery, and a content-driven commerce layer. Currently in early architecture phase, with an ecommerce MVP preceding the consumer mobile app.</p>
            </motion.article>

            <motion.article className="snapshot" variants={staggerItem}>
              <h3>Estate planning platform</h3>
              <p className="meta">Early architecture</p>
              <p>A guided intake and document generation system designed to make estate planning approachable for ordinary households. Currently in the schema and template engine design phase. Built on the studio's reusable identity and document infrastructure.</p>
            </motion.article>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
