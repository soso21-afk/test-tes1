import React from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import './styles.css';

const servicePages = [
  { path: '/medical/psychotherapie', group: 'Médical', title: 'Psychothérapie', lead: 'Un accompagnement structuré pour comprendre les pensées, les émotions et les comportements, afin d’améliorer la santé mentale et le bien-être.', price: 'Selon Tarmed', coverage: 'ASCA & RME selon assurance complémentaire', benefits: ['Troubles de l’humeur', 'Troubles anxieux', 'Thérapie de couple', 'Croissance personnelle'] },
  { path: '/medical/dietetique', group: 'Médical', title: 'Diététique', lead: 'Un accompagnement nutritionnel personnalisé pour changer durablement les habitudes alimentaires et soutenir la santé physique.', price: 'Selon Tarmed', coverage: 'Remboursé par l’assurance de base LaMal', benefits: ['Gestion du poids', 'Prévention', 'Troubles digestifs', 'Équilibre alimentaire'] },
  { path: '/medical/psychologie', group: 'Médical', title: 'Psychologie', lead: 'Une approche d’écoute et d’évaluation pour mieux comprendre les comportements, les émotions et les processus mentaux.', price: 'CHF 150.00', coverage: 'ASCA & RME selon assurance complémentaire', benefits: ['Évaluation', 'Soutien', 'Développement personnel', 'Gestion du stress'] },
  { path: '/nos-therapies/osteopathie', group: 'Thérapies', title: 'Ostéopathie', lead: 'Une prise en charge manuelle pour améliorer la mobilité, soulager les douleurs et soutenir l’équilibre global du corps.', price: 'Selon prestation', coverage: 'Selon assurance complémentaire', benefits: ['Mobilité', 'Douleurs articulaires', 'Tensions', 'Équilibre corporel'] },
  { path: '/nos-therapies/acupuncture', group: 'Thérapies', title: 'Acupuncture', lead: 'Une pratique issue de la médecine traditionnelle chinoise visant à soutenir l’équilibre énergétique et les fonctions naturelles.', price: 'Selon prestation', coverage: 'Selon assurance complémentaire', benefits: ['Énergie', 'Douleurs', 'Stress', 'Sommeil'] },
  { path: '/nos-therapies/ventouse-cupping', group: 'Thérapies', title: 'Ventouse / cupping', lead: 'Une technique traditionnelle par effet de succion pour favoriser la circulation, libérer les tensions et accompagner la récupération.', price: 'Selon prestation', coverage: 'Selon assurance complémentaire', benefits: ['Circulation', 'Tensions', 'Récupération', 'Drainage'] },
  { path: '/nos-therapies/therapie-cranio-sacree', group: 'Thérapies', title: 'Thérapie Cranio-Sacrée', lead: 'Une approche douce par touchers légers pour libérer les tensions et soutenir le fonctionnement du système nerveux.', price: 'CHF 150.00 · séance de 1h30', coverage: 'ASCA & RME selon assurance complémentaire', benefits: ['Stress', 'Migraines', 'Sommeil', 'Douleurs chroniques'] },
  { path: '/nos-therapies/hypnose', group: 'Thérapies', title: 'Hypnothérapie', lead: 'Un état naturel de conscience modifiée pour mobiliser les ressources intérieures, clarifier les objectifs et accompagner le changement.', price: 'CHF 140.00 · séance de 90 min', coverage: 'ASCA selon assurance complémentaire', benefits: ['Ressources', 'Objectifs', 'Blocages', 'Changement'] },
  { path: '/nos-therapies/naturopathie-micro-nutrition', group: 'Thérapies', title: 'Naturopathie & Micro Nutrition', lead: 'Une approche holistique qui combine méthodes naturelles, nutrition et micronutriments pour optimiser la santé.', price: 'CHF 120.00 · première séance CHF 160.00', coverage: 'Selon assurance complémentaire', benefits: ['Poids', 'Détoxification', 'Immunité', 'Digestion'] },
  { path: '/bien-etre-sante/massage', group: 'Bien-être', title: 'Massage', lead: 'Des massages adaptés pour détendre le corps, réduire les tensions, favoriser la circulation et soutenir la récupération.', price: 'Selon soin', coverage: 'Selon assurance complémentaire', benefits: ['Relaxation', 'Tensions', 'Stress', 'Récupération'] },
  { path: '/bien-etre-sante/flottaison', group: 'Bien-être', title: 'Flottaison', lead: 'Une immersion en apesanteur dans une eau saturée en sel d’Epsom pour une relaxation profonde du corps et de l’esprit.', price: 'Selon séance', coverage: 'Prestation bien-être', benefits: ['Relaxation', 'Récupération', 'Sommeil', 'Clarté mentale'] },
  { path: '/bien-etre-sante/cryotherapie', group: 'Bien-être', title: 'Cryothérapie', lead: 'Une exposition courte au froid intense pour aider à réduire l’inflammation, soulager la douleur et stimuler la récupération.', price: 'CHF 65.00', coverage: 'ASCA & RME selon assurance complémentaire', benefits: ['Inflammation', 'Douleurs', 'Sport', 'Métabolisme'] },
  { path: '/bien-etre-sante/halotherapie', group: 'Bien-être', title: 'Halothérapie', lead: 'Une chambre de sel naturelle pour soutenir la respiration, la peau et offrir un environnement profondément apaisant.', price: 'CHF 65.00 · enfant CHF 30.00', coverage: 'ASCA & RME selon assurance complémentaire', benefits: ['Respiration', 'Allergies', 'Peau', 'Stress'] },
  { path: '/bien-etre-sante/chambre-de-sel', group: 'Bien-être', title: 'Chambre de sel', lead: 'Une expérience d’halothérapie en chambre de sel, pensée pour soutenir les voies respiratoires, la peau et l’apaisement.', price: 'CHF 65.00 · enfant CHF 30.00', coverage: 'ASCA & RME selon assurance complémentaire', benefits: ['Respiration', 'Peau', 'Relaxation', 'Sel naturel'] },
  { path: '/prise-en-charge-du-stress', group: 'Programme', title: 'Prise en charge du stress', lead: 'Une évaluation et un accompagnement personnalisés pour comprendre le niveau de stress et mettre en place un plan de soin adapté.', price: 'Selon programme', coverage: 'Selon prestations et assurance', benefits: ['Évaluation', 'Psychologie', 'Psychothérapie', 'Acupuncture'] },
];

const utilityPages = [
  { path: '/nos-soins-santes', title: 'Nos soins Santé & Bien-être', group: 'Services', lead: 'Toutes les prestations Regeneratium réunies par familles : médical, thérapies, bien-être et programmes spécifiques.' },
  { path: '/nos-services', title: 'Nos Services', group: 'Services', lead: 'Retrouvez l’ensemble des soins médicaux, thérapeutiques, bien-être et programmes proposés par Regeneratium.' },
  { path: '/a-propos', title: 'À propos de Regeneratium', group: 'Centre', lead: 'Un centre situé à Rolle, entre Genève et Lausanne, dédié à l’auto-régénération, à l’équilibre et à la longévité.' },
  { path: '/contact', title: 'Contactez-nous', group: 'Contact', lead: 'Toute l’équipe Regeneratium se tient à votre disposition pour répondre à vos questions ou vos demandes.' },
  { path: '/prendre-rendez-vous', title: 'Prendre rendez-vous', group: 'Réservation', lead: 'Choisissez un soin, expliquez votre besoin et laissez l’équipe vous orienter vers le bon accompagnement.' },
];

const allPages = [...servicePages, ...utilityPages];
const groupNames = ['Médical', 'Thérapies', 'Bien-être', 'Programme'];

const homeSlides = [
  '/assets/home-1.jpg',
  '/assets/home-2.jpg',
  '/assets/home-3.jpg',
  '/assets/home-4.jpg',
  '/assets/home-5.jpg',
];

function ContactForm() {
  return (
    <form className="story-form" onSubmit={(event) => event.preventDefault()}>
      <label>Nom<input type="text" placeholder="Votre nom" /></label>
      <label>Soin souhaité<select defaultValue=""><option value="" disabled>Choisir</option>{servicePages.map((page) => <option key={page.path}>{page.title}</option>)}</select></label>
      <a className="chapter-link full" href="mailto:info@regeneratium.ch">Contacter Regeneratium</a>
    </form>
  );
}

function HomePage() {
  return (
    <div className="official-home">
      <div className="home-slideshow" aria-hidden="true">
        {homeSlides.map((slide, index) => (
          <span key={slide} style={{ backgroundImage: `url(${slide})`, animationDelay: `${index * 5}s` }} />
        ))}
      </div>
      <header className="home-nav">
        <a href="/" className="home-logo" aria-label="Regeneratium accueil">
          <img src="/assets/logo-regeneratium.svg" alt="Regeneratium" />
        </a>
        <nav aria-label="Navigation principale">
          <a href="/nos-soins-santes">Soins Santé & Bien-être</a>
          <a href="/nos-services">Services</a>
          <a href="/a-propos">À propos</a>
          <a href="/contact">Contact</a>
        </nav>
        <a className="home-booking" href="/prendre-rendez-vous">Réserver</a>
      </header>
      <main className="home-hero">
        <motion.section className="home-hero-content" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="home-eyebrow">Centre de santé intégrative à Rolle</span>
          <h1>Thérapie & Bien-être</h1>
          <p>Un lieu dédié à l’équilibre, à la récupération et à l’auto-régénération, entre soins médicaux, thérapies et expériences bien-être.</p>
          <div className="home-actions">
            <a className="chapter-link" href="/prendre-rendez-vous">Prendre rendez-vous</a>
            <a className="home-outline" href="/nos-soins-santes">Découvrir les soins</a>
          </div>
        </motion.section>
        <aside className="home-service-panel">
          <span>Explorer</span>
          <a href="/medical/psychotherapie">Psychothérapie</a>
          <a href="/nos-therapies/osteopathie">Ostéopathie</a>
          <a href="/bien-etre-sante/flottaison">Flottaison</a>
          <a href="/bien-etre-sante/cryotherapie">Cryothérapie</a>
        </aside>
      </main>
      <div className="home-photo-strip" aria-hidden="true">
        {[...homeSlides, ...homeSlides].map((slide, index) => <img src={slide} alt="" key={`${slide}-${index}`} />)}
      </div>
    </div>
  );
}

function PageNav() {
  return (
    <header className="page-nav">
      <a href="/" className="brand logo-brand"><img src="/assets/logo-regeneratium.svg" alt="Regeneratium" /></a>
      <nav><a href="/nos-soins-santes">Tous les soins</a><a href="/a-propos">À propos</a><a href="/contact">Contact</a><a href="/prendre-rendez-vous">Réserver</a></nav>
    </header>
  );
}

function PageShell({ children }) {
  return (
    <>
      <div className="image-wash page-wash" />
      <PageNav />
      {children}
      <footer className="page-footer"><div><strong>Regeneratium</strong><span>Rte de la Vallée 7, 1180 Rolle, Suisse</span></div><div><a href="tel:+41218260088">+41 21 826 00 88</a><a href="mailto:info@regeneratium.ch">info@regeneratium.ch</a></div></footer>
    </>
  );
}

function ServicePage({ page }) {
  const related = servicePages.filter((item) => item.path !== page.path && item.group === page.group).slice(0, 3);

  return (
    <main className="page-main">
      <section className="page-hero">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
          <span className="eyebrow">{page.group}</span>
          <h1>{page.title}</h1>
          <p>{page.lead}</p>
          <div className="page-actions"><a href="/prendre-rendez-vous" className="chapter-link">Prendre rendez-vous</a><a href="/nos-soins-santes" className="ghost-link">Voir tous les soins</a></div>
        </motion.div>
        <motion.aside className="price-card" initial={{ opacity: 0, rotateY: -12 }} animate={{ opacity: 1, rotateY: 0 }} transition={{ delay: 0.12, duration: 0.7 }}>
          <span>Tarif</span><strong>{page.price}</strong><small>{page.coverage}</small>
        </motion.aside>
      </section>
      <section className="content-grid">
        <div className="content-block"><span className="section-kicker">Applications</span><h2>Pourquoi choisir ce soin ?</h2><div className="benefit-grid">{page.benefits.map((item) => <article key={item}><span>✦</span><strong>{item}</strong></article>)}</div></div>
        <div className="content-block"><span className="section-kicker">Questions</span><h2>À savoir avant la séance</h2>{['Déroulement', 'Indications', 'Remboursement'].map((item) => <details key={item}><summary>{item}</summary><p>Chaque prise en charge est adaptée à votre situation. L’équipe vous précisera les indications, le déroulé et les éventuelles contre-indications lors de la réservation.</p></details>)}</div>
      </section>
      <section className="related"><span className="section-kicker">Autres soins</span><h2>Continuer l’exploration</h2><div className="directory-grid">{related.map((item) => <a href={item.path} key={item.path}><span>{item.group}</span><strong>{item.title}</strong><small>{item.lead}</small></a>)}</div></section>
    </main>
  );
}

function DirectoryPage({ page }) {
  const isContact = page.path === '/contact' || page.path === '/prendre-rendez-vous';

  return (
    <main className="page-main">
      <section className="page-hero directory">
        <div><span className="eyebrow">{page.group}</span><h1>{page.title}</h1><p>{page.lead}</p>{(page.path === '/nos-services' || page.path === '/nos-soins-santes') && <div className="page-actions"><a href="/" className="chapter-link">Retour à l’accueil</a><a href="/prendre-rendez-vous" className="ghost-link">Aller à la réservation</a></div>}</div>
        {isContact && <ContactForm />}
      </section>
      {page.path === '/nos-soins-santes' || page.path === '/nos-services' ? <ServicesDirectory /> : <InfoPanels page={page} />}
    </main>
  );
}

function ServicesDirectory() {
  return (
    <section className="directory-groups">
      {groupNames.map((group) => {
        const items = servicePages.filter((item) => item.group === group);
        return <div className="directory-group" key={group}><h2>{group}</h2><div className="directory-grid">{items.map((item) => <a href={item.path} key={item.path}><span>{item.group}</span><strong>{item.title}</strong><small>{item.lead}</small></a>)}</div></div>;
      })}
    </section>
  );
}

function InfoPanels({ page }) {
  const panels = page.path === '/a-propos'
    ? ['Stimuler le capital d’auto-régénération.', 'Créer un cadre calme entre Genève et Lausanne.', 'Réunir soins médicaux, thérapies douces et bien-être.']
    : ['Téléphone : +41 21 826 00 88', 'Email : info@regeneratium.ch', 'Adresse : Rte de la Vallée 7, 1180 Rolle'];

  return <section className="content-grid solo">{panels.map((panel) => <article className="content-block" key={panel}><span className="section-kicker">Regeneratium</span><h2>{panel}</h2><p>Une présentation claire pour retrouver rapidement les informations essentielles du centre.</p></article>)}</section>;
}

function NotFoundPage() {
  return <main className="page-main"><section className="page-hero"><div><span className="eyebrow">404</span><h1>Page introuvable</h1><p>La page demandée n’existe pas encore dans cette expérience.</p><a href="/" className="chapter-link">Retour à l’accueil</a></div></section></main>;
}

function App() {
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  const page = allPages.find((item) => item.path === pathname);

  if (pathname === '/') return <div className="app-shell"><HomePage /></div>;

  return (
    <div className="app-shell page-shell">
      <PageShell>
        {page ? (servicePages.some((item) => item.path === page.path) ? <ServicePage page={page} /> : <DirectoryPage page={page} />) : <NotFoundPage />}
      </PageShell>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
