export function getSchemas(): object[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Cogn8 Systems',
      url: 'https://cogn8.com',
      logo: 'https://cogn8.com/favicon.svg',
      description:
        'A product studio that builds platforms where identity, data, and human experience converge.',
      founder: { '@type': 'Person', name: 'Julie McFadden' },
      sameAs: ['https://idmgmt.net'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Julie McFadden',
      jobTitle: 'Founder & Platform Architect',
      worksFor: { '@type': 'Organization', name: 'Cogn8 Systems' },
      url: 'https://juliemcfadden.com',
      description:
        'Thirty-year software architect and platform designer focused on identity, healthcare, and human-facing systems.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Cogn8 Systems',
      url: 'https://cogn8.com',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Cogn8 Systems?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cogn8 Systems is a product studio that builds platforms where identity, data, and human experience converge. It engages with founders, operators, and companies as architects, co-builders, and full build partners.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is an Architect engagement with Cogn8 Systems?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'An Architect engagement is for teams with engineering capacity but architectural questions: platform design, data modeling, identity infrastructure, system strategy. Engagements are typically scoped in weeks, not months, and produce documents and decisions — business plans, architecture specifications, go-to-market frameworks — not code.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is a Co-build partnership with Cogn8 Systems?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Co-build partnership is for founders with a domain, a vision, and the willingness to be hands-on partners. Cogn8 Systems brings the platform, the engineering practice, and the architectural judgment; the founder brings market knowledge and relationships. Equity-bearing partnerships are welcome.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is a Build engagement with Cogn8 Systems?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Build engagement is for companies that need a real platform delivered, not a prototype. Full engagements from architecture through deployment, with the studio responsible for the working system.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is IDmgmt?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'IDmgmt is a portable identity platform incubated at Cogn8 Systems and now operating as an independent company. It addresses the fragmentation of patient identity across healthcare provider systems, and is in active pilot conversation with hospital systems in Arkansas.',
          },
        },
      ],
    },
  ]
}
