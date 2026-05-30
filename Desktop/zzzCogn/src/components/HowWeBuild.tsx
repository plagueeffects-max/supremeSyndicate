import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, staggerItem, viewport } from '../animations/variants'
import { useCardTilt } from '../hooks/useCardTilt'

interface PrincipleProps {
  title: string
  body: string
}

function PrincipleCard({ title, body }: PrincipleProps) {
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = useCardTilt(4)

  return (
    <motion.article
      ref={ref as React.Ref<HTMLElement>}
      className="principle"
      variants={staggerItem}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <h3>{title}</h3>
      <p>{body}</p>
    </motion.article>
  )
}

const principles: PrincipleProps[] = [
  {
    title: 'We build platforms, not features.',
    body: "A platform that's been built right makes the next thing cheaper. The studio's reusable identity, document, and orchestration layers are not products themselves; they're the working machinery beneath the products our clients ship.",
  },
  {
    title: 'We use the right tool for the problem.',
    body: "We work across React, Node, Python, and React Native, and we deploy on Azure, AWS, or Google Cloud depending on what the work actually requires. We don't force the problem to the stack. We pick the tools that serve the problem, and we pick them with the team that will own the result after we hand it off.",
  },
  {
    title: "We're honest about what we don't know.",
    body: "Every project carries assumptions that haven't been tested yet. We surface those assumptions early, in the open, and we name the ones we're least sure about. We'd rather be corrected in week two than wrong at launch.",
  },
  {
    title: 'We finish things.',
    body: "A platform that's 80% complete is a maintenance burden, not an asset. Our engagements are designed to finish — either as a working system that's operable on day one and improvable on day two, or as a finished business plan, architecture document, or strategic artifact the client can act on. We don't leave projects half-built.",
  },
]

export default function HowWeBuild() {
  return (
    <section className="section" id="how-we-build" aria-labelledby="build-title">
      <div className="wrap">
        <motion.div
          className="section-heading"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <span className="section-kicker">How we build</span>
          <h2 id="build-title">How we build</h2>
        </motion.div>

        <motion.div
          className="principles"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {principles.map(p => (
            <PrincipleCard key={p.title} {...p} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
