// Générateur de la version anglaise du site sous en/ (mêmes noms de fichiers
// que la version française). Node, zéro dépendance. Usage : node scripts/gen-en.mjs
// Contenus traduits : soins-content.en.json, soins-prix.en.json, blog-content.en.json.
// NB : en/index.html (accueil) est un fichier statique maintenu à la main.
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const content = JSON.parse(await readFile(join(root, 'scripts', 'soins-content.en.json'), 'utf8'));
const prix = JSON.parse(await readFile(join(root, 'scripts', 'soins-prix.en.json'), 'utf8'));
const blogContent = JSON.parse(await readFile(join(root, 'scripts', 'blog-content.en.json'), 'utf8'));

const esc = (s) => String(s)
  .replace(/&(?!#?\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ── Données des soins (EN) ──
const sectionOf = { Medical: 'medical', Therapies: 'therapies', Wellness: 'bien-etre' };

const icons = {
  dietetique: '<path d="M5 10h14a7 7 0 0 1-14 0Z"/><path d="M12 10c0-3 1.5-5 4-5"/><path d="M12 10c0-2-1-3.6-3-4.2"/>',
  osteopathie: '<circle cx="12" cy="5" r="2"/><path d="M12 7v6M8 10l4-1 4 1M9 20l3-7 3 7"/>',
  acupuncture: '<path d="M20 4 10 14"/><path d="M16 4h4v4"/><path d="M4 20l5-5"/>',
  'ventouse-cupping': '<circle cx="9" cy="9" r="3.2"/><circle cx="16" cy="13" r="3.2"/><circle cx="8.5" cy="16.5" r="2"/>',
  'therapie-cranio-sacree': '<circle cx="12" cy="9" r="6"/><path d="M6 20c2-2 4-3 6-3s4 1 6 3"/>',
  hypnose: '<path d="M14 12a2 2 0 1 1-2-2 4 4 0 1 1 4 4 6 6 0 1 1-6-6"/>',
  'naturopathie-micro-nutrition': '<path d="M12 21v-7"/><path d="M12 14c0-3-2-5-5-5 0 3 2 5 5 5Z"/><path d="M12 12c0-3 2-5 5-5 0 3-2 5-5 5Z"/>',
  massage: '<path d="M5 20c0-7 5-13 14-14 1 9-5 14-14 14Z"/><path d="M5 20c3-5 7-8 11-9.5"/>',
  flottaison: '<path d="M3 9c3-2 5-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 14c3-2 5-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 19c3-2 5-2 6 0s4 2 6 0 4-2 6 0"/>',
  cryotherapie: '<path d="M12 3v18M4 8l16 8M20 8 4 16M5.5 5.5 12 9M18.5 5.5 12 9M5.5 18.5 12 15M18.5 18.5 12 15"/>',
  halotherapie: '<path d="M12 3l1.9 4.4L18.5 9l-4.6 1.6L12 15l-1.9-4.4L5.5 9l4.6-1.6z"/><circle cx="6" cy="18" r="1"/><circle cx="18" cy="18" r="1"/><circle cx="12" cy="20.5" r="1"/>',
  'chambre-de-sel': '<path d="M12 3l1.9 4.4L18.5 9l-4.6 1.6L12 15l-1.9-4.4L5.5 9l4.6-1.6z"/><circle cx="6" cy="18" r="1"/><circle cx="18" cy="18" r="1"/><circle cx="12" cy="20.5" r="1"/>',
  sophrologie: '<path d="M12 20c0-4 1.5-7 4-9 .8 3-.5 6.5-4 9M12 20c0-4-1.5-7-4-9-.8 3 .5 6.5 4 9M12 20c-3.5 0-6-1.5-7-4 3-.5 5.5.5 7 4M12 20c3.5 0 6-1.5 7-4-3-.5-5.5.5-7 4"/>',
};

const services = [
  { slug: 'dietetique', group: 'Medical', title: 'Dietetics', lead: 'Personalised nutritional support to change eating habits for good and support your physical health.', price: 'According to Tarmed', coverage: 'Reimbursed by basic insurance (LaMal)', benefits: ['Weight management', 'Prevention', 'Digestive issues', 'Balanced diet'] },
  { slug: 'osteopathie', group: 'Therapies', title: 'Osteopathy', lead: 'Hands-on care to improve mobility, relieve pain and support the body’s overall balance.', price: 'CHF 130.00 · per session', coverage: 'According to supplementary insurance', benefits: ['Mobility', 'Joint pain', 'Tension', 'Body balance'] },
  { slug: 'acupuncture', group: 'Therapies', title: 'Acupuncture', lead: 'A practice from traditional Chinese medicine that supports energetic balance and the body’s natural functions.', price: 'CHF 150.00 · 1 h 30 session', coverage: 'ASCA & RME according to supplementary insurance', benefits: ['Energy', 'Pain', 'Stress', 'Sleep'] },
  { slug: 'ventouse-cupping', group: 'Therapies', title: 'Cupping', lead: 'A traditional suction technique to boost circulation, release tension and support recovery.', price: 'CHF 95.00 · 50 min session', coverage: 'ASCA & RME according to supplementary insurance', benefits: ['Circulation', 'Tension', 'Recovery', 'Drainage'] },
  { slug: 'therapie-cranio-sacree', group: 'Therapies', title: 'Craniosacral Therapy', lead: 'A gentle, light-touch approach to release tension and support the nervous system.', price: 'CHF 150.00 · 1 h 30 session', coverage: 'ASCA & RME according to supplementary insurance', benefits: ['Stress', 'Migraines', 'Sleep', 'Chronic pain'] },
  { slug: 'hypnose', group: 'Therapies', title: 'Hypnotherapy', lead: 'A natural state of modified consciousness to mobilise inner resources, clarify goals and support change.', price: 'CHF 140.00 · 90 min session', coverage: 'ASCA according to supplementary insurance', benefits: ['Inner resources', 'Goals', 'Blocks', 'Change'] },
  { slug: 'naturopathie-micro-nutrition', group: 'Therapies', title: 'Naturopathy & Micronutrition', lead: 'A holistic approach combining natural methods, nutrition and micronutrients to optimise health.', price: 'CHF 120.00 · first session CHF 160.00', coverage: 'According to supplementary insurance', benefits: ['Weight', 'Detox', 'Immunity', 'Digestion'] },
  { slug: 'sophrologie', group: 'Therapies', title: 'Sophrology', lead: 'A gentle method combining breathing, relaxation and positive visualisation to calm the mind, sleep better and build self-confidence.', price: 'CHF 130.00 · 60 min session', coverage: 'ASCA according to supplementary insurance', benefits: ['Stress reduction', 'Better sleep', 'Self-confidence', 'Emotional balance'] },
  { slug: 'massage', group: 'Wellness', title: 'Massage', lead: 'Tailored massages to relax the body, reduce tension, boost circulation and support recovery.', price: 'From CHF 120.00', coverage: 'ASCA & RME according to supplementary insurance', benefits: ['Relaxation', 'Tension', 'Stress', 'Recovery'] },
  { slug: 'flottaison', group: 'Wellness', title: 'Floatation', lead: 'Weightless immersion in Epsom-salt-saturated water for deep relaxation of body and mind.', price: 'CHF 120.00 · 1 h session', coverage: 'ASCA & RME according to supplementary insurance', benefits: ['Relaxation', 'Recovery', 'Sleep', 'Mental clarity'] },
  { slug: 'cryotherapie', group: 'Wellness', title: 'Cryotherapy', lead: 'Short exposure to intense cold to help reduce inflammation, relieve pain and stimulate recovery.', price: 'CHF 65.00', coverage: 'ASCA & RME according to supplementary insurance', benefits: ['Inflammation', 'Pain', 'Sport', 'Metabolism'] },
  { slug: 'halotherapie', group: 'Wellness', title: 'Halotherapy', lead: 'A natural salt room to support breathing and skin, in a deeply soothing environment.', price: 'CHF 65.00 · children CHF 30.00', coverage: 'ASCA & RME according to supplementary insurance', benefits: ['Breathing', 'Allergies', 'Skin', 'Stress'] },
  { slug: 'chambre-de-sel', group: 'Wellness', title: 'Salt Room', lead: 'A halotherapy experience in a salt room, designed to support the airways, the skin and deep calm.', price: 'CHF 65.00 · children CHF 30.00', coverage: 'ASCA & RME according to supplementary insurance', benefits: ['Breathing', 'Skin', 'Relaxation', 'Natural salt'] },
];

// ── Gabarits (r = chemin vers la racine du site, e = chemin vers en/, fr = page FR équivalente) ──
const navHtml = (r, e, fr) => `
  <nav id="navbar">
    <a href="${e}index.html" class="logo" aria-label="Regeneratium — home">
      <img class="logo-img logo-light" src="${r}assets/logo-regeneratium.svg" alt="Regeneratium" />
      <img class="logo-img logo-dark" src="${r}assets/logo-regeneratium-dark.svg" alt="" aria-hidden="true" />
    </a>
    <div class="nav-links" id="navLinks">
      <div class="nav-item">
        <button class="nav-trigger" aria-expanded="false" aria-haspopup="true">Wellness
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="nav-menu" role="menu" aria-label="Wellness treatments">
          <a href="${e}soins/massage.html" role="menuitem">Massage</a>
          <a href="${e}soins/flottaison.html" role="menuitem">Floatation</a>
          <a href="${e}soins/cryotherapie.html" role="menuitem">Cryotherapy</a>
          <a href="${e}soins/chambre-de-sel.html" role="menuitem">Salt room</a>
        </div>
      </div>
      <div class="nav-item">
        <button class="nav-trigger" aria-expanded="false" aria-haspopup="true">Medical
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="nav-menu" role="menu" aria-label="Medical care">
          <a href="${e}soins/dietetique.html" role="menuitem">Dietetics</a>
        </div>
      </div>
      <div class="nav-item">
        <button class="nav-trigger" aria-expanded="false" aria-haspopup="true">Therapies
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="nav-menu" role="menu" aria-label="Therapies">
          <a href="${e}soins/osteopathie.html" role="menuitem">Osteopathy</a>
          <a href="${e}soins/acupuncture.html" role="menuitem">Acupuncture</a>
          <a href="${e}soins/therapie-cranio-sacree.html" role="menuitem">Craniosacral</a>
          <a href="${e}soins/hypnose.html" role="menuitem">Hypnotherapy</a>
        </div>
      </div>
      <a href="${e}a-propos.html">About</a>
      <a href="${e}blog.html">Blog</a>
      <a href="${e}contact.html">Contact</a>
      <a href="${e}rendez-vous.html" class="nav-cta">Book an appointment</a>
      <div class="lang-switch" aria-label="Langue / Language"><a href="${r}${fr}" lang="fr" hreflang="fr">FR</a><span class="lang-active">EN</span></div>
    </div>
    <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </nav>`;

const footerHtml = (r, e) => `
  <footer>
    <div class="footer-top">
      <div>
        <a href="${e}index.html" class="logo footer-logo" aria-label="Regeneratium">
          <img class="logo-img" src="${r}assets/logo-regeneratium.svg" alt="Regeneratium" />
        </a>
        <p>Therapy &amp; wellness centre in Rolle, between Geneva and Lausanne. Medical
          care, gentle therapies and recovery experiences.</p>
      </div>
      <div>
        <h3>Our treatments</h3>
        <a href="${e}nos-soins-bien-etre.html">Wellness &amp; Health</a>
        <a href="${e}nos-soins-medical.html">Medical</a>
        <a href="${e}nos-soins-therapies.html">Therapies</a>
      </div>
      <div>
        <h3>The centre</h3>
        <a href="${e}a-propos.html">About</a>
        <a href="${e}contact.html">Contact</a>
        <a href="${e}index.html#faq">FAQ</a>
      </div>
      <div>
        <h3>Shop &amp; contact</h3>
        <a href="${e}bons-cadeaux.html">Gift vouchers</a>
        <a href="${e}rendez-vous.html">Book an appointment</a>
        <a href="tel:+41218260088">+41 21 826 00 88</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Regeneratium — Rte de la Vallée 7, 1180 Rolle, Switzerland</span>
      <div>
        <a href="${e}mentions-legales.html">Legal notice</a>
        <a href="${e}mentions-legales.html">Privacy</a>
      </div>
    </div>
  </footer>`;

const doc = ({ r, e, fr, title, desc, body, extraHead = '' }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta name="theme-color" content="#3B6979" />
  <link rel="icon" type="image/svg+xml" href="${r}assets/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,500;0,600;0,700;0,800;1,600;1,700&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${r}style.css" />${extraHead}
</head>
<body class="subpage">
${navHtml(r, e, fr)}

  <main class="soin-page">
${body}
  </main>

${footerHtml(r, e)}

  <script src="${r}script.js"></script>
</body>
</html>
`;

// ── Fiches soins ──
const groupLabel = { Medical: 'Medical', Therapies: 'therapy', Wellness: 'wellness', Programme: '' };

const soinPage = (s) => {
  const r = '../../', e = '../';
  const section = sectionOf[s.group] || 'contact';
  const related = services.filter((x) => x.group === s.group && x.slug !== s.slug).slice(0, 3);
  const icon = icons[s.slug] || icons.massage;

  const benefits = s.benefits.map((b) => `
          <article class="soin-benefit"><span aria-hidden="true">›</span><strong>${esc(b)}</strong></article>`).join('');

  const relatedCards = related.map((x) => `
          <a class="related-card" href="${x.slug}.html">
            <span class="soin-mini-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${icons[x.slug] || icons.massage}</svg></span>
            <strong>${esc(x.title)}</strong>
            <small>${esc(x.lead)}</small>
          </a>`).join('');

  const c = content[s.slug] || {};
  const faqItems = (c.faq && c.faq.length) ? c.faq : [
    { q: 'How the session unfolds', a: 'Every treatment is adapted to your situation. The specialist explains the process and tailors the session to your needs during the appointment.' },
    { q: 'Indications', a: `This treatment is particularly suited to: ${s.benefits.map((b) => b.toLowerCase()).join(', ')}. If in doubt, our team will guide you towards the most appropriate care.` },
    { q: 'Reimbursement', a: `${s.coverage}. We provide a compliant receipt for your insurance whenever the treatment is eligible.` },
  ];
  const faqHtml = faqItems.map((it, i) => `
          <details class="faq-item"${i === 0 ? ' open' : ''}>
            <summary>${esc(it.q)}</summary>
            <p>${esc(it.a)}</p>
          </details>`).join('');
  const introHtml = c.intro ? `
    <section class="soin-intro">
      <span class="section-tag">The treatment</span>
      <h2>What is ${esc(s.title)}?</h2>
      <p>${esc(c.intro)}</p>
    </section>` : '';

  const pl = prix[s.slug];
  let prixHtml = '';
  if (pl && pl.groups && pl.groups.length) {
    const groupsHtml = pl.groups.map((g) => `
      <div class="price-group">${g.title ? `
        <h3>${esc(g.title)}</h3>` : ''}${g.subtitle ? `
        <p class="price-group-sub">${esc(g.subtitle)}</p>` : ''}
        <div class="price-rows">
${g.items.map((it) => `          <div class="price-row"><div class="price-label"><strong>${esc(it.name)}</strong><small>${esc(it.detail)}</small></div><span class="price-amount">${esc(it.price)}</span></div>`).join('\n')}
        </div>
      </div>`).join('\n');
    const notes = (pl.notes || []).map((n) => `
      <p class="price-note">${esc(n)}</p>`).join('');
    prixHtml = `
    <section class="price-list">
      <span class="section-tag">Prices</span>
      <h2>Price list</h2>
${groupsHtml}${notes}
      <a class="btn-primary" href="../rendez-vous.html">Book an appointment</a>
    </section>`;
  }

  const otherLabel = s.group === 'Programme' ? 'Other treatments' : `Other ${groupLabel[s.group]} treatments`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(s.title)} — Regeneratium · Rolle</title>
  <meta name="description" content="${esc(s.title)} at Regeneratium, Rolle, between Geneva and Lausanne. ${esc(s.lead)}" />
  <meta name="theme-color" content="#3B6979" />
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,500;0,600;0,700;0,800;1,600;1,700&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../style.css" />
</head>
<body class="subpage">
${navHtml(r, e, `soins/${s.slug}.html`)}

  <main class="soin-page">
    <section class="soin-hero">
      <div class="soin-hero-text">
        <a class="soin-back" href="../index.html#${section}">‹ ${esc(s.group)}</a>
        <h1>${esc(s.title)}</h1>
        <p class="soin-loc">Between Geneva and Lausanne</p>
        <p class="soin-lead">${esc(s.lead)}</p>
        <div class="soin-actions">
          <a class="btn-primary" href="../rendez-vous.html">Book an appointment</a>
          <a class="btn-outline" href="../index.html#${section}">View all treatments</a>
        </div>
      </div>
      <aside class="price-card">
        <span class="soin-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${icon}</svg></span>
        <span class="price-kicker">Price</span>
        <strong>${esc(s.price)}</strong>
        <p>${esc(s.coverage)}</p>
      </aside>
    </section>
${introHtml}
${prixHtml}
    <section class="soin-body">
      <div class="soin-block">
        <span class="section-tag">Applications &amp; benefits</span>
        <h2>Why choose this treatment?</h2>
        <div class="soin-benefits">${benefits}
        </div>
      </div>
      <div class="soin-block">
        <span class="section-tag">Frequently asked questions</span>
        <h2>Good to know</h2>
        <div class="soin-faq">${faqHtml}
        </div>
      </div>
    </section>

    <section class="soin-related">
      <span class="section-tag">Continue</span>
      <h2>${esc(otherLabel)}</h2>
      <div class="related-grid">${relatedCards}
      </div>
    </section>
  </main>

${footerHtml(r, e)}

  <script src="../../script.js"></script>
</body>
</html>
`;
};

// ── Blog ──
const blogSlugs = Object.keys(blogContent);

const blogCards = blogSlugs.map((s) => {
  const a = blogContent[s];
  return `      <a class="blog-card" href="blog/${s}.html">
        <h2>${esc(a.title)}</h2>
        <p>${esc(a.excerpt)}…</p>
        <span class="blog-more">Read the article →</span>
      </a>`;
}).join('\n');

const blogIndex = doc({
  r: '../', e: '', fr: 'blog.html',
  title: 'Blog — Regeneratium · Rolle',
  desc: 'The Regeneratium journal: wellness advice, recovery, cryotherapy, floatation, mental health and stress management.',
  body: `    <section class="page-head">
      <span class="section-tag">Blog</span>
      <h1>Journal &amp; advice</h1>
      <p>Our articles on well-being, recovery and health — to help you take care of yourself every day.</p>
    </section>
    <section class="blog-grid">
${blogCards}
    </section>`,
});

const blogPage = (s) => {
  const a = blogContent[s];
  const bodyBlocks = a.blocks.map((bl) => bl.type === 'h2' ? `      <h2>${esc(bl.text)}</h2>` : `      <p>${esc(bl.text)}</p>`).join('\n');
  const related = blogSlugs.filter((x) => x !== s).slice(0, 3).map((x) => `        <a class="blog-card" href="${x}.html"><h2>${esc(blogContent[x].title)}</h2><span class="blog-more">Read the article →</span></a>`).join('\n');
  return doc({
    r: '../../', e: '../', fr: `blog/${s}.html`,
    title: `${a.title} — Regeneratium Blog`,
    desc: a.excerpt,
    body: `    <section class="page-head">
      <a class="soin-back" href="../blog.html">‹ Blog</a>
      <span class="section-tag">Article</span>
      <h1>${esc(a.title)}</h1>
      ${a.subtitle ? `<p class="page-loc">${esc(a.subtitle)}</p>` : ''}
    </section>
    <article class="article-body reveal">
${bodyBlocks}
    </article>
    <section class="soin-related">
      <span class="section-tag">Continue</span>
      <h2>More articles</h2>
      <div class="blog-grid" style="padding:26px 0 0">
${related}
      </div>
    </section>`,
  });
};

// ── Pages institutionnelles ──
const team = [
  ['Nathalie', 'Massage therapist (ASCA)'],
  ['Michael', 'Massage therapist (ASCA)'],
  ['Sarah', 'Massage therapist (ASCA)'],
  ['Karen', 'Massage therapist (ASCA, RME)'],
  ['Osvaldo', 'Craniosacral & osteopathy (ASCA)'],
];

const aPropos = doc({
  r: '../', e: '', fr: 'a-propos.html',
  title: 'About — Regeneratium · Rolle',
  desc: 'Regeneratium, a therapy and wellness centre in Rolle between Geneva and Lausanne. Our philosophy, our approach to self-regeneration and our team.',
  body: `    <section class="page-head">
      <span class="section-tag">About</span>
      <h1>Regeneratium, well-being specialists</h1>
      <p class="page-loc">In Rolle, between Geneva and Lausanne</p>
      <p>In an elegant, intimate setting just steps from Lake Geneva, Regeneratium
        welcomes everyone who wants to take care of their body and mind.</p>
    </section>

    <section class="about-wrap reveal">
      <h2>Our philosophy</h2>
      <p>Created by Loïc and Marco, both passionate about natural therapies and
        scientific literature, Regeneratium was designed as a “lab” bringing together
        innovative treatments (cryotherapy, halotherapy, floatation) and therapies such
        as osteopathy, naturopathy &amp; micronutrition, acupuncture, craniosacral
        therapy and cupping. We also offer wellness treatments such as massages.</p>
      <blockquote class="about-quote">“At Regeneratium, we offer you a journey — an
        experience that guides you along the path to calm and well-being. Our mission is
        to allow everyone to tap into their natural capacity for self-regeneration and
        improve their longevity.”</blockquote>
      <p>Cellular and mental self-regeneration and self-healing are within everyone's
        reach, but too often go untapped: poor diet, lack of time for yourself, too much
        stress… Regeneratium guides you along the path of (re)construction, with
        solutions that improve your well-being over the long term.</p>
    </section>

    <section class="about-wrap reveal">
      <h2>Our team</h2>
      <div class="team-grid">
${team.map(([n, ro]) => `        <div class="team-card"><div class="team-avatar" aria-hidden="true">${n[0]}</div><strong>${n}</strong><small>${ro}</small></div>`).join('\n')}
      </div>
    </section>

    <section class="booking" style="padding-top:10px">
      <div class="cta-banner reveal">
        <div>
          <h2>Would you like to meet us?</h2>
          <p>Book an appointment or drop by and see us in Rolle.</p>
        </div>
        <a class="btn-primary btn-light" href="rendez-vous.html">Book an appointment</a>
      </div>
    </section>`,
});

const contact = doc({
  r: '../', e: '', fr: 'contact.html',
  title: 'Contact — Regeneratium · Rolle',
  desc: 'Contact Regeneratium in Rolle: phone +41 21 826 00 88, e-mail info@regeneratium.ch, Rte de la Vallée 7, 1180 Rolle, Switzerland.',
  body: `    <section class="page-head">
      <span class="section-tag">Contact</span>
      <h1>Get in touch</h1>
      <p class="page-loc">In Rolle, between Geneva and Lausanne</p>
      <p>The whole Regeneratium team is at your disposal to answer your questions
        and requests.</p>
    </section>

    <section class="contact" style="border-radius:0">
      <div class="contact-grid">
        <div class="contact-info reveal">
          <a class="contact-item" href="tel:+41218260088"><span>Phone</span><strong>+41 21 826 00 88</strong></a>
          <a class="contact-item" href="mailto:info@regeneratium.ch"><span>E-mail</span><strong>info@regeneratium.ch</strong></a>
          <a class="contact-item" href="https://maps.google.com/?q=Rte+de+la+Vall%C3%A9e+7,+1180+Rolle" target="_blank" rel="noopener"><span>Address</span><strong>Rte de la Vallée 7, 1180 Rolle, Switzerland</strong></a>
          <a class="contact-item" href="rendez-vous.html"><span>Appointments</span><strong>Book online</strong></a>
        </div>
        <form class="contact-form reveal">
          <div class="form-row">
            <label>Name<input type="text" name="nom" placeholder="Your name" required></label>
            <label>E-mail<input type="email" name="email" placeholder="you@email.com" required></label>
          </div>
          <label>Phone<input type="tel" name="tel" placeholder="+41 …"></label>
          <label>Message<textarea name="message" placeholder="Your message…"></textarea></label>
          <button type="submit" class="btn-primary">Send</button>
        </form>
      </div>
    </section>`,
});

const legal = doc({
  r: '../', e: '', fr: 'mentions-legales.html',
  title: 'Legal notice — Regeneratium',
  desc: 'Legal notice and privacy policy of the Regeneratium website, Rolle, Switzerland.',
  body: `    <section class="page-head">
      <span class="section-tag">Legal information</span>
      <h1>Legal notice</h1>
    </section>

    <section class="legal-page reveal">
      <h2>Website publisher</h2>
      <p>Regeneratium — Therapy &amp; wellness centre<br />
        Rte de la Vallée 7, 1180 Rolle, Switzerland<br />
        Phone: <a href="tel:+41218260088">+41 21 826 00 88</a><br />
        E-mail: <a href="mailto:info@regeneratium.ch">info@regeneratium.ch</a></p>

      <h2>Intellectual property</h2>
      <p>All content on this website (texts, images, logo, graphic elements) is the
        property of Regeneratium or its partners. Any reproduction or use, in whole or
        in part, without prior authorisation is prohibited.</p>

      <h2>Liability</h2>
      <p>The information on this website is provided for guidance only and in no way
        replaces medical advice. Regeneratium strives to keep it accurate but cannot be
        held responsible for any errors or omissions.</p>

      <h2>Online booking</h2>
      <p>Online appointment booking is provided by our partner OneDoc SA. Data entered
        in the booking calendar is processed in accordance with OneDoc's privacy
        policy.</p>

      <h2>Data protection</h2>
      <p>Personal data submitted via our forms (name, e-mail, phone, message) is used
        solely to respond to your requests and manage your care. It is neither sold nor
        passed on to third parties. In accordance with Swiss data protection law, you
        have the right to access, rectify and delete your data by writing to
        <a href="mailto:info@regeneratium.ch">info@regeneratium.ch</a>.</p>

      <h2>Cookies</h2>
      <p>This website may use cookies for audience measurement and proper operation.
        You can configure your browser to refuse them.</p>
    </section>`,
});

// ── Pages aperçu « Nos soins » ──
const previews = [
  { slug: 'massage', title: 'Massage', group: 'Wellness', blurb: 'Relaxation, circulation and recovery.' },
  { slug: 'flottaison', title: 'Floatation', group: 'Wellness', blurb: 'Deep relaxation in weightlessness.' },
  { slug: 'cryotherapie', title: 'Cryotherapy', group: 'Wellness', blurb: 'Intense cold, recovery, anti-inflammatory.' },
  { slug: 'halotherapie', title: 'Halotherapy · Salt room', group: 'Wellness', blurb: 'Salty air for breathing and skin.' },
  { slug: 'dietetique', title: 'Dietetics', group: 'Medical', blurb: 'Personalised nutrition (reimbursed by LaMal).' },
  { slug: 'osteopathie', title: 'Osteopathy', group: 'Therapies', blurb: 'Mobility and tension relief.' },
  { slug: 'acupuncture', title: 'Acupuncture', group: 'Therapies', blurb: 'Energetic balance, pain, sleep.' },
  { slug: 'ventouse-cupping', title: 'Cupping', group: 'Therapies', blurb: 'Circulation, tension, recovery.' },
  { slug: 'therapie-cranio-sacree', title: 'Craniosacral', group: 'Therapies', blurb: 'Light touch, nervous system.' },
  { slug: 'naturopathie-micro-nutrition', title: 'Naturopathy & micronutrition', group: 'Therapies', blurb: 'A natural, holistic approach.' },
  { slug: 'hypnose', title: 'Hypnotherapy', group: 'Therapies', blurb: 'Mobilising your inner resources.' },
  { slug: 'sophrologie', title: 'Sophrology', group: 'Therapies', blurb: 'Breathing, relaxation, self-confidence.' },
];
const previewCard = (s) => `<a class="related-card" href="soins/${s.slug}.html"><span class="related-cat">${s.group}</span><strong>${s.title}</strong><small>${s.blurb}</small></a>`;
const previewGrid = (list, extra = '') => `<div class="related-grid${extra}">${list.map(previewCard).join('')}</div>`;

const bienEtre = doc({
  r: '../', e: '', fr: 'nos-soins-bien-etre.html',
  title: 'Our Wellness treatments — Regeneratium · Rolle',
  desc: 'All the wellness treatments at Regeneratium in Rolle: massage, floatation, cryotherapy, halotherapy.',
  body: `    <section class="page-head">
      <span class="section-tag">Our treatments</span>
      <h1>Wellness &amp; Health</h1>
      <p class="page-loc">In Rolle, between Geneva and Lausanne</p>
      <p>Experiences designed to release the body, calm the mind and support recovery.</p>
    </section>
    <section class="soin-related">${previewGrid(previews.filter((s) => s.group === 'Wellness'))}</section>`,
});

const medical = doc({
  r: '../', e: '', fr: 'nos-soins-medical.html',
  title: 'Our Medical care — Regeneratium · Rolle',
  desc: 'Medical care at Regeneratium in Rolle, between Geneva and Lausanne, provided by health professionals.',
  body: `    <section class="page-head">
      <span class="section-tag">Our treatments</span>
      <h1>Our Medical care</h1>
      <p class="page-loc">In Rolle, between Geneva and Lausanne</p>
      <p>Medical care provided by health professionals.</p>
    </section>
    <section id="medical" class="soin-related">
      <span class="section-tag">Medical</span>
      <h2>Medical care</h2>
      ${previewGrid(previews.filter((s) => s.group === 'Medical'), ' grid-solo')}
    </section>`,
});

const therapies = doc({
  r: '../', e: '', fr: 'nos-soins-therapies.html',
  title: 'Our Therapies — Regeneratium · Rolle',
  desc: 'All the therapies at Regeneratium in Rolle, between Geneva and Lausanne: osteopathy, acupuncture, craniosacral, hypnotherapy, sophrology…',
  body: `    <section class="page-head">
      <span class="section-tag">Our treatments</span>
      <h1>Our Therapies</h1>
      <p class="page-loc">In Rolle, between Geneva and Lausanne</p>
      <p>Manual and natural approaches to relieve, rebalance and support change.</p>
    </section>
    <section id="therapies" class="soin-related">
      <span class="section-tag">Therapies</span>
      <h2>Therapies</h2>
      ${previewGrid(previews.filter((s) => s.group === 'Therapies'))}
    </section>`,
});

// ── Page Bons cadeaux / Boutique ──
const produits = JSON.parse(await readFile(join(root, 'scripts', 'boutique-produits.json'), 'utf8'))
  .map((p) => ({ ...p, name: p.name.replace(/&#x27;/g, '’') }));

const catOf = (n) => {
  const s = n.toLowerCase();
  if (/^bon/.test(s)) return 'Gift vouchers';
  if (/pack|offre|longevity|privatisation|abonnement/.test(s)) return 'Packs & offers';
  if (/flottaison|floating/.test(s)) return 'Floatation';
  if (/massage/.test(s)) return 'Massages';
  if (/cryo|salt/.test(s)) return 'Cryo & Salt room';
  return 'Therapies';
};
const catOrder = ['Gift vouchers', 'Floatation', 'Massages', 'Cryo & Salt room', 'Therapies', 'Packs & offers'];
const priceNum = (p) => parseFloat(String(p).replace(/[^\d,\.]/g, '').replace(',', '.')) || 0;
const sorted = [...produits].sort((a, b) => catOrder.indexOf(catOf(a.name)) - catOrder.indexOf(catOf(b.name)) || priceNum(a.price) - priceNum(b.price));

const giftSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M12 8v13M12 8c-2 0-4.5-1-4.5-3A1.9 1.9 0 0 1 12 4.6 1.9 1.9 0 0 1 16.5 5c0 2-2.5 3-4.5 3Z"/></svg>';

const shopCards = sorted.map((p) => {
  const cat = catOf(p.name);
  const visual = p.img
    ? `<img src="${p.img}" alt="" loading="lazy" />`
    : `<span class="shop-ph" aria-hidden="true">${giftSvg}</span>`;
  return `        <a class="shop-card reveal" data-cat="${cat}" href="${p.href}" target="_blank" rel="noopener">
          <div class="shop-visual">${visual}</div>
          <div class="shop-body">
            <span class="shop-cat">${cat}</span>
            <strong>${esc(p.name)}</strong>
            <div class="shop-foot"><span class="shop-price">${esc(p.price)}</span><span class="shop-buy">Give ↗</span></div>
          </div>
        </a>`;
}).join('\n');

const filters = ['All', ...catOrder].map((c, i) => `        <button type="button" class="shop-filter${i === 0 ? ' active' : ''}" data-filter="${c}">${c}</button>`).join('\n');

const bonsCadeaux = doc({
  r: '../', e: '', fr: 'bons-cadeaux.html',
  extraHead: '\n  <link rel="preconnect" href="https://images.sumup.com" />',
  title: 'Gift vouchers & shop — Regeneratium · Rolle',
  desc: 'The Regeneratium shop: gift vouchers, floatation, massages, cryotherapy, salt room, packs and offers — order online, delivered by e-mail.',
  body: `    <section class="page-head">
      <span class="section-tag">Gift vouchers &amp; shop</span>
      <h1>Give the gift of regeneration</h1>
      <p class="page-loc">In Rolle, between Geneva and Lausanne</p>
      <p>Gift vouchers, floatation sessions, massages, cryotherapy, packs… Choose below:
        payment is made online and the voucher arrives by e-mail, ready to give.</p>
    </section>

    <section class="gift-steps reveal" aria-label="How it works">
      <div class="gift-step"><span>1</span><strong>Choose</strong><p>A specific treatment, a pack or a voucher for any amount, below.</p></div>
      <div class="gift-step"><span>2</span><strong>Receive</strong><p>The gift voucher arrives by e-mail, ready to print or forward.</p></div>
      <div class="gift-step"><span>3</span><strong>Give</strong><p>The recipient books their session on +41 21 826 00 88 or online.</p></div>
    </section>

    <section id="boutique" class="soin-related" style="padding-top:16px">
      <span class="section-tag">Shop</span>
      <h2>Our gift vouchers &amp; treatments</h2>
      <div class="shop-filters" role="group" aria-label="Filter by category">
${filters}
      </div>
      <div class="shop-grid">
${shopCards}
      </div>
    </section>

    <section class="booking" style="padding-top:0">
      <div class="cta-banner reveal">
        <div>
          <h2>A question about gift vouchers?</h2>
          <p>Our team will be happy to help you choose the perfect treatment to give.</p>
        </div>
        <a class="btn-primary btn-light" href="contact.html">Contact us</a>
      </div>
    </section>

    <script>
      (function () {
        var btns = [].slice.call(document.querySelectorAll('.shop-filter'));
        var cards = [].slice.call(document.querySelectorAll('.shop-card'));
        btns.forEach(function (btn) {
          btn.addEventListener('click', function () {
            btns.forEach(function (b) { b.classList.toggle('active', b === btn); });
            var f = btn.dataset.filter;
            cards.forEach(function (c) { c.hidden = f !== 'All' && c.dataset.cat !== f; });
          });
        });
      })();
    </script>`,
});

// ── Page Rendez-vous (widget OneDoc) ──
const ONEDOC_ID = '8b7824506ca4883b5b1b63758da9866169bf94a9f6790aa344fbd192a2ff65fd';
const rendezVous = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Book an appointment — Regeneratium · Rolle</title>
  <meta name="description" content="Book your treatment online at Regeneratium in Rolle, between Geneva and Lausanne. Choose your treatment and book via our OneDoc calendar." />
  <meta name="theme-color" content="#3B6979" />
  <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,500;0,600;0,700;0,800;1,600;1,700&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../style.css" />
</head>
<body class="subpage">
${navHtml('../', '', 'rendez-vous.html').replace('href="rendez-vous.html" class="nav-cta"', 'href="#book" class="nav-cta"')}

  <main class="soin-page">
    <section class="booking-intro">
      <div class="section-header">
        <span class="section-tag">Appointments</span>
        <h1>Book an appointment</h1>
        <p>Choose your treatment, then book your slot online — directly in our OneDoc
          calendar, just like at the practice.</p>
      </div>
    </section>

    <section class="booking" id="book">
      <div class="booking-panel">
        <h2>Book online</h2>
        <p class="booking-sub">Find your treatment, then choose the service and time slot
          that suit you, directly in our calendar.</p>

        <!-- Sélecteur : barre de recherche + catégories déroulantes -->
        <div class="booking-picker">
          <label class="spec-label" for="specTrigger">Speciality</label>
          <div class="spec-select">
            <button type="button" class="spec-trigger" id="specTrigger" aria-expanded="false" aria-haspopup="true">
              <span id="specValue">Select a speciality</span>
              <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="spec-panel" id="specPanel" hidden>
              <div class="search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>
                <input type="search" id="soinSearch" placeholder="Search for a treatment…" aria-label="Search for a treatment" autocomplete="off" />
          </div>

          <div class="soin-accordion" id="soinAccordion">
            <div class="soin-cat">
              <button class="soin-cat-head" aria-expanded="false">Wellness
                <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <div class="soin-cat-list">
                <a href="soins/massage.html">Massage</a>
                <a href="soins/flottaison.html">Floatation</a>
                <a href="soins/cryotherapie.html">Cryotherapy</a>
                <a href="soins/chambre-de-sel.html">Salt room</a>
              </div>
            </div>

            <div class="soin-cat">
              <button class="soin-cat-head" aria-expanded="false">Medical
                <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <div class="soin-cat-list">
                <a href="soins/dietetique.html">Dietetics</a>
              </div>
            </div>

            <div class="soin-cat">
              <button class="soin-cat-head" aria-expanded="false">Therapies
                <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <div class="soin-cat-list">
                <a href="soins/osteopathie.html">Osteopathy</a>
                <a href="soins/acupuncture.html">Acupuncture</a>
                <a href="soins/therapie-cranio-sacree.html">Craniosacral</a>
                <a href="soins/hypnose.html">Hypnotherapy</a>
              </div>
            </div>

            <p class="soin-noresult" hidden>No treatment matches your search.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Réservation en ligne (widget OneDoc) -->
        <div class="booking-widget">
          <div class="od-embed">
            <iframe class="od-widget" id="od-widget-${ONEDOC_ID}" src="about:blank" data-src="https://www.onedoc.ch/en/widget/${ONEDOC_ID}" frameborder="0" title="Online appointment booking — Regeneratium (OneDoc)"></iframe>
          </div>
          <a class="od-fallback" href="https://www.onedoc.ch/en/widget/${ONEDOC_ID}" target="_blank" rel="noopener">Open the booking page in a new tab ↗</a>
        </div>
      </div>
    </section>

    <!-- ===================== BONS CADEAUX ===================== -->
    <section class="giftcard">
      <div class="giftcard-inner reveal">
        <div>
          <span class="section-tag">Gift vouchers</span>
          <h2>Rather give a gift?</h2>
          <p>Floatation, massage, cryotherapy or any amount — give a moment of
            regeneration with our gift vouchers.</p>
        </div>
        <a class="btn-primary" href="bons-cadeaux.html">Discover our gift vouchers</a>
      </div>
    </section>
  </main>

${footerHtml('../', '').replace('href="rendez-vous.html">Book an appointment', 'href="#book">Book an appointment')}

  <script src="../script.js"></script>
  <script>
    // Widget OneDoc : activation + auto-hauteur (protocole postMessage du site officiel)
    (function () {
      var ID = '${ONEDOC_ID}';
      var f = document.getElementById('od-widget-' + ID);
      if (f && f.dataset.src) f.src = f.dataset.src;
      window.addEventListener('message', function (e) {
        if (!e.data || e.data['od-widget-id'] !== ID) return;
        if (e.data['od-widget-height']) f.style.height = e.data['od-widget-height'] + 'px';
      });
    })();

    // Menu « Speciality » : ouvrir / fermer le panneau
    (function () {
      var trigger = document.getElementById('specTrigger');
      var panel = document.getElementById('specPanel');
      if (!trigger || !panel) return;
      trigger.addEventListener('click', function () {
        var willOpen = panel.hidden;
        panel.hidden = !willOpen;
        trigger.setAttribute('aria-expanded', String(willOpen));
      });
      document.addEventListener('click', function (e) {
        if (!e.target.closest('.spec-select')) {
          panel.hidden = true;
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    })();

    // Sélecteur de soin : catégories déroulantes + recherche
    (function () {
      var cats = [].slice.call(document.querySelectorAll('.soin-cat'));
      cats.forEach(function (cat) {
        var head = cat.querySelector('.soin-cat-head');
        head.addEventListener('click', function () {
          var open = cat.classList.toggle('open');
          head.setAttribute('aria-expanded', String(open));
        });
      });

      var input = document.getElementById('soinSearch');
      var noResult = document.querySelector('.soin-noresult');
      input.addEventListener('input', function () {
        var q = this.value.trim().toLowerCase();
        var anyGlobal = false;
        cats.forEach(function (cat) {
          var head = cat.querySelector('.soin-cat-head');
          var matches = 0;
          [].slice.call(cat.querySelectorAll('.soin-cat-list a')).forEach(function (a) {
            var hit = !q || a.textContent.toLowerCase().indexOf(q) !== -1;
            a.hidden = !hit;
            if (hit && q) matches++;
          });
          if (q) {
            cat.hidden = matches === 0;
            cat.classList.toggle('open', matches > 0);
            head.setAttribute('aria-expanded', String(matches > 0));
            if (matches > 0) anyGlobal = true;
          } else {
            cat.hidden = false;
            cat.classList.remove('open');
            head.setAttribute('aria-expanded', 'false');
          }
        });
        if (noResult) noResult.hidden = !q || anyGlobal;
      });
    })();
  </script>
</body>
</html>
`;

// ── Écriture ──
await mkdir(join(root, 'en', 'soins'), { recursive: true });
await mkdir(join(root, 'en', 'blog'), { recursive: true });

let n = 0;
for (const s of services) {
  await writeFile(join(root, 'en', 'soins', `${s.slug}.html`), soinPage(s), 'utf8');
  n++;
}
for (const s of blogSlugs) {
  await writeFile(join(root, 'en', 'blog', `${s}.html`), blogPage(s), 'utf8');
}
await writeFile(join(root, 'en', 'blog.html'), blogIndex, 'utf8');
await writeFile(join(root, 'en', 'a-propos.html'), aPropos, 'utf8');
await writeFile(join(root, 'en', 'contact.html'), contact, 'utf8');
await writeFile(join(root, 'en', 'mentions-legales.html'), legal, 'utf8');
await writeFile(join(root, 'en', 'nos-soins-bien-etre.html'), bienEtre, 'utf8');
await writeFile(join(root, 'en', 'nos-soins-medical.html'), medical, 'utf8');
await writeFile(join(root, 'en', 'nos-soins-therapies.html'), therapies, 'utf8');
await writeFile(join(root, 'en', 'bons-cadeaux.html'), bonsCadeaux, 'utf8');
await writeFile(join(root, 'en', 'rendez-vous.html'), rendezVous, 'utf8');
console.log(`Version EN générée : ${n} fiches soins, ${blogSlugs.length} articles + 9 pages dans en/ (index EN statique non touché)`);
