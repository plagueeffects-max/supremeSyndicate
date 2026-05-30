import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, staggerItem, viewport } from '../animations/variants'
import { useCardTilt } from '../hooks/useCardTilt'

interface CardProps {
  title: string
  subtitle: string
  body: string
}

function EngageCard({ title, subtitle, body }: CardProps) {
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = useCardTilt(5)

  return (
    <motion.article
      ref={ref as React.Ref<HTMLElement>}
      className="engage-card"
      variants={staggerItem}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <p>{body}</p>
    </motion.article>
  )
}

const cards: CardProps[] = [
  {
    title: 'Architect',
    subtitle: 'We come in to help you think.',
    body: 'For teams with engineering capacity but architectural questions: platform design, data modeling, identity infrastructure, system strategy. Engagements are typically scoped in weeks, not months, and produce documents and decisions — business plans, architecture specifications, go-to-market frameworks — not code.',
  },
  {
    title: 'Co-build',
    subtitle: 'We build alongside you.',
    body: 'For founders with a domain, a vision, and the willingness to be hands-on partners. We bring the platform, the engineering practice, and the architectural judgment; you bring the market knowledge and the relationships. Equity-bearing partnerships welcome.',
  },
  {
    title: 'Build',
    subtitle: 'We build it for you.',
    body: 'For companies that need a real platform delivered, not a prototype. Full engagements from architecture through deployment, with the studio responsible for the working system. Our platform layer shortens the path; our practice keeps the result maintainable.',
  },
]

export default function Engage() {
  return (
    <section className="section" id="what-we-do" aria-labelledby="engage-title">
      <div className="wrap">
        <motion.div
          className="section-heading"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <span className="section-kicker">How we engage</span>
          <h2 id="engage-title">How we engage</h2>
        </motion.div>

        <motion.div
          className="engage-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {cards.map(card => (
            <EngageCard key={card.title} {...card} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
