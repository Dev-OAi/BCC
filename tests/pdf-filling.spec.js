const { test, expect } = require('@playwright/test');

test.describe('PDF Filling Test', () => {
  test('should fill the PDF with the complete form data', async ({ page }) => {
    // Start a local server to serve the app directory
    const serverProcess = require('child_process').spawn('python3', ['-m', 'http.server', '8002', '--directory', 'app']);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for server to start

    await page.goto('http://localhost:8002');

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
    await page.fill('#owner1-name', 'Complete Test Owner');
    await page.fill('#owner1-ownership', '51');
    await page.fill('#controller-name', 'Complete Test Controller');
    await page.fill('#controller-title', 'President');

    // Click the "Fill PDF" button
    await page.click('#fill-pdf-btn');

    // Wait for the PDF to be updated
    await page.waitForTimeout(2000);

    await expect(page).toHaveScreenshot('complete-filled-pdf.png');

    // Stop the server
    serverProcess.kill();
  });
});
