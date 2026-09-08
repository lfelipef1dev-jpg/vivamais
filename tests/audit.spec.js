const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'out');
const PUBLIC = 'http://localhost:3002';

function getPublicSlugs() {
  return fs.readdirSync(OUT)
    .filter(f => f.endsWith('.html') && f !== '404.html')
    .map(f => f === 'index.html' ? '' : f);
}

test('todas as paginas publicas respondem 200', async ({ page }) => {
  const slugs = getPublicSlugs();
  for (const slug of slugs) {
    const res = await page.request.get(`${PUBLIC}/${slug}`);
    expect(res.status(), `falha em /${slug}`).toBe(200);
  }
});

test('links internos resolvem para arquivos existentes', async ({ page }) => {
  const slugs = getPublicSlugs().slice(0, 12);
  const checked = new Set();
  for (const slug of slugs) {
    await page.goto(`${PUBLIC}/${slug}`);
    const hrefs = await page.locator('a[href]').evaluateAll(links =>
      links.map(a => a.getAttribute('href'))
    );
    for (const href of hrefs) {
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) continue;
      const abs = new URL(href, `${PUBLIC}/${slug}`).pathname.replace(/^\//, '');
      const file = abs === '' ? 'index.html' : abs.replace(/\/$/, '.html');
      if (checked.has(file)) continue;
      checked.add(file);
      const exists = fs.existsSync(path.join(OUT, file)) || fs.existsSync(path.join(OUT, file + '.html'));
      expect(exists, `link quebrado: ${href} em /${slug}`).toBe(true);
    }
  }
});

test('wizard de agendamento navega pelas 5 etapas', async ({ page }) => {
  await page.goto(`${PUBLIC}/agendamento.html`);
  await expect(page.locator('#panel-1')).not.toHaveAttribute('hidden');

  await page.locator('#specialty-grid button').first().click();
  await page.locator('#btn-next').click();
  await expect(page.locator('#panel-2')).not.toHaveAttribute('hidden');

  await page.locator('#doctor-grid button').first().click();
  await page.locator('#btn-next').click();
  await expect(page.locator('#panel-3')).not.toHaveAttribute('hidden');

  await page.locator('.wizard-cal-day:not(.disabled)').first().click();
  await page.locator('#btn-next').click();
  await expect(page.locator('#panel-4')).not.toHaveAttribute('hidden');

  await page.locator('#time-slots button:not(.unavailable)').first().click();
  await page.locator('#btn-next').click();
  await expect(page.locator('#panel-5')).not.toHaveAttribute('hidden');

  await page.locator('#f-name').fill('Paciente Teste');
  await page.locator('#f-phone').fill('11999999999');
  await page.locator('#f-email').fill('teste@vivamais.demo');
  const ins = await page.locator('#f-insurance option').nth(1).getAttribute('value');
  await page.locator('#f-insurance').selectOption(ins);
  await page.locator('#f-lgpd').evaluate(el => {
    el.checked = true;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('#btn-next:enabled').waitFor();
  await page.locator('#btn-next').click();

  await expect(page.locator('#confirmation')).not.toHaveAttribute('hidden');
});

test('filtro de profissionais funciona', async ({ page }) => {
  await page.goto(`${PUBLIC}/profissionais.html`);
  const visibleCards = async () => {
    return page.locator('#doctor-grid .doctor-card-lg').evaluateAll(cards => cards.filter(c => c.style.display !== 'none').length);
  };
  await page.locator('#doctor-search').fill('Souza');
  await expect.poll(visibleCards).toBe(1);
  await page.locator('#doctor-search').fill('');
  await expect.poll(visibleCards).toBe(6);
});

test('portal e admin apresentam avisos demonstrativos', async ({ page }) => {
  await page.goto(`${PUBLIC}/portal.html`);
  await expect(page.locator('text=Ambiente demonstrativo').first()).toBeVisible();
  await page.goto(`${PUBLIC}/admin.html`);
  await expect(page.locator('text=Ambiente demonstrativo').first()).toBeVisible();
});

test('home nao gera erros de console', async ({ page }) => {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(`${PUBLIC}/`);
  await page.waitForTimeout(2500);
  expect(errors, `erros: ${errors.join(', ')}`).toEqual([]);
});
