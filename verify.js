const { chromium } = require('playwright');
const path = require('path');

(async () => {
  let browser;
  try {
    browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to the local application
    const filePath = path.resolve(__dirname, 'app/index.html');
    await page.goto(`file://${filePath}`);

    // Fill in some business details
    await page.fill('input[name="Business Name to appear on card"]', 'Jules Corp');
    await page.fill('input[name="Tax Identification Number"]', '12-3456789');

    // Take a screenshot of the initial state
    const screenshotPath = '/home/jules/verification/frontend_verification.png';
    await page.screenshot({ path: screenshotPath });

    console.log(`Screenshot saved to ${screenshotPath}`);

  } catch (error) {
    console.error('Error during verification:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
