const { test, expect } = require('@playwright/test');

test.describe('PDF Application Form Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should fill the PDF with the complete form data', async ({ page }) => {
    await page.fill('#credit-line-requested', '75000');
    await page.fill('#business-name', 'Complete Test Business');
    await page.fill('#applicant-name', 'Complete Test Applicant');
    await page.fill('#email-address', 'test@business.com');

    await page.click('#fill-pdf-btn');
    await page.waitForTimeout(2000);

    await expect(page).toHaveScreenshot('complete-filled-pdf.png', { maxDiffPixels: 100 });
  });

  test('should reset the form and PDF', async ({ page }) => {
    await page.fill('#business-name', 'Test Business to Reset');
    await page.fill('#applicant-name', 'Test Applicant to Reset');

    await page.setInputFiles('#document-upload', {
      name: 'test.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('test')
    });

    const preview = page.locator('#document-preview');

    // Wait for the FileReader to update the src attribute
    await expect(preview).toHaveAttribute('src', /data:image/, { timeout: 10000 });
    await expect(preview).toBeVisible();

    page.once('dialog', async (dialog) => {
        await dialog.accept();
    });

    await page.click('#reset-btn');

    await expect(page.locator('#business-name')).toBeEmpty();
    await expect(page.locator('#applicant-name')).toBeEmpty();

    await expect(page.locator('#document-upload')).toBeEmpty();
    await expect(preview).toBeHidden();

    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('reset-pdf.png', { maxDiffPixels: 100 });
  });

  test('should scan a business card and autofill the form', async ({ page }) => {
    await page.setInputFiles('#document-upload', {
        name: 'business-card.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('test-business-card')
    });

    await page.selectOption('#document-type', 'business-card');

    await page.evaluate(() => {
        window.Tesseract = {
            recognize: () => Promise.resolve({ data: { text: "John Doe\nAcme Inc.\njohn.doe@acme.com\n123-456-7890" } })
        };
    });

    const scanButton = page.locator('#scan-document-btn');
    await scanButton.click();

    // Wait for the scan to complete by checking if the button is re-enabled
    await expect(scanButton).toBeEnabled();

    await expect(page.locator('#applicant-name')).toHaveValue('John Doe');
    await expect(page.locator('#business-name')).toHaveValue('Acme Inc.');
    await expect(page.locator('#email-address')).toHaveValue('john.doe@acme.com');
    await expect(page.locator('#business-phone')).toHaveValue('123-456-7890');
  });

  test('should scan a driver\'s license and autofill the form', async ({ page }) => {
    await page.setInputFiles('#document-upload', {
        name: 'drivers-license.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('test-drivers-license')
    });

    await page.selectOption('#document-type', 'drivers-license');

    await page.evaluate(() => {
        window.Tesseract = {
            recognize: () => Promise.resolve({ data: { text: "JOSEPH A SAMPLE\n3456 SOMEWHERE AVE\nTALLAHASSEE, FL 32399\nDOB: 08-16-1980" } })
        };
    });

    const scanButton = page.locator('#scan-document-btn');
    await scanButton.click();

    // Wait for the scan to complete
    await expect(scanButton).toBeEnabled();

    await expect(page.locator('#applicant-name')).toHaveValue('JOSEPH A SAMPLE');
    await expect(page.locator('#applicant-home-address')).toHaveValue('3456 SOMEWHERE AVE');
    await expect(page.locator('#applicant-city')).toHaveValue('TALLAHASSEE');
    await expect(page.locator('#applicant-state')).toHaveValue('FL');
    await expect(page.locator('#applicant-zip')).toHaveValue('32399');
    await expect(page.locator('#applicant-dob')).toHaveValue('08/16/1980');
  });

});
