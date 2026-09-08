const { test, expect } = require('@playwright/test');

const VIEWPORTS = [
  { name: '360', width: 360, height: 800 },
  { name: '375', width: 375, height: 800 },
  { name: '390', width: 390, height: 800 },
  { name: '430', width: 430, height: 800 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1366', width: 1366, height: 768 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
];

test('paginas publicas sem overflow horizontal nos 9 breakpoints', async ({ page }) => {
  const pages = ['/', '/profissionais.html', '/agendamento.html'];
  for (const vp of VIEWPORTS) {
    for (const url of pages) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:3002${url}`);
      await page.waitForTimeout(500);
      const hasOverflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth > window.innerWidth + 16;
      });
      expect(hasOverflow, `overflow em ${url} @ ${vp.name}`).toBe(false);
      await page.screenshot({
        path: `test-results/responsive-${vp.name}-${url.replace(/\//g, '-')}.png`,
        fullPage: true,
      });
    }
  }
});
