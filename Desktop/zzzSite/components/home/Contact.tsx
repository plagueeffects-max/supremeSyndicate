'use client'

import { useState, FormEvent } from 'react'
import { toast } from 'sonner'
import { MapPin, Phone, Mail, Send } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

interface FormState {
  name: string
  organisation: string
  message: string
}

const INITIAL: FormState = { name: '', organisation: '', message: '' }

export function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) {
      toast.error('Please fill in your name and message.')
      return
    }
    setSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    toast.success('Message sent! We will be in touch within 24 hours.')
    setForm(INITIAL)
    setSubmitting(false)
  }

  return (
    <section id="contact" className="section-padding bg-deep border-t border-gold/10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <AnimatedSection delay={0.1}>
            <p className="label-gold mb-4">Get in Touch</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-5 leading-snug">
              Let&apos;s Build Something<br />Exceptional Together
            </h2>
            <div className="w-10 h-px bg-gold mb-8" />
            <p className="text-white/55 text-base leading-relaxed mb-10">
              Whether you are an institution procuring equipment, a business commissioning awards, or an individual looking for the best — reach out. We respond within 24 hours.
            </p>
            <ul className="space-y-5">
              {[
                { icon: MapPin, text: 'New Delhi, India' },
                { icon: Phone, text: '+91 98765 43210' },
                { icon: Mail, text: 'info@mdfenterprises.in' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-4 text-white/60 text-sm">
                  <div className="w-9 h-9 border border-gold/20 rounded-sm flex items-center justify-center text-gold/60 shrink-0">
                    <Icon size={15} />
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { name: 'name', label: 'Your Name', placeholder: 'John Smith' },
                { name: 'organisation', label: 'Organisation (optional)', placeholder: 'Delhi Sports Academy' },
              ].map(field => (
                <div key={field.name}>
                  <label className="label-gold mb-2 block" htmlFor={field.name}>
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.name as keyof FormState]}
                    onChange={handleChange}
                    className="w-full bg-navy/50 border border-gold/15 rounded-sm px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-gold/50 transition-colors duration-200"
                  />
                </div>
              ))}
              <div>
                <label className="label-gold mb-2 block" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us what you need..."
                  value={form.message}
                  onChange={handleChange}
                  className="w-full bg-navy/50 border border-gold/15 rounded-sm px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-gold/50 transition-colors duration-200 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={14} />
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
