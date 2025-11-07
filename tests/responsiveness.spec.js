const { test, expect } = require('@playwright/test');

test.describe('Responsiveness Test', () => {
  const viewports = [
    { width: 375, height: 667 }, // Mobile
    { width: 768, height: 1024 }, // Tablet
    { width: 1280, height: 800 }, // Desktop
  ];

  for (const viewport of viewports) {
    test(`should render correctly on ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('file://' + __dirname + '/../app/index.html');
      await expect(page).toHaveScreenshot(`screenshot-${viewport.width}x${viewport.height}.png`);
    });
  }
});
