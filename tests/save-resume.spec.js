import { test, expect } from '@playwright/test';

test.describe('Save and Resume Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page and clear localStorage to ensure a clean slate for each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should save form data to localStorage on input', async ({ page }) => {
    // Input data into a text field and a checkbox
    await page.fill('#business-name', 'Save Test Business');
    await page.check('#sole-proprietorship');

    // Verify that the data is saved in localStorage
    const savedData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('savedFormData'));
    });

    expect(savedData['business-name']).toBe('Save Test Business');
    expect(savedData['sole-proprietorship']).toBe(true);
  });

  test('should restore form data from localStorage on page load', async ({ page }) => {
    const testData = {
      'business-name': 'Restore Test Business',
      'sole-proprietorship': true,
    };

    // Manually set localStorage to simulate a previous session
    await page.evaluate((data) => {
      localStorage.setItem('savedFormData', JSON.stringify(data));
    }, testData);

    // The app should prompt to restore data. Accept it.
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('saved data');
      await dialog.accept();
    });

    // Reload the page to trigger the restore functionality
    await page.reload();

    // Assert that the form fields are populated with the saved data
    await expect(page.locator('#business-name')).toHaveValue('Restore Test Business');
    await expect(page.locator('#sole-proprietorship')).toBeChecked();
  });

  test('should not restore form data if user cancels the prompt', async ({ page }) => {
    const testData = {
      'business-name': 'No Restore Business',
    };

    // Manually set localStorage
    await page.evaluate((data) => {
      localStorage.setItem('savedFormData', JSON.stringify(data));
    }, testData);

    // Dismiss the restore prompt
    page.once('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    await page.reload();

    // Assert that the form remains empty
    await expect(page.locator('#business-name')).toBeEmpty();
  });

  test('should clear localStorage when the form is reset', async ({ page }) => {
    // Fill a field, which will save data to localStorage
    await page.fill('#business-name', 'Reset Test Business');

    // Accept the confirmation dialog for resetting the form
    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page.click('#reset-btn');

    // Verify that localStorage is cleared
    const savedData = await page.evaluate(() => {
      return localStorage.getItem('savedFormData');
    });

    expect(savedData).toBeNull();
  });
});
