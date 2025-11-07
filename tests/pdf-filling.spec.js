const { test, expect } = require('@playwright/test');

test.describe('PDF Filling Test', () => {
  test('should fill the PDF with the complete form data', async ({ page }) => {
    await page.goto(`file://${__dirname}/../app/index.html`);

    // Fill out the entire form
    await page.fill('#business-name', 'Complete Test Business');
    await page.fill('#business-tin', '12-3456789');
    await page.fill('#business-phone', '555-123-4567');
    await page.fill('#business-address', '123 Complete St');
    await page.fill('#business-zip', '90210');
    await page.fill('#applicant-name', 'Complete Test Applicant');
    await page.fill('#applicant-title', 'CEO');
    await page.fill('#applicant-dob', '01/01/1980');
    await page.fill('#applicant-ssn', '123-45-6789');
    await page.fill('#owner1-name', 'Complete Test Owner 1');
    await page.fill('#owner1-ownership', '25');
    await page.fill('#owner2-name', 'Complete Test Owner 2');
    await page.fill('#owner2-ownership', '25');
    await page.fill('#owner3-name', 'Complete Test Owner 3');
    await page.fill('#owner3-ownership', '25');
    await page.fill('#owner4-name', 'Complete Test Owner 4');
    await page.fill('#owner4-ownership', '25');
    await page.fill('#controller-name', 'Complete Test Controller');
    await page.fill('#controller-title', 'President');

    // Click the "Fill PDF" button
    await page.click('#fill-pdf-btn');

    // Wait for the PDF to be updated
    await page.waitForTimeout(2000);

    await expect(page).toHaveScreenshot('complete-filled-pdf.png');
  });
});
