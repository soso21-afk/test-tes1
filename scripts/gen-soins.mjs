// Générateur des pages de soins individuelles (Node, zéro dépendance).
// Usage : node scripts/gen-soins.mjs  -> écrit les fichiers dans soins/
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'soins');

// Contenu réel (intro « qu'est-ce que » + FAQ) extrait du site officiel
let content = {};
try { content = JSON.parse(await readFile(join(root, 'scripts', 'soins-content.json'), 'utf8')); } catch {}

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Ancre de la section correspondante sur la page d'accueil
const sectionOf = { 'Médical': 'medical', 'Thérapies': 'therapies', 'Bien-être': 'bien-etre', 'Programme': 'contact' };

// Icônes SVG (contenu interne, hérite de currentColor)
const icons = {
  psychologie: '<circle cx="12" cy="8" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>',
  psychotherapie: '<path d="M3 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7l-4 3z"/><path d="M9 14v1a2 2 0 0 0 2 2h6l3 2v-7a2 2 0 0 0-2-2h-1"/>',
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
  'prise-en-charge-du-stress': '<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z"/>',
  sophrologie: '<path d="M12 20c0-4 1.5-7 4-9 .8 3-.5 6.5-4 9M12 20c0-4-1.5-7-4-9-.8 3 .5 6.5 4 9M12 20c-3.5 0-6-1.5-7-4 3-.5 5.5.5 7 4M12 20c3.5 0 6-1.5 7-4-3-.5-5.5.5-7 4"/>',
};

const services = [
  { slug: 'psychotherapie', group: 'Médical', title: 'Psychothérapie', lead: 'Un accompagnement structuré pour comprendre les pensées, les émotions et les comportements, afin d’améliorer la santé mentale et le bien-être.', price: 'Selon Tarmed', coverage: 'ASCA & RME selon assurance complémentaire', benefits: ['Troubles de l’humeur', 'Troubles anxieux', 'Thérapie de couple', 'Croissance personnelle'] },
  { slug: 'dietetique', group: 'Médical', title: 'Diététique', lead: 'Un accompagnement nutritionnel personnalisé pour changer durablement les habitudes alimentaires et soutenir la santé physique.', price: 'Selon Tarmed', coverage: 'Remboursé par l’assurance de base (LaMal)', benefits: ['Gestion du poids', 'Prévention', 'Troubles digestifs', 'Équilibre alimentaire'] },
  { slug: 'psychologie', group: 'Médical', title: 'Psychologie', lead: 'Une approche d’écoute et d’évaluation pour mieux comprendre les comportements, les émotions et les processus mentaux.', price: 'CHF 150.00', coverage: 'ASCA & RME selon assurance complémentaire', benefits: ['Évaluation psychologique', 'Thérapie de soutien', 'Développement personnel', 'Gestion du stress'] },
  { slug: 'osteopathie', group: 'Thérapies', title: 'Ostéopathie', lead: 'Une prise en charge manuelle pour améliorer la mobilité, soulager les douleurs et soutenir l’équilibre global du corps.', price: 'Selon prestation', coverage: 'Selon assurance complémentaire', benefits: ['Mobilité', 'Douleurs articulaires', 'Tensions', 'Équilibre corporel'] },
  { slug: 'acupuncture', group: 'Thérapies', title: 'Acupuncture', lead: 'Une pratique issue de la médecine traditionnelle chinoise visant à soutenir l’équilibre énergétique et les fonctions naturelles.', price: 'Selon prestation', coverage: 'Selon assurance complémentaire', benefits: ['Énergie', 'Douleurs', 'Stress', 'Sommeil'] },
  { slug: 'ventouse-cupping', group: 'Thérapies', title: 'Ventouse / Cupping', lead: 'Une technique traditionnelle par effet de succion pour favoriser la circulation, libérer les tensions et accompagner la récupération.', price: 'Selon prestation', coverage: 'Selon assurance complémentaire', benefits: ['Circulation', 'Tensions', 'Récupération', 'Drainage'] },
  { slug: 'therapie-cranio-sacree', group: 'Thérapies', title: 'Thérapie Cranio-Sacrée', lead: 'Une approche douce par touchers légers pour libérer les tensions et soutenir le fonctionnement du système nerveux.', price: 'CHF 150.00 · séance de 1h30', coverage: 'ASCA & RME selon assurance complémentaire', benefits: ['Stress', 'Migraines', 'Sommeil', 'Douleurs chroniques'] },
  { slug: 'hypnose', group: 'Thérapies', title: 'Hypnothérapie', lead: 'Un état naturel de conscience modifiée pour mobiliser les ressources intérieures, clarifier les objectifs et accompagner le changement.', price: 'CHF 140.00 · séance de 90 min', coverage: 'ASCA selon assurance complémentaire', benefits: ['Ressources intérieures', 'Objectifs', 'Blocages', 'Changement'] },
  { slug: 'naturopathie-micro-nutrition', group: 'Thérapies', title: 'Naturopathie & Micro-nutrition', lead: 'Une approche holistique qui combine méthodes naturelles, nutrition et micronutriments pour optimiser la santé.', price: 'CHF 120.00 · première séance CHF 160.00', coverage: 'Selon assurance complémentaire', benefits: ['Poids', 'Détoxification', 'Immunité', 'Digestion'] },
  { slug: 'sophrologie', group: 'Thérapies', title: 'Sophrologie', lead: 'Une méthode douce mêlant respiration, relaxation et visualisation positive pour apaiser le mental, mieux dormir et renforcer la confiance en soi.', price: 'CHF 130.00 · séance de 60 min', coverage: 'ASCA selon assurance complémentaire', benefits: ['Réduction du stress', 'Amélioration du sommeil', 'Confiance en soi', 'Gestion des émotions'] },
  { slug: 'massage', group: 'Bien-être', title: 'Massage', lead: 'Des massages adaptés pour détendre le corps, réduire les tensions, favoriser la circulation et soutenir la récupération.', price: 'Selon soin', coverage: 'Selon assurance complémentaire', benefits: ['Relaxation', 'Tensions', 'Stress', 'Récupération'] },
  { slug: 'flottaison', group: 'Bien-être', title: 'Flottaison', lead: 'Une immersion en apesanteur dans une eau saturée en sel d’Epsom pour une relaxation profonde du corps et de l’esprit.', price: 'Selon séance', coverage: 'Prestation bien-être', benefits: ['Relaxation', 'Récupération', 'Sommeil', 'Clarté mentale'] },
  { slug: 'cryotherapie', group: 'Bien-être', title: 'Cryothérapie', lead: 'Une exposition courte au froid intense pour aider à réduire l’inflammation, soulager la douleur et stimuler la récupération.', price: 'CHF 65.00', coverage: 'ASCA & RME selon assurance complémentaire', benefits: ['Inflammation', 'Douleurs', 'Sport', 'Métabolisme'] },
  { slug: 'halotherapie', group: 'Bien-être', title: 'Halothérapie', lead: 'Une chambre de sel naturelle pour soutenir la respiration, la peau et offrir un environnement profondément apaisant.', price: 'CHF 65.00 · enfant CHF 30.00', coverage: 'ASCA & RME selon assurance complémentaire', benefits: ['Respiration', 'Allergies', 'Peau', 'Stress'] },
  { slug: 'chambre-de-sel', group: 'Bien-être', title: 'Chambre de sel', lead: 'Une expérience d’halothérapie en chambre de sel, pensée pour soutenir les voies respiratoires, la peau et l’apaisement.', price: 'CHF 65.00 · enfant CHF 30.00', coverage: 'ASCA & RME selon assurance complémentaire', benefits: ['Respiration', 'Peau', 'Relaxation', 'Sel naturel'] },
  { slug: 'prise-en-charge-du-stress', group: 'Programme', title: 'Prise en charge du stress', lead: 'Une évaluation et un accompagnement personnalisés pour comprendre le niveau de stress et mettre en place un plan de soin adapté.', price: 'Selon programme', coverage: 'Selon prestations et assurance', benefits: ['Évaluation', 'Psychologie', 'Psychothérapie', 'Acupuncture'] },
];

const navHtml = () => `
  <nav id="navbar">
    <a href="../index.html" class="logo" aria-label="Regeneratium — accueil">
      <img class="logo-img logo-light" src="../assets/logo-regeneratium.svg" alt="Regeneratium" />
      <img class="logo-img logo-dark" src="../assets/logo-regeneratium-dark.svg" alt="" aria-hidden="true" />
    </a>
    <div class="nav-links" id="navLinks">
      <div class="nav-item">
        <button class="nav-trigger" aria-expanded="false" aria-haspopup="true">Bien-être
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="nav-menu" role="menu" aria-label="Soins bien-être">
          <a href="massage.html" role="menuitem">Massage</a>
          <a href="flottaison.html" role="menuitem">Flottaison</a>
          <a href="cryotherapie.html" role="menuitem">Cryothérapie</a>
          <a href="chambre-de-sel.html" role="menuitem">Chambre de sel</a>
        </div>
      </div>
      <div class="nav-item">
        <button class="nav-trigger" aria-expanded="false" aria-haspopup="true">Médical
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="nav-menu" role="menu" aria-label="Soins médicaux">
          <a href="psychologie.html" role="menuitem">Psys</a>
          <a href="dietetique.html" role="menuitem">Diététique</a>
        </div>
      </div>
      <div class="nav-item">
        <button class="nav-trigger" aria-expanded="false" aria-haspopup="true">Thérapies
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="nav-menu" role="menu" aria-label="Soins thérapeutiques">
          <a href="osteopathie.html" role="menuitem">Ostéopathie</a>
          <a href="acupuncture.html" role="menuitem">Acupuncture</a>
          <a href="therapie-cranio-sacree.html" role="menuitem">Cranio-sacrée</a>
          <a href="hypnose.html" role="menuitem">Hypnothérapie</a>
        </div>
      </div>
      <a href="../index.html#centre">Le centre</a>
      <a href="../index.html#faq">FAQ</a>
      <a href="../rendez-vous.html" class="nav-cta">Prendre rendez-vous</a>
    </div>
    <button class="nav-toggle" id="navToggle" aria-label="Ouvrir le menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </nav>`;

const footerHtml = () => `
  <footer>
    <div class="footer-top">
      <div>
        <a href="../index.html" class="logo footer-logo" aria-label="Regeneratium">
          <img class="logo-img" src="../assets/logo-regeneratium.svg" alt="Regeneratium" />
        </a>
        <p>Centre de thérapie &amp; bien-être à Rolle, entre Genève et Lausanne. Soins
          médicaux, thérapies douces et expériences de récupération.</p>
      </div>
      <div>
        <h3>Nos soins</h3>
        <a href="../index.html#bien-etre">Bien-être &amp; Santé</a>
        <a href="../index.html#medical">Médical</a>
        <a href="../index.html#therapies">Thérapies</a>
      </div>
      <div>
        <h3>Le centre</h3>
        <a href="../index.html#centre">Nos espaces</a>
        <a href="../index.html#avis">Avis</a>
        <a href="../index.html#faq">FAQ</a>
      </div>
      <div>
        <h3>Boutique &amp; contact</h3>
        <a href="https://regeneratium.sumupstore.com" target="_blank" rel="noopener">Bons cadeaux</a>
        <a href="../rendez-vous.html">Prendre rendez-vous</a>
        <a href="tel:+41218260088">+41 21 826 00 88</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Regeneratium — Rte de la Vallée 7, 1180 Rolle, Suisse</span>
      <div>
        <a href="../index.html">Mentions légales</a>
        <a href="../index.html">Confidentialité</a>
      </div>
    </div>
  </footer>`;

const page = (s) => {
  const section = sectionOf[s.group] || 'contact';
  const related = services.filter((x) => x.group === s.group && x.slug !== s.slug).slice(0, 3);
  const icon = icons[s.slug] || icons.massage;

  const benefits = s.benefits.map((b) => `
          <article class="soin-benefit"><span aria-hidden="true">›</span><strong>${esc(b)}</strong></article>`).join('');

  const relatedCards = related.map((r) => `
          <a class="related-card" href="${r.slug}.html">
            <span class="soin-mini-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${icons[r.slug] || icons.massage}</svg></span>
            <strong>${esc(r.title)}</strong>
            <small>${esc(r.lead)}</small>
          </a>`).join('');

  const c = content[s.slug] || {};
  const faqItems = (c.faq && c.faq.length) ? c.faq : [
    { q: 'Déroulement de la séance', a: `Chaque prise en charge est adaptée à votre situation. Le ou la spécialiste vous explique le déroulé et adapte le soin à votre besoin lors du rendez-vous.` },
    { q: 'Indications', a: `Ce soin s’adresse notamment à : ${s.benefits.map((b) => b.toLowerCase()).join(', ')}. En cas de doute, notre équipe vous oriente vers la prise en charge la plus adaptée.` },
    { q: 'Remboursement', a: `${s.coverage}. Nous vous remettons un justificatif conforme pour votre assurance lorsque le soin est éligible.` },
  ];
  const faqHtml = faqItems.map((it, i) => `
          <details class="faq-item"${i === 0 ? ' open' : ''}>
            <summary>${esc(it.q)}</summary>
            <p>${esc(it.a)}</p>
          </details>`).join('');
  const introHtml = c.intro ? `
    <section class="soin-intro">
      <span class="section-tag">Le soin</span>
      <h2>${esc(s.title)}, qu’est-ce que c’est&nbsp;?</h2>
      <p>${esc(c.intro)}</p>
    </section>` : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(s.title)} — Regeneratium · Rolle</title>
  <meta name="description" content="${esc(s.title)} à Regeneratium, Rolle, entre Genève et Lausanne. ${esc(s.lead)}" />
  <meta name="theme-color" content="#0a677b" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Lato:wght@400;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../style.css" />
</head>
<body class="subpage">
${navHtml()}

  <main class="soin-page">
    <section class="soin-hero">
      <div class="soin-hero-text">
        <a class="soin-back" href="../index.html#${section}">‹ ${esc(s.group)}</a>
        <h1>${esc(s.title)}</h1>
        <p class="soin-loc">Entre Genève et Lausanne</p>
        <p class="soin-lead">${esc(s.lead)}</p>
        <div class="soin-actions">
          <a class="btn-primary" href="../rendez-vous.html">Prendre rendez-vous</a>
          <a class="btn-outline" href="../index.html#${section}">Voir tous les soins</a>
        </div>
      </div>
      <aside class="price-card">
        <span class="soin-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${icon}</svg></span>
        <span class="price-kicker">Tarif</span>
        <strong>${esc(s.price)}</strong>
        <p>${esc(s.coverage)}</p>
      </aside>
    </section>
${introHtml}
    <section class="soin-body">
      <div class="soin-block">
        <span class="section-tag">Applications &amp; bienfaits</span>
        <h2>Pourquoi choisir ce soin&nbsp;?</h2>
        <div class="soin-benefits">${benefits}
        </div>
      </div>
      <div class="soin-block">
        <span class="section-tag">Questions fréquentes</span>
        <h2>Bon à savoir</h2>
        <div class="soin-faq">${faqHtml}
        </div>
      </div>
    </section>

    <section class="soin-related">
      <span class="section-tag">Continuer</span>
      <h2>Autres soins ${esc(s.group === 'Programme' ? '' : s.group)}</h2>
      <div class="related-grid">${relatedCards}
      </div>
    </section>
  </main>

${footerHtml()}

  <script src="../script.js"></script>
</body>
</html>
`;
};

await mkdir(outDir, { recursive: true });
let n = 0;
for (const s of services) {
  await writeFile(join(outDir, `${s.slug}.html`), page(s), 'utf8');
  n++;
}
console.log(`${n} pages de soins générées dans soins/`);
