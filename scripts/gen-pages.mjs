// Générateur des pages institutionnelles (racine) : À propos, Contact,
// Mentions légales, aperçus de soins. Node, zéro dépendance.
// Usage : node scripts/gen-pages.mjs
import { writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const esc = (s) => String(s)
  .replace(/&(?!#?\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const nav = `
  <nav id="navbar">
    <a href="index.html" class="logo" aria-label="Regeneratium — accueil">
      <img class="logo-img logo-light" src="assets/logo-regeneratium.svg" alt="Regeneratium" />
      <img class="logo-img logo-dark" src="assets/logo-regeneratium-dark.svg" alt="" aria-hidden="true" />
    </a>
    <div class="nav-links" id="navLinks">
      <div class="nav-item">
        <button class="nav-trigger" aria-expanded="false" aria-haspopup="true">Bien-être
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="nav-menu" role="menu" aria-label="Soins bien-être">
          <a href="soins/massage.html" role="menuitem">Massage</a>
          <a href="soins/flottaison.html" role="menuitem">Flottaison</a>
          <a href="soins/cryotherapie.html" role="menuitem">Cryothérapie</a>
          <a href="soins/chambre-de-sel.html" role="menuitem">Chambre de sel</a>
        </div>
      </div>
      <div class="nav-item">
        <button class="nav-trigger" aria-expanded="false" aria-haspopup="true">Médical
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="nav-menu" role="menu" aria-label="Soins médicaux">
          <a href="soins/psychologie.html" role="menuitem">Psys</a>
          <a href="soins/dietetique.html" role="menuitem">Diététique</a>
        </div>
      </div>
      <div class="nav-item">
        <button class="nav-trigger" aria-expanded="false" aria-haspopup="true">Thérapies
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="nav-menu" role="menu" aria-label="Soins thérapeutiques">
          <a href="soins/osteopathie.html" role="menuitem">Ostéopathie</a>
          <a href="soins/acupuncture.html" role="menuitem">Acupuncture</a>
          <a href="soins/therapie-cranio-sacree.html" role="menuitem">Cranio-sacrée</a>
          <a href="soins/hypnose.html" role="menuitem">Hypnothérapie</a>
        </div>
      </div>
      <a href="a-propos.html">À propos</a>
      <a href="blog.html">Blog</a>
      <a href="contact.html">Contact</a>
      <a href="rendez-vous.html" class="nav-cta">Prendre rendez-vous</a>
    </div>
    <button class="nav-toggle" id="navToggle" aria-label="Ouvrir le menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </nav>`;

const footer = `
  <footer>
    <div class="footer-top">
      <div>
        <a href="index.html" class="logo footer-logo" aria-label="Regeneratium">
          <img class="logo-img" src="assets/logo-regeneratium.svg" alt="Regeneratium" />
        </a>
        <p>Centre de thérapie &amp; bien-être à Rolle, entre Genève et Lausanne. Soins
          médicaux, thérapies douces et expériences de récupération.</p>
      </div>
      <div>
        <h3>Nos soins</h3>
        <a href="nos-soins-bien-etre.html">Bien-être &amp; Santé</a>
        <a href="nos-soins-santes.html#medical">Médical</a>
        <a href="nos-soins-santes.html#therapies">Thérapies</a>
      </div>
      <div>
        <h3>Le centre</h3>
        <a href="a-propos.html">À propos</a>
        <a href="contact.html">Contact</a>
        <a href="index.html#faq">FAQ</a>
      </div>
      <div>
        <h3>Boutique &amp; contact</h3>
        <a href="bons-cadeaux.html">Bons cadeaux</a>
        <a href="rendez-vous.html">Prendre rendez-vous</a>
        <a href="tel:+41218260088">+41 21 826 00 88</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Regeneratium — Rte de la Vallée 7, 1180 Rolle, Suisse</span>
      <div>
        <a href="mentions-legales.html">Mentions légales</a>
        <a href="mentions-legales.html">Confidentialité</a>
      </div>
    </div>
  </footer>`;

const doc = ({ title, desc, body, subpage = true, extraHead = '' }) => `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <meta name="theme-color" content="#0a677b" />
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&family=Lato:wght@400;700&family=Lora:ital,wght@1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css" />${extraHead}
</head>
<body${subpage ? ' class="subpage"' : ''}>
${nav}

  <main class="soin-page">
${body}
  </main>

${footer}

  <script src="script.js"></script>
</body>
</html>
`;

const team = [
  ['Nathalie', 'Thérapeute massage (ASCA)'],
  ['Michael', 'Thérapeute massage (ASCA)'],
  ['Sarah', 'Thérapeute massage (ASCA)'],
  ['Karen', 'Thérapeute massage (ASCA, RME)'],
  ['Osvaldo', 'Cranio-sacrée & ostéopathie (ASCA)'],
  ['Sophie', 'Psychologue (LaMal)'],
  ['Benjamin', 'Psychologue (LaMal)'],
  ['Andy', 'Psychologue (LaMal)'],
];

const aPropos = doc({
  title: 'À propos — Regeneratium · Rolle',
  desc: 'Regeneratium, centre de thérapie et bien-être à Rolle entre Genève et Lausanne. Notre philosophie, notre approche de l’auto-régénération et notre équipe.',
  body: `    <section class="page-head">
      <span class="section-tag">À propos</span>
      <h1>Regeneratium, spécialiste du bien-être</h1>
      <p class="page-loc">À Rolle, entre Genève et Lausanne</p>
      <p>Dans un environnement élégant et intimiste, à deux pas du Léman, Regeneratium
        accueille toutes les personnes qui souhaitent prendre soin de leur corps et de
        leur esprit.</p>
    </section>

    <section class="about-wrap reveal">
      <h2>Notre philosophie</h2>
      <p>Créé par Loïc et Marco, passionnés par les thérapies naturelles et la littérature
        scientifique, Regeneratium a été pensé comme un « lab » réunissant des soins
        innovants (cryothérapie, halothérapie, flottaison) et des thérapies telles que
        l’ostéopathie, la naturopathie &amp; micro-nutrition, l’acupuncture, la thérapie
        cranio-sacrée ou le cupping. Nous proposons également des services médicaux en
        psychologie et psychothérapie, des soins de bien-être comme les massages, ainsi
        que des programmes de prise en charge du stress.</p>
      <blockquote class="about-quote">« Chez Regeneratium, nous vous proposons un
        cheminement, une expérience qui vous guide sur le chemin de l’apaisement et du
        bien-être. Notre mission est de permettre à chacun d’exploiter son capital
        d’auto-régénération naturel et d’améliorer sa longévité. »</blockquote>
      <p>L’auto-régénération cellulaire, de l’esprit et l’auto-guérison sont à la portée de
        tous, mais restent trop souvent inexploitées : mauvaise alimentation, manque de
        temps pour soi, trop de stress… Regeneratium vous guide sur le chemin de la
        (re)construction, avec des solutions qui améliorent votre bien-être à long terme.</p>
    </section>

    <section class="about-wrap reveal">
      <h2>Notre équipe</h2>
      <div class="team-grid">
${team.map(([n, r]) => `        <div class="team-card"><div class="team-avatar" aria-hidden="true">${n[0]}</div><strong>${n}</strong><small>${r}</small></div>`).join('\n')}
      </div>
    </section>

    <section class="booking" style="padding-top:10px">
      <div class="cta-banner reveal">
        <div>
          <h2>Envie de nous rencontrer&nbsp;?</h2>
          <p>Prenez rendez-vous ou passez nous voir à Rolle.</p>
        </div>
        <a class="btn-primary btn-light" href="rendez-vous.html">Prendre rendez-vous</a>
      </div>
    </section>`,
});

const contact = doc({
  title: 'Contact — Regeneratium · Rolle',
  desc: 'Contactez Regeneratium à Rolle : téléphone +41 21 826 00 88, e-mail info@regeneratium.ch, Rte de la Vallée 7, 1180 Rolle, Suisse.',
  body: `    <section class="page-head">
      <span class="section-tag">Contact</span>
      <h1>Contactez-nous</h1>
      <p class="page-loc">À Rolle, entre Genève et Lausanne</p>
      <p>Toute l’équipe Regeneratium se tient à votre disposition pour répondre à vos
        questions ou à vos demandes.</p>
    </section>

    <section class="contact" style="border-radius:0">
      <div class="contact-grid">
        <div class="contact-info reveal">
          <a class="contact-item" href="tel:+41218260088"><span>Téléphone</span><strong>+41 21 826 00 88</strong></a>
          <a class="contact-item" href="mailto:info@regeneratium.ch"><span>E-mail</span><strong>info@regeneratium.ch</strong></a>
          <a class="contact-item" href="https://maps.google.com/?q=Rte+de+la+Vall%C3%A9e+7,+1180+Rolle" target="_blank" rel="noopener"><span>Adresse</span><strong>Rte de la Vallée 7, 1180 Rolle, Suisse</strong></a>
          <a class="contact-item" href="rendez-vous.html"><span>Rendez-vous</span><strong>Réservez en ligne</strong></a>
        </div>
        <form class="contact-form reveal">
          <div class="form-row">
            <label>Nom<input type="text" name="nom" placeholder="Votre nom" required></label>
            <label>E-mail<input type="email" name="email" placeholder="vous@email.com" required></label>
          </div>
          <label>Téléphone<input type="tel" name="tel" placeholder="+41 …"></label>
          <label>Message<textarea name="message" placeholder="Votre message…"></textarea></label>
          <button type="submit" class="btn-primary">Envoyer</button>
        </form>
      </div>
    </section>`,
});

const legal = doc({
  title: 'Mentions légales — Regeneratium',
  desc: 'Mentions légales et politique de confidentialité du site Regeneratium, Rolle, Suisse.',
  body: `    <section class="page-head">
      <span class="section-tag">Informations légales</span>
      <h1>Mentions légales</h1>
    </section>

    <section class="legal-page reveal">
      <h2>Éditeur du site</h2>
      <p>Regeneratium — Centre de thérapie &amp; bien-être<br />
        Rte de la Vallée 7, 1180 Rolle, Suisse<br />
        Téléphone : <a href="tel:+41218260088">+41 21 826 00 88</a><br />
        E-mail : <a href="mailto:info@regeneratium.ch">info@regeneratium.ch</a></p>

      <h2>Propriété intellectuelle</h2>
      <p>L’ensemble des contenus de ce site (textes, images, logo, éléments graphiques)
        est la propriété de Regeneratium ou de ses partenaires. Toute reproduction ou
        utilisation, totale ou partielle, sans autorisation préalable est interdite.</p>

      <h2>Responsabilité</h2>
      <p>Les informations présentes sur ce site sont fournies à titre indicatif et ne
        remplacent en aucun cas un avis médical. Regeneratium s’efforce d’en assurer
        l’exactitude mais ne saurait être tenu responsable d’éventuelles erreurs ou
        omissions.</p>

      <h2>Réservation en ligne</h2>
      <p>La prise de rendez-vous en ligne est assurée par notre partenaire OneDoc SA. Les
        données saisies dans l’agenda de réservation sont traitées conformément à la
        politique de confidentialité de OneDoc.</p>

      <h2>Protection des données</h2>
      <p>Les données personnelles communiquées via nos formulaires (nom, e-mail,
        téléphone, message) sont utilisées uniquement pour répondre à vos demandes et
        gérer votre prise en charge. Elles ne sont ni vendues ni cédées à des tiers.
        Conformément à la législation suisse sur la protection des données, vous disposez
        d’un droit d’accès, de rectification et de suppression en écrivant à
        <a href="mailto:info@regeneratium.ch">info@regeneratium.ch</a>.</p>

      <h2>Cookies</h2>
      <p>Ce site peut utiliser des cookies à des fins de mesure d’audience et de bon
        fonctionnement. Vous pouvez configurer votre navigateur pour les refuser.</p>
    </section>`,
});

// ── Pages aperçu « Nos soins » ──
const soins = [
  { slug: 'massage', title: 'Massage', group: 'Bien-être', blurb: 'Détente, circulation et récupération.' },
  { slug: 'flottaison', title: 'Flottaison', group: 'Bien-être', blurb: 'Relaxation profonde en apesanteur.' },
  { slug: 'cryotherapie', title: 'Cryothérapie', group: 'Bien-être', blurb: 'Froid intense, récupération, anti-inflammation.' },
  { slug: 'halotherapie', title: 'Halothérapie · Chambre de sel', group: 'Bien-être', blurb: 'Air salin pour la respiration et la peau.' },
  { slug: 'psychologie', title: 'Psychologie', group: 'Médical', blurb: 'Écoute et évaluation psychologique.' },
  { slug: 'psychotherapie', title: 'Psychothérapie', group: 'Médical', blurb: 'Accompagnement structuré du bien-être mental.' },
  { slug: 'dietetique', title: 'Diététique', group: 'Médical', blurb: 'Nutrition personnalisée (remboursée LaMal).' },
  { slug: 'osteopathie', title: 'Ostéopathie', group: 'Thérapies', blurb: 'Mobilité et soulagement des tensions.' },
  { slug: 'acupuncture', title: 'Acupuncture', group: 'Thérapies', blurb: 'Équilibre énergétique, douleurs, sommeil.' },
  { slug: 'ventouse-cupping', title: 'Ventouse / Cupping', group: 'Thérapies', blurb: 'Circulation, tensions, récupération.' },
  { slug: 'therapie-cranio-sacree', title: 'Cranio-sacrée', group: 'Thérapies', blurb: 'Touchers doux, système nerveux.' },
  { slug: 'naturopathie-micro-nutrition', title: 'Naturopathie & micro-nutrition', group: 'Thérapies', blurb: 'Approche holistique naturelle.' },
  { slug: 'hypnose', title: 'Hypnothérapie', group: 'Thérapies', blurb: 'Mobiliser ses ressources intérieures.' },
  { slug: 'sophrologie', title: 'Sophrologie', group: 'Thérapies', blurb: 'Respiration, relaxation, confiance en soi.' },
];
const card = (s) => `<a class="related-card" href="soins/${s.slug}.html"><span class="related-cat">${s.group}</span><strong>${s.title}</strong><small>${s.blurb}</small></a>`;
const grid = (list) => `<div class="related-grid">${list.map(card).join('')}</div>`;

const bienEtre = doc({
  title: 'Nos soins Bien-être — Regeneratium · Rolle',
  desc: 'Tous les soins bien-être de Regeneratium à Rolle : massage, flottaison, cryothérapie, halothérapie.',
  body: `    <section class="page-head">
      <span class="section-tag">Nos soins</span>
      <h1>Bien-être &amp; Santé</h1>
      <p class="page-loc">À Rolle, entre Genève et Lausanne</p>
      <p>Des expériences pensées pour relâcher le corps, apaiser le mental et soutenir la récupération.</p>
    </section>
    <section class="soin-related">${grid(soins.filter((s) => s.group === 'Bien-être'))}</section>`,
});

const santes = doc({
  title: 'Nos soins Santé — Regeneratium · Rolle',
  desc: 'Tous les soins médicaux et thérapeutiques de Regeneratium à Rolle, entre Genève et Lausanne.',
  body: `    <section class="page-head">
      <span class="section-tag">Nos soins</span>
      <h1>Nos soins Santé</h1>
      <p class="page-loc">À Rolle, entre Genève et Lausanne</p>
      <p>Soins médicaux assurés par des professionnels de santé et thérapies douces complémentaires.</p>
    </section>
    <section id="medical" class="soin-related">
      <span class="section-tag">Médical</span>
      <h2>Soins médicaux</h2>
      ${grid(soins.filter((s) => s.group === 'Médical'))}
    </section>
    <section id="therapies" class="soin-related" style="padding-top:0">
      <span class="section-tag">Thérapies</span>
      <h2>Soins thérapeutiques</h2>
      ${grid(soins.filter((s) => s.group === 'Thérapies'))}
    </section>`,
});

// ── Page Bons cadeaux / Boutique (catalogue réel de la boutique SumUp) ──
const produits = JSON.parse(await readFile(join(root, 'scripts', 'boutique-produits.json'), 'utf8'))
  .map((p) => ({ ...p, name: p.name.replace(/&#x27;/g, '’') }));

const catOf = (n) => {
  const s = n.toLowerCase();
  if (/^bon/.test(s)) return 'Bons cadeaux';
  if (/pack|offre|longevity|privatisation|abonnement/.test(s)) return 'Packs & offres';
  if (/flottaison|floating/.test(s)) return 'Flottaison';
  if (/massage/.test(s)) return 'Massages';
  if (/cryo|salt/.test(s)) return 'Cryo & Chambre de sel';
  return 'Thérapies';
};
const catOrder = ['Bons cadeaux', 'Flottaison', 'Massages', 'Cryo & Chambre de sel', 'Thérapies', 'Packs & offres'];
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
            <div class="shop-foot"><span class="shop-price">${esc(p.price)}</span><span class="shop-buy">Offrir ↗</span></div>
          </div>
        </a>`;
}).join('\n');

const filters = ['Tous', ...catOrder].map((c, i) => `        <button type="button" class="shop-filter${i === 0 ? ' active' : ''}" data-filter="${c}">${c}</button>`).join('\n');

const bonsCadeaux = doc({
  extraHead: '\n  <link rel="preconnect" href="https://images.sumup.com" />',
  title: 'Bons cadeaux & boutique — Regeneratium · Rolle',
  desc: 'La boutique Regeneratium : bons cadeaux, flottaison, massages, cryothérapie, chambre de sel, packs et offres — commande en ligne, réception par e-mail.',
  body: `    <section class="page-head">
      <span class="section-tag">Bons cadeaux &amp; boutique</span>
      <h1>Offrez un moment de régénération</h1>
      <p class="page-loc">À Rolle, entre Genève et Lausanne</p>
      <p>Bons cadeaux, séances de flottaison, massages, cryothérapie, packs… Choisissez
        ci-dessous : le paiement se fait en ligne et le bon arrive par e-mail, prêt à offrir.</p>
    </section>

    <section class="gift-steps reveal" aria-label="Comment ça marche">
      <div class="gift-step"><span>1</span><strong>Choisissez</strong><p>Un soin précis, un pack ou un bon d’un montant libre, ci-dessous.</p></div>
      <div class="gift-step"><span>2</span><strong>Recevez</strong><p>Le bon cadeau arrive par e-mail, prêt à imprimer ou à transférer.</p></div>
      <div class="gift-step"><span>3</span><strong>Offrez</strong><p>La personne réserve son moment au +41 21 826 00 88 ou en ligne.</p></div>
    </section>

    <section id="boutique" class="soin-related" style="padding-top:16px">
      <span class="section-tag">Boutique</span>
      <h2>Nos bons cadeaux &amp; prestations</h2>
      <div class="shop-filters" role="group" aria-label="Filtrer par catégorie">
${filters}
      </div>
      <div class="shop-grid">
${shopCards}
      </div>
    </section>

    <section class="booking" style="padding-top:0">
      <div class="cta-banner reveal">
        <div>
          <h2>Une question sur les bons cadeaux&nbsp;?</h2>
          <p>Notre équipe vous conseille avec plaisir sur le soin idéal à offrir.</p>
        </div>
        <a class="btn-primary btn-light" href="contact.html">Nous contacter</a>
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
            cards.forEach(function (c) { c.hidden = f !== 'Tous' && c.dataset.cat !== f; });
          });
        });
      })();
    </script>`,
});

await writeFile(join(root, 'bons-cadeaux.html'), bonsCadeaux, 'utf8');
await writeFile(join(root, 'a-propos.html'), aPropos, 'utf8');
await writeFile(join(root, 'contact.html'), contact, 'utf8');
await writeFile(join(root, 'mentions-legales.html'), legal, 'utf8');
await writeFile(join(root, 'nos-soins-bien-etre.html'), bienEtre, 'utf8');
await writeFile(join(root, 'nos-soins-santes.html'), santes, 'utf8');
console.log('Pages générées : a-propos, contact, mentions-legales, nos-soins-bien-etre, nos-soins-santes');
