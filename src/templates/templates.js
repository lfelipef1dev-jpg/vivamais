/* VivaMais — templates.js
   Funções de template reutilizáveis para o gerador estático.
   SVG inline (sem emojis). Light theme. Premium. */

const fs = require('fs');
const path = require('path');

function loadData(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', name + '.json'), 'utf8'));
}

const clinic = loadData('clinic');
const specialties = loadData('specialties');

/* ---------- Icons (SVG inline) ---------- */
const icons = {
  heart: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6.5-4.35-9-8.5C1 9 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 5 23 9 21 12.5c-2.5 4.15-9 8.5-9 8.5z"/></svg>',
  calendar: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  phone: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  pin: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  mail: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  search: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  check: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  arrowRight: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
  user: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  whatsapp: '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>',
  chevronDown: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  shield: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
};

/* ---------- Head ---------- */
const BASE_URL = 'https://vivamais.expostacker.com.br';
const DEFAULT_OG_IMAGE = BASE_URL + '/og-image.jpg';

function renderHead(pageTitle, metaDescription, options) {
  options = options || {};
  const title = pageTitle ? pageTitle + ' · ' + clinic.name : clinic.name + ' — ' + clinic.tagline;
  const desc = metaDescription || clinic.tagline;
  const css = (options.extraCss || []).concat(['styles/base.css', 'styles/components.css', 'styles/pages.css']);
  const cssTags = css.map(function (c) {
    return '<link rel="stylesheet" href="' + (options.root || '') + c + '">';
  }).join('\n  ');
  const extraHead = (options.extraHead || []).join('\n  ');
  /* Canonical URL */
  const canonicalSlug = options.canonical || '';
  const canonicalUrl = canonicalSlug === 'index' || canonicalSlug === ''
    ? BASE_URL + '/'
    : BASE_URL + '/' + canonicalSlug + '.html';

  /* Robots */
  const robotsContent = options.noindex ? 'noindex, nofollow' : 'index, follow';

  /* OG image */
  const ogImage = options.ogImage ? (options.ogImage.indexOf('http') === 0 ? options.ogImage : BASE_URL + '/' + options.ogImage) : DEFAULT_OG_IMAGE;

  /* OG type */
  const ogType = options.ogType || 'website';

  /* JSON-LD */
  const jsonLdBlocks = (function () {
    const blocks = options.jsonLd ? (Array.isArray(options.jsonLd) ? options.jsonLd : [options.jsonLd]) : [];
    return blocks.map(function (b) {
      return '  <script type="application/ld+json">' + (typeof b === 'string' ? b : JSON.stringify(b)) + '</script>';
    }).join('\n');
  })();

  var headLines = [
    '<!DOCTYPE html>',
    '<html lang="pt-BR">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '  <title>' + escapeHtml(title) + '</title>',
    '  <meta name="description" content="' + escapeAttr(desc) + '">',
    '  <meta name="robots" content="' + robotsContent + '">',
    '  <link rel="canonical" href="' + escapeAttr(canonicalUrl) + '">',
    '  <meta property="og:title" content="' + escapeAttr(title) + '">',
    '  <meta property="og:description" content="' + escapeAttr(desc) + '">',
    '  <meta property="og:type" content="' + escapeAttr(ogType) + '">',
    '  <meta property="og:url" content="' + escapeAttr(canonicalUrl) + '">',
    '  <meta property="og:image" content="' + escapeAttr(ogImage) + '">',
    '  <meta property="og:site_name" content="' + escapeAttr(clinic.name) + '">',
    '  <meta property="og:locale" content="pt_BR">',
    '  <meta name="twitter:card" content="summary_large_image">',
    '  <meta name="twitter:title" content="' + escapeAttr(title) + '">',
    '  <meta name="twitter:description" content="' + escapeAttr(desc) + '">',
    '  <meta name="twitter:image" content="' + escapeAttr(ogImage) + '">',
    '  <meta name="theme-color" content="#0D9488">',
    '  <link rel="icon" type="image/png" href="/favicon.png">',
    '  <link rel="preload" as="font" type="font/woff2" href="' + (options.root || '') + 'fonts/inter-400-latin.woff2" crossorigin>',
    '  ' + cssTags,
    '  ' + extraHead
  ];
  if (jsonLdBlocks) {
    headLines.push(jsonLdBlocks);
  }
  headLines.push('</head>');
  return headLines.join('\n');
}

/* ---------- Navbar (premium) ---------- */
function renderNavbar(root, active) {
  root = root || '';
  const links = [
    { href: root + 'index.html', label: 'Início', key: 'home' },
    { href: root + 'especialidades.html', label: 'Especialidades', key: 'specialties' },
    { href: root + 'profissionais.html', label: 'Profissionais', key: 'doctors' },
    { href: root + 'convenios.html', label: 'Convênios', key: 'insurance' },
    { href: root + 'sobre.html', label: 'Sobre', key: 'about' },
    { href: root + 'blog.html', label: 'Blog', key: 'blog' }
  ];
  const linkHtml = links.map(function (l) {
    const isCurrent = l.key === active;
    const cls = 'nav-link' + (isCurrent ? ' nav-link-current' : '');
    const attr = isCurrent ? ' aria-current="page"' : '';
    return '<a class="' + cls + '" href="' + l.href + '"' + attr + '>' + escapeHtml(l.label) + '</a>';
  }).join('\n        ');

  return [
    '<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>',
    '<header class="navbar" id="navbar" role="banner">',
    '  <div class="container navbar-inner">',
    '    <a class="nav-brand" href="' + root + 'index.html" aria-label="' + escapeAttr(clinic.name) + ' — página inicial">',
    '      <img src="' + root + 'brand/vivamais-logo.png" alt="VivaMais" width="160" height="107" class="nav-brand-logo" />',
    '      <span class="badge badge-demo nav-demo-badge">Demo</span>',
    '    </a>',
    '    <nav class="nav-links" id="nav-links" aria-label="Navegação principal">',
    '      ' + linkHtml,
    '    </nav>',
    '    <div class="nav-actions">',
    '      <button class="nav-icon-btn" type="button" id="nav-search-btn" aria-label="Abrir busca" aria-controls="search-overlay" aria-expanded="false">' + icons.search + '</button>',
    '      <a class="btn btn-ghost nav-portal" href="' + root + 'portal.html">' + icons.user + '<span>Área do paciente</span></a>',
    '      <a class="btn btn-primary" href="' + root + 'agendamento.html">Agendar consulta</a>',
    '      <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-controls="nav-links" aria-expanded="false">' + icons.menu + '</button>',
    '    </div>',
    '  </div>',
    '</header>',
    renderSearchOverlay(root)
  ].join('\n');
}

/* ---------- Search overlay (global) ---------- */
function renderSearchOverlay(root) {
  root = root || '';
  return [
    '<div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="Busca global" hidden>',
    '  <div class="search-overlay-inner">',
    '    <div class="search-overlay-head">',
    '      <input class="search-overlay-input" id="search-overlay-input" type="search" placeholder="Especialidade, médico ou sintoma..." autocomplete="off" aria-label="Termo de busca">',
    '      <button class="search-overlay-close" type="button" id="search-overlay-close" aria-label="Fechar busca">' + icons.close + '</button>',
    '    </div>',
    '    <div class="search-overlay-results" id="search-overlay-results" role="listbox" aria-label="Resultados da busca"></div>',
    '    <p class="search-overlay-hint text-muted">Busca em especialidades, profissionais e artigos. Dados demonstrativos.</p>',
    '  </div>',
    '</div>'
  ].join('\n');
}

/* ---------- Footer (premium) ---------- */
function renderFooter(root, options) {
  root = root || '';
  options = options || {};
  const extraScripts = (options.extraScripts || []).map(function (s) {
    return '<script src="' + root + s + '" defer></script>';
  }).join('\n  ');
  const specList = specialties.slice(0, 6).map(function (s) {
    return '<li><a href="' + root + 'especialidade-' + s.slug + '.html">' + escapeHtml(s.name) + '</a></li>';
  }).join('');

  return [
    '<footer class="footer" role="contentinfo">',
    '  <div class="container footer-grid">',
    '    <div class="footer-col footer-col-about">',
    '      <a class="nav-brand" href="' + root + 'index.html" aria-label="' + escapeAttr(clinic.name) + ' — página inicial">',
    '        <img src="' + root + 'brand/vivamais-logo.png" alt="VivaMais" width="150" height="100" class="nav-brand-logo nav-brand-logo-footer" />',
    '      </a>',
    '      <p class="text-muted footer-about-text">' + escapeHtml(clinic.tagline) + ' Plataforma digital para saúde integrada, com atendimento humanizado e experiência simples do agendamento ao acompanhamento.</p>',
    '      <span class="badge badge-demo">' + icons.shield + ' Ambiente demonstrativo — dados fictícios</span>',
    '    </div>',
    '    <div class="footer-col">',
    '      <h4>Navegação</h4>',
    '      <ul>',
    '        <li><a href="' + root + 'index.html">Início</a></li>',
    '        <li><a href="' + root + 'especialidades.html">Especialidades</a></li>',
    '        <li><a href="' + root + 'profissionais.html">Profissionais</a></li>',
    '        <li><a href="' + root + 'convenios.html">Convênios</a></li>',
    '        <li><a href="' + root + 'sobre.html">Sobre</a></li>',
    '        <li><a href="' + root + 'blog.html">Blog</a></li>',
    '        <li><a href="' + root + 'faq.html">FAQ</a></li>',
    '      </ul>',
    '    </div>',
    '    <div class="footer-col">',
    '      <h4>Especialidades</h4>',
    '      <ul>' + specList + '</ul>',
    '    </div>',
    '    <div class="footer-col">',
    '      <h4>Legal</h4>',
    '      <ul>',
    '        <li><a href="' + root + 'privacidade.html">Privacidade</a></li>',
    '        <li><a href="' + root + 'termos.html">Termos de uso</a></li>',
    '        <li><a href="' + root + 'cookies.html">Cookies</a></li>',
    '      </ul>',
    '      <h4 class="footer-contact-title">Contato</h4>',
    '      <ul class="footer-contact">',
    '        <li>' + icons.phone + ' <a href="tel:' + escapeAttr(clinic.phone.replace(/\D/g, '')) + '">' + escapeHtml(clinic.phone) + '</a></li>',
    '        <li>' + icons.whatsapp + ' <a href="https://wa.me/' + escapeAttr(clinic.whatsapp.replace(/\D/g, '')) + '" rel="noopener">' + escapeHtml(clinic.whatsapp) + '</a></li>',
    '        <li>' + icons.mail + ' <a href="mailto:' + escapeAttr(clinic.email) + '">' + escapeHtml(clinic.email) + '</a></li>',
    '        <li>' + icons.pin + ' ' + escapeHtml(clinic.address.street) + '<br><span class="text-muted">' + escapeHtml(clinic.address.city) + ' — ' + escapeHtml(clinic.address.state) + '</span></li>',
    '      </ul>',
    '    </div>',
    '  </div>',
    '  <div class="container footer-bottom">',
    '    <span>© ' + new Date().getFullYear() + ' ' + escapeHtml(clinic.name) + ' — Demonstração.</span>',
    '    <span>Dados fictícios. Não utilizar para atendimento real.</span>',
    '  </div>',
    '</footer>',
    '<script src="' + root + 'scripts/app.js" defer></script>',
    '<script src="' + root + 'scripts/search.js" defer></script>',
    '  ' + extraScripts
  ].join('\n');
}

/* ---------- Layout ---------- */
function renderLayout(pageTitle, metaDescription, content, options) {
  options = options || {};
  const root = options.root || '';
  const bodyAttr = options.bodyClass ? ' class="' + escapeAttr(options.bodyClass) + '"' : '';
  return [
    renderHead(pageTitle, metaDescription, options),
    '<body' + bodyAttr + '>',
    renderNavbar(root, options.activeNav),
    '<main id="conteudo">',
    content,
    '</main>',
    renderFooter(root, options),
    '</body>',
    '</html>'
  ].join('\n');
}

/* ---------- JSON-LD builders ---------- */
function buildBreadcrumbList(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(function (item, i) {
      return {
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: BASE_URL + '/' + (item.slug === 'index' ? '' : item.slug + '.html')
      };
    })
  };
}

function buildMedicalClinic() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: clinic.name,
    description: clinic.tagline + ' Plataforma digital para saúde integrada, com atendimento humanizado.',
    url: BASE_URL + '/',
    telephone: clinic.phone,
    email: clinic.email,
    dateModified: new Date().toISOString().split('T')[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: clinic.address.street,
      addressLocality: clinic.address.city,
      addressRegion: clinic.address.state,
      postalCode: clinic.address.zip,
      addressCountry: 'BR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: clinic.geo.lat,
      longitude: clinic.geo.lng
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '19:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '13:00'
      }
    ],
    medicalSpecialty: specialties.map(function (s) { return s.name; }),
    priceRange: '$$'
  };
}

function buildOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: clinic.name,
    url: BASE_URL + '/',
    logo: BASE_URL + '/brand/vivamais-logo.png',
    telephone: clinic.phone,
    email: clinic.email,
    sameAs: [
      'https://expostacker.com.br',
      'https://github.com/lfelipef1dev-jpg'
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: clinic.address.street,
      addressLocality: clinic.address.city,
      addressRegion: clinic.address.state,
      postalCode: clinic.address.zip,
      addressCountry: 'BR'
    }
  };
}

function buildWebSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: clinic.name,
    url: BASE_URL + '/',
    potentialAction: {
      '@type': 'SearchAction',
      target: BASE_URL + '/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
}

function buildMedicalSpecialty(spec) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalSpecialty',
    name: spec.name,
    description: spec.longDescription,
    dateModified: new Date().toISOString().split('T')[0]
  };
}

function buildPhysician(doc, specName) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: doc.name,
    medicalSpecialty: specName,
    hospitalAffiliation: clinic.name,
    identifier: doc.crm,
    description: doc.bio,
    url: BASE_URL + '/medico-' + doc.slug + '.html',
    dateModified: new Date().toISOString().split('T')[0]
  };
}

function buildArticle(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    author: {
      '@type': 'Person',
      name: article.author
    },
    datePublished: article.date,
    dateModified: article.dateModified || article.date,
    description: article.excerpt,
    articleBody: article.content.join(' '),
    publisher: {
      '@type': 'Organization',
      name: clinic.name,
      logo: { '@type': 'ImageObject', url: BASE_URL + '/brand/vivamais-logo.png' }
    },
    mainEntityOfPage: BASE_URL + '/artigo-' + article.slug + '.html'
  };
}

function buildBlog() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Central de saúde — VivaMais',
    url: BASE_URL + '/blog.html'
  };
}

function buildFAQPage(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(function (f) {
      return {
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      };
    })
  };
}

function buildAboutPage() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Sobre a VivaMais',
    description: 'Conheça a VivaMais: propósito, valores, modelo de atendimento e equipe. Plataforma demonstrativa para saúde integrada com cuidado humanizado.',
    url: BASE_URL + '/sobre.html',
    dateModified: new Date().toISOString().split('T')[0]
  };
}

function buildLocalBusiness() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: clinic.name,
    description: 'Como chegar à VivaMais: endereço, telefone, WhatsApp, horários de funcionamento.',
    url: BASE_URL + '/localizacao.html',
    telephone: clinic.phone,
    dateModified: new Date().toISOString().split('T')[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: clinic.address.street,
      addressLocality: clinic.address.city,
      addressRegion: clinic.address.state,
      postalCode: clinic.address.zip,
      addressCountry: 'BR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: clinic.geo.lat,
      longitude: clinic.geo.lng
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '19:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '13:00'
      }
    ]
  };
}

/* ---------- Utils ---------- */
function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function escapeAttr(s) { return escapeHtml(s); }

module.exports = {
  icons: icons,
  clinic: clinic,
  specialties: specialties,
  loadData: loadData,
  renderHead: renderHead,
  renderNavbar: renderNavbar,
  renderFooter: renderFooter,
  renderLayout: renderLayout,
  escapeHtml: escapeHtml,
  escapeAttr: escapeAttr,
  BASE_URL: BASE_URL,
  buildBreadcrumbList: buildBreadcrumbList,
  buildMedicalClinic: buildMedicalClinic,
  buildOrganization: buildOrganization,
  buildWebSite: buildWebSite,
  buildMedicalSpecialty: buildMedicalSpecialty,
  buildPhysician: buildPhysician,
  buildArticle: buildArticle,
  buildBlog: buildBlog,
  buildFAQPage: buildFAQPage,
  buildAboutPage: buildAboutPage,
  buildLocalBusiness: buildLocalBusiness
};
