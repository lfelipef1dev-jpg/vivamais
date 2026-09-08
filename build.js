/* VivaMais — build.js
   Gerador de site estático.
   - Lê JSONs de src/data/
   - Usa templates e funções de página para gerar HTML
   - Copia CSS, JS, imagens para out/
   - Gera sitemap.xml e robots.txt
   Uso: node build.js
*/

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'out');
const SRC = path.join(ROOT, 'src');

/* ---------- Helpers ---------- */
function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}
function copyFile(src, dest) {
  fs.copyFileSync(src, dest);
}
function copyDir(src, dest) {
  ensureDir(dest);
  fs.readdirSync(src, { withFileTypes: true }).forEach(function (entry) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d); else copyFile(s, d);
  });
}
function writeOut(rel, content) {
  const dest = path.join(OUT, rel);
  ensureDir(path.dirname(dest));
  fs.writeFileSync(dest, content);
}

/* ---------- Assets ---------- */
function copyAssets() {
  // CSS
  copyDir(path.join(SRC, 'styles'), path.join(OUT, 'styles'));
  // Fonts
  copyDir(path.join(SRC, 'fonts'), path.join(OUT, 'fonts'));
  // JS
  copyDir(path.join(SRC, 'scripts'), path.join(OUT, 'scripts'));
  // Imagens existentes na raiz
  const imgExts = /\.(jpg|jpeg|png|svg|webp|gif|ico)$/i;
  fs.readdirSync(ROOT).forEach(function (name) {
    if (imgExts.test(name)) copyFile(path.join(ROOT, name), path.join(OUT, name));
  });
  // favicon
  if (fs.existsSync(path.join(ROOT, 'favicon.svg'))) {
    copyFile(path.join(ROOT, 'favicon.svg'), path.join(OUT, 'favicon.svg'));
  }
  // brand assets
  const brandDir = path.join(ROOT, 'brand');
  if (fs.existsSync(brandDir)) {
    copyDir(brandDir, path.join(OUT, 'brand'));
  }
}

/* ---------- Sitemap & robots ---------- */
const SITEMAP_BASE = 'https://vivamais.expostacker.com.br';
const NOINDEX_PAGES = ['admin', 'admin-login', 'portal-login', 'portal', '404'];
const today = new Date().toISOString().split('T')[0];

function getSitemapEntry(pageSlug) {
  const loc = SITEMAP_BASE + '/' + (pageSlug === 'index' ? '' : pageSlug + '.html');
  return [
    '  <url>',
    '    <loc>' + loc + '</loc>',
    '    <lastmod>' + today + '</lastmod>',
    '  </url>'
  ].join('\n');
}

function generateSitemap(pages) {
  const filtered = pages.filter(function (p) {
    return NOINDEX_PAGES.indexOf(p) === -1;
  });
  const urls = filtered.map(function (p) {
    return getSitemapEntry(p);
  }).join('\n');
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '\n</urlset>\n';
}

function generateRobots() {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin.html',
    'Disallow: /admin-login.html',
    'Disallow: /portal-login.html',
    'Disallow: /portal.html',
    'Sitemap: ' + SITEMAP_BASE + '/sitemap.xml'
  ].join('\n') + '\n';
}

/* ---------- Build ---------- */
function build() {
  const t0 = Date.now();
  console.log('VivaMais — build iniciado');

  // Limpa out/
  if (fs.existsSync(OUT)) {
    fs.rmSync(OUT, { recursive: true, force: true });
  }
  ensureDir(OUT);

  // Copia assets
  copyAssets();
  console.log('  ✓ assets copiados (CSS, JS, imagens)');

  // Páginas geradas
  const pages = [];

  // Home
  const home = require('./src/pages/home');
  writeOut('index.html', home.renderHome());
  pages.push('index');
  console.log('  ✓ index.html');

  // Especialidades (listagem)
  const especialidades = require('./src/pages/especialidades');
  writeOut('especialidades.html', especialidades.renderPage());
  pages.push('especialidades');
  console.log('  ✓ especialidades.html');

  // Especialidade individual (6 páginas)
  const especialidade = require('./src/pages/especialidade');
  especialidade.renderAll().forEach(function (p) {
    writeOut('especialidade-' + p.slug + '.html', p.html);
    pages.push('especialidade-' + p.slug);
    console.log('  ✓ especialidade-' + p.slug + '.html');
  });

  // Profissionais (listagem)
  const profissionais = require('./src/pages/profissionais');
  writeOut('profissionais.html', profissionais.renderPage());
  pages.push('profissionais');
  console.log('  ✓ profissionais.html');

  // Médico individual (6 páginas)
  const medico = require('./src/pages/medico');
  medico.renderAll().forEach(function (p) {
    writeOut('medico-' + p.slug + '.html', p.html);
    pages.push('medico-' + p.slug);
    console.log('  ✓ medico-' + p.slug + '.html');
  });

  // Convênios
  const convenios = require('./src/pages/convenios');
  writeOut('convenios.html', convenios.renderPage());
  pages.push('convenios');
  console.log('  ✓ convenios.html');

  // Agendamento (wizard 5 etapas)
  const agendamento = require('./src/pages/agendamento');
  writeOut('agendamento.html', agendamento.renderPage());
  pages.push('agendamento');
  console.log('  ✓ agendamento.html');

  // Portal do paciente — login
  const portalLogin = require('./src/pages/portal-login');
  writeOut('portal-login.html', portalLogin.renderPage());
  pages.push('portal-login');
  console.log('  ✓ portal-login.html');

  // Portal do paciente — dashboard
  const portal = require('./src/pages/portal');
  writeOut('portal.html', portal.renderPage());
  pages.push('portal');
  console.log('  ✓ portal.html');

  // Admin — login
  const adminLogin = require('./src/pages/admin-login');
  writeOut('admin-login.html', adminLogin.renderPage());
  pages.push('admin-login');
  console.log('  ✓ admin-login.html');

  // Admin — painel
  const admin = require('./src/pages/admin');
  writeOut('admin.html', admin.renderPage());
  pages.push('admin');
  console.log('  ✓ admin.html');

  // Blog (listagem)
  const blog = require('./src/pages/blog');
  writeOut('blog.html', blog.renderPage());
  pages.push('blog');
  console.log('  ✓ blog.html');

  // Artigo individual (8 páginas)
  const artigo = require('./src/pages/artigo');
  artigo.renderAll().forEach(function (p) {
    writeOut('artigo-' + p.slug + '.html', p.html);
    pages.push('artigo-' + p.slug);
    console.log('  ✓ artigo-' + p.slug + '.html');
  });

  // Sobre
  const sobre = require('./src/pages/sobre');
  writeOut('sobre.html', sobre.renderPage());
  pages.push('sobre');
  console.log('  ✓ sobre.html');

  // FAQ
  const faq = require('./src/pages/faq');
  writeOut('faq.html', faq.renderPage());
  pages.push('faq');
  console.log('  ✓ faq.html');

  // Localização
  const localizacao = require('./src/pages/localizacao');
  writeOut('localizacao.html', localizacao.renderPage());
  pages.push('localizacao');
  console.log('  ✓ localizacao.html');

  // Privacidade
  const privacidade = require('./src/pages/privacidade');
  writeOut('privacidade.html', privacidade.renderPage());
  pages.push('privacidade');
  console.log('  ✓ privacidade.html');

  // Termos de uso
  const termos = require('./src/pages/termos');
  writeOut('termos.html', termos.renderPage());
  pages.push('termos');
  console.log('  ✓ termos.html');

  // Cookies
  const cookies = require('./src/pages/cookies');
  writeOut('cookies.html', cookies.renderPage());
  pages.push('cookies');
  console.log('  ✓ cookies.html');

  // 404
  const notFound = require('./src/pages/404');
  writeOut('404.html', notFound.renderPage());
  pages.push('404');
  console.log('  ✓ 404.html');

  // Sitemap & robots
  writeOut('sitemap.xml', generateSitemap(pages));
  writeOut('robots.txt', generateRobots());
  console.log('  ✓ sitemap.xml, robots.txt');

  // Relatório
  const count = countFiles(OUT);
  console.log('Build concluído em ' + (Date.now() - t0) + 'ms — ' + count + ' arquivos em out/');
}

function countFiles(dir) {
  let n = 0;
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
    if (e.isDirectory()) n += countFiles(path.join(dir, e.name));
    else n++;
  });
  return n;
}

build();
