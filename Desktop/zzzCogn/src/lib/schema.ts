export function getSchemas(): object[] {
  return [
    /* Organization ─────────────────────────────────────────── */
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://cogn8.com/#organization',
      name: 'Cogn8 Systems',
      alternateName: 'Cogn8',
      url: 'https://cogn8.com',
      logo: 'https://cogn8.com/favicon.svg',
      description:
        'Cogn8 Systems is a senior product studio specializing in platform architecture, identity infrastructure, and healthcare technology. We engage as architects, co-build partners, and full platform delivery teams for founders, operators, and enterprises.',
      founder: {
        '@type': 'Person',
        '@id': 'https://cogn8.com/#julie-mcfadden',
        name: 'Julie McFadden',
      },
      knowsAbout: [
        'Platform Architecture',
        'Identity Infrastructure',
        'Healthcare Technology',
        'Software Development',
        'System Design',
        'Data Platforms',
        'Healthcare Identity Management',
        'Document Systems',
        'API Design',
      ],
      sameAs: ['https://idmgmt.net', 'https://juliemcfadden.com'],
    },

    /* Person ───────────────────────────────────────────────── */
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': 'https://cogn8.com/#julie-mcfadden',
      name: 'Julie McFadden',
      jobTitle: 'Founder & Platform Architect',
      worksFor: {
        '@type': 'Organization',
        '@id': 'https://cogn8.com/#organization',
        name: 'Cogn8 Systems',
      },
      url: 'https://juliemcfadden.com',
      description:
        'Thirty-year software architect and platform designer. Background spans healthcare, publishing, insurance, and creative technology. Consulted with Johns Hopkins, Arkansas BlueCross BlueShield, and Elsevier. Current CTO at Otterkin.',
      knowsAbout: [
        'Platform Architecture',
        'Identity Infrastructure',
        'Healthcare Systems',
        'Enterprise Architecture',
        'Software Engineering',
        'System Design',
      ],
      alumniOf: ['Johns Hopkins', 'Arkansas BlueCross BlueShield', 'Elsevier'],
    },

    /* WebSite ──────────────────────────────────────────────── */
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': 'https://cogn8.com/#website',
      name: 'Cogn8 Systems',
      url: 'https://cogn8.com',
      description: 'Product studio specializing in platform architecture, identity infrastructure, and healthcare technology platforms.',
      publisher: {
        '@type': 'Organization',
        '@id': 'https://cogn8.com/#organization',
      },
    },

    /* WebPage with Speakable (AEO / voice search) ──────────── */
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://cogn8.com/#webpage',
      url: 'https://cogn8.com',
      name: 'Cogn8 Systems — Platform Architecture & Product Studio',
      description:
        'Senior product studio specializing in platform architecture, identity infrastructure, and healthcare technology.',
      isPartOf: { '@id': 'https://cogn8.com/#website' },
      about: { '@id': 'https://cogn8.com/#organization' },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['#hero-title', '.hero-statement', '#engage-title', '#work-title'],
      },
    },

    /* Services ─────────────────────────────────────────────── */
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': 'https://cogn8.com/#architect',
      name: 'Platform Architecture Advisory',
      serviceType: 'Technology Consulting',
      provider: { '@type': 'Organization', '@id': 'https://cogn8.com/#organization' },
      description:
        'Strategic platform architecture advisory for teams with engineering capacity but architectural questions: platform design, data modeling, identity infrastructure, system strategy. Engagements produce documents and decisions — business plans, architecture specifications, go-to-market frameworks.',
      offers: {
        '@type': 'Offer',
        name: 'Architect Engagement',
        description: 'Scoped in weeks, not months. Produces documents and decisions, not code.',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': 'https://cogn8.com/#cobuild',
      name: 'Co-Build Platform Partnership',
      serviceType: 'Software Development',
      provider: { '@type': 'Organization', '@id': 'https://cogn8.com/#organization' },
      description:
        'Hands-on platform partnership for founders with a domain, a vision, and willingness to be hands-on partners. Cogn8 Systems brings platform infrastructure, engineering practice, and architectural judgment. Equity-bearing partnerships welcome.',
      offers: {
        '@type': 'Offer',
        name: 'Co-Build Partnership',
        description: 'Equity-bearing platform partnerships for domain-expert founders.',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': 'https://cogn8.com/#build',
      name: 'Full Platform Build & Delivery',
      serviceType: 'Software Development',
      provider: { '@type': 'Organization', '@id': 'https://cogn8.com/#organization' },
      description:
        'Full platform delivery from architecture through deployment for companies that need a real platform delivered, not a prototype. Studio responsible for the working system.',
      offers: {
        '@type': 'Offer',
        name: 'Build Engagement',
        description: 'Full platform delivery from architecture through deployment.',
      },
    },

    /* FAQPage (AEO — answer engine optimization) ──────────── */
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Cogn8 Systems?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cogn8 Systems is a senior product studio specializing in platform architecture, identity infrastructure, and healthcare technology. Founded by Julie McFadden, the studio engages with founders, operators, and companies as architects, co-builders, and full build partners.',
          },
        },
        {
          '@type': 'Question',
          name: 'What services does Cogn8 Systems offer?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cogn8 Systems offers three engagement types: Architect (strategic advisory producing documents and decisions), Co-build (hands-on equity-bearing platform partnerships with founders), and Build (full platform delivery from architecture through deployment).',
          },
        },
        {
          '@type': 'Question',
          name: 'What is an Architect engagement with Cogn8 Systems?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'An Architect engagement is for teams with engineering capacity but architectural questions: platform design, data modeling, identity infrastructure, system strategy. Engagements are scoped in weeks, not months, and produce documents and decisions — business plans, architecture specifications, go-to-market frameworks — not code.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is a Co-build partnership with Cogn8 Systems?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Co-build partnership is for founders with a domain, a vision, and the willingness to be hands-on partners. Cogn8 Systems brings platform infrastructure, engineering practice, and architectural judgment; the founder brings market knowledge and relationships. Equity-bearing partnerships are welcome.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is a Build engagement with Cogn8 Systems?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Build engagement is for companies that need a real platform delivered, not a prototype. Full engagements from architecture through deployment, with the studio responsible for the working system. The studio platform layer shortens the path; the engineering practice keeps the result maintainable.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is IDmgmt?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'IDmgmt is a portable patient-controlled identity platform incubated at Cogn8 Systems, now operating as an independent company. It addresses the fragmentation of patient identity across healthcare provider systems. In active pilot conversation with Arkansas hospital systems, with regulatory tailwinds from Cures Act and TEFCA mandates.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who founded Cogn8 Systems?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cogn8 Systems was founded by Julie McFadden, a platform architect with thirty years of experience building complex systems. Her background spans healthcare (Johns Hopkins, Arkansas BlueCross BlueShield), publishing (Elsevier), insurance, and creative technology. She currently serves as CTO at Otterkin.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Cogn8 Systems work with healthcare companies?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Cogn8 Systems has deep healthcare expertise, including work on patient identity infrastructure, clinical data systems, and healthcare platform architecture. The studio built IDmgmt, a patient-controlled identity platform in active pilot with Arkansas hospital systems.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I contact Cogn8 Systems?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Contact Cogn8 Systems through the form at cogn8.com/#contact. For a direct conversation about a possible engagement, book a 30-minute intro call at zcal.co/juliemcfadden.',
          },
        },
      ],
    },
  ]
}
