import { motion } from 'framer-motion'
import { fadeUp, slideLeft, slideRight, viewport } from '../animations/variants'
import { track } from '../lib/analytics'

export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="wrap about-layout">
        <motion.div
          className="about-intro"
          variants={slideLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <span className="section-kicker">About</span>
          <h2 id="about-title">About</h2>
          <p>We work at the intersection of platform architecture, identity infrastructure, and the kinds of human systems that data has to serve rather than replace.</p>
        </motion.div>

        <motion.article
          className="bio-card"
          variants={slideRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <div className="bio-title">
            <h3>Julie McFadden</h3>
            <p>Founder &amp; Platform Architect</p>
          </div>

          <div className="prose">
            <p>Cogn8 Systems is a small senior studio. We're deliberate about staying small; the work we want to do rewards proximity, not scale.</p>
            <p>I've spent thirty years writing code and designing systems. I started in the years just before the explosion of the internet into ordinary life, which means I've watched several generations of platforms get built, scale, and either mature into infrastructure or quietly disappear. The patterns repeat. The lessons rarely transfer cleanly. The studio exists because I wanted to keep doing the work, and to do it with the people I trust.</p>
            <p>My background spans healthcare, publishing, insurance, and creative technology. I've consulted with Johns Hopkins on legacy insurance products, with Arkansas BlueCross BlueShield on enterprise architecture, and with Elsevier on the translation pipeline for clinical drug information. I currently serve as CTO at{' '}
              <a
                href="https://otterkin.com"
                data-event="outbound_otterkin"
                rel="noopener"
                onClick={() => track('outbound_otterkin')}
              >
                Otterkin
              </a>
              , a creative technology platform, where I lead platform architecture and long-term technical strategy. The throughline across all of it has been the same: making complex systems understandable, trustworthy, and usable for the people who rely on them.</p>
            <p>I founded Cogn8 Systems to focus that work on platforms where the stakes of getting it right are highest — identity, healthcare, documents people will need to defend in court, marketplaces where trust is the actual product. The studio's first venture, IDmgmt, is a direct outgrowth of that focus.</p>
            <p>I'm also writing a book about what happens when civilizations stop recording themselves. It is, in its own way, an enactment of the same argument the studio makes: that platforms which capture human experience well — and ones that capture it badly — shape the world that follows them.</p>
            <p>More at{' '}
              <a
                href="https://juliemcfadden.com"
                data-event="outbound_julie"
                rel="noopener"
                onClick={() => track('outbound_julie')}
              >
                juliemcfadden.com
              </a>
              .
            </p>
          </div>
        </motion.article>
      </div>
    </section>
  )
}
