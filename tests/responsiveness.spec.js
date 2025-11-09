import { test, expect } from '@playwright/test';

test.describe('Responsiveness Test', () => {
  const viewports = [
    { width: 375, height: 667, name: 'Mobile' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1280, height: 800, name: 'Desktop' },
    { width: 1920, height: 1080, name: 'FullHD' },
  ];

  for (const viewport of viewports) {
    test(`should render correctly on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      // Wait for any potential layout shifts or lazy-loaded content
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot(`screenshot-${viewport.width}x${viewport.height}.png`, {
        fullPage: true,
        maxDiffPixels: 100, // Allow for minor rendering differences
      });
    });
  }
});
