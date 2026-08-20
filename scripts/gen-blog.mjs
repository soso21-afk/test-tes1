// Générateur du blog : blog.html (index) + blog/<slug>.html (articles).
// Node, zéro dépendance. Usage : node scripts/gen-blog.mjs
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const content = JSON.parse(await readFile(join(root, 'scripts', 'blog-content.json'), 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const nav = (b, enHref) => `
  <nav id="navbar">
    <a href="${b}index.html" class="logo" aria-label="Regeneratium — accueil">
      <img class="logo-img logo-light" src="${b}assets/logo-regeneratium.svg" alt="Regeneratium" />
      <img class="logo-img logo-dark" src="${b}assets/logo-regeneratium-dark.svg" alt="" aria-hidden="true" />
    </a>
    <div class="nav-links" id="navLinks">
      <div class="nav-item">
        <button class="nav-trigger" aria-expanded="false" aria-haspopup="true">Bien-être
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="nav-menu" role="menu" aria-label="Soins bien-être">
          <a href="${b}soins/massage.html" role="menuitem">Massage</a>
          <a href="${b}soins/flottaison.html" role="menuitem">Flottaison</a>
          <a href="${b}soins/cryotherapie.html" role="menuitem">Cryothérapie</a>
          <a href="${b}soins/chambre-de-sel.html" role="menuitem">Chambre de sel</a>
        </div>
      </div>
      <div class="nav-item">
        <button class="nav-trigger" aria-expanded="false" aria-haspopup="true">Médical
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="nav-menu" role="menu" aria-label="Soins médicaux">
          <a href="${b}soins/dietetique.html" role="menuitem">Diététique</a>
        </div>
      </div>
      <div class="nav-item">
        <button class="nav-trigger" aria-expanded="false" aria-haspopup="true">Thérapies
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="nav-menu" role="menu" aria-label="Soins thérapeutiques">
          <a href="${b}soins/osteopathie.html" role="menuitem">Ostéopathie</a>
          <a href="${b}soins/acupuncture.html" role="menuitem">Acupuncture</a>
          <a href="${b}soins/therapie-cranio-sacree.html" role="menuitem">Cranio-sacrée</a>
          <a href="${b}soins/hypnose.html" role="menuitem">Hypnothérapie</a>
        </div>
      </div>
      <a href="${b}a-propos.html">À propos</a>
      <a href="${b}blog.html">Blog</a>
      <a href="${b}contact.html">Contact</a>
      <a href="${b}rendez-vous.html" class="nav-cta">Prendre rendez-vous</a>
      <div class="lang-switch" aria-label="Langue / Language"><span class="lang-active">FR</span><a href="${enHref}" lang="en" hreflang="en">EN</a></div>
    </div>
    <button class="nav-toggle" id="navToggle" aria-label="Ouvrir le menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </nav>`;

const footer = (b) => `
  <footer>
    <div class="footer-top">
      <div>
        <a href="${b}index.html" class="logo footer-logo" aria-label="Regeneratium">
          <img class="logo-img" src="${b}assets/logo-regeneratium.svg" alt="Regeneratium" />
        </a>
        <p>Centre de thérapie &amp; bien-être à Rolle, entre Genève et Lausanne. Soins
          médicaux, thérapies douces et expériences de récupération.</p>
      </div>
      <div>
        <h3>Nos soins</h3>
        <a href="${b}nos-soins-bien-etre.html">Bien-être &amp; Santé</a>
        <a href="${b}nos-soins-medical.html">Médical</a>
        <a href="${b}nos-soins-therapies.html">Thérapies</a>
      </div>
      <div>
        <h3>Le centre</h3>
        <a href="${b}a-propos.html">À propos</a>
        <a href="${b}contact.html">Contact</a>
        <a href="${b}index.html#faq">FAQ</a>
      </div>
      <div>
        <h3>Boutique &amp; contact</h3>
        <a href="${b}bons-cadeaux.html">Bons cadeaux</a>
        <a href="${b}rendez-vous.html">Prendre rendez-vous</a>
        <a href="tel:+41218260088">+41 21 826 00 88</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Regeneratium — Rte de la Vallée 7, 1180 Rolle, Suisse</span>
      <div>
        <a href="${b}mentions-legales.html">Mentions légales</a>
        <a href="${b}mentions-legales.html">Confidentialité</a>
      </div>
    </div>
  </footer>`;

const doc = ({ b, title, desc, body, enHref = 'en/index.html' }) => `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta name="theme-color" content="#3B6979" />
  <link rel="icon" type="image/svg+xml" href="${b}assets/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,500;0,600;0,700;0,800;1,600;1,700&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${b}style.css" />
</head>
<body class="subpage">
${nav(b, enHref)}

  <main class="soin-page">
${body}
  </main>

${footer(b)}

  <script src="${b}script.js"></script>
</body>
</html>
`;

const slugs = Object.keys(content);

// Index
const cards = slugs.map((s) => {
  const a = content[s];
  return `      <a class="blog-card" href="blog/${s}.html">
        <h2>${esc(a.title)}</h2>
        <p>${esc(a.excerpt)}…</p>
        <span class="blog-more">Lire l'article →</span>
      </a>`;
}).join('\n');

const index = doc({
  b: '',
  title: 'Blog — Regeneratium · Rolle',
  desc: 'Le journal de Regeneratium : conseils bien-être, récupération, cryothérapie, flottaison, santé mentale et gestion du stress.',
  body: `    <section class="page-head">
      <span class="section-tag">Blog</span>
      <h1>Journal &amp; conseils</h1>
      <p>Nos articles sur le bien-être, la récupération et la santé — pour prendre soin de vous au quotidien.</p>
    </section>
    <section class="blog-grid">
${cards}
    </section>`,
});

// Articles
await mkdir(join(root, 'blog'), { recursive: true });
for (const s of slugs) {
  const a = content[s];
  const bodyBlocks = a.blocks.map((bl) => bl.type === 'h2' ? `      <h2>${esc(bl.text)}</h2>` : `      <p>${esc(bl.text)}</p>`).join('\n');
  const related = slugs.filter((x) => x !== s).slice(0, 3).map((x) => `        <a class="blog-card" href="${x}.html"><h2>${esc(content[x].title)}</h2><span class="blog-more">Lire l'article →</span></a>`).join('\n');
  const page = doc({
    b: '../',
    title: `${a.title} — Blog Regeneratium`,
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
      <span class="section-tag">Continuer</span>
      <h2>Autres articles</h2>
      <div class="blog-grid" style="padding:26px 0 0">
${related}
      </div>
    </section>`,
  });
  await writeFile(join(root, 'blog', `${s}.html`), page, 'utf8');
}
await writeFile(join(root, 'blog.html'), index, 'utf8');
console.log(`Blog généré : blog.html + ${slugs.length} articles dans blog/`);
