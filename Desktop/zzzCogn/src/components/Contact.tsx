import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, staggerItem, viewport } from '../animations/variants'
import { track } from '../lib/analytics'

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) throw new Error('failed')
      form.reset()
      setStatus('done')
      track('form_submit_success')
    } catch {
      form.submit()
    }
  }

  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <motion.div
          className="contact-panel"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <div>
            <span className="section-kicker">Contact</span>
            <h2 id="contact-title">Get in touch</h2>
            <p className="contact-copy">For most inquiries, send a note using the form below.</p>
          </div>

          <div>
            <motion.form
              id="contact-form"
              action="/api/contact"
              method="post"
              onSubmit={handleSubmit}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <div className="honeypot" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" tabIndex={-1} autoComplete="off" />
              </div>

              <motion.label variants={staggerItem} htmlFor="name">
                Name
                <input id="name" name="name" type="text" autoComplete="name" required />
              </motion.label>

              <motion.label variants={staggerItem} htmlFor="email">
                Email
                <input id="email" name="email" type="email" autoComplete="email" required />
              </motion.label>

              <motion.label variants={staggerItem} htmlFor="message">
                Message
                <textarea id="message" name="message" required />
              </motion.label>

              <motion.div className="submit-row" variants={staggerItem}>
                <button type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send'}
                </button>
                <p
                  className="form-status"
                  id="form-status"
                  role="status"
                  aria-live="polite"
                >
                  {status === 'done' && 'Thanks. Julie will reply within a few days.'}
                  {status === 'error' && 'Something went wrong. Please try again.'}
                </p>
              </motion.div>
            </motion.form>

            <div className="booking">
              <p>If you've already decided to talk about a possible engagement, you can also book a 30-minute intro call.</p>
              <a
                className="text-link"
                href="https://zcal.co/juliemcfadden"
                data-event="booking_click"
                rel="noopener"
                style={{ display: 'inline-flex', marginTop: 14 }}
                onClick={() => track('booking_click')}
              >
                Book a call <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
