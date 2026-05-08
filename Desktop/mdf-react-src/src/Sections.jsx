import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring,
} from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.15, 
      delayChildren: 0.2 
    } 
  },
};

const textReveal = {
  hidden: { y: '100%', opacity: 0 },
  show: { y: '0%', opacity: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
};


/* MARQUEE */
export function Marquee() {
  const items = (
    <>
      Sporting Goods <em>—</em> Musical Instruments <em>—</em> Fitness & Wellness <em>—</em> Custom Awards & Trophies <span className="marquee-dot"></span>
    </>
  );
  return (
    <div className="marquee">
      <motion.div
        className="marquee-track"
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="marquee-item">{items}</div>
        <div className="marquee-item">{items}</div>
        <div className="marquee-item">{items}</div>
      </motion.div>
    </div>
  );
}

/* HERITAGE */
export function Heritage() {
  return (
    <section className="section heritage" id="heritage">
      <div className="retro-grid" />
      <div className="container">
        <motion.div
          className="section-header"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div className="section-num" variants={fadeUp}>01 — Heritage</motion.div>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2 className="section-title" variants={textReveal}>
              Four decades, <em>one address.</em>
            </motion.h2>
          </div>
        </motion.div>

        <div className="heritage-grid">
          <motion.div
            className="heritage-image-wrap"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="heritage-image" />
            <div className="heritage-image-caption">
              Origin
              <span>Srinagar, Kashmir</span>
            </div>
            <div className="heritage-stamp">
              <svg className="rot" viewBox="0 0 100 100">
                <defs>
                  <path id="stamp-circle" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                </defs>
                <text>
                  <textPath href="#stamp-circle">· EST 1985 · KASHMIR · MADE WITH CARE · </textPath>
                </text>
              </svg>
              <svg className="heritage-stamp-inner" viewBox="0 0 32 32" fill="none">
                <path d="M16 4 L19 12 L27 12 L20.5 17 L23 25 L16 20 L9 25 L11.5 17 L5 12 L13 12 Z" fill="currentColor" opacity="0.85" />
              </svg>
            </div>
          </motion.div>

          <motion.div
            className="heritage-content"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.p className="heritage-lead" variants={fadeUp}>
              Born in the Valley, MDF Enterprises has been the address for those who refuse to <em>compromise on craft</em> — across sport, sound, sweat, and ceremony.
            </motion.p>
            <motion.p className="heritage-body" variants={fadeUp}>
              From the willow of a tournament-grade bat to the resonance of a hand-tuned tabla, from the engineering of a precision treadmill to the polish of a custom-engraved trophy — what we stock, we have selected. What we sell, we stand behind.
            </motion.p>
            <motion.p className="heritage-body" variants={fadeUp}>
              We are not a marketplace. We are a curator's bench, run from Srinagar, carrying the weight of forty years of relationships with the manufacturers who matter — and the patience to recommend nothing less.
            </motion.p>

            <motion.div className="heritage-stats" variants={stagger}>
              <motion.div variants={fadeUp}>
                <div className="heritage-stat-num"><em>40</em>+</div>
                <div className="heritage-stat-label">Years in trade</div>
              </motion.div>
              <motion.div variants={fadeUp}>
                <div className="heritage-stat-num">04</div>
                <div className="heritage-stat-label">Verticals served</div>
              </motion.div>
              <motion.div variants={fadeUp}>
                <div className="heritage-stat-num">120<em>+</em></div>
                <div className="heritage-stat-label">Brands stocked</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* CATEGORIES */
const CATEGORIES = [
  {
    num: '01', tag: 'Sport', title: 'Sporting', titleEm: 'Goods',
    desc: 'Tournament-grade equipment for cricket, football, tennis, badminton and the field beyond.',
    items: ['Cricket', 'Football', 'Tennis', 'Badminton', 'Athletics'],
    svg: (
      <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M70 150 L130 50 L150 65 L90 165 Z" strokeLinejoin="round" />
        <line x1="78" y1="155" x2="142" y2="58" strokeDasharray="3 4" opacity="0.5" />
        <circle cx="60" cy="165" r="14" />
        <path d="M48 165 Q60 158 72 165" />
        <path d="M48 165 Q60 172 72 165" />
        <circle cx="100" cy="100" r="92" strokeDasharray="2 6" opacity="0.25" />
      </svg>
    ),
  },
  {
    num: '02', tag: 'Music', title: 'Musical', titleEm: 'Instruments',
    desc: 'From classical strings to percussion — tuned by hand, sold by ear.',
    items: ['Guitars', 'Tabla', 'Keyboards', 'Wind', 'Strings'],
    svg: (
      <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="80" cy="130" rx="42" ry="50" />
        <ellipse cx="80" cy="130" rx="32" ry="38" opacity="0.3" />
        <circle cx="80" cy="125" r="10" />
        <rect x="76" y="40" width="8" height="60" rx="2" />
        <rect x="72" y="32" width="16" height="14" rx="2" />
        <line x1="80" y1="46" x2="80" y2="180" strokeDasharray="2 3" opacity="0.5" />
        <circle cx="100" cy="100" r="92" strokeDasharray="2 6" opacity="0.25" />
      </svg>
    ),
  },
  {
    num: '03', tag: 'Wellness', title: 'Fitness &', titleEm: 'Wellness',
    desc: 'Home gyms, commercial setups, and the small things that make habit possible.',
    items: ['Cardio', 'Strength', 'Yoga', 'Recovery', 'Accessories'],
    svg: (
      <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="40" y="92" width="120" height="16" rx="2" />
        <rect x="20" y="76" width="22" height="48" rx="3" />
        <rect x="158" y="76" width="22" height="48" rx="3" />
        <rect x="14" y="84" width="8" height="32" rx="2" />
        <rect x="178" y="84" width="8" height="32" rx="2" />
        <line x1="50" y1="100" x2="150" y2="100" strokeDasharray="3 5" opacity="0.4" />
        <circle cx="100" cy="100" r="92" strokeDasharray="2 6" opacity="0.25" />
      </svg>
    ),
  },
  {
    num: '04', tag: 'Bespoke', title: 'Awards &', titleEm: 'Trophies',
    desc: 'Engraved, etched, and earned — bespoke awards for tournaments, corporates, and ceremonies.',
    items: ['Custom', 'Engraving', 'Crystal', 'Metal', 'Memento'],
    svg: (
      <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M70 50 L130 50 L130 90 Q130 115 100 115 Q70 115 70 90 Z" />
        <path d="M70 60 Q50 60 50 80 Q50 95 65 100" />
        <path d="M130 60 Q150 60 150 80 Q150 95 135 100" />
        <line x1="100" y1="115" x2="100" y2="140" />
        <rect x="80" y="140" width="40" height="8" rx="1" />
        <rect x="70" y="148" width="60" height="14" rx="2" />
        <path d="M85 70 L100 80 L115 70" />
        <circle cx="100" cy="100" r="92" strokeDasharray="2 6" opacity="0.25" />
      </svg>
    ),
  },
];

export function Categories() {
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState('01 / 04');

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const max = track.scrollWidth - track.clientWidth;
      const pct = max > 0 ? track.scrollLeft / max : 0;
      setProgress(pct * 100);
      const idx = Math.min(4, Math.round(pct * 3) + 1);
      setCount(`0${idx} / 04`);
    };
    track.addEventListener('scroll', onScroll);
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="section categories" id="categories">
      <motion.div
        className="section-header"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div className="section-num" variants={fadeUp}>02 — Catalogue</motion.div>
        <div style={{ overflow: 'hidden' }}>
          <motion.h2 className="section-title" variants={textReveal}>
            A house of <em>four disciplines.</em>
          </motion.h2>
        </div>
      </motion.div>

      <div className="cat-track" ref={trackRef}>
        {CATEGORIES.map((cat, i) => (
          <motion.article
            key={i}
            className="cat-card interactive"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="cat-card-bg" />
            <span className="cat-card-num">{cat.num}</span>
            <span className="cat-card-tag">{cat.tag}</span>
            <div className="cat-card-visual">{cat.svg}</div>
            <div className="cat-card-content">
              <h3 className="cat-card-title">
                {cat.title} <em>{cat.titleEm}</em>
              </h3>
              <p className="cat-card-desc">{cat.desc}</p>
              <ul className="cat-card-list">
                {cat.items.map((it, idx) => <li key={idx}>{it}</li>)}
              </ul>
              <div className="cat-card-arrow">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="cat-progress">
        <span>Drag · Scroll · Explore</span>
        <div className="cat-progress-bar">
          <div className="cat-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span>{count}</span>
      </div>
    </section>
  );
}

/* BRANDS */
const BRAND_LOGOS = [
  { file: 'yonexLogo.webp',   name: 'Yonex'   },
  { file: 'stagLogo.webp',    name: 'Stag'    },
  { file: 'sslogo.webp',      name: 'SS'      },
  { file: 'spartanLogo.webp', name: 'Spartan' },
  { file: 'sgLogo.webp',      name: 'SG'      },
  { file: 'niviaLogo.webp',   name: 'Nivia'   },
  { file: 'netcoLogo.webp',   name: 'Netco'   },
  { file: 'jonexLogo.webp',   name: 'Jonex'   },
  { file: 'coscoLogo.webp',   name: 'Cosco'   },
];

// Two copies for seamless infinite loop
const MARQUEE_LOGOS = [...BRAND_LOGOS, ...BRAND_LOGOS];

export function Brands() {
  return (
    <section className="section brands" id="brands">
      <div className="container">
        <motion.div
          className="section-header"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div className="section-num" variants={fadeUp}>03 — Brands</motion.div>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2 className="section-title" variants={textReveal}>
              The <em>names we stock.</em>
            </motion.h2>
          </div>
        </motion.div>

        {/* Infinite marquee strip */}
        <div className="brands-marquee-wrap overflow-hidden relative my-12 py-6 border-y border-[rgba(250,219,95,0.07)]">
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#050e1c] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#050e1c] to-transparent pointer-events-none" />

          <motion.div
            className="flex gap-14 items-center"
            style={{ width: 'max-content', willChange: 'transform' }}
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          >
            {MARQUEE_LOGOS.map((b, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex items-center justify-center h-14 px-4 opacity-50 hover:opacity-90 transition-opacity duration-300"
              >
                <img
                  src={`/brands/${b.file}`}
                  alt={b.name}
                  className="h-9 w-auto object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                  draggable="false"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Logo grid */}
        <motion.div
          className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          {BRAND_LOGOS.map((b, i) => (
            <motion.div
              key={i}
              className="group flex flex-col items-center justify-center gap-3 p-5 rounded-xl
                border border-[rgba(250,219,95,0.1)] bg-[rgba(10,20,40,0.45)] backdrop-blur-sm
                cursor-default"
              variants={fadeUp}
              whileHover={{
                scale: 1.06,
                y: -5,
                borderColor: 'rgba(250,219,95,0.4)',
                boxShadow: '0 12px 40px rgba(250,219,95,0.1)',
                transition: { duration: 0.3 },
              }}
            >
              <img
                src={`/brands/${b.file}`}
                alt={b.name}
                className="h-11 w-full object-contain"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.75 }}
                draggable="false"
              />
              <span className="text-[8px] tracking-[0.2em] uppercase text-[rgba(250,219,95,0.4)] group-hover:text-[rgba(250,219,95,0.75)] transition-colors duration-300">
                {b.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="brand-cta"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          Plus another hundred and twenty names you'd recognise — and a handful you wouldn't, because the right kit isn't always the loudest one.{' '}
          <a href="#contact">Ask the desk.</a>
        </motion.p>
      </div>
    </section>
  );
}

/* CLIENTS */
const CLIENT_LIST = [
  { file: 'crpfLogo.webp',       name: 'CRPF',               full: 'Central Reserve Police Force'                    },
  { file: 'dsekLogo.webp',       name: 'DSEK',               full: 'Directorate of School Education, Kashmir'        },
  { file: 'dyssLogo.webp',       name: 'DYSS',               full: 'Directorate of Youth Services & Sports'          },
  { file: 'kuLogo.webp',         name: 'Kashmir University',  full: 'University of Kashmir'                          },
  { file: 'skaustLogo.webp',     name: 'SKAUST',             full: 'Sher-e-Kashmir University of Agri. Sciences'    },
  { file: 'gmcLogo.webp',        name: 'GMC',                full: 'Government Medical College, Srinagar'           },
  { file: 'jkpLogo.webp',        name: 'JK Police',          full: 'Jammu & Kashmir Police'                        },
  { file: 'clusterUniLogo.webp', name: 'Cluster University',  full: 'Cluster University Srinagar'                   },
];

export function Clients() {
  return (
    <section className="section clients" id="clients">
      <div className="container">
        <motion.div
          className="section-header"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div className="section-num" variants={fadeUp}>04 — Clients</motion.div>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2 className="section-title" variants={textReveal}>
              Trusted by <em>institutions.</em>
            </motion.h2>
          </div>
          <motion.p
            className="mt-6 max-w-2xl text-white/45 text-sm leading-relaxed"
            variants={fadeUp}
          >
            From the Valley's finest academies to national security forces — MDF has been the address for organisations that demand the very best.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mt-14"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          {CLIENT_LIST.map((c, i) => (
            <motion.div
              key={i}
              className="group flex flex-col items-center gap-5 p-8 rounded-2xl
                border border-[rgba(250,219,95,0.1)] bg-[rgba(10,20,40,0.5)]
                backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.25)] cursor-default"
              variants={fadeUp}
              whileHover={{
                y: -7,
                borderColor: 'rgba(250,219,95,0.35)',
                boxShadow: '0 16px 60px rgba(250,219,95,0.09)',
                transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              }}
            >
              <div className="w-16 h-16 flex items-center justify-center">
                <img
                  src={`/clients/${c.file}`}
                  alt={c.name}
                  className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  style={{ filter: 'brightness(0) invert(1)', opacity: 0.8 }}
                  draggable="false"
                />
              </div>
              <div className="text-center">
                <div className="text-[11px] tracking-[0.22em] uppercase text-[rgba(250,219,95,0.75)] font-semibold mb-1">
                  {c.name}
                </div>
                <div className="text-[9px] tracking-[0.04em] text-white/30 leading-relaxed">
                  {c.full}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* CRAFT */
const CRAFT_CARDS = [
  {
    title: 'Curated, not', titleEm: 'catalogued.',
    desc: "Every line item we stock has earned its place. We say no more often than we say yes.",
    icon: <><circle cx="24" cy="24" r="18" /><path d="M24 12 L26 22 L36 24 L26 26 L24 36 L22 26 L12 24 L22 22 Z" fill="currentColor" opacity="0.8" /></>,
  },
  {
    title: 'From the', titleEm: 'Valley.',
    desc: 'Run from Srinagar, with the discipline of a place that takes its craft — and its weather — seriously.',
    icon: <><path d="M8 36 L24 8 L40 36 Z" /><path d="M14 28 L24 14 L34 28" opacity="0.5" /><circle cx="24" cy="32" r="2" fill="currentColor" /></>,
  },
  {
    title: 'Bespoke when', titleEm: 'required.',
    desc: 'Custom awards, special-order instruments, gym fit-outs — when the catalogue ends, the conversation begins.',
    icon: <path d="M24 6 L30 18 L42 20 L33 30 L36 42 L24 36 L12 42 L15 30 L6 20 L18 18 Z" />,
  },
  {
    title: 'After the', titleEm: 'sale.',
    desc: 'Repairs, restringing, retuning, replacement. Forty years of relationships translates to real service.',
    icon: <><rect x="8" y="14" width="32" height="22" rx="2" /><path d="M12 14 L24 26 L36 14" /><line x1="8" y1="14" x2="8" y2="36" opacity="0.3" /></>,
  },
];

export function Craft() {
  return (
    <section className="section craft" id="craft">
      <div className="container">
        <motion.div
          className="section-header"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div className="section-num" variants={fadeUp}>05 — The Difference</motion.div>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2 className="section-title" variants={textReveal}>
              Why our <em>shelves matter.</em>
            </motion.h2>
          </div>
        </motion.div>

        <div className="craft-layout">
          <motion.div
            className="craft-text-block"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
          >
            <p className="craft-quote">Anyone can sell you a bat. Few can pick the one that suits your grip.</p>
            <span className="craft-cite">— The MDF Promise · 1985</span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {CRAFT_CARDS.map((card, i) => (
              <motion.div
                key={i}
                className={`craft-card p-8 rounded-3xl border border-[rgba(250,219,95,0.15)] bg-[rgba(10,20,40,0.4)] backdrop-blur-xl shadow-2xl relative overflow-hidden group ${
                  i === 0 || i === 3 ? 'md:col-span-2' : 'md:col-span-1'
                }`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
                   <svg width="60" height="60" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1">
                    {card.icon}
                  </svg>
                </div>
                <h4 className="craft-card-title text-2xl font-display mb-4">
                  {card.title} <em className="text-[#fadb5f] italic">{card.titleEm}</em>
                </h4>
                <p className="craft-card-desc text-white/60 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* VALLEY */
export function Valley() {
  return (
    <section className="valley" id="valley">
      <div className="valley-bg" />
      <div className="valley-content">
        <motion.div
          className="valley-mark"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Kashmir.
          <span>Where the wood, the wool, and the work all begin.</span>
        </motion.div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.p className="valley-text" variants={fadeUp}>
            We are not in a city that pretends to know sport. We are in the valley where <em>willow grows for cricket</em>, where craftsmen still hand-bind <em>papier-mâché</em>, where the air taught generations to take their time and finish what they started.
          </motion.p>
          <motion.p className="valley-text" variants={fadeUp}>
            That patience shows up in everything we sell — and in everyone we sell to.
          </motion.p>
          <motion.div className="valley-coords" variants={fadeUp}>
            <span className="valley-coords-label">Showroom</span>
            <span>34.0837° N · 74.7973° E</span>
            <span>Srinagar · Jammu & Kashmir · India</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* TRUST */
const TESTIMONIALS = [
  { quote: '"They didn\'t sell me a guitar — they sold me my guitar. There\'s a difference."', name: 'Aamir K.', role: 'Musician · Srinagar', initial: 'A' },
  { quote: '"Outfitted our school\'s entire sports inventory. Three years on — replacements still rare, service still personal."', name: 'Principal D.', role: 'Heritage School · Baramulla', initial: 'P' },
  { quote: '"The trophies arrived two days early, engraved exactly to brief. That\'s worth a paragraph in any review."', name: 'Rohit M.', role: 'Tournament Director', initial: 'R' },
];

export function Trust() {
  return (
    <section className="section trust" id="trust">
      <div className="container">
        <motion.div
          className="section-header"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div className="section-num" variants={fadeUp}>06 — Voices</motion.div>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2 className="section-title" variants={textReveal}>
              What our <em>customers carry.</em>
            </motion.h2>
          </div>
        </motion.div>

        <motion.div
          className="trust-grid"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} className="trust-item" variants={fadeUp}>
              <p className="trust-quote">{t.quote}</p>
              <div className="trust-author">
                <div className="trust-avatar">{t.initial}</div>
                <div>
                  <div className="trust-name">{t.name}</div>
                  <div className="trust-role">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* CTA */
export function CTA() {
  return (
    <section className="section cta" id="contact">
      <motion.div
        className="cta-content"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
      >
        <h2 className="cta-title">Visit. Touch. <em>Decide.</em></h2>
        <p className="cta-desc">
          Catalogues lie. Hands don't. Walk into our Srinagar showroom — or send a message — and let us help you choose the kit, the instrument, the trophy that earns its place.
        </p>
        <div className="cta-actions">
          <a href="https://wa.me/919419191919?text=Hi%20MDF%20Enterprises" className="btn-whatsapp interactive">
            <span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.057 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.825 9.825 0 016.99 2.898 9.823 9.823 0 012.892 6.994c-.003 5.45-4.437 9.884-9.886 9.884z" /></svg>
              WhatsApp Us
            </span>
          </a>
          <a href="tel:+919419191919" className="btn-ghost interactive">
            Call the Showroom
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </a>
        </div>
      </motion.div>
    </section>
  );
}

/* FOOTER */
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src="/logo.png" alt="MDF Enterprises" />
          <p className="footer-tagline">Sport. Music. Fitness. <em>Awards.</em><br />One Address.</p>
          <p className="footer-desc">MDF Enterprises has served the Valley of Kashmir since 1985 — a curated house for sporting equipment, musical instruments, fitness gear, and bespoke awards.</p>
        </div>
        <div className="footer-col">
          <h4>Catalogue</h4>
          <ul>
            <li><a href="#categories" className="interactive">Sporting Goods</a></li>
            <li><a href="#categories" className="interactive">Instruments</a></li>
            <li><a href="#categories" className="interactive">Fitness</a></li>
            <li><a href="#categories" className="interactive">Awards</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>House</h4>
          <ul>
            <li><a href="#heritage" className="interactive">Heritage</a></li>
            <li><a href="#brands" className="interactive">Brands</a></li>
            <li><a href="#craft" className="interactive">Craft</a></li>
            <li><a href="#trust" className="interactive">Voices</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Showroom</h4>
          <p>Srinagar, J&K</p>
          <p>India · 190001</p>
          <p style={{ marginTop: '14px' }}><a href="tel:+919419191919" className="interactive">+91 94191 91919</a></p>
          <p><a href="mailto:hello@mdfenterprises.in" className="interactive">hello@mdfenterprises.in</a></p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 1985 — 2026 MDF Enterprises · All rights reserved.</span>
        <span>Crafted in the Valley · <a href="#" className="interactive">Privacy</a> · <a href="#" className="interactive">Terms</a></span>
      </div>
    </footer>
  );
}
